import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Negocio, PageProps, Plan, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    Boxes,
    Building2,
    CircleDollarSign,
    Crown,
    Package,
    ReceiptText,
    ShoppingBag,
    Sparkles,
    TrendingUp,
    UserPlus,
    Users,
    WalletCards,
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
}

interface RecentSale {
    id: number;
    fecha: string;
    total_neto: number;
    metodo_pago: string;
    estado_pago: string;
    cliente_nombre?: string | null;
}

interface MonthlySale {
    periodo: string;
    ventas: number;
    ingresos: number;
}

interface PaymentMethod {
    metodo: string;
    cantidad: number;
    total: number;
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
    ventasMensuales: MonthlySale[];
    metodosPago: PaymentMethod[];
    productosBajoStock: LowStockProduct[];
    cantidadNegocios: number;
    esAdministradorNegocio: boolean;
};

const currency = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
});

const methodNames: Record<string, string> = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    debito: 'Débito',
    credito: 'Crédito',
    mercadopago: 'Mercado Pago',
    otro: 'Otro',
};

export default function UsuarioPremiumDashboard() {
    const {
        user,
        negocio,
        plan,
        stats,
        ventasRecientes,
        ventasMensuales,
        metodosPago,
        productosBajoStock,
        cantidadNegocios,
        esAdministradorNegocio,
    } = usePage<Props>().props;

    const metrics = [
        { label: 'Ventas de hoy', value: stats.ventasHoy, detail: currency.format(stats.ingresosHoy), icon: ShoppingBag },
        { label: 'Ingresos del mes', value: currency.format(stats.ingresosMes), detail: `${stats.ventasMes} operaciones`, icon: CircleDollarSign },
        { label: 'Ticket acumulado', value: currency.format(stats.ingresos), detail: `${stats.ventas} ventas históricas`, icon: TrendingUp },
        { label: 'Equipo activo', value: stats.usuariosActivos, detail: `${stats.productos} productos · ${stats.clientes} clientes`, icon: Users },
    ];

    const quickActions = [
        { title: 'Nueva venta', description: 'Registrá una operación y actualizá el stock.', icon: ShoppingBag, href: route('ventas.create') },
        { title: 'Productos', description: 'Controlá catálogo, precios y existencias.', icon: Boxes, href: route('productos.index') },
        { title: 'Clientes', description: 'Profundizá la relación con tu cartera.', icon: Users, href: route('clientes.index') },
        { title: 'Reportes', description: 'Analizá tendencias y rendimiento comercial.', icon: BarChart3, href: route('reportes.index') },
    ];

    if (esAdministradorNegocio) {
        quickActions.push({
            title: 'Equipo',
            description: 'Invitá y administrá usuarios del negocio.',
            icon: UserPlus,
            href: route('negocios.usuarios.index', negocio.id),
        });
    }

    const maxPaymentTotal = Math.max(...metodosPago.map((method) => method.total), 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${negocio.nombre_comercial} Premium | Vendra`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 xl:p-8">
                <motion.section
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-8"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_33%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.16),transparent_40%)]" />
                    <motion.div
                        animate={{ rotate: [0, 8, 0], scale: [1, 1.06, 1] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
                    />

                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="gap-1.5 bg-gradient-to-r from-primary to-violet-600">
                                    <Crown className="h-3.5 w-3.5" />
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
                            <p className="mt-6 text-sm text-muted-foreground">Bienvenido de nuevo, {user.nombre}</p>
                            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">
                                {negocio.nombre_comercial}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                Una vista ejecutiva y operativa para tomar decisiones con datos, velocidad y control total.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {esAdministradorNegocio && (
                                <Button asChild variant="outline" size="lg" className="bg-background/60">
                                    <Link href={route('negocios.usuarios.index', negocio.id)}>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Gestionar equipo
                                    </Link>
                                </Button>
                            )}
                            <Button asChild size="lg" className="shadow-lg shadow-primary/15">
                                <Link href={route('ventas.create')}>
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Registrar venta
                                </Link>
                            </Button>
                        </div>
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
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                                            <metric.icon className="h-5 w-5" />
                                        </div>
                                        <Sparkles className="h-4 w-4 text-primary/50" />
                                    </div>
                                    <p className="mt-5 text-sm text-muted-foreground">{metric.label}</p>
                                    <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">{metric.detail}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.55fr_0.75fr]">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    Rendimiento comercial
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Ingresos y cantidad de ventas de los últimos seis meses.
                                </p>
                            </div>
                            <Badge className="gap-1.5">
                                <Sparkles className="h-3 w-3" />
                                Premium
                            </Badge>
                        </CardHeader>
                        <CardContent className="h-[340px] pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ventasMensuales} margin={{ left: -12, right: 8, top: 12 }}>
                                    <defs>
                                        <linearGradient id="ingresosPremium" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.38} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" opacity={0.22} vertical={false} />
                                    <XAxis dataKey="periodo" tickLine={false} axisLine={false} fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} fontSize={12} width={68} />
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
                                                seriesName === 'ingresos'
                                                    ? currency.format(numericValue)
                                                    : numericValue,
                                                seriesName === 'ingresos' ? 'Ingresos' : 'Ventas',
                                            ];
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="ingresos"
                                        stroke="#ef4444"
                                        fill="url(#ingresosPremium)"
                                        strokeWidth={3}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="ventas"
                                        stroke="#8b5cf6"
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
                                <WalletCards className="h-5 w-5 text-primary" />
                                Métodos de pago
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Distribución histórica por volumen facturado.</p>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {metodosPago.map((method) => (
                                <div key={method.metodo}>
                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                        <span>{methodNames[method.metodo] || method.metodo}</span>
                                        <span className="font-semibold">{currency.format(method.total)}</span>
                                    </div>
                                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(method.total / maxPaymentTotal) * 100}%` }}
                                            transition={{ duration: 0.7 }}
                                            className="h-full rounded-full bg-primary"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">{method.cantidad} operación(es)</p>
                                </div>
                            ))}
                            {metodosPago.length === 0 && (
                                <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    Todavía no hay datos de métodos de pago.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Accesos inteligentes</h2>
                        <p className="text-sm text-muted-foreground">Todo lo necesario para operar y analizar tu negocio.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={action.title}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.045 }}
                                whileHover={{ y: -4 }}
                            >
                                <Card className="group h-full">
                                    <CardContent className="flex h-full flex-col p-5">
                                        <div className="w-fit rounded-2xl bg-muted p-3 transition group-hover:bg-primary/10 group-hover:text-primary">
                                            <action.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-5 font-semibold">{action.title}</h3>
                                        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{action.description}</p>
                                        <Button asChild variant="outline" className="mt-5 w-full">
                                            <Link href={action.href}>
                                                Abrir
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ReceiptText className="h-5 w-5 text-primary" />
                                    Operaciones recientes
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Últimas ventas registradas en el negocio.
                                </p>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={route('ventas.index')}>Ver historial</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {ventasRecientes.map((sale) => (
                                <div key={sale.id} className="flex items-center justify-between gap-4 rounded-2xl border p-4 transition hover:bg-muted/30">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{sale.cliente_nombre || 'Consumidor final'}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {new Date(sale.fecha).toLocaleString('es-AR')} · {methodNames[sale.metodo_pago] || sale.metodo_pago}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-primary">{currency.format(Number(sale.total_neto))}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{sale.estado_pago}</p>
                                    </div>
                                </div>
                            ))}
                            {ventasRecientes.length === 0 && (
                                <p className="rounded-2xl border border-dashed p-7 text-center text-sm text-muted-foreground">
                                    Todavía no hay ventas para mostrar.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Alertas de inventario
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
                                <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    Inventario saludable. No hay alertas.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <Card className="overflow-hidden border-primary/25 bg-gradient-to-r from-primary/10 via-card to-violet-500/10">
                    <CardContent className="flex flex-col gap-5 p-7 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-primary">
                                <Crown className="h-5 w-5" />
                                <span className="text-sm font-semibold">Tu negocio está en modo Premium</span>
                            </div>
                            <h2 className="mt-3 text-2xl font-semibold">Convertí cada dato en una decisión.</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Los reportes avanzados ya están habilitados para {negocio.nombre_comercial}.
                            </p>
                        </div>
                        <Button asChild size="lg">
                            <Link href={route('reportes.index')}>
                                Ver análisis completos
                                <TrendingUp className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
