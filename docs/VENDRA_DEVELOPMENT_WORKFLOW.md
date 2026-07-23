# Flujo de desarrollo seguro

## Principio

- `main` es la rama estable. No desarrollar directamente sobre ella.
- `codex/diagnostico-ux` es la rama permanente de integración para todos los trabajos realizados con Codex.
- Solamente `main` y `codex/diagnostico-ux` deben permanecer como ramas permanentes, tanto localmente como en GitHub.
- Cada corrección, funcionalidad o tarea documental se desarrolla en una rama temporal independiente creada desde `codex/diagnostico-ux`.
- `main` y `codex/diagnostico-ux` nunca se eliminan.

## Inicio de una tarea

Antes de crear una rama temporal:

```bash
git status -sb
git branch --show-current
git switch codex/diagnostico-ux
git pull --ff-only origin codex/diagnostico-ux
git fetch origin
git merge-base --is-ancestor origin/main codex/diagnostico-ux
git switch -c fix/descripcion-corta
```

El working tree debe estar limpio. `git merge-base --is-ancestor` debe finalizar correctamente para confirmar que `codex/diagnostico-ux` no está detrás de `main`.

Si una nueva tarea de desarrollo comienza con `codex/diagnostico-ux` activa y estas comprobaciones finalizan correctamente, Codex crea automáticamente la rama temporal apropiada sin solicitar autorización adicional únicamente para crearla. Debe informar el nombre elegido antes de implementar.

Codex nunca implementa una tarea directamente sobre `main` ni directamente sobre `codex/diagnostico-ux`. Commit, push, integración, eliminación de ramas y operaciones destructivas siguen requiriendo autorización explícita.

Convenciones permitidas para ramas temporales:

- `fix/`
- `feat/`
- `docs/`
- `chore/`
- `refactor/`
- `test/`

## Antes de editar

1. Reproducir el problema.
2. Leer rutas, backend, frontend y tests relacionados.
3. Identificar causa raíz.
4. Presentar plan y alcance.
5. Registrar cualquier decisión funcional faltante.

## Durante la implementación

- Cambios pequeños y enfocados.
- No mezclar limpieza general con una corrección.
- No instalar dependencias sin aprobación.
- Añadir pruebas de regresión.
- Mantener comentarios útiles y documentación actualizada.

## Validación

```bash
php artisan optimize:clear
npm run types
npm run build
php artisan test
git diff --check
git status -sb
git diff --stat
git diff
```

También probar manualmente perfiles afectados.

`npm run types` debe ejecutarse e informarse siempre. Mientras exista la deuda TypeScript documentada, su fallo puede considerarse temporalmente no bloqueante únicamente cuando:

1. todos los errores sean preexistentes;
2. no aparezcan errores nuevos;
3. no existan errores en los archivos modificados por la tarea.

Un chequeo de tipos fallido debe informarse como fallido; no puede ocultarse ni presentarse como exitoso. `npm run build`, las pruebas aplicables, `git diff --check` y un working tree controlado siguen siendo validaciones bloqueantes. Cuando se corrija la deuda TypeScript, `npm run types` volverá a ser una validación bloqueante.

## Integración

Después de revisar el diff y completar las validaciones:

```bash
git add <archivos-aprobados>
git diff --cached --check
git diff --cached
git commit -m "fix: descripción del cambio"
git push -u origin fix/descripcion-corta
git switch codex/diagnostico-ux
git pull --ff-only origin codex/diagnostico-ux
git merge --ff-only fix/descripcion-corta
```

Después de integrar, ejecutar nuevamente las validaciones correspondientes desde `codex/diagnostico-ux`, subirla al remoto y confirmar que contiene los commits de la rama temporal:

```bash
git push origin codex/diagnostico-ux
git merge-base --is-ancestor fix/descripcion-corta codex/diagnostico-ux
```

## Limpieza de ramas temporales

Una rama temporal sólo puede eliminarse cuando se cumplan todas estas condiciones:

1. sus cambios fueron revisados;
2. build y pruebas finalizaron correctamente;
3. sus commits fueron subidos al remoto;
4. sus commits fueron integrados en `codex/diagnostico-ux`;
5. `codex/diagnostico-ux` fue validada y subida al remoto.

Después de comprobar esas condiciones y recibir autorización explícita:

```bash
git branch -d fix/descripcion-corta
git push origin --delete fix/descripcion-corta
git fetch origin --prune
```

- Usar `git branch -d`, nunca `git branch -D`, salvo autorización explícita para descartar trabajo no integrado.
- No eliminar `main`, `codex/diagnostico-ux` ni una rama que todavía contenga trabajo no integrado.
- Codex no elimina ramas por iniciativa propia. Debe informar que la rama ya puede limpiarse y esperar autorización explícita.

## Integración final en `main`

Cuando una tarea o conjunto coherente de tareas esté completamente terminado:

1. Confirmar que `codex/diagnostico-ux` esté limpia, validada y subida.
2. Actualizar `main` desde `origin/main` mediante fast-forward.
3. Verificar la relación entre ambas ramas.
4. Integrar `codex/diagnostico-ux` en `main`, preferentemente mediante fast-forward.
5. Ejecutar nuevamente build, pruebas y controles desde `main`.
6. Subir `main` únicamente si todas las validaciones pasan.
7. Crear un tag sólo si representa un punto estable o una versión importante.
8. Volver a `codex/diagnostico-ux` y confirmar que ambas ramas quedaron alineadas.

```bash
git switch main
git pull --ff-only origin main
git merge --ff-only codex/diagnostico-ux
php artisan optimize:clear
npm run types
npm run build
php artisan test
git diff --check
git status -sb
git push origin main
git switch codex/diagnostico-ux
git merge-base --is-ancestor main codex/diagnostico-ux
git merge-base --is-ancestor codex/diagnostico-ux main
```

## Auditoría de ramas residuales

El objetivo final es conservar únicamente `main` y `codex/diagnostico-ux`.

Antes de eliminar cualquier otra rama:

1. listar ramas locales y remotas;
2. identificar su último commit;
3. verificar que todos sus commits estén contenidos en `main`;
4. confirmar que no posea trabajo exclusivo sin integrar;
5. confirmar que no sea `main` ni `codex/diagnostico-ux`;
6. conservar todos los tags existentes.

`origin/HEAD` es una referencia simbólica y no debe considerarse una rama residual.

## Comandos prohibidos sin aprobación

```text
git reset --hard
git clean -fd
git push --force
git rebase
git branch -D
composer update
npm audit fix
php artisan migrate:fresh
php artisan db:wipe
```

## Punto estable

No crear tags para cada fix. Reservarlos para puntos estables o versiones relevantes.

Cuando una versión estable llega a `main`, se puede crear opcionalmente un tag anotado:

```bash
git tag -a vendra-context-sidebar-stable -m "Contexto y sidebar dinámico estables"
git push origin vendra-context-sidebar-stable
```
