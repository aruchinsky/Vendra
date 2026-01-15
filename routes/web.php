<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NegocioController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\VentaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // --- Dashboard principal ---
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categorias', CategoriaController::class);
    // --- Módulo Negocios ---
    Route::resource('negocios', NegocioController::class);
    // --- Módulo Planes ---
    Route::resource('planes', PlanController::class);
    // --- Módulo Planes ---
    Route::resource('planes', PlanController::class);
    // --- Módulo de Reportes ---
    Route::resource('reportes', ReporteController::class);
    // --- Módulo de Tickets ---
    Route::resource('tickets', TicketController::class);
    // --- Módulo de Productos ---
    Route::resource('productos', ProductoController::class);
    // --- Módulo de Clientes ---
    Route::resource('clientes', ClienteController::class);
    // --- Módulo de Ventas ---
    Route::resource('ventas', VentaController::class);

});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function (){
    //roles
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');

    //permisos
    Route::get('/users/roles', [UserRoleController::class, 'index'])->name('users.roles.index');
    Route::put('/users/roles', [UserRoleController::class, 'update'])->name('users.roles.update');

    Route::resource('users', UserController::class);

    // Registro habilitado solo para admin
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
