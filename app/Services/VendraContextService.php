<?php

namespace App\Services;

use App\Models\Negocio;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Resuelve el contexto global de navegación de Vendra.
 *
 * Centraliza la misma ingeniería utilizada por el dashboard para que Inertia,
 * el sidebar, los controladores y los middleware interpreten de igual manera
 * el rol global, los permisos, los negocios disponibles y el negocio activo.
 */
class VendraContextService
{
    private const REQUEST_ATTRIBUTE = 'vendra_context';

    /**
     * Obtiene y memoriza el contexto completo para la solicitud actual.
     *
     * @return array{
     *     user: User|null,
     *     roles: Collection<int, string>,
     *     permissions: Collection<int, string>,
     *     es_admin_global: bool,
     *     es_soporte: bool,
     *     es_usuario_negocio: bool,
     *     negocios: EloquentCollection<int, Negocio>,
     *     negocio_activo: Negocio|null,
     *     es_administrador_negocio: bool,
     *     cantidad_negocios: int,
     *     puede_cambiar_negocio: bool
     * }
     */
    public function resolve(Request $request): array
    {
        $cached = $request->attributes->get(self::REQUEST_ATTRIBUTE);

        if (is_array($cached)) {
            return $cached;
        }

        /** @var User|null $user */
        $user = $request->user();

        if (! $user) {
            $context = [
                'user' => null,
                'roles' => collect(),
                'permissions' => collect(),
                'es_admin_global' => false,
                'es_soporte' => false,
                'es_usuario_negocio' => false,
                'negocios' => new EloquentCollection(),
                'negocio_activo' => null,
                'es_administrador_negocio' => false,
                'cantidad_negocios' => 0,
                'puede_cambiar_negocio' => false,
            ];

            $request->attributes->set(self::REQUEST_ATTRIBUTE, $context);

            return $context;
        }

        $roles = $user->getRoleNames()->values();
        $permissions = $user->getAllPermissions()->pluck('name')->values();
        $esAdminGlobal = $roles->contains('admin');
        $esSoporte = $roles->contains('soporte');
        $esUsuarioNegocio = $roles->contains('usuario');

        $negocios = $this->negociosDisponibles($user, $esAdminGlobal, $esUsuarioNegocio);
        $negocioActivo = $this->resolverNegocioActivo(
            $request,
            $negocios,
            $esAdminGlobal,
            $esUsuarioNegocio,
        );

        $esAdministradorNegocio = false;

        if ($negocioActivo) {
            $esAdministradorNegocio = $esAdminGlobal
                || (bool) $negocioActivo->pivot?->es_administrador;
        }

        $context = [
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
            'es_admin_global' => $esAdminGlobal,
            'es_soporte' => $esSoporte,
            'es_usuario_negocio' => $esUsuarioNegocio,
            'negocios' => $negocios,
            'negocio_activo' => $negocioActivo,
            'es_administrador_negocio' => $esAdministradorNegocio,
            'cantidad_negocios' => $negocios->count(),
            'puede_cambiar_negocio' => ($esAdminGlobal && $negocios->isNotEmpty())
                || ($esUsuarioNegocio && $negocios->count() > 1),
        ];

        $request->attributes->set(self::REQUEST_ATTRIBUTE, $context);

        return $context;
    }

    /**
     * Prepara el contexto autenticado para compartirlo con todas las páginas Inertia.
     */
    public function sharedAuth(Request $request): array
    {
        $context = $this->resolve($request);
        $negocioActivo = $context['negocio_activo'];

        return [
            'user' => $context['user'],
            'roles' => $context['roles']->all(),
            'permissions' => $context['permissions']->all(),
            'negocios' => $context['negocios']
                ->map(fn (Negocio $negocio) => $this->serializarNegocio($negocio))
                ->values()
                ->all(),
            'negocio_activo' => $negocioActivo
                ? $this->serializarNegocio($negocioActivo)
                : null,
            'plan_activo' => $negocioActivo?->plan,
            'es_admin_global' => $context['es_admin_global'],
            'es_soporte' => $context['es_soporte'],
            'es_usuario_negocio' => $context['es_usuario_negocio'],
            'es_administrador_negocio' => $context['es_administrador_negocio'],
            'cantidad_negocios' => $context['cantidad_negocios'],
            'puede_cambiar_negocio' => $context['puede_cambiar_negocio'],
        ];
    }

    /**
     * Valida y guarda un negocio como contexto operativo de la sesión.
     */
    public function seleccionarNegocio(Request $request, Negocio $negocio): void
    {
        /** @var User|null $user */
        $user = $request->user();

        abort_unless($user, 401);
        abort_unless($negocio->activo, 403, 'El negocio seleccionado no está activo.');
        abort_unless(
            $this->usuarioPuedeAcceder($user, $negocio),
            403,
            'No tenés acceso a este negocio.',
        );

        $request->session()->put('negocio_activo_id', $negocio->id);
        $request->attributes->remove(self::REQUEST_ATTRIBUTE);
    }

    /**
     * Elimina el contexto comercial y devuelve al administrador al entorno global.
     */
    public function limpiarNegocioActivo(Request $request): void
    {
        $request->session()->forget('negocio_activo_id');
        $request->attributes->remove(self::REQUEST_ATTRIBUTE);
    }

    /**
     * Determina si un usuario puede operar dentro de un negocio concreto.
     */
    public function usuarioPuedeAcceder(User $user, Negocio $negocio): bool
    {
        if ($user->hasRole('admin')) {
            return $negocio->activo;
        }

        if (! $user->hasRole('usuario')) {
            return false;
        }

        return $user->negociosActivos()
            ->where('negocios.id', $negocio->id)
            ->exists();
    }

    /**
     * Devuelve el negocio activo resuelto para la solicitud.
     */
    public function negocioActivo(Request $request): ?Negocio
    {
        return $this->resolve($request)['negocio_activo'];
    }

    /**
     * Devuelve los negocios visibles para el rol autenticado.
     *
     * @return EloquentCollection<int, Negocio>
     */
    private function negociosDisponibles(
        User $user,
        bool $esAdminGlobal,
        bool $esUsuarioNegocio,
    ): EloquentCollection {
        if ($esAdminGlobal) {
            return Negocio::query()
                ->activos()
                ->with('plan')
                ->withCount('usuariosActivos')
                ->orderBy('nombre_comercial')
                ->get();
        }

        if ($esUsuarioNegocio) {
            return $user->negociosActivos()
                ->with('plan')
                ->withCount('usuariosActivos')
                ->orderBy('nombre_comercial')
                ->get();
        }

        return new EloquentCollection();
    }

    /**
     * Reconcilia el negocio guardado en sesión con los negocios disponibles.
     */
    private function resolverNegocioActivo(
        Request $request,
        EloquentCollection $negocios,
        bool $esAdminGlobal,
        bool $esUsuarioNegocio,
    ): ?Negocio {
        if (! $esAdminGlobal && ! $esUsuarioNegocio) {
            return null;
        }

        if ($esUsuarioNegocio && ! $esAdminGlobal && $negocios->count() === 1) {
            /** @var Negocio $unicoNegocio */
            $unicoNegocio = $negocios->first();
            $request->session()->put('negocio_activo_id', $unicoNegocio->id);

            return $unicoNegocio;
        }

        $negocioActivoId = (int) $request->session()->get('negocio_activo_id', 0);

        if ($negocioActivoId <= 0) {
            return null;
        }

        /** @var Negocio|null $negocioActivo */
        $negocioActivo = $negocios->firstWhere('id', $negocioActivoId);

        if (! $negocioActivo) {
            $request->session()->forget('negocio_activo_id');
        }

        return $negocioActivo;
    }

    /**
     * Reduce un negocio a los datos necesarios para navegación y selección.
     */
    private function serializarNegocio(Negocio $negocio): array
    {
        $negocio->loadMissing('plan');

        return [
            'id' => $negocio->id,
            'plan_id' => $negocio->plan_id,
            'nombre_comercial' => $negocio->nombre_comercial,
            'cuit_cuil' => $negocio->cuit_cuil,
            'telefono' => $negocio->telefono,
            'direccion' => $negocio->direccion,
            'rubro' => $negocio->rubro,
            'logo_path' => $negocio->logo_path,
            'activo' => (bool) $negocio->activo,
            'usuarios_activos_count' => isset($negocio->usuarios_activos_count)
                ? (int) $negocio->usuarios_activos_count
                : 0,
            'created_at' => $negocio->created_at,
            'updated_at' => $negocio->updated_at,
            'plan' => $negocio->plan,
            'pivot' => $negocio->pivot ? [
                'id' => $negocio->pivot->id,
                'negocio_id' => $negocio->pivot->negocio_id,
                'user_id' => $negocio->pivot->user_id,
                'es_administrador' => (bool) $negocio->pivot->es_administrador,
                'activo' => (bool) $negocio->pivot->activo,
                'created_at' => $negocio->pivot->created_at,
                'updated_at' => $negocio->pivot->updated_at,
            ] : null,
        ];
    }
}
