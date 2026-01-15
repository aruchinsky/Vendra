<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('negocio_id')
                ->constrained('negocios')
                ->cascadeOnDelete();

            // Vendedor (usuario que realizó la venta)
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('cliente_id')
                ->nullable()
                ->constrained('clientes')
                ->nullOnDelete();

            $table->dateTime('fecha');

            // Totales (definición clara: total_neto = total final)
            $table->decimal('total_bruto', 12, 2);
            $table->decimal('descuento', 12, 2)->default(0);
            $table->decimal('total_neto', 12, 2);

            $table->enum('metodo_pago', [
                'efectivo','transferencia','debito','credito','mercadopago','otro'
            ])->default('efectivo');

            $table->enum('estado_pago', [
                'pendiente','pagado','anulado'
            ])->default('pagado');

            $table->string('comprobante')->nullable();

            $table->timestamps();
            $table->index(['negocio_id', 'fecha']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('ventas');
    }
};
