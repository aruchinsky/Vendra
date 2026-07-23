import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps, Plan } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Building2, Check, LoaderCircle, Sparkles } from 'lucide-react';
import type { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Negocios', href: '/dashboard/negocios' },
    { title: 'Nuevo negocio', href: '/negocios/create' },
];

type Props = PageProps & {
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

export default function CreateBusiness() {
    const { planFree } = usePage<Props>().props;
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
            <Head title="Nuevo negocio" />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 p-4 md:p-6">
                <Button asChild variant="ghost" className="w-fit">
                    <Link href={route('dashboard.negocios')}>
                        <ArrowLeft className="mr-2 size-4" />
                        Volver a negocios
                    </Link>
                </Button>

                <Card className="overflow-hidden rounded-3xl">
                    <CardHeader className="border-b bg-muted/20 p-6 md:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                    <Building2 className="size-6" />
                                </div>
                                <CardTitle className="text-2xl">Crear otro espacio comercial</CardTitle>
                                <CardDescription className="mt-2 max-w-2xl">
                                    Cada negocio mantiene separados sus productos, clientes, ventas, miembros y suscripción.
                                </CardDescription>
                            </div>
                            <Badge className="gap-1.5">
                                <Sparkles className="size-3" />
                                {planFree?.nombre ?? 'Plan Gratuito'}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <Label htmlFor="nombre_comercial">Nombre comercial</Label>
                                    <Input
                                        id="nombre_comercial"
                                        value={data.nombre_comercial}
                                        onChange={(event) => setData('nombre_comercial', event.target.value)}
                                        placeholder="Ej.: Vendra Store"
                                        className="mt-2"
                                        autoFocus
                                    />
                                    <InputError message={errors.nombre_comercial} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="rubro">Rubro</Label>
                                    <Input
                                        id="rubro"
                                        value={data.rubro}
                                        onChange={(event) => setData('rubro', event.target.value)}
                                        placeholder="Tecnología, indumentaria..."
                                        className="mt-2"
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
                                        className="mt-2"
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
                                        className="mt-2"
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
                                        className="mt-2"
                                    />
                                    <InputError message={errors.direccion} className="mt-2" />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                                <div className="flex gap-3">
                                    <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                                    <p>
                                        Se creará con el Plan Gratuito y quedará seleccionado automáticamente como tu contexto de trabajo.
                                    </p>
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={processing}>
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 size-4 animate-spin" />
                                        Creando negocio...
                                    </>
                                ) : (
                                    'Crear y comenzar'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
