import { LucideIcon } from "lucide-react";
import type { Config } from "ziggy-js";

/* =========================================================
   Tipos Base del Framework
========================================================= */

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

/* =========================================================
   Tipos del Sistema VENDRA
========================================================= */

/* -------- PLANES -------- */
export interface Plan {
    id: number;
    nombre: string;
    slug: string;
    limite_productos: number | null;
    limite_ventas_mensuales: number | null;
    tiene_pagina_publica: boolean;
    reportes_avanzados: boolean;
    multiples_puntos_venta: boolean;
    created_at: string;
    updated_at: string;
}

/* -------- NEGOCIOS -------- */
export interface Negocio {
    id: number;
    nombre_comercial: string;
    cuit_cuil?: string;
    telefono?: string;
    direccion?: string;
    rubro?: string;
    logo_path?: string;
    created_at: string;
    updated_at: string;
}

/* -------- USUARIOS -------- */
export interface User {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  dni?: string;
  telefono?: string;
  domicilio?: string;
  email: string;
  email_verified_at?: string | null;
  estado: "activo" | "inactivo" | "suspendido";
  plan_id?: number | null;
  negocio_id?: number | null;
  created_at: string;
  updated_at: string;
  plan?: Plan | null;
  negocio?: Negocio | null;
  roles?: { id: number; name: string }[];

  /** Imagen de perfil (opcional, para uso futuro) */
  avatar?: string | null;
}


/* -------- PRODUCTOS -------- */
export interface Categoria {
    id: number;
    negocio_id: number;
    nombre: string;
    descripcion?: string;
    created_at: string;
    updated_at: string;
}

export interface Producto {
    id: number;
    negocio_id: number;
    categoria_id: number | null;
    nombre: string;
    sku?: string;
    descripcion?: string;
    precio: number;
    stock_actual: number;
    activo: boolean;
    created_at: string;
    updated_at: string;
    categoria?: Categoria | null;
}

/* -------- CLIENTES -------- */
export interface Cliente {
    id: number;
    negocio_id: number;
    nombre: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    notas?: string;
    created_at: string;
    updated_at: string;
}

/* -------- VENTAS -------- */
export type MetodoPago =
    | "efectivo"
    | "transferencia"
    | "debito"
    | "credito"
    | "mercadopago"
    | "otro";

export type EstadoPago = "pendiente" | "pagado" | "anulado";

export interface Venta {
    id: number;
    negocio_id: number;
    user_id: number;
    cliente_id?: number | null;
    fecha: string;
    total_bruto: number;
    descuento: number;
    total_neto: number;
    metodo_pago: MetodoPago;
    estado_pago: EstadoPago;
    comprobante?: string;
    created_at: string;
    updated_at: string;
    cliente?: Cliente | null;
    detalles?: DetalleVenta[];
}

export interface DetalleVenta {
    id: number;
    venta_id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
    producto?: Producto;
}

/* -------- MOVIMIENTOS DE STOCK -------- */
export type TipoMovimiento = "entrada" | "salida" | "ajuste";

export interface MovimientoStock {
    id: number;
    producto_id: number;
    user_id?: number | null;
    tipo: TipoMovimiento;
    cantidad: number;
    motivo?: string;
    venta_id?: number | null;
    created_at: string;
    updated_at: string;
    producto?: Producto;
}

/* -------- TICKETS DE SOPORTE -------- */
export type EstadoTicket = "abierto" | "en_progreso" | "cerrado";
export type PrioridadTicket = "baja" | "media" | "alta";

export interface TicketSoporte {
    id: number;
    user_id: number;
    asignado_a?: number | null;
    asunto: string;
    descripcion: string;
    prioridad: PrioridadTicket;
    estado: EstadoTicket;
    created_at: string;
    updated_at: string;
    usuario?: User;
    asignado?: User;
}

/* =========================================================
   Paginación y Respuestas
========================================================= */

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    last_page: number;
    links: PaginationLinks[];
}

/* =========================================================
   Roles y Permisos (Spatie)
========================================================= */

export interface Role {
    id: number;
    name: string;
    permissions_count?: number;
}

export interface Permission {
    id: number;
    name: string;
}

/* =========================================================
   Props Globales de Páginas Inertia
========================================================= */

export interface pageProps {
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };

    // Autenticación
    auth?: {
        user?: User;
        roles: string[];
        permissions: string[];
    };

    // Datos principales
    planes?: PaginatedData<Plan> | Plan[];
    productos?: PaginatedData<Producto> | Producto[];
    clientes?: PaginatedData<Cliente> | Cliente[];
    ventas?: PaginatedData<Venta> | Venta[];
    tickets?: PaginatedData<TicketSoporte> | TicketSoporte[];
    negocios?: PaginatedData<Negocio> | Negocio[];
    roles?: PaginatedData<Role> | Role[];
    permissions?: Permission[];

    // Parámetros adicionales
    search?: string;
    [key: string]: unknown;
}
