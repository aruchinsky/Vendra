<?php

namespace Database\Seeders;

use App\Models\Negocio;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NegocioSeeder extends Seeder
{
    public function run(): void
    {
        $planFree = Plan::where('slug', 'free')->firstOrFail();
        $planPremium = Plan::where('slug', 'premium')->firstOrFail();

        $negociosDemo = [
            [
                'email' => 'free@vendra.test',
                'plan_id' => $planFree->id,
                'nombre_comercial' => 'Negocio Demo Free',
                'cuit_cuil' => '20-30000001-1',
                'rubro' => 'Almacén',
            ],
            [
                'email' => 'premium@vendra.test',
                'plan_id' => $planPremium->id,
                'nombre_comercial' => 'Negocio Demo Premium',
                'cuit_cuil' => '20-30000002-2',
                'rubro' => 'Tecnología',
            ],
        ];

        for ($i = 1; $i <= 10; $i++) {
            $premium = $i > 5;

            $negociosDemo[] = [
                'email' => sprintf('usuario%02d@vendra.test', $i),
                'plan_id' => $premium ? $planPremium->id : $planFree->id,
                'nombre_comercial' => sprintf('Comercio Demo %02d', $i),
                'cuit_cuil' => sprintf('20-%08d-%d', 31000000 + $i, $i % 10),
                'rubro' => $premium ? 'Indumentaria' : 'Servicios',
            ];
        }

        foreach ($negociosDemo as $data) {
            $user = User::where('email', $data['email'])->first();

            if (! $user) {
                $this->command?->warn("No se encontró el usuario {$data['email']}; se omitió su negocio.");
                continue;
            }

            $negocio = Negocio::updateOrCreate(
                ['cuit_cuil' => $data['cuit_cuil']],
                [
                    'plan_id' => $data['plan_id'],
                    'nombre_comercial' => $data['nombre_comercial'],
                    'telefono' => '3704000000',
                    'direccion' => 'Formosa, Argentina',
                    'rubro' => $data['rubro'],
                    'logo_path' => null,
                    'activo' => true,
                ]
            );

            DB::table('negocio_user')->updateOrInsert(
                [
                    'negocio_id' => $negocio->id,
                    'user_id' => $user->id,
                ],
                [
                    'es_administrador' => true,
                    'activo' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command?->info('Negocios demo creados y vinculados a sus administradores.');
    }
}
