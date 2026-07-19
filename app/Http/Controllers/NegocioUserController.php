<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use App\Models\NegocioUser;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NegocioUserController extends Controller
{
    public function index(Request $request, Negocio $negocio): Response
    {
        /** @var User $usuarioAutenticado */
        $usuarioAutenticado = $request->user();
        $this->autorizarAdministracion($usuarioAutenticado, $negocio);

        $search = $request->query('search');

        $negocio->load('plan:id,nombre,slug,limite_usuarios,activo');

        $usuarios = $negocio->usuarios()
            ->with('roles:id,name')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('users.nombre', 'like', "%{$search}%")
                        ->orWhere('users.apellido', 'like', "%{$search}%")
                        ->orWhere('users.username', 'like', "%{$search}%")
                        ->orWhere('users.email', 'like', "%{$search}%");
                });
            })
            ->orderBy('users.apellido')
            ->orderBy('users.nombre')
            ->paginate(10)
            ->withQueryString();

        $usuariosActivos = $negocio->usuariosActivos()->count();
        $limiteUsuarios = $negocio->plan->limite_usuarios;

        return Inertia::render('Negocios/Usuarios/Index', [
            'negocio' => $negocio,
            'usuarios' => $usuarios,
            'usuarios_activos_count' => $usuariosActivos,
            'limite_usuarios' => $limiteUsuarios,
            'puede_agregar_usuarios' => $usuariosActivos < $limiteUsuarios,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request, Negocio $negocio): RedirectResponse
    {
        /** @var User $usuarioAutenticado */
        $usuarioAutenticado = $request->user();
        $this->autorizarAdministracion($usuarioAutenticado, $negocio);

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'es_administrador' => 'nullable|boolean',
        ]);

        $usuario = User::query()
            ->where('email', $validated['email'])
            ->firstOrFail();

        if ($usuario->estado !== 'activo') {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'La cuenta indicada no está activa.');
        }

        $membresia = NegocioUser::query()
            ->where('negocio_id', $negocio->id)
            ->where('user_id', $usuario->id)
            ->first();

        if ($membresia?->activo) {
            return redirect()
                ->back()
                ->withInput()
                ->with('warning', 'Ese usuario ya pertenece activamente al negocio.');
        }

        if (! $this->hayLugarDisponible($negocio)) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'El negocio alcanzó el límite de usuarios permitido por su plan.');
        }

        try {
            DB::transaction(function () use ($negocio, $usuario, $validated) {
                NegocioUser::updateOrCreate(
                    [
                        'negocio_id' => $negocio->id,
                        'user_id' => $usuario->id,
                    ],
                    [
                        'es_administrador' => (bool) ($validated['es_administrador'] ?? false),
                        'activo' => true,
                    ]
                );
            });

            return redirect()
                ->route('negocios.usuarios.index', $negocio)
                ->with('success', 'Usuario agregado correctamente al negocio.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo agregar el usuario al negocio.');
        }
    }

    public function update(Request $request, Negocio $negocio, User $user): RedirectResponse
    {
        /** @var User $usuarioAutenticado */
        $usuarioAutenticado = $request->user();
        $this->autorizarAdministracion($usuarioAutenticado, $negocio);

        $validated = $request->validate([
            'es_administrador' => 'required|boolean',
            'activo' => 'required|boolean',
        ]);

        $membresia = NegocioUser::query()
            ->where('negocio_id', $negocio->id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $nuevoEstadoActivo = $request->boolean('activo');
        $nuevoEstadoAdministrador = $request->boolean('es_administrador');

        if ($nuevoEstadoActivo && $user->estado !== 'activo') {
            return redirect()
                ->back()
                ->with('error', 'No se puede activar la membresía de una cuenta inactiva o suspendida.');
        }

        if (! $membresia->activo && $nuevoEstadoActivo && ! $this->hayLugarDisponible($negocio)) {
            return redirect()
                ->back()
                ->with('error', 'El negocio alcanzó el límite de usuarios permitido por su plan.');
        }

        if ($usuarioAutenticado->id === $user->id && ! $nuevoEstadoActivo) {
            return redirect()
                ->back()
                ->with('error', 'No podés desactivar tu propia membresía desde esta pantalla.');
        }

        if (
            $membresia->activo
            && $membresia->es_administrador
            && (! $nuevoEstadoActivo || ! $nuevoEstadoAdministrador)
            && ! $this->existeOtroAdministrador($negocio, $user)
        ) {
            return redirect()
                ->back()
                ->with('error', 'El negocio debe conservar al menos un administrador activo.');
        }

        try {
            $membresia->update([
                'es_administrador' => $nuevoEstadoAdministrador,
                'activo' => $nuevoEstadoActivo,
            ]);

            return redirect()
                ->route('negocios.usuarios.index', $negocio)
                ->with('success', 'Acceso del usuario actualizado correctamente.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->with('error', 'No se pudo actualizar el acceso del usuario.');
        }
    }

    public function destroy(Request $request, Negocio $negocio, User $user): RedirectResponse
    {
        /** @var User $usuarioAutenticado */
        $usuarioAutenticado = $request->user();
        $this->autorizarAdministracion($usuarioAutenticado, $negocio);

        if ($usuarioAutenticado->id === $user->id) {
            return redirect()
                ->back()
                ->with('error', 'No podés quitarte del negocio desde esta pantalla.');
        }

        $membresia = NegocioUser::query()
            ->where('negocio_id', $negocio->id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if (
            $membresia->activo
            && $membresia->es_administrador
            && ! $this->existeOtroAdministrador($negocio, $user)
        ) {
            return redirect()
                ->back()
                ->with('error', 'No se puede quitar al único administrador activo del negocio.');
        }

        try {
            $membresia->update([
                'activo' => false,
                'es_administrador' => false,
            ]);

            return redirect()
                ->route('negocios.usuarios.index', $negocio)
                ->with('success', 'Usuario desvinculado correctamente del negocio.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->with('error', 'No se pudo desvincular el usuario del negocio.');
        }
    }

    private function autorizarAdministracion(User $user, Negocio $negocio): void
    {
        if (! $user->hasRole('admin') && ! $negocio->esAdministrador($user->id)) {
            abort(403, 'No tenés permisos para administrar los usuarios de este negocio.');
        }
    }

    private function hayLugarDisponible(Negocio $negocio): bool
    {
        $negocio->loadMissing('plan:id,limite_usuarios');

        return $negocio->usuariosActivos()->count() < $negocio->plan->limite_usuarios;
    }

    private function existeOtroAdministrador(Negocio $negocio, User $user): bool
    {
        return $negocio->administradores()
            ->where('users.id', '!=', $user->id)
            ->exists();
    }
}
