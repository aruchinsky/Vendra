import type { BreadcrumbItem, SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Mi perfil', href: '/settings/profile' }];

type ProfileForm = {
    nombre: string;
    apellido: string;
    username: string;
    email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        nombre: auth.user.nombre,
        apellido: auth.user.apellido,
        username: auth.user.username,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi perfil" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Información personal" description="Actualizá tus datos de identificación y acceso." />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input id="nombre" value={data.nombre} onChange={(event) => setData('nombre', event.target.value)} required />
                                <InputError message={errors.nombre} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="apellido">Apellido</Label>
                                <Input id="apellido" value={data.apellido} onChange={(event) => setData('apellido', event.target.value)} required />
                                <InputError message={errors.apellido} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Nombre de usuario</Label>
                            <Input id="username" value={data.username} onChange={(event) => setData('username', event.target.value)} required />
                            <InputError message={errors.username} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input id="email" type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} required />
                            <InputError message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="text-sm text-muted-foreground">
                                Tu correo todavía no fue verificado.{' '}
                                <Link href={route('verification.send')} method="post" as="button" className="underline underline-offset-4">
                                    Reenviar verificación
                                </Link>
                                {status === 'verification-link-sent' && (
                                    <p className="mt-2 font-medium text-emerald-600">Enviamos un nuevo enlace de verificación.</p>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Guardar cambios</Button>
                            <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                                <p className="text-sm text-muted-foreground">Guardado</p>
                            </Transition>
                        </div>
                    </form>

                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
