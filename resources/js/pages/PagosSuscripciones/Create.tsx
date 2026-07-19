import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type {
    BreadcrumbItem,
    MetodoPagoSuscripcion,
    Negocio,
    Plan,
} from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pagos de suscripciones', href: '/pagos-suscripciones' },
    { title: 'Registrar', href: '' },
];

interface Props {
    negocios: Negocio[];
    planes: Plan[];
}

export default function Create() {
    const { negocios, planes } = usePage<Props>().props;
    const { data, setData, post, processing, errors } = useForm({
        negocio_id: negocios[0]?.id ?? 0,
        plan_id: planes[0]?.id ?? 0,
        monto: '',
        moneda: 'ARS',
        periodo_inicio: '',
        periodo_fin: '',
        metodo_pago: 'transferencia' as MetodoPagoSuscripcion,
        referencia_pago: '',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post(route('pagos-suscripciones.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registrar pago de suscripción" />
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Registrar pago de suscripción</h1>
                    <p className="text-muted-foreground text-sm">
                        El cambio de plan se aplicará únicamente cuando un administrador global apruebe el pago.
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>Datos del pago</CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="negocio_id">Negocio</Label>
                                <Select
                                    value={data.negocio_id ? String(data.negocio_id) : ''}
                                    onValueChange={(value) => setData('negocio_id', Number(value))}
                                    disabled={processing || negocios.length === 0}
                                >
                                    <SelectTrigger id="negocio_id">
                                        <SelectValue placeholder="Seleccionar negocio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {negocios.map((negocio) => (
                                            <SelectItem key={negocio.id} value={String(negocio.id)}>
                                                {negocio.nombre_comercial}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.negocio_id && <p className="text-sm text-red-500">{errors.negocio_id}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="plan_id">Plan solicitado</Label>
                                <Select
                                    value={data.plan_id ? String(data.plan_id) : ''}
                                    onValueChange={(value) => setData('plan_id', Number(value))}
                                    disabled={processing || planes.length === 0}
                                >
                                    <SelectTrigger id="plan_id">
                                        <SelectValue placeholder="Seleccionar plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {planes.map((plan) => (
                                            <SelectItem key={plan.id} value={String(plan.id)}>
                                                {plan.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.plan_id && <p className="text-sm text-red-500">{errors.plan_id}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="monto">Monto</Label>
                                <Input
                                    id="monto"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.monto}
                                    onChange={(event) => setData('monto', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.monto && <p className="text-sm text-red-500">{errors.monto}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="moneda">Moneda</Label>
                                <Input
                                    id="moneda"
                                    maxLength={3}
                                    value={data.moneda}
                                    onChange={(event) => setData('moneda', event.target.value.toUpperCase())}
                                    disabled={processing}
                                />
                                {errors.moneda && <p className="text-sm text-red-500">{errors.moneda}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="periodo_inicio">Inicio del período</Label>
                                <Input
                                    id="periodo_inicio"
                                    type="date"
                                    value={data.periodo_inicio}
                                    onChange={(event) => setData('periodo_inicio', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.periodo_inicio && (
                                    <p className="text-sm text-red-500">{errors.periodo_inicio}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="periodo_fin">Fin del período</Label>
                                <Input
                                    id="periodo_fin"
                                    type="date"
                                    value={data.periodo_fin}
                                    onChange={(event) => setData('periodo_fin', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.periodo_fin && <p className="text-sm text-red-500">{errors.periodo_fin}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="metodo_pago">Método de pago</Label>
                                <Select
                                    value={data.metodo_pago}
                                    onValueChange={(value) => setData('metodo_pago', value as MetodoPagoSuscripcion)}
                                    disabled={processing}
                                >
                                    <SelectTrigger id="metodo_pago">
                                        <SelectValue placeholder="Seleccionar método" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                                        <SelectItem value="transferencia">Transferencia</SelectItem>
                                        <SelectItem value="efectivo">Efectivo</SelectItem>
                                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                        <SelectItem value="otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.metodo_pago && <p className="text-sm text-red-500">{errors.metodo_pago}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="referencia_pago">Referencia o comprobante</Label>
                                <Input
                                    id="referencia_pago"
                                    value={data.referencia_pago}
                                    onChange={(event) => setData('referencia_pago', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.referencia_pago && (
                                    <p className="text-sm text-red-500">{errors.referencia_pago}</p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(route('pagos-suscripciones.index'))}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || negocios.length === 0 || planes.length === 0}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...
                                    </>
                                ) : (
                                    'Registrar pago'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
