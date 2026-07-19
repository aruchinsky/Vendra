import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, EstadoUsuario, PageProps, Role } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: '/users' },
    { title: 'Crear', href: '' },
];

type Props = PageProps & {
    roles: Role[];
};

export default function Create() {
    const { roles } = usePage<Props>().props;
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        domicilio: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        estado: 'activo' as EstadoUsuario,
        rol: 'usuario',
    });

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post(route('users.store'));
    };

    const handleCancel = () => {
        const hasChanges = Object.values(data).some(
            (value) => value !== '' && value !== 'activo' && value !== 'usuario',
        );

        if (hasChanges && !confirm('¿Seguro que querés salir? Los cambios sin guardar se perderán.')) {
            return;
        }

        router.visit(route('users.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear usuario" />
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Crear usuario</h1>
                    <p className="text-muted-foreground text-sm">
                        Esta pantalla crea una cuenta global. Los negocios se relacionan posteriormente mediante sus membresías.
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>Información del usuario</CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(event) => setData('nombre', event.target.value)}
                                    disabled={processing}
                                    autoFocus
                                />
                                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="apellido">Apellido</Label>
                                <Input
                                    id="apellido"
                                    value={data.apellido}
                                    onChange={(event) => setData('apellido', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="dni">DNI</Label>
                                <Input
                                    id="dni"
                                    value={data.dni}
                                    onChange={(event) => setData('dni', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="username">Nombre de usuario</Label>
                                <Input
                                    id="username"
                                    value={data.username}
                                    onChange={(event) => setData('username', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono}
                                    onChange={(event) => setData('telefono', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">
                                <Label htmlFor="domicilio">Domicilio</Label>
                                <Input
                                    id="domicilio"
                                    value={data.domicilio}
                                    onChange={(event) => setData('domicilio', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.domicilio && <p className="text-sm text-red-500">{errors.domicilio}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(event) => setData('password_confirmation', event.target.value)}
                                    disabled={processing}
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="estado">Estado</Label>
                                <Select
                                    value={data.estado}
                                    onValueChange={(value) => setData('estado', value as EstadoUsuario)}
                                    disabled={processing}
                                >
                                    <SelectTrigger id="estado">
                                        <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="activo">Activo</SelectItem>
                                        <SelectItem value="inactivo">Inactivo</SelectItem>
                                        <SelectItem value="suspendido">Suspendido</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="rol">Rol global</Label>
                                <Select
                                    value={data.rol}
                                    onValueChange={(value) => setData('rol', value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger id="rol">
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.rol && <p className="text-sm text-red-500">{errors.rol}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                                    </>
                                ) : (
                                    'Guardar'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
