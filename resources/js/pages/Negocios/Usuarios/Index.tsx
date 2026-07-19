import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type {
    BreadcrumbItem,
    Negocio,
    PageProps,
    PaginatedData,
    UserConNegocioPivot,
} from '@/types';
import { normalizePaginatedData } from '@/utils/pagination';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ShieldCheck, ShieldOff, UserPlus, UserRoundX } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';

interface Props extends PageProps {
    negocio: Negocio;
    usuarios: PaginatedData<UserConNegocioPivot>;
    usuarios_activos_count: number;
    limite_usuarios: number;
    puede_agregar_usuarios: boolean;
}

export default function Index() {
    const {
        negocio,
        usuarios,
        usuarios_activos_count,
        limite_usuarios,
        puede_agregar_usuarios,
    } = usePage<Props>().props;

    const normalizedUsers = normalizePaginatedData<UserConNegocioPivot>(usuarios);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        es_administrador: false,
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState<UserConNegocioPivot | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Negocios', href: '/negocios' },
        { title: negocio.nombre_comercial, href: route('negocios.index') },
        { title: 'Usuarios', href: route('negocios.usuarios.index', negocio.id) },
    ];

    const columns: ColumnDef<UserConNegocioPivot>[] = [
        {
            id: 'nombre_completo',
            header: 'Nombre completo',
            cell: ({ row }) => `${row.original.nombre} ${row.original.apellido}`,
        },
        {
            accessorKey: 'username',
            header: 'Usuario',
        },
        {
            accessorKey: 'email',
            header: 'Correo electrónico',
        },
        {
            id: 'tipo_acceso',
            header: 'Acceso',
            cell: ({ row }) => (
                <span className="bg-muted rounded-md px-2 py-1 text-xs">
                    {row.original.pivot?.es_administrador ? 'Administrador' : 'Miembro'}
                </span>
            ),
        },
        {
            id: 'estado_membresia',
            header: 'Estado',
            cell: ({ row }) => (
                <span className="bg-muted rounded-md px-2 py-1 text-xs">
                    {row.original.pivot?.activo ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const usuario = row.original;
                const esAdministrador = usuario.pivot?.es_administrador ?? false;
                const activo = usuario.pivot?.activo ?? false;

                return (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!activo}
                            onClick={() => {
                                router.put(
                                    route('negocios.usuarios.update', {
                                        negocio: negocio.id,
                                        user: usuario.id,
                                    }),
                                    {
                                        es_administrador: !esAdministrador,
                                        activo,
                                    },
                                    {
                                        preserveScroll: true,
                                    },
                                );
                            }}
                        >
                            {esAdministrador ? (
                                <ShieldOff className="mr-2 h-4 w-4" />
                            ) : (
                                <ShieldCheck className="mr-2 h-4 w-4" />
                            )}
                            {esAdministrador ? 'Quitar administración' : 'Hacer administrador'}
                        </Button>

                        {activo && (
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                    setUserToRemove(usuario);
                                    setDialogOpen(true);
                                }}
                            >
                                <UserRoundX className="mr-2 h-4 w-4" />
                                Quitar
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        post(route('negocios.usuarios.store', negocio.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleSearch = useCallback(
        (searchTerm: string) => {
            router.get(
                route('negocios.usuarios.index', negocio.id),
                { search: searchTerm },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['usuarios'],
                },
            );
        },
        [negocio.id],
    );

    const handlePageChange = useCallback((url: string | null) => {
        if (url) {
            router.get(url, undefined, {
                preserveState: true,
                preserveScroll: true,
                only: ['usuarios'],
            });
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Usuarios de ${negocio.nombre_comercial}`} />
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Usuarios de {negocio.nombre_comercial}</h1>
                    <p className="text-muted-foreground text-sm">
                        El plan {negocio.plan?.nombre ?? ''} permite {limite_usuarios} usuario(s). Actualmente hay {usuarios_activos_count} activo(s).
                    </p>
                </div>

                <Card>
                    <CardHeader>Agregar un usuario existente</CardHeader>
                    <CardContent>
                        {puede_agregar_usuarios ? (
                            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="email">Correo de la cuenta Vendra</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        placeholder="usuario@correo.com"
                                        disabled={processing}
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <label className="flex items-center gap-2 pb-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={data.es_administrador}
                                        onChange={(event) => setData('es_administrador', event.target.checked)}
                                        disabled={processing}
                                    />
                                    Administrador técnico
                                </label>

                                <Button type="submit" disabled={processing}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    {processing ? 'Agregando...' : 'Agregar usuario'}
                                </Button>
                            </form>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                El negocio alcanzó el límite de usuarios de su plan. Para incorporar más personas deberá ampliar su plan o desactivar una membresía existente.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <DataTable
                    columns={columns}
                    data={normalizedUsers.data}
                    pagination={{
                        from: normalizedUsers.from,
                        to: normalizedUsers.to,
                        total: normalizedUsers.total,
                        links: normalizedUsers.links,
                        onPageChange: handlePageChange,
                    }}
                    onSearch={handleSearch}
                    searchPlaceholder="Buscar usuario del negocio..."
                />

                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Quitar este usuario del negocio?</AlertDialogTitle>
                            <AlertDialogDescription>
                                {userToRemove
                                    ? `${userToRemove.nombre} ${userToRemove.apellido} perderá el acceso a ${negocio.nombre_comercial}. Su cuenta global no será eliminada.`
                                    : 'La cuenta perderá el acceso al negocio, pero no será eliminada.'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (userToRemove) {
                                        router.delete(
                                            route('negocios.usuarios.destroy', {
                                                negocio: negocio.id,
                                                user: userToRemove.id,
                                            }),
                                            {
                                                preserveScroll: true,
                                            },
                                        );
                                    }
                                }}
                            >
                                Quitar usuario
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
