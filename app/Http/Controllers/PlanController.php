<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        $planes = Plan::paginate(10);

        return Inertia::render('Planes/Index', [
            'planes' => $planes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Planes/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
        ]);

        Plan::create($request->all());

        return redirect()->route('planes.index')
            ->with('success', 'Plan creado correctamente.');
    }

    // placeholders (aún no implementados)
    public function show(Plan $plan) {}
    public function edit(Plan $plan) {}
    public function update(Request $request, Plan $plan) {}
    public function destroy(Plan $plan) {}
}
