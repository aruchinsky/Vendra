# Primera tarea controlada para Codex

## Objetivo

Diagnosticar tres observaciones de UX del sidebar sin modificar código inicialmente.

## Prompt inicial

```text
Trabajá en modo diagnóstico, sin modificar archivos.

Leé AGENTS.md y la documentación referenciada. Inspeccioná la versión actual del repositorio y reproducí o trazá estos tres problemas:

1. En /negocios/{id}/usuarios el SidebarTrigger móvil no abre el sidebar, aunque funciona en otras páginas.
2. El selector cambia correctamente el negocio activo, pero el popover no se cierra.
3. Conviven /dashboard/negocios (selector por tarjetas) y /negocios (tabla administrativa). Analizá su navegación, breadcrumbs y exposición en el sidebar.

Para cada punto entregá:
- causa raíz demostrada;
- archivos y líneas involucradas;
- riesgo del cambio;
- propuesta mínima;
- pruebas automáticas y manuales necesarias.

No edites, no instales dependencias, no hagas commits ni ejecutes comandos destructivos.
```

## Después del diagnóstico

Revisar el plan. Si es correcto, crear una rama:

```bash
git switch -c fix/sidebar-ux-followup
```

Luego pedir la implementación de un issue por vez, comenzando por el cierre del selector, que es el cambio de menor superficie.
