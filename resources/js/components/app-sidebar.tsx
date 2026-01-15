import { NavFooter } from "@/components/nav-footer"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type NavItem, pageProps } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import {
  LayoutGrid,
  ShoppingCart,
  Users,
  BarChart3,
  HelpCircle,
  Package,
  Tag,
  Folder,
  Settings,
  LifeBuoy,
} from "lucide-react"
import AppLogo from "./app-logo"

export function AppSidebar() {
  const { auth } = usePage<pageProps>().props
  const userRoles = auth?.roles ?? []
  const rol = userRoles[0]?.toLowerCase() ?? null

  /* =========================================================
     🔹 Menú base para todos los usuarios
  ========================================================= */
  const mainNavItems: NavItem[] = [
    { title: "Panel principal", href: route("dashboard"), icon: LayoutGrid },
  ]

  /* =========================================================
     🔹 Menús específicos por rol
  ========================================================= */

  if (rol === "admin") {
    mainNavItems.push(
      { title: "Usuarios", href: route("users.index"), icon: Users },
      { title: "Roles", href: route("roles.index"), icon: Folder },
      { title: "Permisos", href: route("users.roles.index"), icon: Settings },
      { title: "Planes", href: route("planes.index"), icon: Tag },
      { title: "Reportes", href: route("reportes.index"), icon: BarChart3 },
      { title: "Soporte", href: route("tickets.index"), icon: HelpCircle },
    )
  }

  if (rol === "comerciante_free") {
    mainNavItems.push(
      { title: "Productos", href: route("productos.index"), icon: Package },
      { title: "Clientes", href: route("clientes.index"), icon: Users },
      { title: "Ventas", href: route("ventas.index"), icon: ShoppingCart },
      { title: "Categorías", href: route("categorias.index"), icon: Folder },
      // { title: "Reportes básicos", href: route("reportes.basicos"), icon: BarChart3 },
      { title: "Centro de ayuda", href: route("tickets.index"), icon: LifeBuoy },
    )
  }

  if (rol === "comerciante_premium") {
    mainNavItems.push(
      { title: "Productos", href: route("productos.index"), icon: Package },
      { title: "Clientes", href: route("clientes.index"), icon: Users },
      { title: "Ventas", href: route("ventas.index"), icon: ShoppingCart },
      { title: "Categorías", href: route("categorias.index"), icon: Folder },
      // { title: "Reportes avanzados", href: route("reportes.avanzados"), icon: BarChart3 },
      // { title: "Configuraciones", href: route("configuracion.index"), icon: Settings },
      { title: "Centro de ayuda", href: route("tickets.index"), icon: LifeBuoy },
    )
  }

  if (rol === "soporte") {
    mainNavItems.push(
      { title: "Tickets", href: route("tickets.index"), icon: HelpCircle },
      { title: "Usuarios", href: route("users.index"), icon: Users },
      { title: "Reportes", href: route("reportes.index"), icon: BarChart3 },
    )
  }

  /* =========================================================
     🔹 Footer del menú
  ========================================================= */
  const footerNavItems: NavItem[] = []

  /* =========================================================
     🔹 Render del sidebar
  ========================================================= */
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-colors duration-200"
    >
      {/* ---------- Encabezado ---------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={route("dashboard")} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ---------- Contenido ---------- */}
      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      {/* ---------- Pie ---------- */}
      <SidebarFooter>
        {footerNavItems.length > 0 && <NavFooter items={footerNavItems} className="mt-auto" />}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
