<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // =====================================================
        // 🆓 PLAN GRATUITO (FREE)
        // =====================================================
        Plan::firstOrCreate(
            ['slug' => 'free'],
            [
                'nombre' => 'Plan Gratuito',
                'limite_productos' => 50,
                'limite_ventas_mensuales' => 100,
                'tiene_pagina_publica' => false,
                'reportes_avanzados' => false,
                'multiples_puntos_venta' => false,
            ]
        );

        // =====================================================
        // 💎 PLAN PREMIUM
        // =====================================================
        Plan::firstOrCreate(
            ['slug' => 'premium'],
            [
                'nombre' => 'Plan Premium',
                'limite_productos' => null, // sin límite
                'limite_ventas_mensuales' => null, // sin límite
                'tiene_pagina_publica' => true,
                'reportes_avanzados' => true,
                'multiples_puntos_venta' => true,
            ]
        );
    }
}
