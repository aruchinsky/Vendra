<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('pagos_suscripciones', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('plan_id')
                ->constrained('planes')
                ->cascadeOnDelete();

            $table->foreignId('negocio_id')
                ->nullable()
                ->constrained('negocios')
                ->nullOnDelete();

            $table->decimal('monto', 12, 2);
            $table->string('moneda', 3)->default('ARS');

            $table->date('periodo_inicio');
            $table->date('periodo_fin');

            $table->enum('estado', ['pendiente','aprobado','rechazado'])
                ->default('pendiente');

            // Método agnóstico
            $table->enum('metodo_pago', [
                'mercadopago','transferencia','efectivo','tarjeta','otro'
            ])->default('otro');

            // Identificador universal (operación, comprobante, referencia externa)
            $table->string('referencia_pago')->nullable();

            // Datos específicos del proveedor (ej: MP payment_id, status_detail, etc.)
            $table->json('datos_pago')->nullable();

            // Auditoría de aprobación
            $table->timestamp('aprobado_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'plan_id', 'estado']);
            $table->index(['metodo_pago', 'estado']);
            $table->index(['negocio_id', 'estado']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('pagos_suscripciones');
    }
};
