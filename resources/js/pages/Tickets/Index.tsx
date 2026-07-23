import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps, PaginatedData, TicketSoporte } from '@/types';
import { normalizePaginatedData } from '@/utils/pagination';
import { Head, Link, router, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Headset, Plus } from 'lucide-react';
import { useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tickets', href: '/tickets' }];

type Props = PageProps & {
    tickets: PaginatedData<TicketSoporte>;
    puede_crear_ticket: boolean;
    puede_gestionar_tickets: boolean;
};

const estadoLabel: Record<TicketSoporte['estado'], string> = {
    abierto: 'Abierto',
    en_progreso: 'En progreso',
    cerrado: 'Cerrado',
};

const prioridadLabel: Record<TicketSoporte['prioridad'], string> = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
};

export default function TicketsIndex() {
    const { tickets, puede_crear_ticket, puede_gestionar_tickets } = usePage<Props>().props;
    const normalizedTickets = normalizePaginatedData<TicketSoporte>(tickets);

    const columns: ColumnDef<TicketSoporte>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="font-mono text-xs">#{row.original.id}</span>,
        },
        {
            accessorKey: 'asunto',
            header: 'Asunto',
            cell: ({ row }) => (
                <div className="max-w-md">
                    <p className="font-medium">{row.original.asunto}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{row.original.descripcion}</p>
                </div>
            ),
        },
        ...(puede_gestionar_tickets
            ? [
                  {
                      id: 'usuario',
                      header: 'Usuario',
                      cell: ({ row }: { row: { original: TicketSoporte } }) =>
                          row.original.usuario
                              ? `${row.original.usuario.nombre} ${row.original.usuario.apellido}`
                              : 'Cuenta no disponible',
                  } satisfies ColumnDef<TicketSoporte>,
              ]
            : []),
        {
            accessorKey: 'prioridad',
            header: 'Prioridad',
            cell: ({ row }) => (
                <Badge variant={row.original.prioridad === 'alta' ? 'destructive' : 'secondary'}>
                    {prioridadLabel[row.original.prioridad]}
                </Badge>
            ),
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.estado === 'abierto'
                            ? 'open'
                            : row.original.estado === 'en_progreso'
                              ? 'progress'
                              : 'closed'
                    }
                >
                    {estadoLabel[row.original.estado]}
                </Badge>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Creado',
            cell: ({ row }) => new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(row.original.created_at)),
        },
    ];

    const handleSearch = useCallback((searchTerm: string) => {
        router.get(
            route('tickets.index'),
            { search: searchTerm },
            { preserveState: true, preserveScroll: true, only: ['tickets'] },
        );
    }, []);

    const handlePageChange = useCallback((url: string | null) => {
        if (url) {
            router.get(url, undefined, { preserveState: true, preserveScroll: true, only: ['tickets'] });
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tickets" />
            <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Headset className="size-6 text-primary" />
                            <h1 className="text-2xl font-semibold tracking-tight">Centro de ayuda</h1>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {puede_gestionar_tickets
                                ? 'Revisá las solicitudes enviadas por los usuarios de Vendra.'
                                : 'Consultá tus incidencias y contactá al equipo de soporte.'}
                        </p>
                    </div>
                    {puede_crear_ticket && (
                        <Button asChild>
                            <Link href={route('tickets.create')}>
                                <Plus className="mr-2 size-4" />
                                Nuevo ticket
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Solicitudes registradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={normalizedTickets.data}
                            pagination={{
                                from: normalizedTickets.from ?? 0,
                                to: normalizedTickets.to ?? 0,
                                total: normalizedTickets.total,
                                links: normalizedTickets.links,
                                onPageChange: handlePageChange,
                            }}
                            onSearch={handleSearch}
                            searchPlaceholder="Buscar por asunto, estado, prioridad o usuario..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
