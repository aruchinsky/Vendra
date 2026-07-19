import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { useState, type FormEventHandler } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const registerRouteExists = route().has('register');

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('login'), {
            preserveScroll: true,
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            description="Ingresá a tu cuenta para continuar gestionando tus negocios en Vendra."
        >
            <Head title="Iniciar sesión" />

            {status && (
                <div className="mb-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder="tuemail@ejemplo.com"
                            className="h-11 pl-10"
                            disabled={processing}
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="password">Contraseña</Label>
                        {canResetPassword && route().has('password.request') && (
                            <TextLink href={route('password.request')} className="text-xs" tabIndex={5}>
                                ¿Olvidaste tu contraseña?
                            </TextLink>
                        )}
                    </div>

                    <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder="Ingresá tu contraseña"
                            className="h-11 px-10"
                            disabled={processing}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            tabIndex={3}
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center gap-3 rounded-xl border bg-muted/25 px-3 py-2.5">
                    <Checkbox
                        id="remember"
                        name="remember"
                        checked={data.remember}
                        onCheckedChange={(checked) => setData('remember', checked === true)}
                        tabIndex={4}
                    />
                    <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                        Mantener mi sesión iniciada
                    </Label>
                </div>

                <Button type="submit" className="mt-1 h-11 w-full" tabIndex={5} disabled={processing}>
                    {processing ? (
                        <>
                            <LoaderCircle className="size-4 animate-spin" />
                            Ingresando...
                        </>
                    ) : (
                        'Ingresar a Vendra'
                    )}
                </Button>

                {registerRouteExists && (
                    <div className="border-t pt-5 text-center text-sm text-muted-foreground">
                        ¿Todavía no tenés una cuenta?{' '}
                        <TextLink href={route('register')} tabIndex={6}>
                            Crear cuenta gratis
                        </TextLink>
                    </div>
                )}
            </form>
        </AuthLayout>
    );
}
