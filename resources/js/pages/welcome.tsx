import { Head, Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ShoppingBag, Store, ArrowRight, ShieldCheck, Zap, Moon, Sun } from 'lucide-react'
import { type SharedData } from '@/types'
import { useEffect, useState } from 'react'
import AppLogo from '@/components/app-logo'

export default function Welcome() {
  const { auth } = usePage<SharedData>().props
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  const toggleTheme = () => {
    const root = document.documentElement
    root.classList.toggle('dark')
    setDarkMode(root.classList.contains('dark'))
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light')
  }

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark')
      setDarkMode(false)
    }
  }, [])

  return (
    <>
      <Head title="Vendra | Sistema de gestión para emprendedores" />

      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">

        {/* ---------- NAVBAR ---------- */}
        <header className="w-full border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto flex max-w-7xl items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <AppLogo />
              <h1 className="text-xl font-semibold tracking-tight text-primary">Vendra</h1>
            </div>

            <nav className="flex items-center gap-4 text-sm">
              <Link href="#features" className="hover:text-primary transition-colors">
                Características
              </Link>
              <Link href="#planes" className="hover:text-primary transition-colors">
                Planes
              </Link>
              <Link href="#contacto" className="hover:text-primary transition-colors">
                Contacto
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-border hover:bg-muted transition"
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="ml-4 rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-semibold shadow hover:opacity-90 transition"
                >
                  Ir al panel
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="px-4 py-2 text-sm hover:text-primary transition"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href={route('register')}
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-semibold shadow hover:opacity-90 transition"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* ---------- HERO SECTION ---------- */}
        <section className="flex flex-1 flex-col-reverse lg:flex-row items-center justify-center px-6 lg:px-20 py-12 lg:py-24 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Gestioná tu negocio{' '}
              <span className="text-primary">más fácil</span> que nunca
            </h2>
            <p className="text-base text-muted-foreground max-w-lg">
              Vendra es el sistema de gestión más intuitivo para emprendedores y pequeños comercios. 
              Administrá tus productos, clientes y ventas desde un solo lugar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={route('register')}
                className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-primary-foreground font-semibold shadow hover:opacity-90 transition"
              >
                Probar gratis
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#features"
                className="flex items-center gap-2 rounded-md border border-border px-5 py-2 text-sm font-medium hover:text-primary hover:border-primary transition"
              >
                Ver características
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-center"
          >
            <img
              src="/images/dashboard-preview.png"
              alt="Dashboard de Vendra"
              className="w-full max-w-md rounded-xl shadow-lg dark:shadow-[0_0_20px_rgba(229,57,53,0.25)]"
            />
          </motion.div>
        </section>

        {/* ---------- FEATURES ---------- */}
        <section id="features" className="py-16 bg-card border-t border-border">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-12">Todo lo que necesitás para vender más</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Store,
                  title: 'Gestión de productos',
                  text: 'Cargá tus productos con fotos, precios, categorías y stock.',
                },
                {
                  icon: ShoppingBag,
                  title: 'Ventas rápidas',
                  text: 'Registrá ventas en segundos y generá comprobantes al instante.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Seguridad y respaldo',
                  text: 'Tu información siempre protegida y disponible en la nube.',
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl bg-card p-8 shadow-sm hover:shadow-md border border-border transition-colors"
                >
                  <f.icon className="mx-auto mb-4 text-primary" size={36} />
                  <h4 className="font-semibold text-lg mb-2">{f.title}</h4>
                  <p className="text-sm text-muted-foreground">{f.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- PLANES ---------- */}
        <section id="planes" className="py-20 bg-background text-center">
          <h3 className="text-3xl font-bold mb-12">Elegí tu plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {[
              {
                name: 'Free',
                price: 'Gratis',
                features: ['Hasta 50 productos', 'Soporte por correo', 'Reportes básicos'],
                highlight: false,
              },
              {
                name: 'Premium',
                price: '$3999/mes',
                features: ['Productos ilimitados', 'Reportes avanzados', 'Atención prioritaria'],
                highlight: true,
              },
              {
                name: 'Empresarial',
                price: 'A medida',
                features: ['Soporte personalizado', 'Integraciones avanzadas', 'Equipo dedicado'],
                highlight: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`rounded-xl border p-8 transition-colors ${
                  plan.highlight
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                }`}
              >
                <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
                <p className="text-2xl font-bold text-primary mb-4">{plan.price}</p>
                <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center justify-center gap-2">
                      <Zap size={14} className="text-primary" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={route('register')}
                  className={`inline-block px-5 py-2 rounded-md font-semibold transition ${
                    plan.highlight
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'border border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  Empezar
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------- FOOTER ---------- */}
        <footer
          id="contacto"
          className="border-t border-border py-8 text-center text-sm text-muted-foreground"
        >
          <p>© {new Date().getFullYear()} Vendra — Desarrollado por AIR Sistemas</p>
        </footer>
      </div>
    </>
  )
}
