# Arquitectura de Vendra

## Propósito

Vendra es una plataforma SaaS freemium para emprendedores y pequeños comercios. Centraliza negocios, usuarios, productos, clientes, ventas, stock, reportes, soporte y suscripciones dentro del ecosistema AIR Sistemas.

## Stack actual

### Backend

- PHP `^8.3`
- Laravel `^13.0`
- Inertia Laravel `^2.0`
- Spatie Laravel Permission `^6.19`
- Ziggy `^2.4`
- Pest `^4.0`

### Frontend

- React `^19`
- TypeScript `^5.7`
- Inertia React `^2.0`
- Vite `^6`
- Tailwind CSS `^4`
- shadcn/ui y Radix UI
- Framer Motion
- Recharts
- Sonner
- TanStack Table

### Persistencia

- MySQL/MariaDB en el entorno local de XAMPP.
- Una sola base de datos compartida con aislamiento lógico por negocio.

## Capas principales

### Laravel

- `routes/`: entrada HTTP y middleware de acceso.
- `app/Http/Controllers/`: casos de uso y renderizado Inertia.
- `app/Http/Middleware/`: apariencia, datos compartidos y negocio activo.
- `app/Services/VendraContextService.php`: resolución central del contexto autenticado.
- `app/Models/`: entidades Eloquent.
- `database/migrations/`: esquema.
- `database/seeders/`: planes, roles, permisos, usuarios y negocios demo.

### React/Inertia

- `resources/js/app.tsx`: arranque de Inertia y resolución de páginas.
- `resources/js/pages/`: páginas por módulo.
- `resources/js/layouts/`: layouts principales.
- `resources/js/components/`: sidebar, navegación, selector de negocio y UI reutilizable.
- `resources/js/lib/sidebar-navigation.ts`: matriz declarativa de navegación.
- `resources/js/types/index.d.ts`: contratos TypeScript compartidos.

## Flujo de una solicitud autenticada

1. Laravel inicia la sesión y autentica al usuario.
2. `HandleInertiaRequests` solicita a `VendraContextService` el contexto global.
3. El servicio resuelve roles, permisos, negocios disponibles, negocio activo y plan.
4. El contexto se comparte como `auth` con todas las páginas Inertia.
5. Las rutas operativas usan rol, permiso y `EnsureActiveBusiness`.
6. El controlador consulta únicamente datos del negocio autorizado.
7. React construye el sidebar desde el contexto ya autorizado.

## Dashboard como referencia funcional

`DashboardController` contiene los casos validados:

- administrador global;
- soporte;
- usuario sin negocio;
- usuario con un negocio;
- usuario con varios negocios;
- selección y limpieza del contexto;
- dashboard Free/Premium según el plan del negocio.

La lógica reusable debe vivir en servicios/middleware, pero cualquier refactor debe preservar estos comportamientos y sus pruebas.

## Carga de páginas Inertia

`resources/js/app.tsx` usa un glob de páginas. La plantilla Blade debe cargar solo la entrada principal:

```blade
@viteReactRefresh
@vite(['resources/js/app.tsx'])
@inertiaHead
```

No cargar `resources/js/pages/{component}.tsx` directamente desde Blade, porque esas páginas no son entradas independientes garantizadas del manifiesto.
