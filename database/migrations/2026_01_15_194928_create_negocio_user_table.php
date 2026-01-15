<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('negocio_user', function (Blueprint $table) {
            $table->id();

            $table->foreignId('negocio_id')
                ->constrained('negocios')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Rol interno dentro del negocio (independiente de roles globales Spatie)
            $table->enum('rol_en_negocio', ['owner', 'encargado', 'vendedor'])
                ->default('vendedor');

            $table->boolean('activo')->default(true);

            $table->timestamps();

            $table->unique(['negocio_id', 'user_id']);
            $table->index(['user_id', 'negocio_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('negocio_user');
    }
};
