import { Head } from "@inertiajs/react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Wrench, MessageSquare, CheckCircle, Timer, Users } from "lucide-react"
import { type pageProps } from "@/types"

export default function SoporteDashboard({ user, stats }: pageProps & { stats: any }) {
  const cards = [
    { label: "Tickets abiertos", value: stats.ticketsAbiertos, icon: MessageSquare },
    { label: "En progreso", value: stats.ticketsEnProgreso, icon: Timer },
    { label: "Cerrados", value: stats.ticketsCerrados, icon: CheckCircle },
    { label: "Promedio de respuesta", value: stats.promedioRespuesta, icon: Wrench },
    { label: "Comercios asistidos", value: stats.comerciosAsistidos, icon: Users },
  ]

  return (
    <>
      <Head title="Panel de Soporte Técnico" />

      <div className="p-6 space-y-10">
        {/* ---------- HEADER ---------- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-primary/15 to-accent/10 border border-border rounded-xl p-6 shadow-sm"
        >
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <Wrench className="w-6 h-6 text-primary" />
            Panel de Soporte Técnico
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hola <strong>{user.nombre}</strong>, gestioná los tickets y el soporte de los comercios.
          </p>
        </motion.div>

        {/* ---------- STATS ---------- */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card className="border-border hover:shadow-md transition-all duration-300">
                <CardHeader className="flex items-center gap-2 pb-2">
                  <item.icon className="text-primary h-5 w-5" />
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-primary">{item.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ---------- ACTIVIDAD RECIENTE ---------- */}
        <div className="mt-10 border border-border rounded-xl p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4 text-primary">Actividad reciente</h2>
          <p className="text-muted-foreground text-sm">
            Aquí verás los tickets nuevos, actualizaciones y respuestas pendientes.
            Próximamente se integrará con el módulo de soporte.
          </p>
        </div>
      </div>
    </>
  )
}
