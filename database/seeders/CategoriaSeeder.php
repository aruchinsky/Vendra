<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;
use App\Models\Negocio;
use Illuminate\Support\Arr;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $nombresGenerales = [
            ['nombre' => 'Electrónica', 'descripcion' => 'Productos tecnológicos y dispositivos.'],
            ['nombre' => 'Indumentaria', 'descripcion' => 'Ropa, calzado y accesorios.'],
            ['nombre' => 'Alimentos', 'descripcion' => 'Comestibles y bebidas.'],
            ['nombre' => 'Hogar', 'descripcion' => 'Artículos para el hogar y decoración.'],
            ['nombre' => 'Belleza', 'descripcion' => 'Cosméticos y cuidado personal.'],
        ];

        // Si aún no hay negocios, crear una categoría genérica
        if (Negocio::count() === 0) {
            foreach ($nombresGenerales as $cat) {
                Categoria::firstOrCreate($cat);
            }
            return;
        }

        // Crear categorías base por negocio
        foreach (Negocio::all() as $negocio) {
            $cantidad = rand(3, 5);
            $seleccionadas = Arr::random($nombresGenerales, $cantidad);

            foreach ($seleccionadas as $cat) {
                Categoria::firstOrCreate([
                    'negocio_id' => $negocio->id,
                    'nombre' => $cat['nombre'],
                ], [
                    'descripcion' => $cat['descripcion'],
                ]);
            }
        }
    }
}
