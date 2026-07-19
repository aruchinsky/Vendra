<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertOk();
});

test('new users can register', function () {
    Role::create([
        'name' => 'usuario',
        'guard_name' => 'web',
    ]);

    $response = $this->post('/register', [
        'nombre' => 'Iván',
        'apellido' => 'Prueba',
        'username' => 'ivan.prueba',
        'email' => 'ivan.prueba@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::query()
        ->where('email', 'ivan.prueba@example.com')
        ->firstOrFail();

    expect($user->nombre)->toBe('Iván')
        ->and($user->apellido)->toBe('Prueba')
        ->and($user->username)->toBe('ivan.prueba')
        ->and($user->hasRole('usuario'))->toBeTrue();
});

test('authenticated users cannot open the public registration page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/register');

    $response->assertRedirect(route('dashboard', absolute: false));
});
