# Registro de decisiones de arquitectura

## D-001 — Plan por negocio

El plan pertenece al negocio, no al usuario. Motivo: un usuario puede participar en varios negocios con planes diferentes.

## D-002 — Free/Premium no son roles

Los únicos roles globales vigentes son `admin`, `usuario` y `soporte`. Free/Premium son capacidades y límites del tenant.

## D-003 — Relación multiusuario

Se utiliza `negocio_user` para permitir múltiples usuarios por negocio y múltiples negocios por usuario.

## D-004 — Administración interna mínima

La membresía usa `es_administrador` en lugar de replicar roles Spatie por tenant en esta etapa. Protege equipo, configuración y suscripción.

## D-005 — Una sola base de datos

Vendra utiliza multi-tenancy lógico por `negocio_id`. No se implementa una base por cliente en la versión actual.

## D-006 — Contexto centralizado

`VendraContextService` es la fuente única del contexto autenticado. Dashboard, middleware e Inertia deben consumirlo.

## D-007 — Administrador con dos entornos

El administrador global inicia en entorno global y puede seleccionar un negocio para operar sus módulos. Puede volver al entorno global sin cerrar sesión.

## D-008 — Seguridad backend

El sidebar nunca constituye autorización. Las rutas/controladores deben validar rol, permiso, negocio y plan.

## D-009 — Selector y administración de negocios son conceptos distintos

Se conservarán conceptualmente dos experiencias:

- selector rápido del workspace;
- administración formal de negocios.

La exposición final en sidebar y breadcrumbs está pendiente de ajuste de UX.

## D-010 — Soporte consulta usuarios

Soporte puede abrir el listado de usuarios, pero no crear, editar, eliminar ni asignar roles.

## D-011 — Inertia resuelve páginas desde `app.tsx`

Blade carga únicamente `resources/js/app.tsx`. Las páginas no se agregan dinámicamente como entradas Vite.

## D-012 — Módulos incompletos usan transición segura

No inventar CRUD. Mientras se definen Productos, Clientes, Ventas y Reportes, las rutas pueden mostrar páginas de transición sin romper navegación.

## D-013 — Cambios controlados con Git

`main` representa la línea estable y no se usa para desarrollo directo. `codex-ui` es la rama de integración para los trabajos de interfaz realizados con Codex. Todo cambio se desarrolla en una rama temporal independiente y sólo puede limpiarse, con autorización explícita, después de revisión, validación, publicación remota e integración validada en `codex-ui`. Se usa borrado seguro con `git branch -d`; los tags se reservan para puntos estables o versiones relevantes.
