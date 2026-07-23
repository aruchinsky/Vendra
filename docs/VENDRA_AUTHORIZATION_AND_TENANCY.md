# Autorización, planes y aislamiento multi-cliente

## Dimensiones de acceso

Vendra combina cuatro dimensiones distintas:

1. **Rol global Spatie**: `admin`, `usuario`, `soporte`.
2. **Permisos Spatie**: acciones por módulo.
3. **Membresía del negocio**: activa/inactiva y administrador interno.
4. **Plan del negocio**: límites y funciones Free/Premium.

Estas dimensiones no deben mezclarse.

## Roles globales

### `admin`

- Control global del SaaS.
- Usuarios, roles, planes, pagos y negocios.
- Puede seleccionar cualquier negocio activo y operar su contexto comercial.
- Puede limpiar la selección para volver al entorno global.

### `usuario`

- Usuario final de uno o más negocios.
- Solo accede a negocios con membresía activa.
- Sus acciones dependen de permisos, membresía, negocio activo y plan.

### `soporte`

- Panel de soporte, tickets y consulta de usuarios.
- No tiene acceso de edición a usuarios.
- No opera módulos comerciales en la versión actual.

## Planes

Free y Premium son filas de `planes` y pertenecen al negocio mediante `negocios.plan_id`.

### Free

- límite de productos: 50;
- límite de ventas mensuales: 100;
- límite de usuarios: 1;
- sin página pública;
- sin reportes avanzados;
- sin múltiples puntos de venta.

### Premium

- productos sin límite;
- ventas mensuales sin límite;
- límite de usuarios: 5;
- página pública habilitada;
- reportes avanzados;
- múltiples puntos de venta.

Los valores anteriores reflejan el seeder vigente. Un administrador puede editar planes, por lo que la lógica debe consultar la base de datos y no codificarlos en React.

## Membresía `negocio_user`

Campos relevantes:

- `negocio_id`
- `user_id`
- `es_administrador`
- `activo`

Reglas:

- combinación negocio/usuario única;
- usuario y negocio deben estar activos;
- el negocio debe conservar al menos un administrador activo;
- el número de miembros activos no puede superar el límite del plan;
- un usuario no puede desactivar o quitar su propia membresía desde la pantalla de equipo.

## Negocio activo

- Clave de sesión: `negocio_activo_id`.
- Usuario con un solo negocio: selección automática.
- Usuario con varios negocios: conserva una selección válida o muestra selector.
- Administrador: inicia en entorno global salvo que tenga una selección válida.
- Soporte: no utiliza contexto comercial.

## `VendraContextService`

Responsabilidades:

- memorizar el contexto por request;
- cargar roles y permisos efectivos;
- determinar tipo de usuario;
- cargar negocios autorizados y su plan;
- validar/restaurar negocio activo;
- seleccionar negocio;
- limpiar selección del administrador;
- serializar los datos compartidos con Inertia.

No duplicar esta ingeniería en controladores o componentes.

## Política de aislamiento

Para cualquier operación:

- Nunca aceptar que `negocio_id` del navegador sea suficiente.
- Comparar la entidad con el negocio activo autorizado.
- Validar relaciones cruzadas: categoría, producto, cliente y venta deben pertenecer al mismo negocio.
- Un administrador global debe tener contexto seleccionado para operar datos comerciales; su rol global no elimina la necesidad de identificar el tenant objetivo.
- El frontend nunca reemplaza estas verificaciones.
