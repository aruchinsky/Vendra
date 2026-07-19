import AppLogo from '@/components/app-logo';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    Boxes,
    Check,
    ChevronRight,
    CircleDollarSign,
    Cloud,
    CreditCard,
    LineChart,
    Menu,
    Moon,
    PackageCheck,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Store,
    Sun,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.55, ease: 'easeOut' as const },
};

const heroHighlights = [
    { label: 'Sin instalación', icon: Cloud },
    { label: 'Plan gratuito', icon: Zap },
    { label: 'Datos organizados', icon: ShieldCheck },
];

const dashboardStats = [
    { label: 'Ventas del día', value: '$ 186.400', icon: CircleDollarSign },
    { label: 'Operaciones', value: '24', icon: ShoppingBag },
    { label: 'Productos', value: '138', icon: PackageCheck },
];

const features = [
    {
        icon: ShoppingBag,
        title: 'Ventas simples y rápidas',
        description: 'Registrá operaciones en pocos pasos y mantené cada movimiento organizado desde un mismo lugar.',
    },
    {
        icon: Boxes,
        title: 'Productos y stock',
        description: 'Controlá productos, categorías, precios y existencias con una experiencia clara y sin complicaciones.',
    },
    {
        icon: Users,
        title: 'Clientes siempre a mano',
        description: 'Centralizá la información de tus clientes y consultá su historial cuando lo necesites.',
    },
    {
        icon: LineChart,
        title: 'Información para decidir',
        description: 'Visualizá el rendimiento de tu negocio con indicadores claros y reportes fáciles de comprender.',
    },
    {
        icon: ShieldCheck,
        title: 'Datos protegidos',
        description: 'Cada negocio trabaja dentro de su propio espacio, con información separada y accesos controlados.',
    },
    {
        icon: Cloud,
        title: 'Disponible donde estés',
        description: 'Accedé desde computadora, tablet o celular y continuá trabajando con la misma información.',
    },
];

const plans = [
    {
        name: 'Free',
        eyebrow: 'Para comenzar',
        price: 'Gratis',
        description: 'Las herramientas esenciales para ordenar y profesionalizar tu negocio desde el primer día.',
        features: ['Hasta 50 productos', 'Registro de ventas', 'Gestión de clientes', 'Control de stock', 'Reportes básicos'],
        featured: false,
    },
    {
        name: 'Premium',
        eyebrow: 'Para crecer',
        price: 'Próximamente',
        description: 'Más capacidad, analítica avanzada y herramientas colaborativas para negocios en expansión.',
        features: ['Productos sin límite', 'Más ventas mensuales', 'Reportes avanzados', 'Usuarios adicionales', 'Atención prioritaria'],
        featured: true,
    },
    {
        name: 'A medida',
        eyebrow: 'Para necesidades especiales',
        price: 'Cotización',
        description: 'Una adaptación personalizada de Vendra basada en el relevamiento real de cada organización.',
        features: ['Relevamiento funcional', 'Adaptaciones específicas', 'Integraciones personalizadas', 'Acompañamiento técnico', 'Presupuesto individual'],
        featured: false,
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const registerRouteExists = useMemo(() => route().has('register'), []);
    const isAuthenticated = Boolean(auth?.user);

    const primaryHref = isAuthenticated
        ? route('dashboard')
        : registerRouteExists
          ? route('register')
          : route('login');

    const primaryLabel = isAuthenticated
        ? 'Ir a mi panel'
        : registerRouteExists
          ? 'Crear cuenta gratis'
          : 'Ingresar a Vendra';

    useEffect(() => {
        const root = document.documentElement;
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        root.classList.toggle('dark', shouldUseDark);
        setDarkMode(shouldUseDark);
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        const nextDarkMode = !root.classList.contains('dark');

        root.classList.toggle('dark', nextDarkMode);
        localStorage.setItem('theme', nextDarkMode ? 'dark' : 'light');
        setDarkMode(nextDarkMode);
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
            <Head title="Vendra | Tu negocio, más simple que nunca">
                <meta
                    name="description"
                    content="Vendra es una plataforma de gestión de ventas para emprendedores y pequeños comercios. Administrá productos, clientes, ventas y stock desde un solo lugar."
                />
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
                <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] overflow-hidden">
                    <div className="absolute left-1/2 top-[-320px] h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
                    <div className="absolute right-[-180px] top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute left-[-180px] top-80 h-80 w-80 rounded-full bg-muted blur-3xl" />
                </div>

                <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
                    <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
                        <Link href={route('home')} className="flex items-center gap-3" aria-label="Inicio de Vendra">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                                <AppLogo />
                            </div>
                            <div className="leading-none">
                                <span className="block text-lg font-semibold tracking-tight">Vendra</span>
                                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">By AIR Sistemas</span>
                            </div>
                        </Link>

                        <nav className="hidden items-center gap-7 text-sm md:flex">
                            <a href="#soluciones" className="text-muted-foreground transition-colors hover:text-foreground">
                                Soluciones
                            </a>
                            <a href="#como-funciona" className="text-muted-foreground transition-colors hover:text-foreground">
                                Cómo funciona
                            </a>
                            <a href="#planes" className="text-muted-foreground transition-colors hover:text-foreground">
                                Planes
                            </a>
                            <a href="#contacto" className="text-muted-foreground transition-colors hover:text-foreground">
                                Contacto
                            </a>
                        </nav>

                        <div className="hidden items-center gap-2 md:flex">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/70 transition-colors hover:bg-muted"
                                aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
                                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
                            >
                                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>

                            {!isAuthenticated && (
                                <Link
                                    href={route('login')}
                                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Iniciar sesión
                                </Link>
                            )}

                            <Link
                                href={primaryHref}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95"
                            >
                                {isAuthenticated ? 'Ir al panel' : registerRouteExists ? 'Empezar gratis' : 'Ingresar'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/70"
                                aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
                            >
                                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen((current) => !current)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/70"
                                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-border bg-background px-5 py-5 md:hidden"
                        >
                            <nav className="flex flex-col gap-1">
                                {[
                                    ['Soluciones', '#soluciones'],
                                    ['Cómo funciona', '#como-funciona'],
                                    ['Planes', '#planes'],
                                    ['Contacto', '#contacto'],
                                ].map(([label, href]) => (
                                    <a
                                        key={href}
                                        href={href}
                                        onClick={closeMobileMenu}
                                        className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                        {label}
                                    </a>
                                ))}
                                {!isAuthenticated && (
                                    <Link
                                        href={route('login')}
                                        onClick={closeMobileMenu}
                                        className="mt-2 rounded-lg border border-border px-3 py-3 text-center text-sm font-medium"
                                    >
                                        Iniciar sesión
                                    </Link>
                                )}
                                <Link
                                    href={primaryHref}
                                    onClick={closeMobileMenu}
                                    className="mt-2 rounded-lg bg-primary px-3 py-3 text-center text-sm font-semibold text-primary-foreground"
                                >
                                    {primaryLabel}
                                </Link>
                            </nav>
                        </motion.div>
                    )}
                </header>

                <main>
                    <section className="relative px-5 pb-20 pt-16 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
                        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.65, ease: 'easeOut' }}
                                className="max-w-3xl"
                            >
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Gestión comercial simple, moderna y accesible
                                </div>

                                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl lg:leading-[1.02]">
                                    El futuro de tus ventas,
                                    <span className="relative ml-2 inline-block text-primary">
                                        hoy.
                                        <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-primary/30" />
                                    </span>
                                </h1>

                                <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    Vendra reúne productos, clientes, ventas y stock en una experiencia clara para que puedas dedicar menos tiempo a administrar y más tiempo a hacer crecer tu negocio.
                                </p>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href={primaryHref}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20"
                                    >
                                        {primaryLabel}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <a
                                        href="#soluciones"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-muted"
                                    >
                                        Descubrir Vendra
                                        <ChevronRight className="h-4 w-4" />
                                    </a>
                                </div>

                                {!registerRouteExists && !isAuthenticated && (
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        El registro público estará disponible próximamente. Mientras tanto, podés ingresar con una cuenta habilitada.
                                    </p>
                                )}

                                <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                                    {heroHighlights.map(({ label, icon: Icon }) => (
                                        <div key={label} className="flex items-center gap-2 text-muted-foreground">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="h-3.5 w-3.5" />
                                            </span>
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30, scale: 0.98 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                                className="relative"
                            >
                                <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
                                <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl shadow-black/10 backdrop-blur dark:shadow-black/30">
                                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                                <Store className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Mi negocio</p>
                                                <p className="text-xs text-muted-foreground">Panel general</p>
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">En línea</div>
                                    </div>

                                    <div className="space-y-5 p-5 sm:p-6">
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            {dashboardStats.map(({ label, value, icon: Icon }) => (
                                                <div key={label} className="rounded-xl border border-border bg-background/70 p-4">
                                                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{label}</p>
                                                    <p className="mt-1 text-lg font-semibold">{value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="rounded-xl border border-border bg-background/70 p-4">
                                            <div className="mb-5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">Rendimiento semanal</p>
                                                    <p className="text-xs text-muted-foreground">Evolución de ventas</p>
                                                </div>
                                                <BarChart3 className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex h-36 items-end gap-2 sm:gap-3">
                                                {[38, 58, 46, 76, 62, 92, 82].map((height, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${height}%` }}
                                                        transition={{ duration: 0.55, delay: 0.35 + index * 0.07 }}
                                                        className="flex-1 rounded-t-md bg-primary/80"
                                                        title={`${height}%`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="mt-2 grid grid-cols-7 gap-2 text-center text-[10px] text-muted-foreground sm:gap-3">
                                                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                                                    <span key={day}>{day}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                    <CreditCard className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Venta registrada</p>
                                                    <p className="text-xs text-muted-foreground">Hace unos segundos</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                    <PackageCheck className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Stock actualizado</p>
                                                    <p className="text-xs text-muted-foreground">Automáticamente</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    <section className="border-y border-border bg-card/40 py-8">
                        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 text-center sm:grid-cols-4 lg:px-8">
                            {[
                                ['1 solo lugar', 'para gestionar'],
                                ['Free', 'para empezar'],
                                ['Multi-negocio', 'desde una cuenta'],
                                ['100% web', 'sin instalaciones'],
                            ].map(([value, label]) => (
                                <div key={value}>
                                    <p className="font-semibold text-foreground">{value}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="soluciones" className="px-5 py-20 sm:py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                                    <Zap className="h-3.5 w-3.5" />
                                    Todo conectado
                                </div>
                                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Las herramientas que necesitás, sin sumar complejidad
                                </h2>
                                <p className="mt-4 text-muted-foreground">
                                    Cada módulo de Vendra está pensado para acompañar el trabajo diario de emprendedores y pequeños comercios.
                                </p>
                            </motion.div>

                            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature, index) => (
                                    <motion.article
                                        key={feature.title}
                                        {...reveal}
                                        transition={{ duration: 0.5, delay: index * 0.06 }}
                                        whileHover={{ y: -5 }}
                                        className="group rounded-2xl border border-border bg-card/70 p-6 transition-colors hover:border-primary/35 hover:bg-card"
                                    >
                                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-transform group-hover:scale-105">
                                            <feature.icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                                    </motion.article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="como-funciona" className="border-y border-border bg-card/40 px-5 py-20 sm:py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <motion.div {...reveal} className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                                        <Store className="h-3.5 w-3.5" />
                                        Empezá en pocos pasos
                                    </div>
                                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                        Tu cuenta abre la puerta. Tu negocio define la experiencia.
                                    </h2>
                                    <p className="mt-4 leading-7 text-muted-foreground">
                                        En Vendra cada usuario puede trabajar con uno o varios negocios. Las herramientas disponibles dependen del plan del negocio activo.
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    {[
                                        {
                                            number: '01',
                                            title: 'Ingresá a tu cuenta',
                                            text: 'Accedé de forma segura desde cualquier dispositivo compatible.',
                                        },
                                        {
                                            number: '02',
                                            title: 'Creá o elegí tu negocio',
                                            text: 'Cada negocio conserva sus propios productos, clientes, ventas y configuración.',
                                        },
                                        {
                                            number: '03',
                                            title: 'Trabajá con las funciones de tu plan',
                                            text: 'Comenzá con Free y activá Premium cuando tu negocio necesite dar el siguiente paso.',
                                        },
                                    ].map((step) => (
                                        <div key={step.number} className="flex gap-4 rounded-2xl border border-border bg-background/80 p-5">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                                                {step.number}
                                            </span>
                                            <div>
                                                <h3 className="font-semibold">{step.title}</h3>
                                                <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    <section id="planes" className="px-5 py-20 sm:py-24 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                                    <CircleDollarSign className="h-3.5 w-3.5" />
                                    Planes flexibles
                                </div>
                                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Empezá sin costo y crecé a tu ritmo
                                </h2>
                                <p className="mt-4 text-muted-foreground">
                                    Una base simple para comenzar y más herramientas cuando tu negocio realmente las necesite.
                                </p>
                            </motion.div>

                            <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
                                {plans.map((plan, index) => (
                                    <motion.article
                                        key={plan.name}
                                        {...reveal}
                                        transition={{ duration: 0.5, delay: index * 0.08 }}
                                        className={`relative flex flex-col rounded-2xl border p-6 sm:p-7 ${
                                            plan.featured
                                                ? 'border-primary bg-primary/[0.06] shadow-xl shadow-primary/10'
                                                : 'border-border bg-card/70'
                                        }`}
                                    >
                                        {plan.featured && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                                                Recomendado
                                            </div>
                                        )}
                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{plan.eyebrow}</p>
                                        <h3 className="mt-3 text-2xl font-semibold">{plan.name}</h3>
                                        <p className="mt-2 text-3xl font-semibold text-primary">{plan.price}</p>
                                        <p className="mt-4 min-h-[72px] text-sm leading-6 text-muted-foreground">{plan.description}</p>

                                        <ul className="mt-6 flex-1 space-y-3">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2 text-sm">
                                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        <Check className="h-3 w-3" />
                                                    </span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            href={plan.name === 'A medida' ? '#contacto' : primaryHref}
                                            className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                                                plan.featured
                                                    ? 'bg-primary text-primary-foreground hover:-translate-y-0.5 hover:opacity-95'
                                                    : 'border border-border bg-background hover:border-primary/40 hover:bg-muted'
                                            }`}
                                        >
                                            {plan.name === 'A medida' ? 'Solicitar información' : plan.name === 'Free' ? primaryLabel : 'Conocer Premium'}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </motion.article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="contacto" className="px-5 pb-20 lg:px-8 lg:pb-24">
                        <motion.div
                            {...reveal}
                            className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-primary/20 bg-primary px-6 py-12 text-primary-foreground shadow-2xl shadow-primary/20 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14"
                        >
                            <div className="max-w-2xl">
                                <p className="text-sm font-medium text-primary-foreground/75">Vendra · By AIR Sistemas</p>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Tu negocio puede ser más simple desde hoy.
                                </h2>
                                <p className="mt-4 leading-7 text-primary-foreground/80">
                                    Organizá tu operación, mantené el control y construí una base sólida para crecer.
                                </p>
                            </div>
                            <Link
                                href={primaryHref}
                                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 lg:mt-0"
                            >
                                {primaryLabel}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    </section>
                </main>

                <footer className="border-t border-border bg-card/40">
                    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                                <AppLogo />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">Vendra</p>
                                <p className="text-xs">El futuro de tus ventas, hoy.</p>
                            </div>
                        </div>
                        <p>© {new Date().getFullYear()} AIR Sistemas. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
