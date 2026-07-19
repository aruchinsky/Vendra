<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PagoSuscripcion extends Model
{
    use HasFactory;

    protected $table = 'pagos_suscripciones';

    protected $fillable = [
        'negocio_id',
        'plan_id',
        'user_id',
        'monto',
        'moneda',
        'periodo_inicio',
        'periodo_fin',
        'estado',
        'metodo_pago',
        'referencia_pago',
        'datos_pago',
        'aprobado_at',
    ];

    protected function casts(): array
    {
        return [
            'negocio_id' => 'integer',
            'plan_id' => 'integer',
            'user_id' => 'integer',
            'monto' => 'float',
            'datos_pago' => 'array',
            'periodo_inicio' => 'date:Y-m-d',
            'periodo_fin' => 'date:Y-m-d',
            'aprobado_at' => 'datetime',
        ];
    }

    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class, 'negocio_id');
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopePendientes(Builder $query): Builder
    {
        return $query->where('estado', 'pendiente');
    }

    public function scopeAprobados(Builder $query): Builder
    {
        return $query->where('estado', 'aprobado');
    }
}
