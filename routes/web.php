<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NegocioController;
use App\Http\Controllers\NegocioUserController;
use App\Http\Controllers\PagoSuscripcionController;
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
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
    Route::get('dashboard/negocios', [DashboardController::class, 'negocios'])
        ->name('dashboard.negocios');
    Route::post(
        'dashboard/negocios/{negocio}/seleccionar',
        [DashboardController::class, 'seleccionarNegocio']
    )->name('dashboard.negocio.seleccionar');

    Route::resource('categorias', CategoriaController::class);
    Route::resource('negocios', NegocioController::class);
    Route::resource('reportes', ReporteController::class);
    Route::resource('tickets', TicketController::class);
    Route::resource('productos', ProductoController::class);
    Route::resource('clientes', ClienteController::class);
    Route::resource('ventas', VentaController::class);

    Route::prefix('negocios/{negocio}')
        ->name('negocios.')
        ->group(function () {
            Route::get('usuarios', [NegocioUserController::class, 'index'])
                ->name('usuarios.index');
            Route::post('usuarios', [NegocioUserController::class, 'store'])
                ->name('usuarios.store');
            Route::put('usuarios/{user}', [NegocioUserController::class, 'update'])
                ->name('usuarios.update');
            Route::delete('usuarios/{user}', [NegocioUserController::class, 'destroy'])
                ->name('usuarios.destroy');
        });

    Route::get('pagos-suscripciones', [PagoSuscripcionController::class, 'index'])
        ->name('pagos-suscripciones.index');
    Route::get('pagos-suscripciones/create', [PagoSuscripcionController::class, 'create'])
        ->name('pagos-suscripciones.create');
    Route::post('pagos-suscripciones', [PagoSuscripcionController::class, 'store'])
        ->name('pagos-suscripciones.store');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('planes', PlanController::class);

    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');

    Route::get('/users/roles', [UserRoleController::class, 'index'])
        ->name('users.roles.index');
    Route::put('/users/roles', [UserRoleController::class, 'update'])
        ->name('users.roles.update');

    Route::resource('users', UserController::class);

    Route::patch(
        'pagos-suscripciones/{pagoSuscripcion}/aprobar',
        [PagoSuscripcionController::class, 'aprobar']
    )->name('pagos-suscripciones.aprobar');

    Route::patch(
        'pagos-suscripciones/{pagoSuscripcion}/rechazar',
        [PagoSuscripcionController::class, 'rechazar']
    )->name('pagos-suscripciones.rechazar');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
