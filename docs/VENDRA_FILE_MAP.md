# Mapa de archivos relevantes

## Contexto y navegación

- `app/Services/VendraContextService.php`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `app/Http/Middleware/EnsureActiveBusiness.php`
- `app/Http/Controllers/DashboardController.php`
- `resources/js/components/app-sidebar.tsx`
- `resources/js/components/business-switcher.tsx`
- `resources/js/components/nav-main.tsx`
- `resources/js/components/app-sidebar-header.tsx`
- `resources/js/lib/sidebar-navigation.ts`
- `resources/js/types/index.d.ts`
- `tests/Feature/SidebarContextTest.php`

## Negocios y equipo

- `app/Models/Negocio.php`
- `app/Models/NegocioUser.php`
- `app/Models/User.php`
- `app/Http/Controllers/NegocioController.php`
- `app/Http/Controllers/NegocioUserController.php`
- `resources/js/pages/Negocios/Index.tsx`
- `resources/js/pages/Negocios/Create.tsx`
- `resources/js/pages/Negocios/Usuarios/Index.tsx`
- `resources/js/pages/Dashboards/SelectorNegocio.tsx`

## Roles y permisos

- `database/migrations/*create_permission_tables.php`
- `database/seeders/RolesAndPermissionsSeeder.php`
- `app/Http/Controllers/RoleController.php`
- `app/Http/Controllers/UserRoleController.php`
- `config/permission.php`

## Planes y suscripciones

- `app/Models/Plan.php`
- `app/Models/PagoSuscripcion.php`
- `app/Http/Controllers/PlanController.php`
- `app/Http/Controllers/PagoSuscripcionController.php`
- `database/seeders/PlanSeeder.php`

## Operación comercial

- `app/Models/Categoria.php`
- `app/Models/Producto.php`
- `app/Models/Cliente.php`
- `app/Models/Venta.php`
- `app/Http/Controllers/CategoriaController.php`
- `app/Http/Controllers/ProductoController.php`
- `app/Http/Controllers/ClienteController.php`
- `app/Http/Controllers/VentaController.php`
- `app/Http/Controllers/ReporteController.php`

## Soporte

- `app/Models/TicketSoporte.php`
- `app/Http/Controllers/TicketController.php`
- `resources/js/pages/Tickets/`

## Configuración de entrada

- `bootstrap/app.php`
- `routes/web.php`
- `routes/auth.php`
- `routes/settings.php`
- `resources/js/app.tsx`
- `resources/views/app.blade.php`
- `vite.config.ts`
- `composer.json`
- `package.json`
