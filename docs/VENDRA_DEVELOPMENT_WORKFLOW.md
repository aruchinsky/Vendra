# Flujo de desarrollo seguro

## Principio

- `main` es la rama estable. No desarrollar directamente sobre ella.
- `codex-ui` es la rama de integración para los trabajos de interfaz realizados con Codex.
- Cada corrección o funcionalidad se desarrolla en una rama temporal independiente.

## Inicio de una tarea

Para trabajos de interfaz con Codex, partir de `codex-ui` actualizada:

```bash
git status -sb
git branch --show-current
git switch codex-ui
git pull --ff-only origin codex-ui
git switch -c fix/descripcion-corta
```

Usar prefijos adecuados al alcance, por ejemplo:

- `fix/`
- `feat/`
- `codex/`
- `refactor/`
- `docs/`
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

## Integración

Después de revisar el diff:

```bash
git add <archivos-aprobados>
git diff --cached --check
git diff --cached
git commit -m "fix: descripción del cambio"
git push -u origin fix/descripcion-corta
```

Abrir PR o integrar en `codex-ui` sólo después de pruebas y revisión. Una vez integrado el cambio, validar `codex-ui` y subirla al remoto antes de considerar terminada la tarea.

## Limpieza de ramas temporales

Una rama temporal sólo puede eliminarse cuando se cumplan todas estas condiciones:

1. sus cambios fueron revisados;
2. build y pruebas finalizaron correctamente;
3. el commit fue subido al remoto;
4. el cambio fue integrado en `codex-ui`;
5. `codex-ui` fue validada y subida al remoto.

Después de comprobar esas condiciones y recibir autorización explícita:

```bash
git branch -d fix/descripcion-corta
git push origin --delete fix/descripcion-corta
git fetch origin --prune
```

- Usar `git branch -d`, nunca `git branch -D`, salvo autorización explícita para descartar trabajo no integrado.
- No eliminar `main`, `codex-ui` ni una rama que todavía contenga trabajo no integrado.
- Codex no elimina ramas por iniciativa propia. Debe informar que la rama ya puede limpiarse y esperar autorización explícita.

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
