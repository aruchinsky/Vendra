<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('negocio_user', function (Blueprint $table) {
            $table->id();

            $table->foreignId('negocio_id')
                ->constrained('negocios')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Distinción técnica mínima para proteger configuración,
            // suscripción e incorporación de miembros al negocio.
            $table->boolean('es_administrador')->default(false);
            $table->boolean('activo')->default(true);

            $table->timestamps();

            $table->unique(['negocio_id', 'user_id']);
            $table->index(['user_id', 'activo']);
            $table->index(['negocio_id', 'es_administrador', 'activo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('negocio_user');
    }
};
