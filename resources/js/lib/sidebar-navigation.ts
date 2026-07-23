import type { Auth, NavGroup, NavItem } from '@/types';
import {
    BarChart3,
    Building2,
    CircleDollarSign,
    FolderKey,
    Headset,
    LayoutDashboard,
    Package,
    ReceiptText,
    ShieldCheck,
    ShoppingCart,
    Tags,
    Users,
    UsersRound,
} from 'lucide-react';

/**
 * Construye el sidebar exclusivamente con el contexto autorizado por Laravel.
 * El frontend nunca deduce el plan ni la membresía por su cuenta.
 */
export function buildSidebarNavigation(auth: Auth): NavGroup[] {
    const groups: NavGroup[] = [];
    const hasRole = (role: string) => auth.roles.includes(role);
    const hasPermission = (...permissions: string[]) =>
        hasRole('admin') || permissions.some((permission) => auth.permissions.includes(permission));

    const generalItems: NavItem[] = [
        {
            title: auth.es_soporte ? 'Panel de soporte' : auth.es_admin_global ? 'Panel general' : 'Panel principal',
            href: route('dashboard'),
            icon: LayoutDashboard,
            activePatterns: ['/dashboard'],
        },
    ];

    if (auth.es_admin_global || auth.es_usuario_negocio) {
        generalItems.push({
            title: auth.es_admin_global ? 'Negocios' : 'Mis negocios',
            href: route('dashboard.negocios'),
            icon: Building2,
            activePatterns: ['/dashboard/negocios*', '/negocios', '/negocios/create'],
        });
    }

    groups.push({ title: 'General', items: generalItems });

    if (auth.es_admin_global) {
        groups.push({
            title: 'Administración de Vendra',
            items: [
                {
                    title: 'Usuarios',
                    href: route('users.index'),
                    icon: Users,
                    activePatterns: ['/users', '/users/create', '/users/*/edit'],
                },
                {
                    title: 'Roles',
                    href: route('roles.index'),
                    icon: ShieldCheck,
                    activePatterns: ['/roles*'],
                },
                {
                    title: 'Asignación de roles',
                    href: route('users.roles.index'),
                    icon: FolderKey,
                    activePatterns: ['/users/roles*'],
                },
                {
                    title: 'Planes',
                    href: route('planes.index'),
                    icon: Tags,
                    activePatterns: ['/planes*'],
                },
                {
                    title: 'Suscripciones',
                    href: route('pagos-suscripciones.index'),
                    icon: CircleDollarSign,
                    activePatterns: ['/pagos-suscripciones*'],
                },
            ],
        });
    }

    if (auth.es_soporte && !auth.es_admin_global) {
        groups.push({
            title: 'Atención al usuario',
            items: [
                {
                    title: 'Tickets',
                    href: route('tickets.index'),
                    icon: Headset,
                    activePatterns: ['/tickets*'],
                },
                {
                    title: 'Usuarios',
                    href: route('users.index'),
                    icon: Users,
                    activePatterns: ['/users*'],
                },
            ],
        });
    }

    if (auth.negocio_activo && (auth.es_admin_global || auth.es_usuario_negocio)) {
        const plan = auth.plan_activo ?? auth.negocio_activo.plan ?? null;
        const businessItems: NavItem[] = [];

        if (hasPermission('ver productos')) {
            businessItems.push({
                title: 'Productos',
                href: route('productos.index'),
                icon: Package,
                activePatterns: ['/productos*'],
            });
        }

        if (hasPermission('ver categorias', 'ver productos')) {
            businessItems.push({
                title: 'Categorías',
                href: route('categorias.index'),
                icon: Tags,
                activePatterns: ['/categorias*'],
            });
        }

        if (hasPermission('ver clientes')) {
            businessItems.push({
                title: 'Clientes',
                href: route('clientes.index'),
                icon: UsersRound,
                activePatterns: ['/clientes*'],
            });
        }

        if (hasPermission('ver ventas')) {
            businessItems.push({
                title: 'Ventas',
                href: route('ventas.index'),
                icon: ShoppingCart,
                activePatterns: ['/ventas*'],
            });
        }

        if (hasPermission('ver_basico reportes')) {
            const advanced = Boolean(plan?.reportes_avanzados) && hasPermission('ver_avanzado reportes');

            businessItems.push({
                title: advanced ? 'Reportes avanzados' : 'Reportes',
                href: route('reportes.index'),
                icon: BarChart3,
                activePatterns: ['/reportes*'],
                badge: advanced ? 'Premium' : undefined,
                badgeTone: advanced ? 'premium' : undefined,
            });
        }

        if (businessItems.length > 0) {
            groups.push({
                title: auth.negocio_activo.nombre_comercial,
                items: businessItems,
            });
        }

        if (auth.es_administrador_negocio) {
            const managementItems: NavItem[] = [
                {
                    title: 'Equipo',
                    href: route('negocios.usuarios.index', auth.negocio_activo.id),
                    icon: Users,
                    activePatterns: [`/negocios/${auth.negocio_activo.id}/usuarios*`],
                },
            ];

            if (!auth.es_admin_global) {
                managementItems.push({
                    title: 'Plan y suscripción',
                    href: route('pagos-suscripciones.index'),
                    icon: ReceiptText,
                    activePatterns: ['/pagos-suscripciones*'],
                });
            }

            groups.push({
                title: 'Gestión del negocio',
                items: managementItems,
            });
        }
    }

    if (auth.es_usuario_negocio && hasPermission('ver tickets')) {
        groups.push({
            title: 'Ayuda',
            items: [
                {
                    title: 'Centro de ayuda',
                    href: route('tickets.index'),
                    icon: Headset,
                    activePatterns: ['/tickets*'],
                },
            ],
        });
    }

    return groups.filter((group) => group.items.length > 0);
}
