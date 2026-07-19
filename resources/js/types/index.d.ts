import type { LucideIcon } from "lucide-react";
import type { Config } from "ziggy-js";

/* =========================================================
   Tipos Base del Framework
========================================================= */

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

/* =========================================================
   Tipos del Sistema VENDRA
========================================================= */

/* -------- PLANES -------- */
export type PlanSlug = "free" | "premium" | (string & {});

export type FuncionalidadPlan =
    | "tiene_pagina_publica"
    | "reportes_avanzados"
    | "multiples_puntos_venta";

export interface Plan {
    id: number;
    nombre: string;
    slug: PlanSlug;
    limite_productos: number | null;
    limite_ventas_mensuales: number | null;
    limite_usuarios: number;
    tiene_pagina_publica: boolean;
    reportes_avanzados: boolean;
    multiples_puntos_venta: boolean;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

/* -------- RELACIÓN USUARIO / NEGOCIO -------- */
export interface NegocioUserPivot {
    id?: number;
    negocio_id: number;
    user_id: number;
    es_administrador: boolean;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
}

/* -------- NEGOCIOS -------- */
export interface Negocio {
    id: number;
    plan_id: number;
    nombre_comercial: string;
    cuit_cuil?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    rubro?: string | null;
    logo_path?: string | null;
    activo: boolean;
    created_at: string;
    updated_at: string;

    /** Relaciones opcionales cargadas desde Laravel. */
    plan?: Plan;
    usuarios?: UserConNegocioPivot[];
    usuarios_activos_count?: number;
}

export interface NegocioConUserPivot extends Negocio {
    pivot?: NegocioUserPivot;
}

/* -------- USUARIOS -------- */
export type EstadoUsuario = "activo" | "inactivo" | "suspendido";

export interface User {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
    dni?: string | null;
    telefono?: string | null;
    domicilio?: string | null;
    email: string;
    email_verified_at?: string | null;
    estado: EstadoUsuario;
    created_at: string;
    updated_at: string;

    /** Relaciones opcionales cargadas desde Laravel. */
    negocios?: NegocioConUserPivot[];
    roles?: Role[];
    permissions?: Permission[];

    /** Imagen de perfil opcional para uso presente o futuro. */
    avatar?: string | null;
}

export interface UserConNegocioPivot extends User {
    pivot?: NegocioUserPivot;
}

/* -------- CONTEXTO AUTENTICADO -------- */
export interface Auth {
    user: User;
    roles: string[];
    permissions: string[];

    /** Negocios activos a los que pertenece el usuario autenticado. */
    negocios?: NegocioConUserPivot[];

    /** Negocio seleccionado actualmente para operar dentro de Vendra. */
    negocio_activo?: NegocioConUserPivot | null;

    /** Permiso técnico para administrar miembros, plan y configuración crítica. */
    es_administrador_negocio?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

/* -------- PAGOS DE SUSCRIPCIONES -------- */
export type EstadoPagoSuscripcion = "pendiente" | "aprobado" | "rechazado";

export type MetodoPagoSuscripcion =
    | "mercadopago"
    | "transferencia"
    | "efectivo"
    | "tarjeta"
    | "otro";

export interface PagoSuscripcion {
    id: number;
    negocio_id: number;
    plan_id: number;
    user_id?: number | null;
    monto: number;
    moneda: string;
    periodo_inicio: string;
    periodo_fin: string;
    estado: EstadoPagoSuscripcion;
    metodo_pago: MetodoPagoSuscripcion;
    referencia_pago?: string | null;
    datos_pago?: Record<string, unknown> | null;
    aprobado_at?: string | null;
    created_at: string;
    updated_at: string;

    /** Relaciones opcionales cargadas desde Laravel. */
    negocio?: Negocio;
    plan?: Plan;
    usuario?: User | null;
}

/* -------- PRODUCTOS -------- */
export interface Categoria {
    id: number;
    negocio_id: number;
    nombre: string;
    descripcion?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Producto {
    id: number;
    negocio_id: number;
    categoria_id: number | null;
    nombre: string;
    sku?: string | null;
    descripcion?: string | null;
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
    email?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    notas?: string | null;
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
    comprobante?: string | null;
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
    motivo?: string | null;
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
    asignado?: User | null;
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
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
    last_page: number;
    links: PaginationLinks[];
}

/* =========================================================
   Roles y Permisos Globales (Spatie)
========================================================= */

export type RolGlobal = "admin" | "usuario" | "soporte";

export interface Role {
    id: number;
    name: RolGlobal | string;
    guard_name?: string;
    permissions_count?: number;
    permissions?: Permission[];
}

export interface UserWithRoles extends User {
    roles: Role[];
}

export interface Permission {
    id: number;
    name: string;
    guard_name?: string;
}

/* =========================================================
   Props Globales de Páginas Inertia
========================================================= */

export interface PageProps {
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };

    /* Autenticación y contexto del negocio activo. */
    auth?: Auth;
    negocio_activo?: NegocioConUserPivot | null;
    es_administrador_negocio?: boolean;

    /* Datos principales. */
    users?: PaginatedData<UserWithRoles> | UserWithRoles[];
    usuario?: UserWithRoles;
    planes?: PaginatedData<Plan> | Plan[];
    negocios?: PaginatedData<Negocio> | Negocio[];
    pagos_suscripciones?: PaginatedData<PagoSuscripcion> | PagoSuscripcion[];
    es_admin_global?: boolean;
    puede_agregar_usuarios?: boolean;
    usuarios_activos_count?: number;
    limite_usuarios?: number;
    productos?: PaginatedData<Producto> | Producto[];
    clientes?: PaginatedData<Cliente> | Cliente[];
    ventas?: PaginatedData<Venta> | Venta[];
    tickets?: PaginatedData<TicketSoporte> | TicketSoporte[];
    roles?: PaginatedData<Role> | Role[];
    permissions?: Permission[];

    /* Parámetros adicionales. */
    search?: string;
    [key: string]: unknown;
}

/** Alias temporal para imports existentes. */
export type pageProps = PageProps;
