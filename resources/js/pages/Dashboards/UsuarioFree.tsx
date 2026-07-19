import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Negocio, PageProps, Plan, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Boxes,
    Building2,
    CircleDollarSign,
    Crown,
    LockKeyhole,
    Package,
    Plus,
    ReceiptText,
    ShoppingBag,
    Sparkles,
    Store,
    Users,
    WalletCards,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Mi negocio', href: '/dashboard' }];

interface BusinessStats {
    productos: number;
    clientes: number;
    ventas: number;
    ingresos: number;
    ventasMes: number;
    ingresosMes: number;
    ventasHoy: number;
    ingresosHoy: number;
    productosBajoStock: number;
    usuariosActivos: number;
    usoProductos: number | null;
    usoVentasMensuales: number | null;
}

interface RecentSale {
    id: number;
    fecha: string;
    total_neto: number;
    metodo_pago: string;
    estado_pago: string;
    comprobante?: string | null;
    cliente_nombre?: string | null;
}

interface LowStockProduct {
    id: number;
    nombre: string;
    stock_actual: number;
}

type Props = PageProps & {
    user: User;
    negocio: Negocio;
    plan: Plan;
    stats: BusinessStats;
    ventasRecientes: RecentSale[];
    productosBajoStock: LowStockProduct[];
    cantidadNegocios: number;
    esAdministradorNegocio: boolean;
};

const currency = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
});

function UsageBar({ value }: { value: number | null }) {
    const percentage = value ?? 0;

    return (
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.7 }}
                className={`h-full rounded-full ${percentage >= 90 ? 'bg-destructive' : 'bg-primary'}`}
            />
        </div>
    );
}

export default function UsuarioFreeDashboard() {
    const { user, negocio, plan, stats, ventasRecientes, productosBajoStock, cantidadNegocios } =
        usePage<Props>().props;

    const metrics = [
        { label: 'Ventas de hoy', value: stats.ventasHoy, detail: currency.format(stats.ingresosHoy), icon: ShoppingBag },
        { label: 'Ingresos del mes', value: currency.format(stats.ingresosMes), detail: `${stats.ventasMes} ventas`, icon: CircleDollarSign },
        { label: 'Productos', value: stats.productos, detail: `${stats.productosBajoStock} con stock bajo`, icon: Package },
        { label: 'Clientes', value: stats.clientes, detail: 'Base comercial', icon: Users },
    ];

    const quickActions = [
        { title: 'Nueva venta', description: 'Registrá una operación en segundos.', icon: ShoppingBag, href: route('ventas.create') },
        { title: 'Agregar producto', description: 'Ampliá tu catálogo y stock.', icon: Plus, href: route('productos.create') },
        { title: 'Clientes', description: 'Consultá y administrá tu cartera.', icon: Users, href: route('clientes.index') },
        { title: 'Productos', description: 'Revisá precios, categorías y existencias.', icon: Boxes, href: route('productos.index') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${negocio.nombre_comercial} | Vendra`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 xl:p-8">
                <motion.section
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-8"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.09),transparent_38%)]" />
                    <motion.div
                        animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-primary/15 blur-3xl"
                    />

                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="gap-1.5">
                                    <Store className="h-3.5 w-3.5" />
                                    {plan.nombre}
                                </Badge>
                                {cantidadNegocios > 1 && (
                                    <Button asChild variant="outline" size="sm" className="bg-background/60">
                                        <Link href={route('dashboard.negocios')}>
                                            <Building2 className="mr-2 h-3.5 w-3.5" />
                                            Cambiar negocio
                                        </Link>
                                    </Button>
                                )}
                            </div>
                            <p className="mt-6 text-sm text-muted-foreground">Hola, {user.nombre}</p>
                            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">
                                {negocio.nombre_comercial}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                Tu centro de operaciones diario: registrá ventas, controlá productos y mantené cerca a tus clientes.
                            </p>
                        </div>

                        <Button asChild size="lg" className="shadow-lg shadow-primary/15">
                            <Link href={route('ventas.create')}>
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Registrar venta
                            </Link>
                        </Button>
                    </div>
                </motion.section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg">
                                <CardContent className="p-5">
                                    <div className="w-fit rounded-2xl bg-primary/10 p-3 text-primary">
                                        <metric.icon className="h-5 w-5" />
                                    </div>
                                    <p className="mt-5 text-sm text-muted-foreground">{metric.label}</p>
                                    <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">{metric.detail}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Acciones rápidas
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Las herramientas esenciales para mover tu negocio.</p>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            {quickActions.map((action, index) => (
                                <motion.div
                                    key={action.title}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.04 }}
                                >
                                    <Link
                                        href={action.href}
                                        className="group flex h-full items-start gap-4 rounded-2xl border p-4 transition hover:border-primary/40 hover:bg-primary/5"
                                    >
                                        <div className="rounded-xl bg-muted p-2.5 text-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                                            <action.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{action.title}</p>
                                            <p className="mt-1 text-sm leading-5 text-muted-foreground">{action.description}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <WalletCards className="h-5 w-5 text-primary" />
                                Uso del Plan Free
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span>Productos</span>
                                    <span className="font-medium">
                                        {stats.productos} / {plan.limite_productos ?? '∞'}
                                    </span>
                                </div>
                                <UsageBar value={stats.usoProductos} />
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span>Ventas del mes</span>
                                    <span className="font-medium">
                                        {stats.ventasMes} / {plan.limite_ventas_mensuales ?? '∞'}
                                    </span>
                                </div>
                                <UsageBar value={stats.usoVentasMensuales} />
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">
                                El límite se reinicia automáticamente al comenzar cada mes.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ReceiptText className="h-5 w-5 text-primary" />
                                    Últimas ventas
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">Movimientos recientes de {negocio.nombre_comercial}.</p>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={route('ventas.index')}>Ver todas</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {ventasRecientes.map((sale) => (
                                    <div key={sale.id} className="flex items-center justify-between gap-4 rounded-2xl border p-4">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{sale.cliente_nombre || 'Consumidor final'}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {new Date(sale.fecha).toLocaleString('es-AR')} · {sale.metodo_pago}
                                            </p>
                                        </div>
                                        <p className="whitespace-nowrap font-semibold text-primary">
                                            {currency.format(Number(sale.total_neto))}
                                        </p>
                                    </div>
                                ))}
                                {ventasRecientes.length === 0 && (
                                    <div className="rounded-2xl border border-dashed p-8 text-center">
                                        <ShoppingBag className="mx-auto h-8 w-8 text-primary" />
                                        <p className="mt-3 font-medium">Tu primera venta te espera</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Cuando registres una venta aparecerá aquí.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Stock para revisar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {productosBajoStock.map((product) => (
                                <div key={product.id} className="flex items-center justify-between gap-3 rounded-2xl border p-4">
                                    <p className="truncate text-sm font-medium">{product.nombre}</p>
                                    <Badge variant={product.stock_actual <= 0 ? 'destructive' : 'secondary'}>
                                        {product.stock_actual}
                                    </Badge>
                                </div>
                            ))}
                            {productosBajoStock.length === 0 && (
                                <p className="rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                                    No hay productos con stock bajo.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 p-7 md:p-9"
                >
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 text-primary">
                                <Crown className="h-5 w-5" />
                                <span className="text-sm font-semibold">Desbloqueá el siguiente nivel</span>
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold md:text-3xl">
                                Más análisis, más usuarios, más crecimiento.
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                Premium suma reportes avanzados, herramientas colaborativas y una visión más profunda del rendimiento.
                            </p>
                        </div>
                        <Button asChild size="lg">
                            <Link href={route('pagos-suscripciones.create')}>
                                Mejorar mi plan
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <LockKeyhole className="absolute -bottom-8 -right-8 h-40 w-40 text-primary/5" />
                </motion.section>
            </div>
        </AppLayout>
    );
}
