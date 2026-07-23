import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Negocio, PageProps, PaginatedData } from '@/types';
import { normalizePaginatedData } from '@/utils/pagination';
import { Head, Link, router, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2, LogIn, Plus, Users } from 'lucide-react';
import { useCallback, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Negocios', href: '/negocios' }];

type Props = PageProps & {
    negocios: PaginatedData<Negocio>;
};

export default function NegociosIndex() {
    const { negocios, auth } = usePage<Props>().props;
    const normalized = normalizePaginatedData<Negocio>(negocios);
    const [selectingId, setSelectingId] = useState<number | null>(null);

    const selectBusiness = (businessId: number) => {
        setSelectingId(businessId);
        router.post(
            route('dashboard.negocio.seleccionar', businessId),
            {},
            { onFinish: () => setSelectingId(null) },
        );
    };

    const columns: ColumnDef<Negocio>[] = [
        {
            accessorKey: 'nombre_comercial',
            header: 'Negocio',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="size-4" />
                    </span>
                    <div>
                        <p className="font-medium">{row.original.nombre_comercial}</p>
                        <p className="text-xs text-muted-foreground">{row.original.rubro || 'Rubro sin especificar'}</p>
                    </div>
                </div>
            ),
        },
        {
            id: 'plan',
            header: 'Plan',
            cell: ({ row }) => (
                <Badge variant={row.original.plan?.slug === 'premium' ? 'default' : 'secondary'}>
                    {row.original.plan?.nombre || 'Sin plan'}
                </Badge>
            ),
        },
        {
            id: 'usuarios',
            header: 'Usuarios activos',
            cell: ({ row }) => (
                <span className="inline-flex items-center gap-1.5 text-sm">
                    <Users className="size-4 text-muted-foreground" />
                    {row.original.usuarios_activos_count ?? 0}
                </span>
            ),
        },
        {
            accessorKey: 'activo',
            header: 'Estado',
            cell: ({ row }) => (
                <Badge variant={row.original.activo ? 'outline' : 'destructive'}>
                    {row.original.activo ? 'Activo' : 'Inactivo'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <Button
                    size="sm"
                    variant={auth?.negocio_activo?.id === row.original.id ? 'secondary' : 'default'}
                    onClick={() => selectBusiness(row.original.id)}
                    disabled={selectingId !== null || !row.original.activo}
                >
                    <LogIn className="mr-2 size-4" />
                    {selectingId === row.original.id
                        ? 'Ingresando...'
                        : auth?.negocio_activo?.id === row.original.id
                          ? 'Seleccionado'
                          : 'Gestionar'}
                </Button>
            ),
        },
    ];

    const handleSearch = useCallback((searchTerm: string) => {
        router.get(
            route('negocios.index'),
            { search: searchTerm },
            { preserveState: true, preserveScroll: true, only: ['negocios'] },
        );
    }, []);

    const handlePageChange = useCallback((url: string | null) => {
        if (url) {
            router.get(url, undefined, { preserveState: true, preserveScroll: true, only: ['negocios'] });
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Negocios" />
            <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {auth?.es_admin_global ? 'Negocios de Vendra' : 'Mis negocios'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Seleccioná el contexto comercial que querés gestionar.
                        </p>
                    </div>
                    {auth?.es_usuario_negocio && (
                        <Button asChild>
                            <Link href={route('negocios.create')}>
                                <Plus className="mr-2 size-4" />
                                Nuevo negocio
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Espacios comerciales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={normalized.data}
                            pagination={{
                                from: normalized.from ?? 0,
                                to: normalized.to ?? 0,
                                total: normalized.total,
                                links: normalized.links,
                                onPageChange: handlePageChange,
                            }}
                            onSearch={handleSearch}
                            searchPlaceholder="Buscar por nombre, CUIT o rubro..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
