<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Negocio;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categoriasBase = [
            ['nombre' => 'Electrónica', 'descripcion' => 'Productos tecnológicos y dispositivos.'],
            ['nombre' => 'Indumentaria', 'descripcion' => 'Ropa, calzado y accesorios.'],
            ['nombre' => 'Alimentos', 'descripcion' => 'Comestibles y bebidas.'],
            ['nombre' => 'Hogar', 'descripcion' => 'Artículos para el hogar y decoración.'],
            ['nombre' => 'Belleza', 'descripcion' => 'Cosméticos y cuidado personal.'],
        ];

        foreach (Negocio::query()->get() as $negocio) {
            foreach ($categoriasBase as $categoria) {
                Categoria::updateOrCreate(
                    [
                        'negocio_id' => $negocio->id,
                        'nombre' => $categoria['nombre'],
                    ],
                    [
                        'descripcion' => $categoria['descripcion'],
                    ]
                );
            }
        }
    }
}
