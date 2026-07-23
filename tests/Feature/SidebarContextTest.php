<?php

use App\Models\Negocio;
use App\Models\Plan;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function crearPlanSidebar(string $slug = 'free'): Plan
{
    return Plan::create([
        'nombre' => $slug === 'premium' ? 'Plan Premium' : 'Plan Gratuito',
        'slug' => $slug,
        'limite_productos' => $slug === 'premium' ? null : 50,
        'limite_ventas_mensuales' => $slug === 'premium' ? null : 100,
        'limite_usuarios' => $slug === 'premium' ? 5 : 1,
        'tiene_pagina_publica' => $slug === 'premium',
        'reportes_avanzados' => $slug === 'premium',
        'multiples_puntos_venta' => $slug === 'premium',
        'activo' => true,
    ]);
}

function crearNegocioSidebar(Plan $plan, string $nombre): Negocio
{
    return Negocio::create([
        'plan_id' => $plan->id,
        'nombre_comercial' => $nombre,
        'activo' => true,
    ]);
}

test('un usuario con un solo negocio lo recibe automáticamente como contexto activo', function () {
    $plan = crearPlanSidebar();
    $user = User::factory()->create();
    $user->assignRole('usuario');

    $negocio = crearNegocioSidebar($plan, 'Comercio Único');
    $negocio->usuarios()->attach($user->id, [
        'es_administrador' => true,
        'activo' => true,
    ]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertSessionHas('negocio_activo_id', $negocio->id)
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboards/ComercianteFree')
            ->where('auth.negocio_activo.id', $negocio->id)
            ->where('auth.es_administrador_negocio', true)
            ->where('auth.cantidad_negocios', 1));
});

test('un administrador global puede seleccionar cualquier negocio activo y volver al entorno global', function () {
    $plan = crearPlanSidebar('premium');
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $negocio = crearNegocioSidebar($plan, 'Negocio Premium');

    $this->actingAs($admin)
        ->post(route('dashboard.negocio.seleccionar', $negocio))
        ->assertRedirect(route('dashboard'))
        ->assertSessionHas('negocio_activo_id', $negocio->id);

    $this->actingAs($admin)
        ->delete(route('dashboard.negocio.limpiar'))
        ->assertRedirect(route('dashboard'))
        ->assertSessionMissing('negocio_activo_id');
});

test('un usuario no puede seleccionar un negocio ajeno', function () {
    $plan = crearPlanSidebar();
    $user = User::factory()->create();
    $user->assignRole('usuario');
    $negocioAjeno = crearNegocioSidebar($plan, 'Negocio Ajeno');

    $this->actingAs($user)
        ->post(route('dashboard.negocio.seleccionar', $negocioAjeno))
        ->assertForbidden();
});

test('soporte puede consultar usuarios pero no recibe acceso a su edición', function () {
    $soporte = User::factory()->create();
    $soporte->assignRole('soporte');

    $this->actingAs($soporte)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Users/Index')
            ->where('auth.es_soporte', true)
            ->where('auth.es_admin_global', false));

    $this->actingAs($soporte)
        ->get(route('users.create'))
        ->assertForbidden();
});

test('los módulos operativos exigen un negocio activo', function () {
    $user = User::factory()->create();
    $user->assignRole('usuario');

    $this->actingAs($user)
        ->get(route('productos.index'))
        ->assertRedirect(route('dashboard'))
        ->assertSessionHas('warning');
});
