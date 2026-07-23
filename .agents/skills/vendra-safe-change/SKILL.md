---
name: vendra-safe-change
description: Implementar o revisar cambios en Vendra con diagnóstico previo, aislamiento multi-tenant, rama Git, pruebas y diff. Usar para fixes, features, refactors y code review del repositorio Vendra; no usar para tareas ajenas al proyecto.
---

# Cambio seguro en Vendra

1. Leer `AGENTS.md` y los documentos que referencia.
2. Confirmar rama y estado con `git status -sb` y `git branch --show-current`.
3. No modificar `main`; proponer una rama de tarea.
4. Inspeccionar rutas, backend, frontend, tipos y tests relacionados.
5. Reproducir o demostrar el problema antes de editar.
6. Presentar causa, alcance y plan.
7. Implementar el cambio mínimo aprobado.
8. Mantener aislamiento por negocio, permisos y plan.
9. Añadir pruebas de regresión.
10. Ejecutar:

```bash
php artisan optimize:clear
npm run types
npm run build
php artisan test
git diff --check
git status -sb
git diff
```

11. Resumir archivos modificados, comportamiento, validaciones y riesgos restantes.
12. No hacer commit, push, merge o comandos destructivos sin solicitud explícita.
