<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'planes'; // 👈 importante

    protected $fillable = [
        'nombre',
        'slug',
        'limite_productos',
        'limite_ventas_mensuales',
        'tiene_pagina_publica',
        'reportes_avanzados',
        'multiples_puntos_venta',
    ];
}
