<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketSoporte extends Model
{
    use HasFactory;

    /**
     * Laravel pluralizaría TicketSoporte como ticket_soportes,
     * pero la migración creó la tabla tickets_soporte.
     */
    protected $table = 'tickets_soporte';

    protected $fillable = [
        'user_id',
        'asignado_a',
        'asunto',
        'descripcion',
        'prioridad',
        'estado',
    ];

    /**
     * Usuario que creó el ticket.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Usuario de soporte asignado al ticket.
     */
    public function asignado(): BelongsTo
    {
        return $this->belongsTo(User::class, 'asignado_a');
    }

    /**
     * Filtra tickets por estado.
     */
    public function scopeEstado($query, ?string $estado)
    {
        if (!$estado) {
            return $query;
        }

        return $query->where('estado', $estado);
    }

    /**
     * Filtra tickets por prioridad.
     */
    public function scopePrioridad($query, ?string $prioridad)
    {
        if (!$prioridad) {
            return $query;
        }

        return $query->where('prioridad', $prioridad);
    }
}
