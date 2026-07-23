# Modelo de datos vigente

## Entidades de infraestructura

- `cache`, `cache_locks`
- `jobs`, `job_batches`, `failed_jobs`
- `password_reset_tokens`, `sessions`
- tablas de Spatie: `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions`

## Entidades SaaS

### `users`

Datos personales y de acceso. El plan no pertenece al usuario.

Campos principales: nombre, apellido, DNI, teléfono, domicilio, username, email, password, estado.

### `planes`

Define límites y funciones del negocio:

- `limite_productos`
- `limite_ventas_mensuales`
- `limite_usuarios`
- `tiene_pagina_publica`
- `reportes_avanzados`
- `multiples_puntos_venta`
- `activo`

### `negocios`

Tenant comercial de Vendra. Pertenece a un plan.

Campos principales: nombre comercial, CUIT/CUIL, teléfono, dirección, rubro, logo y estado.

### `negocio_user`

Relación muchos-a-muchos usuario/negocio con administración y estado de membresía.

### `pagos_suscripciones`

Historial de solicitudes/pagos por negocio y plan. El usuario iniciador puede quedar nulo si la cuenta se elimina.

Estados: pendiente, aprobado, rechazado.

Métodos: MercadoPago, transferencia, efectivo, tarjeta, otro.

## Entidades operativas

### `categorias`

Pertenece opcionalmente a un negocio en el esquema actual. En la lógica vigente de Vendra debe operarse dentro del negocio activo. Nombre único por negocio.

### `productos`

Pertenece a un negocio y opcionalmente a una categoría. Tiene precio, stock actual, SKU y estado.

### `clientes`

Pertenece a un negocio. Contiene contacto, dirección y notas.

### `ventas`

Pertenece a un negocio, usuario vendedor y cliente opcional. Registra fecha, totales, método y estado de pago.

### `detalle_ventas`

Ítems de una venta con producto, cantidad, precio unitario y subtotal.

### `movimientos_stock`

Entradas, salidas y ajustes. Puede vincularse a una venta y a un usuario.

### `tickets_soporte`

Ticket reportado por un usuario y asignable a soporte. Prioridades baja/media/alta; estados abierto/en progreso/cerrado.

## Relaciones clave

```text
Plan 1 ── N Negocio
User N ── N Negocio (negocio_user)
Negocio 1 ── N Categoria
Negocio 1 ── N Producto
Negocio 1 ── N Cliente
Negocio 1 ── N Venta
Venta 1 ── N DetalleVenta
Producto 1 ── N MovimientoStock
Negocio 1 ── N PagoSuscripcion
User 1 ── N TicketSoporte
```

## Deuda técnica del modelo

- Existen clases legado `Customer`, `Support` y `Ticket` del prototipo inicial.
- Los modelos `Producto`, `Cliente` y `Venta` recibidos originalmente estaban vacíos o incompletos; completar relaciones y casts junto con sus CRUD.
- La nulabilidad de `categorias.negocio_id` requiere una decisión explícita antes de habilitar categorías globales. La operación actual debe mantenerse tenant-scoped.
