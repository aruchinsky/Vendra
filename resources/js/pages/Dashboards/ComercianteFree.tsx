import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  Zap,
  Lock,
  Crown,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type pageProps } from "@/types"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"

export default function ComercianteFree() {
  const { auth, stats = {} } = usePage<pageProps & { stats: any }>().props
  const user = auth?.user ?? null
  const negocio = stats.negocio ?? "Tu negocio"

  const metricas = [
    { label: "Productos", value: stats.productos ?? 0, icon: Package },
    { label: "Ventas", value: stats.ventas ?? 0, icon: ShoppingBag },
    { label: "Clientes", value: stats.clientes ?? 0, icon: Users },
    {
      label: "Ingresos",
      value: `$${(stats.ingresos ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
  ]

  return (
    <AppLayout>
      <Head title="Panel Comerciante Free" />

      {/* ---------- HERO ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-6 shadow-sm border border-border mx-2 sm:mx-4 md:mx-8"
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold text-foreground">
            ¡Hola, <span className="text-primary">{user?.nombre}</span>!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bienvenido al panel de tu negocio <strong>{negocio}</strong>
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock size={14} className="text-primary" />
            Estás utilizando el <strong className="text-primary ml-1">Plan Free</strong>.  
            <span className="ml-1">Actualizá a Premium para desbloquear todas las funciones.</span>
          </div>
        </div>
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-primary/20 blur-3xl"
        />
      </motion.div>

      {/* ---------- MÉTRICAS ---------- */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 px-2 sm:px-4 md:px-8">
        {metricas.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border shadow-sm hover:shadow-md transition">
              <CardContent className="flex items-center gap-3 py-5">
                <div className="p-3 rounded-full bg-primary/10">
                  <m.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                  <p className="text-lg font-semibold text-foreground">{m.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ---------- ACTIVIDAD RECIENTE ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-10 mx-2 sm:mx-4 md:mx-8 border border-border rounded-xl p-6 relative overflow-hidden"
      >
        <h2 className="text-lg font-semibold mb-4 text-primary">Actividad reciente</h2>
        <PlaceholderPattern className="absolute inset-0 stroke-neutral-900/10 dark:stroke-neutral-100/10 pointer-events-none" />
        <p className="relative z-10 text-sm text-muted-foreground">
          Próximamente podrás ver un resumen de tus ventas y movimientos recientes aquí.
        </p>
      </motion.div>

      {/* ---------- LÍMITE DEL PLAN ---------- */}
      <div className="mt-10 px-2 sm:px-4 md:px-8">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Lock size={18} /> Límite del Plan Free
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>🔸 Podés cargar hasta <strong>50 productos</strong>.</p>
            <p>🔸 No incluye reportes avanzados ni múltiples puntos de venta.</p>
            <p>🔸 Soporte disponible solo por correo electrónico.</p>
          </CardContent>
        </Card>
      </div>

      {/* ---------- MEJORAR PLAN ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-10 mx-2 sm:mx-4 md:mx-8 border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/10 rounded-xl p-6 text-center"
      >
        <Crown className="mx-auto text-primary mb-2" size={32} />
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          ¿Querés llevar tu negocio al siguiente nivel?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Pasate al <strong>Plan Premium</strong> y desbloqueá reportes avanzados, integraciones y más herramientas para crecer.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          <Link href={route("planes.index")}>
            <Zap className="mr-2 h-4 w-4" /> Mejorar mi plan <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </AppLayout>
  )
}
