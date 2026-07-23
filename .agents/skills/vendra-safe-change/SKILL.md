---
name: vendra-safe-change
description: Implementar o revisar cambios en Vendra con diagnóstico previo, aislamiento multi-tenant, rama Git, pruebas y diff. Usar para fixes, features, refactors y code review del repositorio Vendra; no usar para tareas ajenas al proyecto.
---

# Cambio seguro en Vendra

1. Leer `AGENTS.md` y los documentos que referencia.
2. Confirmar rama y estado con `git status -sb` y `git branch --show-current`.
3. No desarrollar sobre `main` ni directamente sobre `codex/diagnostico-ux`.
4. Crear cada rama temporal desde `codex/diagnostico-ux` limpia, actualizada desde su upstream mediante fast-forward y no retrasada respecto de `main`.
5. Cuando una nueva tarea de desarrollo comience en `codex/diagnostico-ux` y las comprobaciones anteriores pasen, crear automáticamente una rama temporal con el prefijo apropiado e informar su nombre; no pedir autorización adicional únicamente para crearla.
6. Inspeccionar rutas, backend, frontend, tipos y tests relacionados.
7. Reproducir o demostrar el problema antes de editar.
8. Presentar causa, alcance y plan.
9. Implementar el cambio mínimo aprobado.
10. Mantener aislamiento por negocio, permisos y plan.
11. Añadir pruebas de regresión.
12. Ejecutar:

```bash
php artisan optimize:clear
npm run types
npm run build
php artisan test
git diff --check
git status -sb
git diff
```

13. Ejecutar e informar siempre `npm run types`. Mientras exista la deuda TypeScript documentada, tratar su fallo como no bloqueante sólo si los errores son preexistentes, no aparecen errores nuevos y no afectan archivos modificados. Nunca presentar como exitoso un chequeo fallido. Build, pruebas aplicables, `git diff --check` y working tree controlado siguen siendo bloqueantes; al corregirse la deuda, types vuelve a ser bloqueante.
14. Resumir archivos modificados, comportamiento, validaciones y riesgos restantes.
15. Integrar ramas temporales en `codex/diagnostico-ux` y ésta en `main` únicamente con autorización explícita y después de validar.
16. No eliminar una rama temporal hasta demostrar que sus commits están subidos e integrados en `codex/diagnostico-ux`, que la integración está validada y subida, y que el usuario autorizó la limpieza.
17. Eliminar ramas temporales con `git branch -d`, nunca con `git branch -D` salvo autorización explícita para descartar trabajo.
18. No eliminar nunca `main` ni `codex/diagnostico-ux`; commit, push, merge, integración, limpieza y operaciones destructivas requieren autorización explícita.
