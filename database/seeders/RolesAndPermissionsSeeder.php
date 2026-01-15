<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modulos = [
            'productos' => ['ver', 'crear', 'editar', 'eliminar'],
            'clientes'  => ['ver', 'crear', 'editar', 'eliminar'],
            'ventas'    => ['ver', 'crear', 'editar', 'eliminar'],
            'reportes'  => ['ver_basico', 'ver_avanzado'],
            'tickets'   => ['ver', 'crear', 'responder', 'cerrar'],
            'usuarios'  => ['ver', 'crear', 'editar', 'eliminar'],
        ];

        foreach ($modulos as $modulo => $acciones) {
            foreach ($acciones as $accion) {
                Permission::firstOrCreate(['name' => "{$accion} {$modulo}"]);
            }
        }

        $roles = ['admin', 'comerciante_free', 'comerciante_premium', 'soporte'];

        foreach ($roles as $rol) {
            Role::firstOrCreate(['name' => $rol]);
        }

        $rolesPermisos = [
            'admin' => Permission::all()->pluck('name')->toArray(),
            'comerciante_free' => [
                'ver productos', 'crear productos', 'editar productos',
                'ver clientes', 'crear clientes', 'editar clientes',
                'ver ventas', 'crear ventas', 'ver_basico reportes',
                'ver tickets', 'crear tickets'
            ],
            'comerciante_premium' => [
                'ver productos', 'crear productos', 'editar productos', 'eliminar productos',
                'ver clientes', 'crear clientes', 'editar clientes', 'eliminar clientes',
                'ver ventas', 'crear ventas', 'editar ventas', 'eliminar ventas',
                'ver_basico reportes', 'ver_avanzado reportes',
                'ver tickets', 'crear tickets', 'cerrar tickets'
            ],
            'soporte' => [
                'ver tickets', 'responder tickets', 'cerrar tickets', 'ver usuarios'
            ],
        ];

        foreach ($rolesPermisos as $rol => $permisos) {
            $r = Role::where('name', $rol)->first();
            $r->syncPermissions($permisos);
        }
    }
}
