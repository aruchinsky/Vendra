<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('planes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique(); // Free / Premium
            $table->string('slug')->unique();   // free / premium
            $table->unsignedInteger('limite_productos')->nullable(); // null = sin límite
            $table->unsignedInteger('limite_ventas_mensuales')->nullable();
            $table->boolean('tiene_pagina_publica')->default(false);
            $table->boolean('reportes_avanzados')->default(false);
            $table->boolean('multiples_puntos_venta')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('planes');
    }
};
