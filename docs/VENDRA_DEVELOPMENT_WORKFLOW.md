# Flujo de desarrollo seguro

## Principio

`main` es estable. No desarrollar directamente sobre `main`.

## Inicio de una tarea

```bash
git status -sb
git branch --show-current
git pull --ff-only origin main
git switch -c fix/descripcion-corta
```

Usar prefijos:

- `fix/`
- `feature/`
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

Abrir PR o fusionar solo después de pruebas y revisión.

## Comandos prohibidos sin aprobación

```text
git reset --hard
git clean -fd
git push --force
git rebase
composer update
npm audit fix
php artisan migrate:fresh
php artisan db:wipe
```

## Punto estable

Cuando una versión estable llega a `main`, crear opcionalmente un tag anotado:

```bash
git tag -a vendra-context-sidebar-stable -m "Contexto y sidebar dinámico estables"
git push origin vendra-context-sidebar-stable
```
