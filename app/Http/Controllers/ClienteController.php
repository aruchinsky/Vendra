<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('ver clientes'), 403);

        return Inertia::render('Modules/ComingSoon', [
            'title' => 'Clientes',
            'description' => 'Agenda comercial, datos de contacto e historial de relaciones con cada cliente.',
            'negocio' => $request->attributes->get('negocio_activo'),
        ]);
    }
}
