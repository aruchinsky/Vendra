# Observaciones y tareas pendientes

## UX-001 — Sidebar móvil en Equipo

**Ruta observada:** `/negocios/{negocio}/usuarios?search=`
**Síntoma:** el botón del sidebar móvil no expande el panel en esta página; funciona en las demás.

### Investigación requerida

- Revisar la versión local actual de:
  - `resources/js/pages/Negocios/Usuarios/Index.tsx`
  - layouts y `AppShell`;
  - `AppSidebarHeader` y `SidebarTrigger`;
  - `resources/js/components/ui/sidebar.tsx`.
- Buscar overlays, stacking contexts, `pointer-events`, `z-index`, dialogs o contenedores fixed/absolute que intercepten el trigger.
- Reproducir en viewport móvil y revisar consola.

No aplicar un cambio global al sidebar sin demostrar primero por qué falla solo esta página.

## UX-002 — Selector no se cierra

**Síntoma:** el negocio cambia y todo el contexto se actualiza, pero el popover del selector continúa visible.

### Comportamiento esperado

- cerrar al seleccionar exitosamente;
- mantener indicador de carga durante la solicitud;
- no cerrar prematuramente si la solicitud falla;
- conservar accesibilidad y foco.

Revisar `business-switcher.tsx` y los callbacks `onSuccess`, `onError`, `onFinish` de Inertia.

## UX-003 — Dos vistas de negocios

- `/dashboard/negocios`: tarjetas para seleccionar workspace.
- `/negocios`: tabla administrativa funcional.

### Recomendación pendiente de aprobación

Conservar ambas:

- `Cambiar negocio` para el selector.
- `Mis negocios` / `Administrar negocios` para la tabla.

Agregar una entrada clara al sidebar para la vista administrativa según rol y revisar el breadcrumb de Equipo para que no lleve al usuario a una pantalla inesperada.

## SEC-001 — Dependencias npm

`npm install` informó vulnerabilidades y scripts pendientes de aprobación. No bloquearon el build.

Crear una rama independiente de auditoría. No ejecutar `npm audit fix` sin revisar actualizaciones y pruebas.

## CFG-001 — Localización

Confirmar antes de producción:

- timezone `America/Argentina/Buenos_Aires`;
- locale español;
- faker locale apropiado;
- formato monetario ARS.

## LEG-001 — Prototipo de tickets

`Customer`, `Support` y `Ticket` permanecen como legado. Confirmar referencias con búsqueda y tests antes de retirarlos.
