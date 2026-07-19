import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    PackageCheck,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Users,
} from 'lucide-react';
import type { PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

const benefits = [
    {
        icon: ShoppingCart,
        title: 'Ventas en un solo lugar',
        description: 'Registrá operaciones, clientes y comprobantes sin perder tiempo.',
    },
    {
        icon: PackageCheck,
        title: 'Stock siempre bajo control',
        description: 'Conocé tus existencias y movimientos con información actualizada.',
    },
    {
        icon: BarChart3,
        title: 'Decisiones con claridad',
        description: 'Visualizá el rendimiento del negocio con reportes simples y útiles.',
    },
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <main className="relative min-h-svh overflow-hidden bg-background text-foreground lg:grid lg:grid-cols-[1.08fr_0.92fr]">
            {/* Panel comercial de marca */}
            <section className="relative hidden min-h-svh overflow-hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col xl:p-14">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-36 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/25 blur-[120px]" />
                    <div className="absolute -bottom-52 right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-red-500/20 blur-[130px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <Link href={route('home')} className="group flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] p-1.5 shadow-2xl shadow-primary/10 backdrop-blur-xl transition group-hover:border-primary/50 group-hover:bg-white/[0.12]">
                            <AppLogoIcon className="size-full" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-semibold tracking-tight">Vendra</span>
                                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-200">
                                    SaaS
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400">By AIR Sistemas</p>
                        </div>
                    </Link>

                    <Link
                        href={route('home')}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft className="size-4" />
                        Volver al inicio
                    </Link>
                </div>

                <div className="relative z-10 my-auto grid gap-10 xl:grid-cols-[1fr_0.9fr] xl:items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        className="max-w-xl"
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-red-100">
                            <Sparkles className="size-3.5" />
                            Tu negocio, más simple que nunca
                        </div>

                        <h1 className="text-4xl font-semibold tracking-tight text-balance xl:text-5xl">
                            Convertí cada venta en una decisión más inteligente.
                        </h1>
                        <p className="mt-5 max-w-lg text-base leading-7 text-zinc-400">
                            Vendra reúne productos, clientes, ventas y reportes en una experiencia moderna creada para emprendedores y pequeños comercios.
                        </p>

                        <div className="mt-8 space-y-5">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.18 + index * 0.1, duration: 0.45 }}
                                    className="flex gap-4"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-red-300">
                                        <benefit.icon className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-medium text-zinc-100">{benefit.title}</h2>
                                        <p className="mt-1 text-sm leading-6 text-zinc-400">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Mini dashboard decorativo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 22 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.7, ease: 'easeOut' }}
                        className="relative hidden xl:block"
                    >
                        <div className="absolute -inset-8 rounded-[3rem] bg-primary/10 blur-3xl" />
                        <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.075] p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-xs text-zinc-500">Negocio activo</p>
                                    <p className="mt-1 font-medium text-zinc-100">Vendra Store</p>
                                </div>
                                <span className="rounded-full border border-primary/30 bg-primary/[0.15] px-2.5 py-1 text-[11px] font-medium text-red-200">
                                    Premium
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                                    <p className="text-xs text-zinc-500">Ventas del mes</p>
                                    <p className="mt-2 text-xl font-semibold">$ 846.520</p>
                                    <p className="mt-1 text-xs text-emerald-400">+18,4% este mes</p>
                                </div>
                                <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                                    <p className="text-xs text-zinc-500">Productos</p>
                                    <p className="mt-2 text-xl font-semibold">248</p>
                                    <p className="mt-1 text-xs text-zinc-500">12 con stock bajo</p>
                                </div>
                            </div>

                            <div className="mt-3 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-zinc-500">Actividad semanal</p>
                                        <p className="mt-1 text-sm font-medium text-zinc-200">Operaciones registradas</p>
                                    </div>
                                    <BarChart3 className="size-5 text-red-300" />
                                </div>
                                <div className="mt-5 flex h-24 items-end gap-2">
                                    {[42, 58, 48, 76, 64, 92, 78].map((height, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: 0.55 + index * 0.06, duration: 0.45 }}
                                            className="flex-1 rounded-t-md bg-gradient-to-t from-primary/40 to-red-300"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                                {[
                                    [ShieldCheck, 'Seguro'],
                                    [Users, 'Multiusuario'],
                                    [CheckCircle2, 'En línea'],
                                ].map(([Icon, label]) => {
                                    const FeatureIcon = Icon as typeof ShieldCheck;
                                    return (
                                        <div key={label as string} className="rounded-xl border border-white/[0.08] bg-white/[0.045] p-3">
                                            <FeatureIcon className="mx-auto size-4 text-red-300" />
                                            <p className="mt-2 text-[11px] text-zinc-400">{label as string}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-zinc-500">
                    <span>© {new Date().getFullYear()} Vendra</span>
                    <span>El futuro de tus ventas, hoy.</span>
                </div>
            </section>

            {/* Panel del formulario */}
            <section className="relative flex min-h-svh items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
                <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
                    <div className="absolute -right-28 -top-28 size-72 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-32 -left-24 size-72 rounded-full bg-red-500/[0.08] blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="mb-8 flex items-center justify-between lg:hidden">
                        <Link href={route('home')} className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl border bg-card p-1.5 shadow-sm">
                                <AppLogoIcon className="size-full" />
                            </div>
                            <div>
                                <p className="font-semibold tracking-tight">Vendra</p>
                                <p className="text-xs text-muted-foreground">By AIR Sistemas</p>
                            </div>
                        </Link>
                        <Link
                            href={route('home')}
                            aria-label="Volver al inicio"
                            className="flex size-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <div className="mb-7">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-muted/45 px-3 py-1 text-xs font-medium text-muted-foreground">
                                <ShieldCheck className="size-3.5 text-primary" />
                                Acceso protegido
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
                        </div>

                        <div className="rounded-3xl border bg-card/85 p-5 shadow-[0_20px_70px_-35px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
                            {children}
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
