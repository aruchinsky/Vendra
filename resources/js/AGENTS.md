# Vendra frontend — reglas específicas

Estas reglas complementan el `AGENTS.md` de la raíz.

## Stack y convenciones

- React 19 + TypeScript + Inertia 2.
- Tailwind CSS 4 y componentes shadcn/ui/Radix existentes.
- Usar `lucide-react` para iconografía.
- Reutilizar componentes existentes antes de crear wrappers nuevos.
- Mantener compatibilidad con modo claro/oscuro, escritorio, móvil y sidebar colapsado.
- No agregar paquetes sin aprobación.

## Contexto autenticado

- Consumir `auth` compartido por `HandleInertiaRequests`.
- No deducir rol, plan o administración desde nombres, URLs o el primer rol del array.
- Usar `roles.includes(...)`, permisos efectivos y campos del contexto global.
- El frontend representa autorización; Laravel la impone.

## Sidebar

- `resources/js/lib/sidebar-navigation.ts` contiene la matriz declarativa.
- `resources/js/components/app-sidebar.tsx` compone el sidebar.
- `resources/js/components/business-switcher.tsx` cambia el negocio activo.
- Mantener accesibilidad, foco, teclado, búsqueda, cierre de popover y funcionamiento móvil.
- Las rutas activas deben contemplar páginas hijas y parámetros, no solo igualdad exacta con `page.url`.

## Inertia y Vite

- Las páginas se resuelven desde `resources/js/app.tsx` mediante `import.meta.glob('./pages/**/*.tsx')`.
- `resources/views/app.blade.php` debe cargar únicamente la entrada principal con `@vite(['resources/js/app.tsx'])`.
- No agregar una página Inertia dinámica como entrada Blade independiente.

## Calidad

Después de cambios TS/TSX ejecutar:

```bash
npm run types
npm run build
```

Para cambios visuales, probar como mínimo:

- desktop expandido y colapsado;
- viewport móvil;
- tema claro y oscuro;
- navegación Inertia;
- consola y red del navegador;
- foco y cierre de popovers/dialogs.
