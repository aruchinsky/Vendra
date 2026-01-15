<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Negocio;
use Illuminate\Http\Request;

class NegocioController extends Controller
{
    public function index()
    {
        $negocios = Negocio::paginate(10);

        return Inertia::render('Negocios/Index', [
            'negocios' => $negocios,
        ]);
    }

    public function create()
    {
        return Inertia::render('Negocios/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_comercial' => 'required|string|max:255',
        ]);

        Negocio::create($request->all());

        return redirect()->route('negocios.index')
            ->with('success', 'Negocio creado correctamente.');
    }

    // placeholders para evitar errores
    public function show(Negocio $negocio) {}
    public function edit(Negocio $negocio) {}
    public function update(Request $request, Negocio $negocio) {}
    public function destroy(Negocio $negocio) {}
}
