# Vendra — instrucciones obligatorias para agentes

## Objetivo

Vendra es un SaaS multi-cliente de gestión de ventas del ecosistema AIR Sistemas. Este repositorio es un producto comercial en desarrollo activo, no un proyecto de demostración.

Antes de modificar código, leer:

1. `docs/VENDRA_CURRENT_STATE.md`
2. `docs/VENDRA_ARCHITECTURE.md`
3. `docs/VENDRA_AUTHORIZATION_AND_TENANCY.md`
4. `docs/VENDRA_DECISIONS.md`
5. `docs/VENDRA_KNOWN_ISSUES.md`

Para tareas de backend también leer `app/AGENTS.md`. Para tareas de React/Inertia también leer `resources/js/AGENTS.md`.

## Fuente de verdad

- Laravel 13, PHP `^8.3`, Inertia 2, React 19, TypeScript, Tailwind 4, shadcn/ui, Spatie Permission 6.
- Roles globales vigentes: `admin`, `usuario`, `soporte`.
- `free` y `premium` son planes del negocio, nunca roles.
- El plan pertenece a `negocios.plan_id`.
- La membresía usuario-negocio está en `negocio_user`.
- El negocio activo se guarda en sesión con `negocio_activo_id`.
- `App\Services\VendraContextService` es la fuente central para roles, permisos, negocios disponibles, negocio activo, plan y administración interna.
- `DashboardController` es la referencia funcional validada para los casos de login y dashboard.
- La autorización real debe ejecutarse en Laravel. Ocultar un enlace en React no constituye seguridad.

## Reglas de trabajo

- Inspeccionar siempre los archivos actuales antes de diagnosticar o modificar.
- No asumir rutas, tablas, componentes, nombres de permisos ni funcionalidades inexistentes.
- Presentar primero causa, archivos afectados y plan. No editar hasta que el usuario apruebe, salvo que pida implementación directa.
- Limitar cada cambio al alcance solicitado.
- Mantener aislamiento estricto por `negocio_id`.
- Validar que entidades relacionadas pertenezcan al mismo negocio.
- Conservar el comportamiento multi-negocio y el contexto global del administrador.
- No convertir planes Free/Premium en roles.
- No introducir dependencias nuevas sin aprobación explícita.
- No modificar `.env`, secretos, credenciales ni datos reales.
- No ejecutar comandos destructivos o irreversibles sin aprobación explícita.
- No hacer commit, merge, rebase, push, tag ni abrir PR sin solicitud explícita.
- No trabajar directamente sobre `main` para nuevas correcciones o funcionalidades. Usar una rama `fix/*`, `feature/*` o `refactor/*`.
- No usar `git reset --hard`, `git clean`, `migrate:fresh`, `db:wipe`, `composer update` ni `npm audit fix` sin autorización explícita.
- No eliminar archivos legado solo porque parezcan obsoletos; primero demostrar que no tienen referencias activas.
- Mantener documentación y tests sincronizados con cualquier cambio de comportamiento.

## Validación mínima antes de declarar una tarea terminada

Ejecutar, según el alcance:

```bash
php artisan optimize:clear
npm run types
npm run build
php artisan test
git diff --check
git status -sb
```

Si alguna validación no puede ejecutarse, explicar exactamente cuál y por qué. No afirmar que una tarea está validada si no se ejecutaron los controles correspondientes.

## Estado estable conocido

La versión consolidada del sidebar/contexto pasó:

- `npm run build`
- `php artisan test`: 33 pruebas, 114 assertions

Existen tres observaciones de UX pendientes documentadas en `docs/VENDRA_KNOWN_ISSUES.md`. No deben confundirse con fallos de la arquitectura multi-tenant.

## Code Review Rules

- Marcar cualquier consulta operativa sin filtro o autorización de negocio.
- Marcar cualquier asociación cruzada posible entre negocios.
- Marcar cualquier ruta protegida solo desde el frontend.
- Marcar el uso de roles `comerciante_free` o `comerciante_premium`.
- Marcar lógica duplicada que vuelva a resolver el negocio activo fuera de `VendraContextService` sin justificación.
- Marcar comandos o migraciones destructivas no solicitadas.
- Marcar páginas Inertia cargadas como entradas individuales en Blade; las páginas se resuelven desde `resources/js/app.tsx` con `import.meta.glob`.
