import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    AtSign,
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Mail,
    UserRound,
} from 'lucide-react';
import { useState, type FormEventHandler } from 'react';

type RegisterForm = {
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        nombre: '',
        apellido: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('register'), {
            preserveScroll: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Creá tu cuenta en Vendra"
            description="Empezá gratis. Después de registrarte podrás crear tu primer negocio y administrarlo desde un solo lugar."
        >
            <Head title="Crear cuenta" />

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <div className="relative">
                            <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="nombre"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="given-name"
                                value={data.nombre}
                                onChange={(event) => setData('nombre', event.target.value)}
                                disabled={processing}
                                placeholder="Tu nombre"
                                className="h-11 pl-10"
                            />
                        </div>
                        <InputError message={errors.nombre} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input
                            id="apellido"
                            type="text"
                            required
                            tabIndex={2}
                            autoComplete="family-name"
                            value={data.apellido}
                            onChange={(event) => setData('apellido', event.target.value)}
                            disabled={processing}
                            placeholder="Tu apellido"
                            className="h-11"
                        />
                        <InputError message={errors.apellido} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Nombre de usuario</Label>
                    <div className="relative">
                        <AtSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="username"
                            type="text"
                            required
                            tabIndex={3}
                            autoComplete="username"
                            value={data.username}
                            onChange={(event) => setData('username', event.target.value)}
                            disabled={processing}
                            placeholder="ivanruchinsky"
                            className="h-11 pl-10"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Usá letras, números, guiones o guiones bajos.</p>
                    <InputError message={errors.username} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={4}
                            autoComplete="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            disabled={processing}
                            placeholder="tuemail@ejemplo.com"
                            className="h-11 pl-10"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            disabled={processing}
                            placeholder="Creá una contraseña segura"
                            className="h-11 px-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            tabIndex={6}
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                    <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password_confirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            required
                            tabIndex={7}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(event) => setData('password_confirmation', event.target.value)}
                            disabled={processing}
                            placeholder="Repetí tu contraseña"
                            className="h-11 px-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                            aria-label={showPasswordConfirmation ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            tabIndex={8}
                        >
                            {showPasswordConfirmation ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="rounded-2xl border bg-muted/30 px-4 py-3 text-xs leading-5 text-muted-foreground">
                    Al crear tu cuenta aceptás utilizar Vendra de manera responsable. Tu primer negocio comenzará con el plan Free.
                </div>

                <Button type="submit" className="h-11 w-full" tabIndex={9} disabled={processing}>
                    {processing ? (
                        <>
                            <LoaderCircle className="size-4 animate-spin" />
                            Creando cuenta...
                        </>
                    ) : (
                        'Crear mi cuenta gratis'
                    )}
                </Button>

                <div className="border-t pt-5 text-center text-sm text-muted-foreground">
                    ¿Ya tenés una cuenta?{' '}
                    <TextLink href={route('login')} tabIndex={10}>
                        Iniciar sesión
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
