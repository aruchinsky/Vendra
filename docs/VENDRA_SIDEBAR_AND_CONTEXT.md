# Sidebar dinámico y contexto de negocio

## Objetivo de la reingeniería

Eliminar el menú fijo basado en roles antiguos y representar correctamente:

- roles globales;
- permisos efectivos;
- negocio activo;
- plan del negocio;
- administrador interno;
- cero, uno o varios negocios.

## Componentes centrales

- `app/Services/VendraContextService.php`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `app/Http/Middleware/EnsureActiveBusiness.php`
- `resources/js/components/app-sidebar.tsx`
- `resources/js/components/business-switcher.tsx`
- `resources/js/components/nav-main.tsx`
- `resources/js/lib/sidebar-navigation.ts`
- `resources/js/types/index.d.ts`
- `tests/Feature/SidebarContextTest.php`

## Menú esperado

### Administrador sin negocio seleccionado

- Panel general.
- Negocios.
- Usuarios.
- Roles.
- Asignación de roles.
- Planes.
- Suscripciones.

### Administrador con negocio seleccionado

Además del menú global:

- Productos.
- Categorías.
- Clientes.
- Ventas.
- Reportes.
- Equipo.
- Opción para volver al entorno global.

### Soporte

- Panel de soporte.
- Tickets.
- Usuarios en modo consulta.

### Usuario sin negocio

- Panel principal.
- Crear primer negocio.
- Ayuda según permisos.

### Usuario con negocio activo

- Panel principal.
- Productos.
- Categorías.
- Clientes.
- Ventas.
- Reportes.
- Equipo y plan/suscripción si administra el negocio.
- Centro de ayuda.

Reportes avanzados requieren simultáneamente permiso y `plan.reportes_avanzados`.

## Selector de negocio

- Usa shadcn `Popover` + `Command`.
- Permite buscar negocios.
- Muestra nombre, plan, logo y administración.
- Debe cerrar el popover al finalizar una selección exitosa.
- Debe funcionar con sidebar expandido, colapsado y móvil.
- El administrador puede elegir entorno global.

## Dos vistas de negocios

### `/dashboard/negocios`

Selector visual de workspace por tarjetas. Propósito: entrar rápidamente a un negocio.

### `/negocios`

Vista administrativa tabular. Propósito: buscar, crear, revisar plan/estado/usuarios y administrar negocios.

La recomendación arquitectónica es conservar ambas y diferenciarlas claramente:

- `Cambiar negocio` → selector por tarjetas.
- `Mis negocios` o `Administrar negocios` → tabla administrativa.

La nomenclatura definitiva y el breadcrumb están pendientes de aprobación tras revisar la última versión de los componentes.
