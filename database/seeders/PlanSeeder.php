<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::updateOrCreate(
            ['slug' => 'free'],
            [
                'nombre' => 'Plan Gratuito',
                'limite_productos' => 50,
                'limite_ventas_mensuales' => 100,
                'limite_usuarios' => 1,
                'tiene_pagina_publica' => false,
                'reportes_avanzados' => false,
                'multiples_puntos_venta' => false,
                'activo' => true,
            ]
        );

        Plan::updateOrCreate(
            ['slug' => 'premium'],
            [
                'nombre' => 'Plan Premium',
                'limite_productos' => null,
                'limite_ventas_mensuales' => null,
                'limite_usuarios' => 5,
                'tiene_pagina_publica' => true,
                'reportes_avanzados' => true,
                'multiples_puntos_venta' => true,
                'activo' => true,
            ]
        );
    }
}
