<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Negocio;
use App\Models\PagoSuscripcion;
use App\Models\Plan;
use App\Models\Producto;
use App\Models\TicketSoporte;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->hasRole('admin')) {
            return $this->dashboardAdministrador($user);
        }

        if ($user->hasRole('soporte')) {
            return $this->dashboardSoporte($user);
        }

        if ($user->hasRole('usuario')) {
            return $this->dashboardUsuario($request, $user);
        }

        return Inertia::render('Dashboards/Generico', [
            'user' => $user,
            'mensaje' => 'Tu cuenta todavía no posee un rol global habilitado para operar en Vendra.',
        ]);
    }

    public function negocios(Request $request): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        abort_unless($user->hasRole('usuario'), 403);

        $negocios = $this->negociosDisponibles($user);

        if ($negocios->isEmpty()) {
            return redirect()->route('dashboard');
        }

        return $this->renderSelectorNegocios($request, $user, $negocios);
    }

    public function seleccionarNegocio(Request $request, Negocio $negocio): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        abort_unless($user->hasRole('usuario'), 403);

        $pertenece = $user->negociosActivos()
            ->where('negocios.id', $negocio->id)
            ->exists();

        abort_unless($pertenece, 403, 'No tenés acceso a este negocio.');

        $request->session()->put('negocio_activo_id', $negocio->id);

        return redirect()
            ->route('dashboard')
            ->with('success', "Ahora estás gestionando {$negocio->nombre_comercial}.");
    }

    private function dashboardAdministrador(User $user): Response
    {
        $stats = [
            'usuariosTotales' => User::count(),
            'usuariosActivos' => User::where('estado', 'activo')->count(),
            'negociosTotales' => Negocio::count(),
            'negociosActivos' => Negocio::activos()->count(),
            'productosTotales' => Producto::count(),
            'ventasTotales' => Venta::count(),
            'clientesTotales' => Cliente::count(),
            'planesActivos' => Plan::activos()->count(),
            'ticketsAbiertos' => TicketSoporte::where('estado', 'abierto')->count(),
            'pagosPendientes' => PagoSuscripcion::pendientes()->count(),
            'ingresosComercios' => (float) Venta::sum('total_neto'),
            'ingresosSuscripciones' => (float) PagoSuscripcion::aprobados()->sum('monto'),
        ];

        $evolucion = collect(range(5, 0))->map(function (int $monthsAgo) {
            $inicio = now()->subMonths($monthsAgo)->startOfMonth();
            $fin = $inicio->copy()->endOfMonth();

            return [
                'periodo' => $inicio->format('m/Y'),
                'usuarios' => User::whereBetween('created_at', [$inicio, $fin])->count(),
                'negocios' => Negocio::whereBetween('created_at', [$inicio, $fin])->count(),
                'ventas' => (float) Venta::whereBetween('fecha', [$inicio, $fin])->sum('total_neto'),
            ];
        })->values();

        $distribucionPlanes = Plan::query()
            ->activos()
            ->withCount([
                'negocios as negocios_activos_count' => fn ($query) => $query->where('activo', true),
            ])
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'slug'])
            ->map(fn (Plan $plan) => [
                'id' => $plan->id,
                'nombre' => $plan->nombre,
                'slug' => $plan->slug,
                'negocios' => $plan->negocios_activos_count,
            ]);

        $negociosRecientes = Negocio::query()
            ->with('plan:id,nombre,slug')
            ->withCount('usuariosActivos')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Negocio $negocio) => [
                'id' => $negocio->id,
                'nombre_comercial' => $negocio->nombre_comercial,
                'rubro' => $negocio->rubro,
                'activo' => $negocio->activo,
                'created_at' => $negocio->created_at,
                'usuarios_activos_count' => $negocio->usuarios_activos_count,
                'plan' => $negocio->plan ? [
                    'nombre' => $negocio->plan->nombre,
                    'slug' => $negocio->plan->slug,
                ] : null,
            ]);

        $pagosPendientes = PagoSuscripcion::query()
            ->pendientes()
            ->with([
                'negocio:id,nombre_comercial',
                'plan:id,nombre,slug',
                'usuario:id,nombre,apellido,email',
            ])
            ->latest()
            ->limit(5)
            ->get();

        $ticketsRecientes = TicketSoporte::query()
            ->leftJoin('users as reportantes', 'reportantes.id', '=', 'tickets_soporte.user_id')
            ->select([
                'tickets_soporte.id',
                'tickets_soporte.asunto',
                'tickets_soporte.prioridad',
                'tickets_soporte.estado',
                'tickets_soporte.created_at',
                'reportantes.nombre as usuario_nombre',
                'reportantes.apellido as usuario_apellido',
            ])
            ->latest('tickets_soporte.created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboards/Administrador', [
            'user' => $user,
            'stats' => $stats,
            'evolucion' => $evolucion,
            'distribucionPlanes' => $distribucionPlanes,
            'negociosRecientes' => $negociosRecientes,
            'pagosPendientes' => $pagosPendientes,
            'ticketsRecientes' => $ticketsRecientes,
        ]);
    }

    private function dashboardSoporte(User $user): Response
    {
        $ticketsResueltos = TicketSoporte::query()
            ->where('estado', 'cerrado')
            ->latest('updated_at')
            ->limit(100)
            ->get(['created_at', 'updated_at']);

        $promedioMinutos = $ticketsResueltos->isEmpty()
            ? null
            : (int) round($ticketsResueltos->average(
                fn (TicketSoporte $ticket) => $ticket->created_at->diffInMinutes($ticket->updated_at)
            ));

        $stats = [
            'ticketsAbiertos' => TicketSoporte::where('estado', 'abierto')->count(),
            'ticketsEnProgreso' => TicketSoporte::where('estado', 'en_progreso')->count(),
            'ticketsCerrados' => TicketSoporte::where('estado', 'cerrado')->count(),
            'prioridadAlta' => TicketSoporte::where('prioridad', 'alta')
                ->where('estado', '!=', 'cerrado')
                ->count(),
            'asignadosAMi' => TicketSoporte::where('asignado_a', $user->id)
                ->where('estado', '!=', 'cerrado')
                ->count(),
            'sinAsignar' => TicketSoporte::whereNull('asignado_a')
                ->where('estado', '!=', 'cerrado')
                ->count(),
            'usuariosAsistidos' => TicketSoporte::distinct('user_id')->count('user_id'),
            'promedioRespuesta' => $this->formatearDuracion($promedioMinutos),
        ];

        $ticketsRecientes = TicketSoporte::query()
            ->leftJoin('users as reportantes', 'reportantes.id', '=', 'tickets_soporte.user_id')
            ->leftJoin('users as tecnicos', 'tecnicos.id', '=', 'tickets_soporte.asignado_a')
            ->select([
                'tickets_soporte.id',
                'tickets_soporte.asunto',
                'tickets_soporte.descripcion',
                'tickets_soporte.prioridad',
                'tickets_soporte.estado',
                'tickets_soporte.created_at',
                'tickets_soporte.updated_at',
                'reportantes.nombre as usuario_nombre',
                'reportantes.apellido as usuario_apellido',
                'tecnicos.nombre as tecnico_nombre',
                'tecnicos.apellido as tecnico_apellido',
            ])
            ->latest('tickets_soporte.created_at')
            ->limit(8)
            ->get();

        $cargaPorEstado = [
            ['estado' => 'Abiertos', 'cantidad' => $stats['ticketsAbiertos']],
            ['estado' => 'En progreso', 'cantidad' => $stats['ticketsEnProgreso']],
            ['estado' => 'Cerrados', 'cantidad' => $stats['ticketsCerrados']],
        ];

        return Inertia::render('Dashboards/Soporte', [
            'user' => $user,
            'stats' => $stats,
            'ticketsRecientes' => $ticketsRecientes,
            'cargaPorEstado' => $cargaPorEstado,
        ]);
    }

    private function dashboardUsuario(Request $request, User $user): Response
    {
        $negocios = $this->negociosDisponibles($user);

        if ($negocios->isEmpty()) {
            $request->session()->forget('negocio_activo_id');

            return Inertia::render('Dashboards/UsuarioSinNegocio', [
                'user' => $user,
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

        if ($negocios->count() === 1) {
            /** @var Negocio $negocio */
            $negocio = $negocios->first();
            $request->session()->put('negocio_activo_id', $negocio->id);

            return $this->dashboardNegocio($user, $negocio, 1);
        }

        $negocioActivoId = (int) $request->session()->get('negocio_activo_id', 0);
        /** @var Negocio|null $negocioActivo */
        $negocioActivo = $negocios->firstWhere('id', $negocioActivoId);

        if (! $negocioActivo) {
            $request->session()->forget('negocio_activo_id');

            return $this->renderSelectorNegocios($request, $user, $negocios);
        }

        return $this->dashboardNegocio($user, $negocioActivo, $negocios->count());
    }

    private function dashboardNegocio(User $user, Negocio $negocio, int $cantidadNegocios): Response
    {
        $negocio->loadMissing('plan');
        $plan = $negocio->plan;

        $inicioMes = now()->startOfMonth();
        $finMes = now()->endOfMonth();
        $inicioHoy = now()->startOfDay();
        $finHoy = now()->endOfDay();

        $productos = Producto::where('negocio_id', $negocio->id)->count();
        $clientes = Cliente::where('negocio_id', $negocio->id)->count();
        $ventas = Venta::where('negocio_id', $negocio->id)->count();
        $ingresos = (float) Venta::where('negocio_id', $negocio->id)->sum('total_neto');
        $ventasMes = Venta::where('negocio_id', $negocio->id)
            ->whereBetween('fecha', [$inicioMes, $finMes])
            ->count();
        $ingresosMes = (float) Venta::where('negocio_id', $negocio->id)
            ->whereBetween('fecha', [$inicioMes, $finMes])
            ->sum('total_neto');
        $ventasHoy = Venta::where('negocio_id', $negocio->id)
            ->whereBetween('fecha', [$inicioHoy, $finHoy])
            ->count();
        $ingresosHoy = (float) Venta::where('negocio_id', $negocio->id)
            ->whereBetween('fecha', [$inicioHoy, $finHoy])
            ->sum('total_neto');

        $ventasRecientes = Venta::query()
            ->leftJoin('clientes', 'clientes.id', '=', 'ventas.cliente_id')
            ->where('ventas.negocio_id', $negocio->id)
            ->select([
                'ventas.id',
                'ventas.fecha',
                'ventas.total_neto',
                'ventas.metodo_pago',
                'ventas.estado_pago',
                'ventas.comprobante',
                'clientes.nombre as cliente_nombre',
            ])
            ->latest('ventas.fecha')
            ->limit(6)
            ->get();

        $ventasMensuales = collect(range(5, 0))->map(function (int $monthsAgo) use ($negocio) {
            $inicio = now()->subMonths($monthsAgo)->startOfMonth();
            $fin = $inicio->copy()->endOfMonth();

            return [
                'periodo' => $inicio->format('m/Y'),
                'ventas' => Venta::where('negocio_id', $negocio->id)
                    ->whereBetween('fecha', [$inicio, $fin])
                    ->count(),
                'ingresos' => (float) Venta::where('negocio_id', $negocio->id)
                    ->whereBetween('fecha', [$inicio, $fin])
                    ->sum('total_neto'),
            ];
        })->values();

        $metodosPago = Venta::query()
            ->where('negocio_id', $negocio->id)
            ->selectRaw('metodo_pago, COUNT(*) as cantidad, SUM(total_neto) as total')
            ->groupBy('metodo_pago')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($item) => [
                'metodo' => $item->metodo_pago,
                'cantidad' => (int) $item->cantidad,
                'total' => (float) $item->total,
            ]);

        $productosBajoStock = Producto::query()
            ->where('negocio_id', $negocio->id)
            ->where('activo', true)
            ->where('stock_actual', '<=', 5)
            ->orderBy('stock_actual')
            ->limit(6)
            ->get(['id', 'nombre', 'stock_actual']);

        $limiteProductos = $plan?->limite_productos;
        $limiteVentas = $plan?->limite_ventas_mensuales;

        $stats = [
            'productos' => $productos,
            'clientes' => $clientes,
            'ventas' => $ventas,
            'ingresos' => $ingresos,
            'ventasMes' => $ventasMes,
            'ingresosMes' => $ingresosMes,
            'ventasHoy' => $ventasHoy,
            'ingresosHoy' => $ingresosHoy,
            'productosBajoStock' => $productosBajoStock->count(),
            'usuariosActivos' => $negocio->usuariosActivos()->count(),
            'usoProductos' => $limiteProductos === null || $limiteProductos === 0
                ? null
                : min(100, (int) round(($productos / $limiteProductos) * 100)),
            'usoVentasMensuales' => $limiteVentas === null || $limiteVentas === 0
                ? null
                : min(100, (int) round(($ventasMes / $limiteVentas) * 100)),
        ];

        $props = [
            'user' => $user,
            'negocio' => $negocio,
            'plan' => $plan,
            'stats' => $stats,
            'ventasRecientes' => $ventasRecientes,
            'ventasMensuales' => $ventasMensuales,
            'metodosPago' => $metodosPago,
            'productosBajoStock' => $productosBajoStock,
            'cantidadNegocios' => $cantidadNegocios,
            'esAdministradorNegocio' => $negocio->esAdministrador($user->id),
        ];

        $vista = $plan?->slug === 'premium'
            ? 'Dashboards/UsuarioPremium'
            : 'Dashboards/UsuarioFree';

        return Inertia::render($vista, $props);
    }

    private function negociosDisponibles(User $user)
    {
        return $user->negociosActivos()
            ->with('plan')
            ->withCount('usuariosActivos')
            ->orderBy('nombre_comercial')
            ->get();
    }

    private function renderSelectorNegocios(Request $request, User $user, $negocios): Response
    {
        $negocioActivoId = (int) $request->session()->get('negocio_activo_id', 0);

        return Inertia::render('Dashboards/SelectorNegocio', [
            'user' => $user,
            'negocioActivoId' => $negocioActivoId ?: null,
            'negocios' => $negocios->map(fn (Negocio $negocio) => [
                'id' => $negocio->id,
                'nombre_comercial' => $negocio->nombre_comercial,
                'rubro' => $negocio->rubro,
                'direccion' => $negocio->direccion,
                'logo_path' => $negocio->logo_path,
                'usuarios_activos_count' => $negocio->usuarios_activos_count,
                'es_administrador' => (bool) $negocio->pivot?->es_administrador,
                'plan' => $negocio->plan ? [
                    'id' => $negocio->plan->id,
                    'nombre' => $negocio->plan->nombre,
                    'slug' => $negocio->plan->slug,
                    'reportes_avanzados' => $negocio->plan->reportes_avanzados,
                ] : null,
            ])->values(),
        ]);
    }

    private function formatearDuracion(?int $minutos): string
    {
        if ($minutos === null) {
            return 'Sin datos';
        }

        if ($minutos < 60) {
            return "{$minutos} min";
        }

        $horas = intdiv($minutos, 60);
        $resto = $minutos % 60;

        return $resto > 0 ? "{$horas} h {$resto} min" : "{$horas} h";
    }
}
