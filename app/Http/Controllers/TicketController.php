<?php

namespace App\Http\Controllers;

use App\Models\TicketSoporte;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    /**
     * Lista tickets globalmente para administración/soporte y únicamente los
     * propios para usuarios comerciales.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $search = trim((string) $request->query('search', ''));
        $puedeGestionar = $user->hasAnyRole(['admin', 'soporte']);

        $tickets = TicketSoporte::query()
            ->with([
                'usuario:id,nombre,apellido,email',
                'asignado:id,nombre,apellido,email',
            ])
            ->when(! $puedeGestionar, fn ($query) => $query->where('user_id', $user->id))
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('asunto', 'like', "%{$search}%")
                        ->orWhere('descripcion', 'like', "%{$search}%")
                        ->orWhere('estado', 'like', "%{$search}%")
                        ->orWhere('prioridad', 'like', "%{$search}%")
                        ->orWhereHas('usuario', function ($usuarioQuery) use ($search) {
                            $usuarioQuery->where('nombre', 'like', "%{$search}%")
                                ->orWhere('apellido', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'puede_crear_ticket' => $user->can('crear tickets'),
            'puede_gestionar_tickets' => $puedeGestionar,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Muestra el formulario simplificado de creación de incidencias.
     */
    public function create(): Response
    {
        return Inertia::render('Tickets/Create');
    }

    /**
     * Registra un ticket asociado al usuario autenticado.
     */
    public function store(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'asunto' => 'required|string|max:255',
            'descripcion' => 'required|string|max:5000',
            'prioridad' => 'required|in:baja,media,alta',
        ]);

        TicketSoporte::create([
            'user_id' => $user->id,
            'asignado_a' => null,
            'asunto' => $validated['asunto'],
            'descripcion' => $validated['descripcion'],
            'prioridad' => $validated['prioridad'],
            'estado' => 'abierto',
        ]);

        return redirect()
            ->route('tickets.index')
            ->with('success', 'Ticket creado correctamente. El equipo de soporte ya puede revisarlo.');
    }
}
