<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Negocio;
use Illuminate\Support\Str;

class NegocioSeeder extends Seeder
{
    public function run(): void
    {
        $comerciantes = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['comerciante_free', 'comerciante_premium']);
        })->get();

        foreach ($comerciantes as $user) {
            $nombre = "{$user->nombre} {$user->apellido}";
            $slug = Str::slug($nombre);

            Negocio::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'nombre_comercial' => ucfirst($slug) . " Store",
                    'cuit_cuil' => fake()->numerify('##-########-#'),
                    'telefono' => fake()->phoneNumber(),
                    'direccion' => fake()->address(),
                    'rubro' => fake()->randomElement(['Electrónica', 'Ropa', 'Hogar', 'Servicios']),
                    'logo_path' => null,
                    'activo' => true,
                ]
            );
        }

        echo "✅ Negocios creados para comerciantes Free y Premium.\n";
    }
}
