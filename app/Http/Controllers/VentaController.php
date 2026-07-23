<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VentaController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('ver ventas'), 403);

        return Inertia::render('Modules/ComingSoon', [
            'title' => 'Ventas',
            'description' => 'Registro de operaciones, comprobantes, métodos de pago y movimientos automáticos de stock.',
            'negocio' => $request->attributes->get('negocio_activo'),
        ]);
    }
    public function create(Request $request): Response
    {
        abort_unless($request->user()?->can('crear ventas'), 403);

        return Inertia::render('Modules/ComingSoon', [
            'title' => 'Nueva venta',
            'description' => 'El flujo de venta y actualización automática de stock se implementará en la etapa operativa.',
            'negocio' => $request->attributes->get('negocio_activo'),
        ]);
    }

}
