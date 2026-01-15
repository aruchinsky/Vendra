<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tickets_soporte', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // quien reporta
            $table->foreignId('asignado_a')->nullable()->constrained('users')->nullOnDelete(); // técnico soporte (rol soporte)
            $table->string('asunto');
            $table->text('descripcion');
            $table->enum('prioridad', ['baja','media','alta'])->default('baja');
            $table->enum('estado', ['abierto','en_progreso','cerrado'])->default('abierto');
            $table->timestamps();
            $table->index(['estado','prioridad']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('tickets_soporte');
    }
};
