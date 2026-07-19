<?php

namespace App\Http\Controllers;

use App\Models\Negocio;
use App\Models\PagoSuscripcion;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PagoSuscripcionController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $search = $request->query('search');
        $esAdminGlobal = $user->hasRole('admin');

        $pagos = PagoSuscripcion::query()
            ->with([
                'negocio:id,plan_id,nombre_comercial',
                'plan:id,nombre,slug',
                'usuario:id,nombre,apellido,email',
            ])
            ->when(! $esAdminGlobal, function ($query) use ($user) {
                $query->whereHas('negocio.administradores', function ($q) use ($user) {
                    $q->where('users.id', $user->id);
                });
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('referencia_pago', 'like', "%{$search}%")
                        ->orWhere('estado', 'like', "%{$search}%")
                        ->orWhereHas('negocio', function ($negocioQuery) use ($search) {
                            $negocioQuery->where('nombre_comercial', 'like', "%{$search}%");
                        })
                        ->orWhereHas('plan', function ($planQuery) use ($search) {
                            $planQuery->where('nombre', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('PagosSuscripciones/Index', [
            'pagos_suscripciones' => $pagos,
            'es_admin_global' => $esAdminGlobal,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $negocios = Negocio::query()
            ->with('plan:id,nombre,slug')
            ->when(! $user->hasRole('admin'), function ($query) use ($user) {
                $query->whereHas('administradores', function ($q) use ($user) {
                    $q->where('users.id', $user->id);
                });
            })
            ->activos()
            ->orderBy('nombre_comercial')
            ->get();

        $planes = Plan::query()
            ->activos()
            ->orderBy('id')
            ->get();

        return Inertia::render('PagosSuscripciones/Create', [
            'negocios' => $negocios,
            'planes' => $planes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'negocio_id' => 'required|integer|exists:negocios,id',
            'plan_id' => 'required|integer|exists:planes,id',
            'monto' => 'required|numeric|min:0',
            'moneda' => 'required|string|size:3',
            'periodo_inicio' => 'required|date',
            'periodo_fin' => 'required|date|after_or_equal:periodo_inicio',
            'metodo_pago' => 'required|in:mercadopago,transferencia,efectivo,tarjeta,otro',
            'referencia_pago' => 'nullable|string|max:255',
        ]);

        $negocio = Negocio::query()->findOrFail($validated['negocio_id']);
        $this->autorizarAdministracion($user, $negocio);

        $plan = Plan::query()
            ->whereKey($validated['plan_id'])
            ->where('activo', true)
            ->firstOrFail();

        try {
            PagoSuscripcion::create([
                'negocio_id' => $negocio->id,
                'plan_id' => $plan->id,
                'user_id' => $user->id,
                'monto' => $validated['monto'],
                'moneda' => strtoupper($validated['moneda']),
                'periodo_inicio' => $validated['periodo_inicio'],
                'periodo_fin' => $validated['periodo_fin'],
                'estado' => 'pendiente',
                'metodo_pago' => $validated['metodo_pago'],
                'referencia_pago' => $validated['referencia_pago'] ?? null,
                'datos_pago' => null,
                'aprobado_at' => null,
            ]);

            return redirect()
                ->route('pagos-suscripciones.index')
                ->with('success', 'Pago de suscripción registrado y pendiente de aprobación.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo registrar el pago de suscripción.');
        }
    }

    public function aprobar(PagoSuscripcion $pagoSuscripcion): RedirectResponse
    {
        if ($pagoSuscripcion->estado !== 'pendiente') {
            return redirect()
                ->back()
                ->with('warning', 'El pago ya fue procesado anteriormente.');
        }

        try {
            DB::transaction(function () use ($pagoSuscripcion) {
                $pagoSuscripcion->update([
                    'estado' => 'aprobado',
                    'aprobado_at' => now(),
                ]);

                $pagoSuscripcion->negocio()->update([
                    'plan_id' => $pagoSuscripcion->plan_id,
                ]);
            });

            return redirect()
                ->route('pagos-suscripciones.index')
                ->with('success', 'Pago aprobado y plan del negocio actualizado correctamente.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->with('error', 'No se pudo aprobar el pago.');
        }
    }

    public function rechazar(PagoSuscripcion $pagoSuscripcion): RedirectResponse
    {
        if ($pagoSuscripcion->estado !== 'pendiente') {
            return redirect()
                ->back()
                ->with('warning', 'El pago ya fue procesado anteriormente.');
        }

        try {
            $pagoSuscripcion->update([
                'estado' => 'rechazado',
                'aprobado_at' => null,
            ]);

            return redirect()
                ->route('pagos-suscripciones.index')
                ->with('success', 'Pago rechazado correctamente.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->with('error', 'No se pudo rechazar el pago.');
        }
    }

    private function autorizarAdministracion(User $user, Negocio $negocio): void
    {
        if (! $user->hasRole('admin') && ! $negocio->esAdministrador($user->id)) {
            abort(403, 'No tenés permisos para gestionar la suscripción de este negocio.');
        }
    }
}
