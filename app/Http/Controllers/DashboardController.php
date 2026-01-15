<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Negocio;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\Cliente;
use App\Models\TicketSoporte;
use App\Models\Plan;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $rol = $user->getRoleNames()->first();

        switch ($rol) {
            case 'admin':
                return $this->dashboardAdministrador($user);

            case 'comerciante_free':
                return $this->dashboardComerciante($user, 'free');

            case 'comerciante_premium':
                return $this->dashboardComerciante($user, 'premium');

            case 'soporte':
                return $this->dashboardSoporte($user);

            default:
                return Inertia::render('Dashboards/Generico', [
                    'user' => $user,
                    'mensaje' => 'Bienvenido a Vendra. Tu rol aún no tiene un panel personalizado.'
                ]);
        }
    }

    /* =========================================================
       🧠 ADMINISTRADOR
    ========================================================= */
    private function dashboardAdministrador($user)
    {
        $stats = [
            'usuariosTotales' => User::count(),
            'negociosActivos' => Negocio::where('activo', true)->count(),
            'productosTotales' => Producto::count(),
            'ventasTotales' => Venta::count(),
            'clientesTotales' => Cliente::count(),
            'planesActivos' => Plan::count(),
            'ingresosTotales' => Venta::sum('total_neto'),
        ];

        // Mock temporal de ventas mensuales
        $stats['ventasMensuales'] = collect(range(1, 6))->mapWithKeys(fn ($i) => [
            now()->subMonths(6 - $i)->format('M') => rand(100, 500)
        ]);

        return Inertia::render('Dashboards/Administrador', [
            'user' => $user,
            'stats' => $stats,
        ]);
    }

    /* =========================================================
       🏪 COMERCIANTE FREE / PREMIUM
    ========================================================= */
    private function dashboardComerciante($user, string $tipo)
    {
        $negocio = Negocio::where('user_id', $user->id)->first();

        $productos = Producto::where('negocio_id', $negocio?->id)->count();
        $ventas = Venta::where('negocio_id', $negocio?->id)->count();
        $clientes = Cliente::where('negocio_id', $negocio?->id)->count();
        $ingresos = Venta::where('negocio_id', $negocio?->id)->sum('total_neto');

        $stats = [
            'negocio' => $negocio?->nombre_comercial ?? 'Sin nombre',
            'plan' => strtoupper($tipo),
            'productos' => $productos,
            'ventas' => $ventas,
            'clientes' => $clientes,
            'ingresos' => $ingresos,
        ];

        $view = $tipo === 'premium' ? 'Dashboards/ComerciantePremium' : 'Dashboards/ComercianteFree';

        return Inertia::render($view, [
            'user' => $user,
            'stats' => $stats,
        ]);
    }

    /**
     * Dashboard para el rol de Soporte Técnico
     */
    private function dashboardSoporte($user)
    {
        // Simulación de datos (hasta que el módulo Tickets esté activo)
        $stats = [
            'ticketsAbiertos' => rand(3, 15),
            'ticketsEnProgreso' => rand(1, 8),
            'ticketsCerrados' => rand(10, 40),
            'promedioRespuesta' => rand(5, 20) . ' min',
            'comerciosAsistidos' => rand(10, 50),
        ];

        return Inertia::render('Dashboards/Soporte', [
            'user' => $user,
            'stats' => $stats,
        ]);
    }

}
