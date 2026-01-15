import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { motion } from "framer-motion"
import {
  Building2,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Layers,
  Settings,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Database,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { Badge } from "@/components/ui/badge"
import { type BreadcrumbItem, type pageProps } from "@/types"

const breadcrumbs: BreadcrumbItem[] = [{ title: "Dashboard", href: "/dashboard" }]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
}

export default function AdministradorDashboard() {
  const { auth, stats = {} } = usePage<pageProps & { stats: any }>().props
  const user = auth?.user ?? null

  const statCards = [
    {
      label: "Negocios activos",
      value: stats.negociosActivos ?? 0,
      icon: Building2,
      hint: "Total de comercios registrados y activos en la plataforma.",
    },
    {
      label: "Usuarios registrados",
      value: stats.usuariosTotales ?? 0,
      icon: Users,
      hint: "Usuarios con cuentas activas en el sistema.",
    },
    {
      label: "Productos totales",
      value: stats.productosTotales ?? 0,
      icon: Package,
      hint: "Cantidad total de productos registrados en todos los negocios.",
    },
    {
      label: "Ventas registradas",
      value: stats.ventasTotales ?? 0,
      icon: ShoppingCart,
      hint: "Número total de operaciones de venta realizadas.",
    },
    {
      label: "Clientes activos",
      value: stats.clientesTotales ?? 0,
      icon: CreditCard,
      hint: "Clientes registrados en los distintos negocios.",
    },
    {
      label: "Planes activos",
      value: stats.planesActivos ?? 0,
      icon: Layers,
      hint: "Planes disponibles y asignados a los usuarios.",
    },
    {
      label: "Ingresos totales",
      value: `$${stats.ingresosTotales?.toLocaleString() ?? "0"}`,
      icon: DollarSign,
      hint: "Suma total de ingresos generados por las ventas.",
    },
  ]

  const acciones = [
    {
      titulo: "Usuarios y Roles",
      descripcion: "Gestioná cuentas, permisos y niveles de acceso.",
      icono: Users,
      href: route("users.index"),
      color: "from-primary/40 to-primary/20",
    },
    {
      titulo: "Negocios",
      descripcion: "Supervisá los comercios registrados en Vendra.",
      icono: Building2,
      href: route("negocios.index"),
      color: "from-accent/40 to-accent/20",
    },
    {
      titulo: "Planes",
      descripcion: "Controlá los planes disponibles y sus características.",
      icono: Layers,
      href: route("planes.index"),
      color: "from-secondary/40 to-secondary/20",
    },
    {
      titulo: "Configuración general",
      descripcion: "Ajustes globales del sistema y mantenimiento.",
      icono: Settings,
      href: "#",
      color: "from-muted/40 to-muted/20",
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard del Administrador | Vendra" />

      {/* ===== HERO ===== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-background to-secondary/15 p-6 shadow-sm border border-border mx-2 sm:mx-4 md:mx-8"
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <Database className="w-6 h-6 text-primary" />
            Panel de Administración Global
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            {user ? (
              <>
                Bienvenido, <strong>{user.nombre}</strong>. Desde este panel podés
                supervisar toda la plataforma, negocios, planes y usuarios activos.
              </>
            ) : (
              "Panel principal del administrador del sistema."
            )}
          </p>
        </div>
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-primary/20 blur-3xl"
        />
      </motion.div>

      {/* ===== STATS ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 px-2 sm:px-4 md:px-8"
      >
        {statCards.map((item, i) => (
          <motion.div
            key={item.label}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i}
          >
            <Card className="border-border shadow-sm hover:shadow-md transition-all duration-300 group relative">
              <CardContent className="flex items-center gap-3 py-5">
                <div className="p-3 rounded-full bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-semibold text-foreground">{item.value}</p>
                </div>
              </CardContent>
              <div className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground">
                {item.hint}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== ACCIONES PRINCIPALES ===== */}
      <div className="mt-10 px-2 sm:px-4 md:px-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Módulos principales
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {acciones.map((op, i) => (
            <motion.div
              key={op.titulo}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="shadow-sm border-border hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
                <CardHeader className="relative pb-1">
                  <div className={`absolute inset-0 bg-gradient-to-r ${op.color} opacity-[0.08] rounded-t-lg`} />
                  <div className="relative flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-foreground">{op.titulo}</CardTitle>
                    <div className="p-2 rounded-full bg-muted/50 dark:bg-muted/30">
                      <op.icono className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 flex flex-col justify-between flex-1 py-3">
                  <p className="text-sm text-muted-foreground mb-3 leading-snug">{op.descripcion}</p>
                  <Button asChild size="sm" className="w-full transition-all duration-200 hover:shadow-sm">
                    <Link href={op.href}>
                      <Sparkles className="w-4 h-4 mr-1" /> Ingresar
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== ACTIVIDAD GENERAL ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 mx-2 sm:mx-4 md:mx-8 border border-border rounded-xl p-6 relative overflow-hidden"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
          <BarChart3 className="h-5 w-5" />
          Actividad general del sistema
        </h2>
        <PlaceholderPattern className="absolute inset-0 stroke-neutral-900/10 dark:stroke-neutral-100/10 pointer-events-none" />
        <p className="relative z-10 text-muted-foreground">
          Aquí se visualizarán los reportes de uso del sistema, ventas globales, negocios nuevos y estadísticas de crecimiento mensual.
        </p>
        <div className="relative z-10 mt-6 flex flex-wrap gap-3 text-sm">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            🏬 {statCards[0].value} negocios activos
          </Badge>
          <Badge className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20">
            💰 {statCards[6].value} ingresos totales
          </Badge>
          <Badge className="bg-accent/10 text-accent-foreground hover:bg-accent/20">
            📦 {statCards[2].value} productos registrados
          </Badge>
        </div>
      </motion.div>
    </AppLayout>
  )
}
