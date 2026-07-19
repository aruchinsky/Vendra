import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    Crown,
    MapPin,
    Plus,
    ShieldCheck,
    Sparkles,
    Store,
    Users,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Elegir negocio', href: '/dashboard/negocios' }];

interface BusinessOption {
    id: number;
    nombre_comercial: string;
    rubro?: string | null;
    direccion?: string | null;
    logo_path?: string | null;
    usuarios_activos_count: number;
    es_administrador: boolean;
    plan?: {
        id: number;
        nombre: string;
        slug: string;
        reportes_avanzados: boolean;
    } | null;
}

type Props = PageProps & {
    user: User;
    negocioActivoId?: number | null;
    negocios: BusinessOption[];
};

export default function SelectorNegocio() {
    const { user, negocioActivoId, negocios } = usePage<Props>().props;
    const [selectingId, setSelectingId] = useState<number | null>(null);

    const selectBusiness = (businessId: number) => {
        setSelectingId(businessId);
        router.post(
            route('dashboard.negocio.seleccionar', businessId),
            {},
            {
                preserveScroll: true,
                onFinish: () => setSelectingId(null),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Elegí tu negocio | Vendra" />

            <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden p-4 md:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.1),transparent_30%)]" />

                <div className="relative mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <Badge variant="outline" className="gap-2 bg-background/70">
                            <Store className="h-3.5 w-3.5 text-primary" />
                            Selector de negocios
                        </Badge>
                        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
                            ¿Qué negocio querés gestionar hoy, <span className="text-primary">{user.nombre}</span>?
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                            Cada negocio tiene sus propios productos, clientes, ventas y plan. Elegí uno para entrar a su espacio de trabajo.
                        </p>
                    </motion.div>

                    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {negocios.map((business, index) => {
                            const isActive = negocioActivoId === business.id;
                            const isPremium = business.plan?.slug === 'premium';

                            return (
                                <motion.div
                                    key={business.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card
                                        className={`group relative h-full overflow-hidden transition-all hover:shadow-xl ${
                                            isActive ? 'border-primary ring-1 ring-primary/35' : ''
                                        }`}
                                    >
                                        <div
                                            className={`absolute inset-x-0 top-0 h-1 ${
                                                isPremium
                                                    ? 'bg-gradient-to-r from-primary via-fuchsia-500 to-violet-500'
                                                    : 'bg-primary/50'
                                            }`}
                                        />
                                        <CardContent className="flex h-full flex-col p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
                                                    {business.logo_path ? (
                                                        <img
                                                            src={business.logo_path}
                                                            alt={`Logo de ${business.nombre_comercial}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Building2 className="h-7 w-7" />
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap justify-end gap-2">
                                                    <Badge variant={isPremium ? 'default' : 'secondary'} className="gap-1">
                                                        {isPremium && <Crown className="h-3 w-3" />}
                                                        {business.plan?.nombre || 'Sin plan'}
                                                    </Badge>
                                                    {isActive && (
                                                        <Badge variant="outline" className="gap-1 text-primary">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Actual
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <h2 className="mt-6 text-xl font-semibold">{business.nombre_comercial}</h2>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {business.rubro || 'Rubro sin especificar'}
                                            </p>

                                            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-primary" />
                                                    {business.usuarios_activos_count} usuario(s) activo(s)
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    {business.direccion || 'Sin dirección registrada'}
                                                </div>
                                                {business.es_administrador && (
                                                    <div className="flex items-center gap-2">
                                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                                        Administrás este negocio
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                type="button"
                                                className="mt-7 w-full"
                                                onClick={() => selectBusiness(business.id)}
                                                disabled={selectingId !== null}
                                            >
                                                {selectingId === business.id ? 'Ingresando...' : 'Gestionar negocio'}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-dashed bg-card/55 p-5 sm:flex-row"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">¿Tenés otro emprendimiento?</p>
                                <p className="text-sm text-muted-foreground">
                                    Podés crear otro espacio independiente dentro de tu cuenta.
                                </p>
                            </div>
                        </div>
                        <Button asChild variant="outline">
                            <Link href={route('negocios.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear otro negocio
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
