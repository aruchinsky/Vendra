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
    /* =========================================================
       Dashboard y contexto comercial
    ========================================================= */
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('dashboard/negocios', [DashboardController::class, 'negocios'])
        ->middleware('role:admin|usuario')
        ->name('dashboard.negocios');

    Route::post(
        'dashboard/negocios/{negocio}/seleccionar',
        [DashboardController::class, 'seleccionarNegocio']
    )
        ->middleware('role:admin|usuario')
        ->name('dashboard.negocio.seleccionar');

    Route::delete(
        'dashboard/negocio/seleccion',
        [DashboardController::class, 'limpiarNegocio']
    )
        ->middleware('role:admin')
        ->name('dashboard.negocio.limpiar');

    /* =========================================================
       Negocios y membresías
    ========================================================= */
    Route::resource('negocios', NegocioController::class)
        ->middleware('role:admin|usuario');

    Route::prefix('negocios/{negocio}')
        ->name('negocios.')
        ->middleware('role:admin|usuario')
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

    /* =========================================================
       Operación del negocio activo
    ========================================================= */
    Route::middleware(['role:admin|usuario', 'negocio.activo'])->group(function () {
        Route::get('productos', [ProductoController::class, 'index'])
            ->middleware('permission:ver productos')
            ->name('productos.index');
        Route::get('productos/create', [ProductoController::class, 'create'])
            ->middleware('permission:crear productos')
            ->name('productos.create');

        Route::get('categorias', [CategoriaController::class, 'index'])
            ->middleware('permission:ver categorias|ver productos')
            ->name('categorias.index');
        Route::post('categorias', [CategoriaController::class, 'store'])
            ->middleware('permission:crear categorias|crear productos')
            ->name('categorias.store');
        Route::put('categorias/{categoria}', [CategoriaController::class, 'update'])
            ->middleware('permission:editar categorias|editar productos')
            ->name('categorias.update');
        Route::delete('categorias/{categoria}', [CategoriaController::class, 'destroy'])
            ->middleware('permission:eliminar categorias|eliminar productos')
            ->name('categorias.destroy');

        Route::get('clientes', [ClienteController::class, 'index'])
            ->middleware('permission:ver clientes')
            ->name('clientes.index');

        Route::get('ventas', [VentaController::class, 'index'])
            ->middleware('permission:ver ventas')
            ->name('ventas.index');
        Route::get('ventas/create', [VentaController::class, 'create'])
            ->middleware('permission:crear ventas')
            ->name('ventas.create');

        Route::get('reportes', [ReporteController::class, 'index'])
            ->middleware('permission:ver_basico reportes')
            ->name('reportes.index');
    });

    /* =========================================================
       Soporte
    ========================================================= */
    Route::get('tickets', [TicketController::class, 'index'])
        ->middleware('permission:ver tickets')
        ->name('tickets.index');
    Route::get('tickets/create', [TicketController::class, 'create'])
        ->middleware('permission:crear tickets')
        ->name('tickets.create');
    Route::post('tickets', [TicketController::class, 'store'])
        ->middleware('permission:crear tickets')
        ->name('tickets.store');

    /* =========================================================
       Suscripciones del negocio
    ========================================================= */
    Route::middleware('role:admin|usuario')->group(function () {
        Route::get('pagos-suscripciones', [PagoSuscripcionController::class, 'index'])
            ->name('pagos-suscripciones.index');
        Route::get('pagos-suscripciones/create', [PagoSuscripcionController::class, 'create'])
            ->name('pagos-suscripciones.create');
        Route::post('pagos-suscripciones', [PagoSuscripcionController::class, 'store'])
            ->name('pagos-suscripciones.store');
    });

    /* =========================================================
       Consulta de usuarios para administración y soporte
    ========================================================= */
    Route::get('/users', [UserController::class, 'index'])
        ->middleware(['role:admin|soporte', 'permission:ver usuarios'])
        ->name('users.index');
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

    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

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
