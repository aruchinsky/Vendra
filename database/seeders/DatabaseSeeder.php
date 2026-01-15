<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Plan;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {

            // =====================================================
            // 📦 SEEDERS BASE
            // =====================================================
            $this->call([
                PlanSeeder::class,
                RolesAndPermissionsSeeder::class,
            ]);

            // =====================================================
            // 🌐 CUENTAS BASE
            // =====================================================
            $planFree = \App\Models\Plan::where('slug', 'free')->first();
            $planPremium = \App\Models\Plan::where('slug', 'premium')->first();

            $usuariosBase = [
                [
                    'username' => 'admin',
                    'nombre' => 'Andrés',
                    'apellido' => 'Ruchinsky',
                    'email' => 'admin@vendra.test',
                    'rol' => 'admin',
                    'plan_id' => $planPremium->id,
                ],
                [
                    'username' => 'premium',
                    'nombre' => 'Carla',
                    'apellido' => 'Gómez',
                    'email' => 'premium@vendra.test',
                    'rol' => 'comerciante_premium',
                    'plan_id' => $planPremium->id,
                ],
                [
                    'username' => 'free',
                    'nombre' => 'Luis',
                    'apellido' => 'Pérez',
                    'email' => 'free@vendra.test',
                    'rol' => 'comerciante_free',
                    'plan_id' => $planFree->id,
                ],
                [
                    'username' => 'soporte',
                    'nombre' => 'Sofía',
                    'apellido' => 'Torres',
                    'email' => 'soporte@vendra.test',
                    'rol' => 'soporte',
                    'plan_id' => $planFree->id,
                ],
            ];

            foreach ($usuariosBase as $data) {
                $user = User::firstOrCreate(
                    ['email' => $data['email']],
                    [
                        'username' => $data['username'],
                        'nombre' => $data['nombre'],
                        'apellido' => $data['apellido'],
                        'dni' => fake()->unique()->numerify('########'),
                        'telefono' => fake()->phoneNumber(),
                        'domicilio' => fake()->address(),
                        'password' => Hash::make('12345678'),
                        'estado' => 'activo',
                        'plan_id' => $data['plan_id'],
                    ]
                );

                $user->assignRole($data['rol']);
            }

            // =====================================================
            // 👨‍💻 USUARIOS DEMO ADICIONALES
            // =====================================================
            for ($i = 1; $i <= 10; $i++) {
                $nombre = fake()->firstName();
                $apellido = fake()->lastName();
                $username = Str::slug($nombre . $apellido . $i);
                $rol = $i <= 5 ? 'comerciante_free' : 'comerciante_premium';
                $plan = $i <= 5 ? $planFree : $planPremium;

                $usuario = User::firstOrCreate(
                    ['email' => "{$username}@vendra.test"],
                    [
                        'username' => $username,
                        'nombre' => $nombre,
                        'apellido' => $apellido,
                        'dni' => fake()->unique()->numerify('########'),
                        'telefono' => fake()->phoneNumber(),
                        'domicilio' => fake()->address(),
                        'password' => Hash::make('12345678'),
                        'estado' => 'activo',
                        'email_verified_at' => now(),
                        'remember_token' => Str::random(10),
                        'plan_id' => $plan->id,
                    ]
                );

                $usuario->assignRole($rol);
            }

            // =====================================================
            // 🏪 NEGOCIOS Y CATEGORÍAS
            // =====================================================
            $this->call([
                NegocioSeeder::class,
                CategoriaSeeder::class,
            ]);

            $this->command->info('✅ Sistema Vendra poblado con Planes, Roles, Usuarios, Negocios y Categorías.');
        });
    }
}
