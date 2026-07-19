import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps, Plan, User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Check,
    Gamepad2,
    LoaderCircle,
    Package,
    Rocket,
    ShieldCheck,
    Sparkles,
    Store,
} from 'lucide-react';
import type { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Primer negocio', href: '/dashboard' }];

type Props = PageProps & {
    user: User;
    planFree?: Pick<
        Plan,
        'id' | 'nombre' | 'slug' | 'limite_productos' | 'limite_ventas_mensuales' | 'limite_usuarios'
    > | null;
};

interface BusinessForm {
    nombre_comercial: string;
    rubro: string;
    cuit_cuil: string;
    telefono: string;
    direccion: string;
}

export default function UsuarioSinNegocio() {
    const { user, planFree } = usePage<Props>().props;
    const { data, setData, post, processing, errors } = useForm<BusinessForm>({
        nombre_comercial: '',
        rubro: '',
        cuit_cuil: '',
        telefono: '',
        direccion: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('negocios.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Creá tu primer negocio | Vendra" />

            <div className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden p-4 md:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(239,68,68,0.14),transparent_28%),radial-gradient(circle_at_85%_72%,rgba(139,92,246,0.12),transparent_30%)]" />

                <div className="relative mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <motion.section
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative overflow-hidden rounded-3xl border bg-card p-7 md:p-10"
                    >
                        <motion.div
                            animate={{ rotate: [0, 6, 0], scale: [1, 1.04, 1] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
                        />

                        <div className="relative z-10">
                            <Badge variant="outline" className="gap-2 bg-background/65">
                                <Gamepad2 className="h-3.5 w-3.5 text-primary" />
                                Configuración inicial
                            </Badge>
                            <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                                <Store className="h-8 w-8" />
                            </div>
                            <h1 className="mt-7 text-3xl font-semibold tracking-tight md:text-5xl">
                                Antes de empezar, creá tu <span className="text-primary">primer negocio</span>
                            </h1>
                            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                                Tu cuenta es el acceso a Vendra. El negocio es el espacio donde vivirán tus productos, clientes, ventas y reportes: como crear tu primer personaje antes de entrar al juego.
                            </p>

                            <div className="mt-8 space-y-4">
                                {[
                                    { icon: Rocket, text: 'Se activa inmediatamente con el Plan Free.' },
                                    { icon: Package, text: `Podés comenzar con hasta ${planFree?.limite_productos ?? 50} productos.` },
                                    { icon: ShieldCheck, text: 'Tus datos quedan aislados de cualquier otro comercio.' },
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.text}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + index * 0.08 }}
                                        className="flex items-center gap-3 rounded-2xl border bg-background/55 p-4"
                                    >
                                        <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 }}
                    >
                        <Card className="overflow-hidden rounded-3xl">
                            <CardContent className="p-0">
                                <div className="border-b bg-muted/25 p-6 md:p-8">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Hola, {user.nombre}</p>
                                            <h2 className="mt-1 text-2xl font-semibold">Dale identidad a tu negocio</h2>
                                        </div>
                                        <Badge className="w-fit gap-2">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            {planFree?.nombre ?? 'Plan Gratuito'} incluido
                                        </Badge>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="p-6 md:p-8">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <Label htmlFor="nombre_comercial">Nombre comercial</Label>
                                            <Input
                                                id="nombre_comercial"
                                                value={data.nombre_comercial}
                                                onChange={(event) => setData('nombre_comercial', event.target.value)}
                                                placeholder="Ej.: Vendra Store"
                                                className="mt-2 h-11"
                                                autoFocus
                                                disabled={processing}
                                            />
                                            <InputError message={errors.nombre_comercial} className="mt-2" />
                                        </div>

                                        <div>
                                            <Label htmlFor="rubro">Rubro</Label>
                                            <Input
                                                id="rubro"
                                                value={data.rubro}
                                                onChange={(event) => setData('rubro', event.target.value)}
                                                placeholder="Indumentaria, tecnología..."
                                                className="mt-2 h-11"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.rubro} className="mt-2" />
                                        </div>

                                        <div>
                                            <Label htmlFor="cuit_cuil">CUIT / CUIL</Label>
                                            <Input
                                                id="cuit_cuil"
                                                value={data.cuit_cuil}
                                                onChange={(event) => setData('cuit_cuil', event.target.value)}
                                                placeholder="Opcional"
                                                className="mt-2 h-11"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.cuit_cuil} className="mt-2" />
                                        </div>

                                        <div>
                                            <Label htmlFor="telefono">Teléfono</Label>
                                            <Input
                                                id="telefono"
                                                value={data.telefono}
                                                onChange={(event) => setData('telefono', event.target.value)}
                                                placeholder="Opcional"
                                                className="mt-2 h-11"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.telefono} className="mt-2" />
                                        </div>

                                        <div>
                                            <Label htmlFor="direccion">Dirección</Label>
                                            <Input
                                                id="direccion"
                                                value={data.direccion}
                                                onChange={(event) => setData('direccion', event.target.value)}
                                                placeholder="Opcional"
                                                className="mt-2 h-11"
                                                disabled={processing}
                                            />
                                            <InputError message={errors.direccion} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                                        <div className="flex gap-3">
                                            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                            <p className="text-sm leading-6 text-muted-foreground">
                                                Al continuar, Vendra creará el negocio, te agregará como administrador técnico y lo dejará seleccionado para comenzar a trabajar.
                                            </p>
                                        </div>
                                    </div>

                                    <Button type="submit" size="lg" className="mt-7 w-full" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                Creando tu negocio...
                                            </>
                                        ) : (
                                            <>
                                                Crear y entrar
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.section>
                </div>
            </div>
        </AppLayout>
    );
}
