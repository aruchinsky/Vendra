import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps, PaginatedData, PagoSuscripcion } from '@/types';
import { normalizePaginatedData } from '@/utils/pagination';
import { Head, Link, router, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Check, Plus, X } from 'lucide-react';
import { useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pagos de suscripciones', href: '/pagos-suscripciones' },
];

interface Props extends PageProps {
    pagos_suscripciones: PaginatedData<PagoSuscripcion>;
    es_admin_global: boolean;
}

const formatMoney = (value: number, currency: string) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency,
    }).format(Number(value));

export default function Index() {
    const { pagos_suscripciones, es_admin_global } = usePage<Props>().props;
    const normalizedPayments = normalizePaginatedData<PagoSuscripcion>(pagos_suscripciones);

    const columns: ColumnDef<PagoSuscripcion>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            id: 'negocio',
            header: 'Negocio',
            cell: ({ row }) => row.original.negocio?.nombre_comercial ?? '-',
        },
        {
            id: 'plan',
            header: 'Plan solicitado',
            cell: ({ row }) => row.original.plan?.nombre ?? '-',
        },
        {
            id: 'importe',
            header: 'Importe',
            cell: ({ row }) => formatMoney(row.original.monto, row.original.moneda),
        },
        {
            id: 'periodo',
            header: 'Período',
            cell: ({ row }) => `${row.original.periodo_inicio} a ${row.original.periodo_fin}`,
        },
        {
            accessorKey: 'metodo_pago',
            header: 'Método',
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => (
                <span className="bg-muted rounded-md px-2 py-1 text-xs capitalize">
                    {row.original.estado}
                </span>
            ),
        },
        {
            accessorKey: 'referencia_pago',
            header: 'Referencia',
            cell: ({ row }) => row.original.referencia_pago ?? '-',
        },
    ];

    if (es_admin_global) {
        columns.push({
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const pago = row.original;

                if (pago.estado !== 'pendiente') {
                    return <span className="text-muted-foreground text-sm">Procesado</span>;
                }

                return (
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => router.patch(route('pagos-suscripciones.aprobar', pago.id), {})}
                        >
                            <Check className="mr-2 h-4 w-4" /> Aprobar
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => router.patch(route('pagos-suscripciones.rechazar', pago.id), {})}
                        >
                            <X className="mr-2 h-4 w-4" /> Rechazar
                        </Button>
                    </div>
                );
            },
        });
    }

    const handleSearch = useCallback((searchTerm: string) => {
        router.get(
            route('pagos-suscripciones.index'),
            { search: searchTerm },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['pagos_suscripciones'],
            },
        );
    }, []);

    const handlePageChange = useCallback((url: string | null) => {
        if (url) {
            router.get(url, undefined, {
                preserveState: true,
                preserveScroll: true,
                only: ['pagos_suscripciones'],
            });
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pagos de suscripciones" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Pagos de suscripciones</h1>
                        <p className="text-muted-foreground text-sm">
                            Historial de solicitudes de cambio o renovación de planes.
                        </p>
                    </div>
                    <Link href={route('pagos-suscripciones.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Registrar pago
                        </Button>
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={normalizedPayments.data}
                    pagination={{
                        from: normalizedPayments.from,
                        to: normalizedPayments.to,
                        total: normalizedPayments.total,
                        links: normalizedPayments.links,
                        onPageChange: handlePageChange,
                    }}
                    onSearch={handleSearch}
                    searchPlaceholder="Buscar por negocio, plan, estado o referencia..."
                />
            </div>
        </AppLayout>
    );
}
