# Vendra backend — reglas específicas

Estas reglas complementan el `AGENTS.md` de la raíz.

## Arquitectura Laravel

- Versión objetivo: Laravel 13 y PHP `^8.3`.
- Usar tipos de retorno y relaciones Eloquent explícitas.
- Preferir Form Requests o validación clara en controlador; no aceptar IDs de negocio sin autorización posterior.
- Para módulos operativos, obtener el negocio autorizado desde el contexto/middleware, no desde un `negocio_id` libre enviado por el cliente.
- `EnsureActiveBusiness` exige un negocio activo para rutas operativas.
- `VendraContextService` centraliza el contexto de la solicitud y memoriza el resultado en atributos del request.
- El administrador global puede seleccionar cualquier negocio activo y limpiar la selección para volver al entorno global.
- El usuario `usuario` solo puede seleccionar negocios con membresía activa.
- Soporte no opera módulos comerciales salvo una decisión funcional explícita futura.

## Autorización

Combinar cuando corresponda:

1. Autenticación y verificación de correo.
2. Rol global Spatie.
3. Permiso Spatie.
4. Negocio activo.
5. Membresía activa o condición de administrador global.
6. Condición `es_administrador` para configuración crítica, equipo y suscripción.
7. Función habilitada por el plan.

No confiar en datos compartidos por Inertia para autorizar backend.

## Base de datos

- Toda entidad operativa debe estar aislada por `negocio_id` directa o indirectamente.
- No mezclar productos, categorías, clientes, ventas o movimientos de negocios distintos.
- `negocio_user` usa `es_administrador` y `activo`.
- Mantener al menos un administrador activo por negocio.
- El plan limita productos, ventas mensuales y usuarios; `null` significa sin límite en los campos configurados como nullable.

## Compatibilidad y legado

Los modelos/controladores `Customer`, `Support` y `Ticket` pertenecen a un prototipo anterior. El flujo actual de soporte usa `TicketSoporte` y `tickets_soporte`. No eliminarlos hasta confirmar referencias y planificar una limpieza independiente.

## Pruebas esperadas

Agregar o actualizar tests para:

- acceso permitido y denegado;
- aislamiento entre negocios;
- negocio activo ausente;
- administrador global;
- usuario con cero, uno y varios negocios;
- soporte en modo consulta;
- límites de plan cuando el módulo los implemente.
