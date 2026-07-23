<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NegocioController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $search = $request->query('search');

        $negocios = Negocio::query()
            ->with('plan:id,nombre,slug,limite_usuarios,activo')
            ->withCount(['usuariosActivos as usuarios_activos_count'])
            ->when(! $user->hasRole('admin'), function ($query) use ($user) {
                $query->whereHas('usuarios', function ($q) use ($user) {
                    $q->where('users.id', $user->id)
                        ->where('negocio_user.activo', true);
                });
            })
            ->buscar($search)
            ->orderBy('nombre_comercial')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Negocios/Index', [
            'negocios' => $negocios,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Negocios/Create', [
            'planFree' => Plan::query()
                ->where('slug', 'free')
                ->where('activo', true)
                ->first([
                    'id',
                    'nombre',
                    'slug',
                    'limite_productos',
                    'limite_ventas_mensuales',
                    'limite_usuarios',
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'nombre_comercial' => 'required|string|max:255',
            'cuit_cuil' => 'nullable|string|max:30',
            'telefono' => 'nullable|string|max:50',
            'direccion' => 'nullable|string|max:255',
            'rubro' => 'nullable|string|max:150',
            'logo_path' => 'nullable|string|max:255',
        ]);

        try {
            /** @var Negocio $negocio */
            $negocio = DB::transaction(function () use ($validated, $user) {
                $planFree = Plan::query()
                    ->where('slug', 'free')
                    ->where('activo', true)
                    ->firstOrFail();

                $negocio = Negocio::create([
                    ...$validated,
                    'plan_id' => $planFree->id,
                    'activo' => true,
                ]);

                $negocio->usuarios()->attach($user->id, [
                    'es_administrador' => true,
                    'activo' => true,
                ]);

                return $negocio;
            });

            $request->session()->put('negocio_activo_id', $negocio->id);

            return redirect()
                ->route('dashboard')
                ->with('success', 'Tu negocio fue creado con el Plan Gratuito y ya está listo para usar.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo crear el negocio.');
        }
    }

    public function show(Negocio $negocio): void
    {
    }

    public function edit(Negocio $negocio): void
    {
    }

    public function update(Request $request, Negocio $negocio): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $this->puedeAdministrar($user, $negocio)) {
            abort(403, 'No tenés permisos para administrar este negocio.');
        }

        $validated = $request->validate([
            'nombre_comercial' => 'required|string|max:255',
            'cuit_cuil' => 'nullable|string|max:30',
            'telefono' => 'nullable|string|max:50',
            'direccion' => 'nullable|string|max:255',
            'rubro' => 'nullable|string|max:150',
            'logo_path' => 'nullable|string|max:255',
            'activo' => 'nullable|boolean',
        ]);

        if ($request->has('activo')) {
            $validated['activo'] = $request->boolean('activo');
        } else {
            unset($validated['activo']);
        }

        $negocio->update($validated);

        return redirect()
            ->route('negocios.index')
            ->with('success', 'Negocio actualizado correctamente.');
    }

    public function destroy(Request $request, Negocio $negocio): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $this->puedeAdministrar($user, $negocio)) {
            abort(403, 'No tenés permisos para administrar este negocio.');
        }

        try {
            DB::transaction(function () use ($negocio) {
                $negocio->update(['activo' => false]);
                $negocio->membresias()->update(['activo' => false]);
            });

            if ((int) $request->session()->get('negocio_activo_id') === $negocio->id) {
                $request->session()->forget('negocio_activo_id');
            }

            return redirect()
                ->route('dashboard')
                ->with('success', 'Negocio desactivado correctamente.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->with('error', 'No se pudo desactivar el negocio.');
        }
    }

    private function puedeAdministrar(User $user, Negocio $negocio): bool
    {
        return $user->hasRole('admin') || $negocio->esAdministrador($user->id);
    }
}
