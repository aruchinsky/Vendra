<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar las migraciones.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Datos personales
            $table->string('nombre');
            $table->string('apellido');
            $table->string('dni', 20)->nullable()->unique();
            $table->string('telefono')->nullable();
            $table->string('domicilio')->nullable();

            // Datos de acceso
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            // Relaciones opcionales
            $table->foreignId('plan_id')->nullable()->constrained('planes')->nullOnDelete();
            // 🚫 Eliminamos negocio_id para evitar la referencia circular

            // Estado del usuario
            $table->enum('estado', ['activo', 'inactivo', 'suspendido'])->default('activo');

            // Tokens y tiempos
            $table->rememberToken();
            $table->timestamps();
        });


        // Tabla de tokens para restablecimiento de contraseña
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Sesiones activas de los usuarios
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Revertir las migraciones.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
