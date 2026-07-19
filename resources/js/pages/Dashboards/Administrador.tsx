import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowUpRight,
    Building2,
    CircleDollarSign,
    CreditCard,
    Database,
    Headphones,
    Layers3,
    Package,
    ReceiptText,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Users,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Centro de control', href: '/dashboard' }];

interface AdminStats {
    usuariosTotales: number;
    usuariosActivos: number;
    negociosTotales: number;
    negociosActivos: number;
    productosTotales: number;
    ventasTotales: number;
    clientesTotales: number;
    planesActivos: number;
    ticketsAbiertos: number;
    pagosPendientes: number;
    ingresosComercios: number;
    ingresosSuscripciones: number;
}

interface EvolucionItem {
    periodo: string;
    usuarios: number;
    negocios: number;
    ventas: number;
}

interface PlanDistribution {
    id: number;
    nombre: string;
    slug: string;
    negocios: number;
}

interface RecentBusiness {
    id: number;
    nombre_comercial: string;
    rubro?: string | null;
    activo: boolean;
    created_at: string;
    usuarios_activos_count: number;
    plan?: { nombre: string; slug: string } | null;
}

interface PendingPayment {
    id: number;
    monto: number;
    moneda: string;
    created_at: string;
    negocio?: { nombre_comercial: string } | null;
    plan?: { nombre: string; slug: string } | null;
}

interface RecentTicket {
    id: number;
    asunto: string;
    prioridad: 'baja' | 'media' | 'alta';
    estado: 'abierto' | 'en_progreso' | 'cerrado';
    created_at: string;
    usuario_nombre?: string | null;
    usuario_apellido?: string | null;
}

type Props = PageProps & {
    user: User;
    stats: AdminStats;
    evolucion: EvolucionItem[];
    distribucionPlanes: PlanDistribution[];
    negociosRecientes: RecentBusiness[];
    pagosPendientes: PendingPayment[];
    ticketsRecientes: RecentTicket[];
};

const currency = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('es-AR');

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.045, duration: 0.35 },
    }),
};

function statusLabel(status: RecentTicket['estado']) {
    return status === 'en_progreso' ? 'En progreso' : status.charAt(0).toUpperCase() + status.slice(1);
}

export default function AdministradorDashboard() {
    const { user, stats, evolucion, distribucionPlanes, negociosRecientes, pagosPendientes, ticketsRecientes } =
        usePage<Props>().props;

    const cards = [
        {
            label: 'Negocios activos',
            value: number.format(stats.negociosActivos),
            detail: `${number.format(stats.negociosTotales)} registrados`,
            icon: Building2,
        },
        {
            label: 'Usuarios activos',
            value: number.format(stats.usuariosActivos),
            detail: `${number.format(stats.usuariosTotales)} cuentas totales`,
            icon: Users,
        },
        {
            label: 'Ventas procesadas',
            value: number.format(stats.ventasTotales),
            detail: currency.format(stats.ingresosComercios),
            icon: ShoppingCart,
        },
        {
            label: 'Ingresos SaaS',
            value: currency.format(stats.ingresosSuscripciones),
            detail: `${stats.pagosPendientes} pagos pendientes`,
            icon: CircleDollarSign,
        },
        {
            label: 'Productos',
            value: number.format(stats.productosTotales),
            detail: `${number.format(stats.clientesTotales)} clientes`,
            icon: Package,
        },
        {
            label: 'Soporte activo',
            value: number.format(stats.ticketsAbiertos),
            detail: 'Tickets abiertos',
            icon: Headphones,
        },
    ];

    const modules = [
        {
            title: 'Usuarios y roles',
            description: 'Administrá cuentas globales, accesos y seguridad.',
            icon: Users,
            href: route('users.index'),
        },
        {
            title: 'Negocios',
            description: 'Supervisá comercios, membresías y estado operativo.',
            icon: Building2,
            href: route('negocios.index'),
        },
        {
            title: 'Planes',
            description: 'Definí límites y capacidades de Free y Premium.',
            icon: Layers3,
            href: route('planes.index'),
        },
        {
            title: 'Pagos',
            description: 'Revisá solicitudes y aprobá suscripciones.',
            icon: CreditCard,
            href: route('pagos-suscripciones.index'),
        },
        {
            title: 'Tickets',
            description: 'Observá la operación del equipo de soporte.',
            icon: Headphones,
            href: route('tickets.index'),
        },
        {
            title: 'Permisos',
            description: 'Configurá roles y permisos globales de Vendra.',
            icon: ShieldCheck,
            href: route('roles.index'),
        },
    ];

    const maxPlanBusinesses = Math.max(...distribucionPlanes.map((plan) => plan.negocios), 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Centro de control | Vendra" />

            <div className="flex flex-col gap-6 p-4 md:p-6 xl:p-8">
                <motion.section
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-8"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.11),transparent_38%)]" />
                    <motion.div
                        animate={{ x: [0, 22, 0], y: [0, -14, 0] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
                    />

                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <Badge variant="outline" className="mb-4 gap-2 bg-background/70">
                                <Database className="h-3.5 w-3.5 text-primary" />
                                Administración global de Vendra
                            </Badge>
                            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                Tu centro de mando, <span className="text-primary">{user.nombre}</span>
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                Controlá el crecimiento del SaaS, la actividad comercial, las suscripciones y la salud operativa desde una única vista ejecutiva.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:flex">
                            <div className="rounded-2xl border bg-background/70 px-4 py-3 backdrop-blur">
                                <p className="text-xs text-muted-foreground">Planes activos</p>
                                <p className="mt-1 text-2xl font-semibold">{stats.planesActivos}</p>
                            </div>
                            <div className="rounded-2xl border bg-background/70 px-4 py-3 backdrop-blur">
                                <p className="text-xs text-muted-foreground">Alertas operativas</p>
                                <p className="mt-1 text-2xl font-semibold text-primary">
                                    {stats.ticketsAbiertos + stats.pagosPendientes}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                    {cards.map((item, index) => (
                        <motion.div
                            key={item.label}
                            custom={index}
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card className="group h-full overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="rounded-2xl bg-primary/10 p-3 text-primary transition group-hover:scale-105">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <Activity className="h-4 w-4 text-muted-foreground/50" />
                                    </div>
                                    <p className="mt-5 text-sm text-muted-foreground">{item.label}</p>
                                    <p className="mt-1 text-2xl font-semibold tracking-tight">{item.value}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Evolución de la plataforma
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Altas de usuarios, nuevos negocios y volumen de ventas de los últimos seis meses.
                                </p>
                            </div>
                            <Badge variant="secondary">Tiempo real</Badge>
                        </CardHeader>
                        <CardContent className="h-[330px] pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={evolucion} margin={{ left: -16, right: 8, top: 12 }}>
                                    <defs>
                                        <linearGradient id="ventasAdmin" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" opacity={0.22} vertical={false} />
                                    <XAxis dataKey="periodo" tickLine={false} axisLine={false} fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} fontSize={12} width={72} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 14,
                                            border: '1px solid var(--border)',
                                            background: 'var(--popover)',
                                            color: 'var(--popover-foreground)',
                                        }}
                                        formatter={(value, name) => {
                                            const numericValue = Number(value);
                                            const seriesName = String(name);

                                            return [
                                                seriesName === 'ventas'
                                                    ? currency.format(numericValue)
                                                    : number.format(numericValue),
                                                seriesName === 'ventas'
                                                    ? 'Ventas'
                                                    : seriesName === 'usuarios'
                                                      ? 'Usuarios'
                                                      : 'Negocios',
                                            ];
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="ventas"
                                        stroke="#ef4444"
                                        fill="url(#ventasAdmin)"
                                        strokeWidth={3}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="usuarios"
                                        stroke="#8b5cf6"
                                        fill="transparent"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="negocios"
                                        stroke="#06b6d4"
                                        fill="transparent"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers3 className="h-5 w-5 text-primary" />
                                Distribución por plan
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Negocios activos en cada nivel comercial.</p>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {distribucionPlanes.map((plan) => (
                                <div key={plan.id}>
                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{plan.nombre}</span>
                                            {plan.slug === 'premium' && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                                        </div>
                                        <span className="font-semibold">{plan.negocios}</span>
                                    </div>
                                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(plan.negocios / maxPlanBusinesses) * 100}%` }}
                                            transition={{ duration: 0.7 }}
                                            className="h-full rounded-full bg-primary"
                                        />
                                    </div>
                                </div>
                            ))}

                            {distribucionPlanes.length === 0 && (
                                <p className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                                    Todavía no hay planes activos para mostrar.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Operación central</h2>
                        <p className="text-sm text-muted-foreground">Accesos directos a los módulos estratégicos.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {modules.map((module, index) => (
                            <motion.div
                                key={module.title}
                                custom={index}
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ y: -3 }}
                            >
                                <Card className="group h-full overflow-hidden">
                                    <CardContent className="flex h-full flex-col p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="rounded-2xl bg-muted p-3 text-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                                                <module.icon className="h-5 w-5" />
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                                        </div>
                                        <h3 className="mt-5 font-semibold">{module.title}</h3>
                                        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                                            {module.description}
                                        </p>
                                        <Button asChild variant="outline" className="mt-5 w-full">
                                            <Link href={module.href}>Abrir módulo</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Nuevos negocios
                            </CardTitle>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={route('negocios.index')}>Ver todos</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {negociosRecientes.map((negocio) => (
                                <div key={negocio.id} className="rounded-2xl border p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium">{negocio.nombre_comercial}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {negocio.rubro || 'Rubro sin especificar'} · {negocio.usuarios_activos_count} usuario(s)
                                            </p>
                                        </div>
                                        <Badge variant={negocio.plan?.slug === 'premium' ? 'default' : 'secondary'}>
                                            {negocio.plan?.nombre || 'Sin plan'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {negociosRecientes.length === 0 && (
                                <p className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                                    Todavía no se registraron negocios.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <ReceiptText className="h-5 w-5 text-primary" />
                                Pagos pendientes
                            </CardTitle>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={route('pagos-suscripciones.index')}>Gestionar</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {pagosPendientes.map((pago) => (
                                <div key={pago.id} className="flex items-center justify-between gap-3 rounded-2xl border p-4">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{pago.negocio?.nombre_comercial || 'Negocio'}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {pago.plan?.nombre || 'Plan'} · {new Date(pago.created_at).toLocaleDateString('es-AR')}
                                        </p>
                                    </div>
                                    <p className="whitespace-nowrap font-semibold text-primary">
                                        {currency.format(pago.monto)}
                                    </p>
                                </div>
                            ))}
                            {pagosPendientes.length === 0 && (
                                <p className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                                    No hay pagos pendientes de revisión.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Headphones className="h-5 w-5 text-primary" />
                                Últimos tickets
                            </CardTitle>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={route('tickets.index')}>Ver soporte</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {ticketsRecientes.map((ticket) => (
                                <div key={ticket.id} className="rounded-2xl border p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{ticket.asunto}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {[ticket.usuario_nombre, ticket.usuario_apellido].filter(Boolean).join(' ') || 'Usuario'}
                                            </p>
                                        </div>
                                        <Badge variant={ticket.prioridad === 'alta' ? 'destructive' : 'secondary'}>
                                            {ticket.prioridad}
                                        </Badge>
                                    </div>
                                    <p className="mt-3 text-xs text-muted-foreground">{statusLabel(ticket.estado)}</p>
                                </div>
                            ))}
                            {ticketsRecientes.length === 0 && (
                                <p className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                                    No hay tickets recientes.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
