# Incorporación segura de Vendra a Codex

## Preparación del repositorio

1. Confirmar que la versión estable está en `main`.
2. Confirmar build y pruebas en verde.
3. Guardar un tag estable.
4. Copiar este paquete de contexto al repositorio y crear un commit separado de documentación.
5. Abrir la carpeta raíz del repositorio en Codex.

Codex puede trabajar con carpetas locales, repositorios, terminales y herramientas del desarrollador. Su historial es separado del historial normal de ChatGPT; por eso las reglas importantes deben permanecer versionadas en `AGENTS.md` y `docs/`.

## Primera apertura

En la app de escritorio:

1. Seleccionar **Codex**.
2. Abrir la carpeta local `C:\xampp\htdocs\Vendra`.
3. Conceder acceso solo a esa carpeta.
4. No habilitar permisos amplios o navegador/CDP hasta necesitarlos.
5. Pedir inicialmente una tarea de solo lectura:

```text
Leé AGENTS.md y todos los documentos que este referencia. No modifiques archivos.
Resumí la arquitectura, las reglas de seguridad, el estado actual y los issues pendientes.
Indicá qué archivos de instrucciones cargaste.
```

Verificar que la respuesta respete roles, planes, multi-tenancy y comandos prohibidos.

## Uso recomendado

- Una tarea por conversación/rama.
- Correcciones pequeñas en rama local.
- Refactors grandes mediante worktree aislado.
- Revisar siempre el diff.
- No permitir commits o pushes automáticos al comenzar.
- Mantener aprobación manual para comandos sensibles.

## Primera tarea sugerida

Usar `docs/CODEX_FIRST_TASK.md` para los tres problemas actuales del sidebar.
