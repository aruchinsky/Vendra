<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReporteController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('ver_basico reportes'), 403);

        /** @var Negocio $negocio */
        $negocio = $request->attributes->get('negocio_activo');
        $negocio->loadMissing('plan');

        $avanzado = $request->user()?->can('ver_avanzado reportes')
            && (bool) $negocio->plan?->reportes_avanzados;

        return Inertia::render('Modules/ComingSoon', [
            'title' => $avanzado ? 'Reportes avanzados' : 'Reportes',
            'description' => $avanzado
                ? 'Analítica Premium, comparativas y filtros avanzados del negocio.'
                : 'Indicadores básicos de ventas, productos, clientes e inventario.',
            'negocio' => $negocio,
        ]);
    }
}
