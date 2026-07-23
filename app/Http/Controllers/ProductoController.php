<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('ver productos'), 403);

        return Inertia::render('Modules/ComingSoon', [
            'title' => 'Productos',
            'description' => 'Catálogo, precios, SKU, existencias y control operativo de productos.',
            'negocio' => $request->attributes->get('negocio_activo'),
        ]);
    }
    public function create(Request $request): Response
    {
        abort_unless($request->user()?->can('crear productos'), 403);

        return Inertia::render('Modules/ComingSoon', [
            'title' => 'Productos',
            'description' => 'El alta de productos quedará disponible al implementar el CRUD operativo del catálogo.',
            'negocio' => $request->attributes->get('negocio_activo'),
        ]);
    }

}
