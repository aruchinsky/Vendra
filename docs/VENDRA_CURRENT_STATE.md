# Estado actual de Vendra

**Fecha de corte:** 23 de julio de 2026
**Estado:** funcionalmente estable con observaciones de UX pendientes
**Base:** Laravel 13 + Inertia + React 19

## Validación estable alcanzada

La versión consolidada después de la reingeniería del contexto y sidebar completó correctamente:

```text
npm run build
php artisan test
Tests: 33 passed (114 assertions)
```

El build de Vite transformó 3758 módulos sin errores.

## Funcionalidades consolidadas

- Autenticación, verificación de correo, recuperación y cambio de contraseña.
- Registro público de usuarios.
- Roles globales Spatie: administrador, usuario y soporte.
- Planes Free y Premium asociados al negocio.
- Relación multiusuario `negocio_user`.
- Creación de negocios con Plan Gratuito y creador como administrador.
- Usuario con cero, uno o varios negocios.
- Selección de negocio activo mediante sesión.
- Administrador global con entorno global y contexto comercial opcional.
- Selector de negocio en el sidebar.
- Sidebar dinámico por rol, permisos, negocio activo, plan y administración interna.
- Administración de miembros de un negocio respetando el límite del plan.
- Gestión de planes, usuarios, roles y asignación de roles.
- Pagos/suscripciones con aprobación y cambio de plan.
- Dashboard específico para administrador, soporte, usuario Free, usuario Premium, selector y usuario sin negocio.
- Tickets alineados con `TicketSoporte`.
- Categorías aisladas por negocio activo.
- Rutas operativas protegidas por negocio activo y permisos.

## Módulos todavía incompletos

Los siguientes módulos tienen base de rutas/controladores o pantallas de transición, pero todavía no constituyen CRUD completos de producción:

- Productos.
- Clientes.
- Ventas.
- Reportes avanzados y reportes operativos completos.
- Edición completa de la configuración del negocio.
- Integración real con MercadoPago/facturación.
- Puntos de venta múltiples.

No inventar lógica de estos módulos sin una definición funcional y técnica aprobada.

## Observaciones no bloqueantes

Existen tres observaciones de UX detectadas manualmente:

1. En `/negocios/{id}/usuarios`, el botón móvil del sidebar no abre el panel, aunque funciona en otras páginas.
2. Al cambiar de negocio, el contexto cambia correctamente pero el selector permanece abierto.
3. Conviven `/dashboard/negocios` (selector visual por tarjetas) y `/negocios` (administración tabular). Ambas son funcionales, pero falta cerrar su nomenclatura y exposición definitiva en el sidebar.

Ver `VENDRA_KNOWN_ISSUES.md`.

## Alertas técnicas conocidas

- `npm install` informó vulnerabilidades de dependencias y una advertencia sobre scripts de `esbuild`; el build completó correctamente.
- No ejecutar `npm audit fix` automáticamente. Auditar y actualizar en una rama independiente.
- La configuración de locale/timezone debe revisarse antes de producción; históricamente estaba en inglés/UTC.
- El README histórico puede contener referencias a Laravel 12 o PHP 8.2. La fuente técnica actual es `composer.json`: Laravel 13 y PHP `^8.3`.
