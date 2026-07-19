import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Headphones,
    Inbox,
    MessageSquareText,
    ShieldAlert,
    TimerReset,
    UserRoundCheck,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Soporte', href: '/dashboard' }];

interface SupportStats {
    ticketsAbiertos: number;
    ticketsEnProgreso: number;
    ticketsCerrados: number;
    prioridadAlta: number;
    asignadosAMi: number;
    sinAsignar: number;
    usuariosAsistidos: number;
    promedioRespuesta: string;
}

interface TicketItem {
    id: number;
    asunto: string;
    descripcion: string;
    prioridad: 'baja' | 'media' | 'alta';
    estado: 'abierto' | 'en_progreso' | 'cerrado';
    created_at: string;
    updated_at: string;
    usuario_nombre?: string | null;
    usuario_apellido?: string | null;
}

interface StateLoad {
    estado: string;
    cantidad: number;
}

type Props = PageProps & {
    user: User;
    stats: SupportStats;
    ticketsRecientes: TicketItem[];
    cargaPorEstado: StateLoad[];
};

function stateLabel(state: TicketItem['estado']) {
    if (state === 'en_progreso') return 'En progreso';
    return state === 'cerrado' ? 'Cerrado' : 'Abierto';
}

export default function SoporteDashboard() {
    const { user, stats, ticketsRecientes, cargaPorEstado } = usePage<Props>().props;
    const maxLoad = Math.max(...cargaPorEstado.map((item) => item.cantidad), 1);

    const metricCards = [
        { label: 'Abiertos', value: stats.ticketsAbiertos, icon: MessageSquareText, detail: 'Requieren revisión' },
        { label: 'En progreso', value: stats.ticketsEnProgreso, icon: Clock3, detail: 'Atención activa' },
        { label: 'Prioridad alta', value: stats.prioridadAlta, icon: ShieldAlert, detail: 'Incidentes críticos' },
        { label: 'Asignados a mí', value: stats.asignadosAMi, icon: UserRoundCheck, detail: 'Tu bandeja actual' },
        { label: 'Sin asignar', value: stats.sinAsignar, icon: Inbox, detail: 'Disponibles para tomar' },
        { label: 'Tiempo promedio', value: stats.promedioRespuesta, icon: TimerReset, detail: 'Resolución histórica' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Centro de soporte | Vendra" />

            <div className="flex flex-col gap-6 p-4 md:p-6 xl:p-8">
                <motion.section
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-8"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_40%)]" />
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <Badge variant="outline" className="mb-4 gap-2 bg-background/70">
                                <Headphones className="h-3.5 w-3.5 text-primary" />
                                Operación de soporte
                            </Badge>
                            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                                Hola, <span className="text-primary">{user.nombre}</span>. Esta es tu guardia.
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                Priorizá incidencias, tomá tickets disponibles y mantené a los usuarios de Vendra acompañados en cada etapa.
                            </p>
                        </div>

                        <Button asChild size="lg" className="shadow-lg shadow-primary/15">
                            <Link href={route('tickets.index')}>
                                <MessageSquareText className="mr-2 h-4 w-4" />
                                Abrir bandeja de tickets
                            </Link>
                        </Button>
                    </div>
                </motion.section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                    {metricCards.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        {item.label === 'Prioridad alta' && stats.prioridadAlta > 0 && (
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-60" />
                                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-5 text-sm text-muted-foreground">{item.label}</p>
                                    <p className="mt-1 text-2xl font-semibold">{item.value}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p>
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
                                    <Inbox className="h-5 w-5 text-primary" />
                                    Actividad reciente
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Últimas solicitudes recibidas por el equipo de soporte.
                                </p>
                            </div>
                            <Badge variant="secondary">{stats.usuariosAsistidos} usuarios asistidos</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {ticketsRecientes.map((ticket, index) => (
                                    <motion.div
                                        key={ticket.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.035 }}
                                        className="rounded-2xl border p-4 transition hover:bg-muted/35"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-medium">{ticket.asunto}</p>
                                                    <Badge variant={ticket.prioridad === 'alta' ? 'destructive' : 'secondary'}>
                                                        {ticket.prioridad}
                                                    </Badge>
                                                </div>
                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                                    {ticket.descripcion}
                                                </p>
                                                <p className="mt-3 text-xs text-muted-foreground">
                                                    Reportado por{' '}
                                                    {[ticket.usuario_nombre, ticket.usuario_apellido].filter(Boolean).join(' ') || 'Usuario'}
                                                    {' · '}
                                                    {new Date(ticket.created_at).toLocaleString('es-AR')}
                                                </p>
                                            </div>
                                            <Badge variant="outline">{stateLabel(ticket.estado)}</Badge>
                                        </div>
                                    </motion.div>
                                ))}

                                {ticketsRecientes.length === 0 && (
                                    <div className="rounded-2xl border border-dashed p-8 text-center">
                                        <CheckCircle2 className="mx-auto h-9 w-9 text-primary" />
                                        <p className="mt-3 font-medium">La bandeja está tranquila</p>
                                        <p className="mt-1 text-sm text-muted-foreground">No hay tickets recientes para mostrar.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Carga por estado
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {cargaPorEstado.map((item) => (
                                    <div key={item.estado}>
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span>{item.estado}</span>
                                            <span className="font-semibold">{item.cantidad}</span>
                                        </div>
                                        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.cantidad / maxLoad) * 100}%` }}
                                                transition={{ duration: 0.65 }}
                                                className="h-full rounded-full bg-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-primary/25 bg-primary/5">
                            <CardContent className="p-6">
                                <AlertTriangle className="h-8 w-8 text-primary" />
                                <h3 className="mt-4 font-semibold">Foco recomendado</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {stats.prioridadAlta > 0
                                        ? `Hay ${stats.prioridadAlta} ticket(s) de prioridad alta que deberían atenderse primero.`
                                        : stats.sinAsignar > 0
                                          ? `Hay ${stats.sinAsignar} ticket(s) sin asignar disponibles para tomar.`
                                          : 'No hay alertas críticas. Podés continuar con los tickets en progreso.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
