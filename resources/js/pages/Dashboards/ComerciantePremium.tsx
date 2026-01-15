import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Zap,
  Star,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type pageProps } from "@/types"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function ComerciantePremium() {
  const { auth, stats = {} } = usePage<pageProps & { stats: any }>().props
  const user = auth?.user ?? null
  const negocio = stats.negocio ?? "Tu negocio"

  const metricas = [
    { label: "Productos", value: stats.productos ?? 0, icon: Package },
    { label: "Ventas", value: stats.ventas ?? 0, icon: ShoppingBag },
    { label: "Clientes", value: stats.clientes ?? 0, icon: Users },
    {
      label: "Ingresos totales",
      value: `$${(stats.ingresos ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
  ]

  const datosVentasMensuales = Object.entries(stats.ventasMensuales ?? {}).map(
    ([mes, valor]) => ({ mes, valor })
  )

  return (
    <AppLayout>
      <Head title="Panel Comerciante Premium" />

      {/* ---------- HERO ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-6 shadow-sm border border-border mx-2 sm:mx-4 md:mx-8"
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold text-foreground">
            ¡Bienvenido de nuevo,{" "}
            <span className="text-primary">{user?.nombre}</span>!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Este es el panel de control premium de tu negocio{" "}
            <strong>{negocio}</strong>.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Star size={14} className="text-primary" />
            Estás disfrutando los beneficios del{" "}
            <strong className="text-primary ml-1">Plan Premium</strong>.
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
            <Card className="border-border shadow-sm hover:shadow-md transition-all">
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

      {/* ---------- GRÁFICO DE VENTAS ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-10 mx-2 sm:mx-4 md:mx-8 border border-border rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
          <BarChart3 className="h-5 w-5" />
          Rendimiento de ventas
        </h2>

        {datosVentasMensuales.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={datosVentasMensuales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="mes" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#e53935"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aún no hay suficientes datos para generar un gráfico de ventas.
          </p>
        )}
      </motion.div>

      {/* ---------- ACCIONES PRINCIPALES ---------- */}
      <div className="mt-10 px-2 sm:px-4 md:px-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <Zap className="h-5 w-5 text-primary" /> Accesos rápidos
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              titulo: "Productos",
              descripcion: "Gestioná tus productos y categorías.",
              href: route("productos.index"),
              icono: Package,
            },
            {
              titulo: "Ventas",
              descripcion: "Revisá tus transacciones y generá reportes.",
              href: route("ventas.index"),
              icono: ShoppingBag,
            },
            {
              titulo: "Clientes",
              descripcion: "Consultá y administrá tu base de clientes.",
              href: route("clientes.index"),
              icono: Users,
            },
          ].map((acc, i) => (
            <motion.div
              key={acc.titulo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className="hover:shadow-md transition-all h-full">
                <CardHeader className="flex items-center gap-3">
                  <acc.icono className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm font-semibold">{acc.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>{acc.descripcion}</p>
                  <Button asChild size="sm" className="mt-2">
                    <Link href={acc.href}>
                      Ir <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ---------- SECCIÓN INFERIOR: INSIGHTS ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-12 mx-2 sm:mx-4 md:mx-8 border border-border rounded-xl p-6 relative overflow-hidden"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
          <TrendingUp className="h-5 w-5" />
          Insights del negocio
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Tu plan Premium incluye análisis detallados y reportes avanzados para ayudarte a
          tomar mejores decisiones comerciales.
        </p>

        <Button asChild size="sm" className="bg-primary text-primary-foreground">
          <Link href={route("reportes.index")}>Ver reportes detallados</Link>
        </Button>
      </motion.div>
    </AppLayout>
  )
}
