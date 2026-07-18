<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to login from the registration page', function () {
    $this->get('/register')->assertRedirect('/login');
});

test('registration access is restricted to administrators', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/register')
        ->assertForbidden();

    $admin = User::factory()->create();
    Role::create(['name' => 'admin']);
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/register')
        ->assertOk();
});
