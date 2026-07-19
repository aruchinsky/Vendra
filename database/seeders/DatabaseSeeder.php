<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PlanSeeder::class,
            RolesAndPermissionsSeeder::class,
        ]);

        $usuariosBase = [
            [
                'username' => 'admin',
                'nombre' => 'Andrés',
                'apellido' => 'Ruchinsky',
                'dni' => '28000001',
                'email' => 'admin@vendra.test',
                'rol' => 'admin',
            ],
            [
                'username' => 'premium',
                'nombre' => 'Carla',
                'apellido' => 'Gómez',
                'dni' => '30000001',
                'email' => 'premium@vendra.test',
                'rol' => 'usuario',
            ],
            [
                'username' => 'free',
                'nombre' => 'Luis',
                'apellido' => 'Pérez',
                'dni' => '30000002',
                'email' => 'free@vendra.test',
                'rol' => 'usuario',
            ],
            [
                'username' => 'soporte',
                'nombre' => 'Sofía',
                'apellido' => 'Torres',
                'dni' => '29000001',
                'email' => 'soporte@vendra.test',
                'rol' => 'soporte',
            ],
        ];

        foreach ($usuariosBase as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'username' => $data['username'],
                    'nombre' => $data['nombre'],
                    'apellido' => $data['apellido'],
                    'dni' => $data['dni'],
                    'telefono' => '3704000000',
                    'domicilio' => 'Formosa, Argentina',
                    'password' => Hash::make('12345678'),
                    'estado' => 'activo',
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles([$data['rol']]);
        }

        for ($i = 1; $i <= 10; $i++) {
            $numero = sprintf('%02d', $i);

            $user = User::updateOrCreate(
                ['email' => "usuario{$numero}@vendra.test"],
                [
                    'username' => "usuario{$numero}",
                    'nombre' => 'Usuario',
                    'apellido' => "Demo {$numero}",
                    'dni' => (string) (32000000 + $i),
                    'telefono' => '3704000000',
                    'domicilio' => 'Formosa, Argentina',
                    'password' => Hash::make('12345678'),
                    'estado' => 'activo',
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles(['usuario']);
        }

        $this->call([
            NegocioSeeder::class,
            CategoriaSeeder::class,
        ]);

        $this->command?->info('Vendra poblado con planes, roles, usuarios, negocios y categorías demo.');
    }
}
