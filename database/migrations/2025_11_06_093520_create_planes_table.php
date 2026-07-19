<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('slug')->unique();

            // Límites del negocio. null significa "sin límite".
            $table->unsignedInteger('limite_productos')->nullable();
            $table->unsignedInteger('limite_ventas_mensuales')->nullable();
            $table->unsignedInteger('limite_usuarios')->default(1);

            // Funcionalidades habilitadas por el plan del negocio.
            $table->boolean('tiene_pagina_publica')->default(false);
            $table->boolean('reportes_avanzados')->default(false);
            $table->boolean('multiples_puntos_venta')->default(false);

            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('planes');
    }
};
