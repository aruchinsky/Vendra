# Pruebas y validación

## Suite estable de referencia

La versión actual alcanzó:

```text
33 tests passed
114 assertions
```

## Comandos

### Pruebas PHP

```bash
php artisan test
```

### Caso específico

```bash
php artisan test --filter=SidebarContextTest
```

### TypeScript

```bash
npm run types
```

### Build

```bash
npm run build
```

### Formato y lint

```bash
npm run format:check
npm run lint
```

Nota: `npm run lint` tiene `--fix`; revisar el diff después de ejecutarlo.

## Casos cubiertos por SidebarContextTest

- Usuario con un solo negocio recibe contexto automático.
- Administrador selecciona cualquier negocio y vuelve al entorno global.
- Usuario no selecciona negocio ajeno.
- Soporte consulta usuarios pero no edita.
- Módulos operativos exigen negocio activo.

## Matriz manual mínima

### Admin

- entorno global;
- selección de cualquier negocio;
- cambio de negocio;
- regreso a global;
- herramientas globales y comerciales.

### Usuario Free

- negocio automático;
- límites y menú Free;
- equipo/suscripción si administra.

### Usuario Premium

- funciones Premium;
- reportes avanzados;
- equipo y suscripción.

### Soporte

- tickets;
- usuarios en consulta;
- ausencia de edición y módulos comerciales.

### Usuario sin negocio

- dashboard sin tenant;
- creación del primer negocio;
- contexto automático después de crear.

### Responsive

- desktop expandido/colapsado;
- móvil;
- popovers y dialogs;
- tema claro/oscuro;
- consola sin errores.
