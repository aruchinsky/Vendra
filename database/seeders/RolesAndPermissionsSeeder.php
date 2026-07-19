<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Se mantienen los nombres actuales para reducir cambios en el código.
        // Free/Premium ya no son roles: el plan del negocio habilita funciones.
        $modulos = [
            'productos' => ['ver', 'crear', 'editar', 'eliminar'],
            'clientes' => ['ver', 'crear', 'editar', 'eliminar'],
            'ventas' => ['ver', 'crear', 'editar', 'eliminar'],
            'reportes' => ['ver_basico', 'ver_avanzado'],
            'tickets' => ['ver', 'crear', 'responder', 'cerrar'],
            'usuarios' => ['ver', 'crear', 'editar', 'eliminar'],
        ];

        foreach ($modulos as $modulo => $acciones) {
            foreach ($acciones as $accion) {
                Permission::firstOrCreate([
                    'name' => "{$accion} {$modulo}",
                    'guard_name' => 'web',
                ]);
            }
        }

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $usuario = Role::firstOrCreate([
            'name' => 'usuario',
            'guard_name' => 'web',
        ]);

        $soporte = Role::firstOrCreate([
            'name' => 'soporte',
            'guard_name' => 'web',
        ]);

        $admin->syncPermissions(Permission::all());

        // El usuario puede operar Vendra. Los límites y funciones reales se
        // validan además con el plan del negocio activo y es_administrador.
        $usuario->syncPermissions([
            'ver productos',
            'crear productos',
            'editar productos',
            'eliminar productos',
            'ver clientes',
            'crear clientes',
            'editar clientes',
            'eliminar clientes',
            'ver ventas',
            'crear ventas',
            'editar ventas',
            'eliminar ventas',
            'ver_basico reportes',
            'ver_avanzado reportes',
            'ver tickets',
            'crear tickets',
            'cerrar tickets',
            'ver usuarios',
            'crear usuarios',
            'editar usuarios',
            'eliminar usuarios',
        ]);

        $soporte->syncPermissions([
            'ver tickets',
            'responder tickets',
            'cerrar tickets',
            'ver usuarios',
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
