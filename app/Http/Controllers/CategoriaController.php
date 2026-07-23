<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Negocio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoriaController extends Controller
{
    public function index(Request $request): Response
    {
        $this->autorizar($request, 'ver categorias', 'ver productos');

        return Inertia::render('Modules/ComingSoon', [
            'title' => 'Categorías',
            'description' => 'Organización del catálogo mediante categorías independientes para el negocio activo.',
            'negocio' => $request->attributes->get('negocio_activo'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->autorizar($request, 'crear categorias', 'crear productos');
        $negocio = $this->negocioActivo($request);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        $negocio->categorias()->create($validated);

        return redirect()
            ->route('categorias.index')
            ->with('success', 'Categoría creada correctamente.');
    }

    public function update(Request $request, Categoria $categoria): RedirectResponse
    {
        $this->autorizar($request, 'editar categorias', 'editar productos');
        $this->autorizarCategoria($request, $categoria);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        $categoria->update($validated);

        return redirect()
            ->route('categorias.index')
            ->with('success', 'Categoría actualizada correctamente.');
    }

    public function destroy(Request $request, Categoria $categoria): RedirectResponse
    {
        $this->autorizar($request, 'eliminar categorias', 'eliminar productos');
        $this->autorizarCategoria($request, $categoria);

        $categoria->delete();

        return redirect()
            ->route('categorias.index')
            ->with('success', 'Categoría eliminada correctamente.');
    }

    private function autorizar(Request $request, string ...$permissions): void
    {
        $user = $request->user();

        abort_unless(
            $user && ($user->hasRole('admin') || collect($permissions)->contains(fn ($permission) => $user->can($permission))),
            403,
        );
    }

    private function negocioActivo(Request $request): Negocio
    {
        /** @var Negocio|null $negocio */
        $negocio = $request->attributes->get('negocio_activo');
        abort_unless($negocio, 403);

        return $negocio;
    }

    private function autorizarCategoria(Request $request, Categoria $categoria): void
    {
        abort_unless($categoria->negocio_id === $this->negocioActivo($request)->id, 403);
    }
}
