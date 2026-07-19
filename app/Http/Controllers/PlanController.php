<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $planes = Plan::query()
            ->withCount('negocios')
            ->buscar($search)
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Planes/Index', [
            'planes' => $planes,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Planes/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validarPlan($request);

        Plan::create($this->normalizarBooleanos($request, $validated, true));

        return redirect()
            ->route('planes.index')
            ->with('success', 'Plan creado correctamente.');
    }

    // Se mantienen sin vista asociada hasta que esas pantallas sean implementadas.
    public function show(Plan $plan): void
    {
    }

    public function edit(Plan $plan): void
    {
    }

    public function update(Request $request, Plan $plan): RedirectResponse
    {
        $validated = $this->validarPlan($request, $plan);

        $plan->update($this->normalizarBooleanos($request, $validated, false));

        return redirect()
            ->route('planes.index')
            ->with('success', 'Plan actualizado correctamente.');
    }

    public function destroy(Plan $plan): RedirectResponse
    {
        if ($plan->negocios()->exists() || $plan->pagosSuscripciones()->exists()) {
            $plan->update(['activo' => false]);

            return redirect()
                ->route('planes.index')
                ->with('warning', 'El plan está en uso y fue desactivado para conservar el historial.');
        }

        $plan->delete();

        return redirect()
            ->route('planes.index')
            ->with('success', 'Plan eliminado correctamente.');
    }

    private function validarPlan(Request $request, ?Plan $plan = null): array
    {
        $planId = $plan?->id;

        return $request->validate([
            'nombre' => 'required|string|max:255|unique:planes,nombre,' . $planId,
            'slug' => 'required|string|max:100|alpha_dash|unique:planes,slug,' . $planId,
            'limite_productos' => 'nullable|integer|min:0',
            'limite_ventas_mensuales' => 'nullable|integer|min:0',
            'limite_usuarios' => 'required|integer|min:1',
            'tiene_pagina_publica' => 'nullable|boolean',
            'reportes_avanzados' => 'nullable|boolean',
            'multiples_puntos_venta' => 'nullable|boolean',
            'activo' => 'nullable|boolean',
        ]);
    }

    private function normalizarBooleanos(Request $request, array $validated, bool $esNuevo): array
    {
        $validated['tiene_pagina_publica'] = $request->boolean('tiene_pagina_publica');
        $validated['reportes_avanzados'] = $request->boolean('reportes_avanzados');
        $validated['multiples_puntos_venta'] = $request->boolean('multiples_puntos_venta');

        if ($request->has('activo')) {
            $validated['activo'] = $request->boolean('activo');
        } elseif ($esNuevo) {
            $validated['activo'] = true;
        } else {
            unset($validated['activo']);
        }

        return $validated;
    }
}
