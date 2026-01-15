<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->foreignId('categoria_id')->nullable()->constrained('categorias')->nullOnDelete();
            $table->string('nombre');
            $table->string('sku')->nullable();
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 12, 2);
            $table->integer('stock_actual')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->unique(['negocio_id','sku']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('productos');
    }
};
