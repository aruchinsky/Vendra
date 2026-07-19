<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('negocios', function (Blueprint $table) {
            $table->id();

            // El plan pertenece al negocio y determina sus límites y funciones.
            $table->foreignId('plan_id')
                ->constrained('planes')
                ->restrictOnDelete();

            $table->string('nombre_comercial');
            $table->string('cuit_cuil')->nullable();
            $table->string('telefono')->nullable();
            $table->string('direccion')->nullable();
            $table->string('rubro')->nullable();
            $table->string('logo_path')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->index(['plan_id', 'activo']);
            $table->index('nombre_comercial');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('negocios');
    }
};
