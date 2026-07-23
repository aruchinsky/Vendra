import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PrioridadTicket } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Send } from 'lucide-react';
import type { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tickets', href: '/tickets' },
    { title: 'Nuevo ticket', href: '/tickets/create' },
];

interface TicketForm {
    asunto: string;
    descripcion: string;
    prioridad: PrioridadTicket;
}

export default function CreateTicket() {
    const { data, setData, post, processing, errors } = useForm<TicketForm>({
        asunto: '',
        descripcion: '',
        prioridad: 'baja',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('tickets.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo ticket" />
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 p-4 md:p-6">
                <Button asChild variant="ghost" className="w-fit">
                    <Link href={route('tickets.index')}>
                        <ArrowLeft className="mr-2 size-4" />
                        Volver a tickets
                    </Link>
                </Button>

                <Card className="overflow-hidden rounded-3xl">
                    <CardHeader className="border-b bg-muted/20 p-6 md:p-8">
                        <CardTitle className="text-2xl">¿Cómo podemos ayudarte?</CardTitle>
                        <CardDescription>
                            Describí el inconveniente con el mayor detalle posible para que podamos orientarte mejor.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <Label htmlFor="asunto">Asunto</Label>
                                <Input
                                    id="asunto"
                                    value={data.asunto}
                                    onChange={(event) => setData('asunto', event.target.value)}
                                    placeholder="Ej.: No puedo registrar una venta"
                                    className="mt-2"
                                    autoFocus
                                />
                                <InputError message={errors.asunto} className="mt-2" />
                            </div>

                            <div>
                                <Label htmlFor="prioridad">Prioridad</Label>
                                <Select value={data.prioridad} onValueChange={(value) => setData('prioridad', value as PrioridadTicket)}>
                                    <SelectTrigger id="prioridad" className="mt-2 w-full">
                                        <SelectValue placeholder="Seleccionar prioridad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="baja">Baja</SelectItem>
                                        <SelectItem value="media">Media</SelectItem>
                                        <SelectItem value="alta">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.prioridad} className="mt-2" />
                            </div>

                            <div>
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(event) => setData('descripcion', event.target.value)}
                                    placeholder="Contanos qué estabas haciendo, qué ocurrió y qué mensaje viste."
                                    className="mt-2 min-h-40"
                                />
                                <InputError message={errors.descripcion} className="mt-2" />
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={processing}>
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 size-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 size-4" />
                                        Enviar ticket
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
