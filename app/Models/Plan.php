<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'planes';

    protected $fillable = [
        'nombre',
        'slug',
        'limite_productos',
        'limite_ventas_mensuales',
        'limite_usuarios',
        'tiene_pagina_publica',
        'reportes_avanzados',
        'multiples_puntos_venta',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'limite_productos' => 'integer',
            'limite_ventas_mensuales' => 'integer',
            'limite_usuarios' => 'integer',
            'tiene_pagina_publica' => 'boolean',
            'reportes_avanzados' => 'boolean',
            'multiples_puntos_venta' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    /* =========================================================
       Relaciones
    ========================================================= */

    public function negocios(): HasMany
    {
        return $this->hasMany(Negocio::class, 'plan_id');
    }

    public function pagosSuscripciones(): HasMany
    {
        return $this->hasMany(PagoSuscripcion::class, 'plan_id');
    }

    /* =========================================================
       Scopes
    ========================================================= */

    public function scopeActivos(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    public function scopeBuscar(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('nombre', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
        });
    }
}
