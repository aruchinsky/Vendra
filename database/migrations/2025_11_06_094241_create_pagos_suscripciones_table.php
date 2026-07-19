<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos_suscripciones', function (Blueprint $table) {
            $table->id();

            // Todo pago de un plan corresponde obligatoriamente a un negocio.
            $table->foreignId('negocio_id')
                ->constrained('negocios')
                ->restrictOnDelete();

            // Plan solicitado o abonado para el negocio.
            $table->foreignId('plan_id')
                ->constrained('planes')
                ->restrictOnDelete();

            // Usuario que inició o registró el pago. Se conserva el historial
            // aunque esa cuenta deje de existir.
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->decimal('monto', 12, 2);
            $table->string('moneda', 3)->default('ARS');

            $table->date('periodo_inicio');
            $table->date('periodo_fin');

            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado'])
                ->default('pendiente');

            $table->enum('metodo_pago', [
                'mercadopago',
                'transferencia',
                'efectivo',
                'tarjeta',
                'otro',
            ])->default('otro');

            $table->string('referencia_pago')->nullable();
            $table->json('datos_pago')->nullable();
            $table->timestamp('aprobado_at')->nullable();

            $table->timestamps();

            $table->index(['negocio_id', 'estado']);
            $table->index(['plan_id', 'estado']);
            $table->index(['user_id', 'estado']);
            $table->index(['metodo_pago', 'estado']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos_suscripciones');
    }
};
