
# VENDRA  
### Sistema de Gestión de Ventas para Comercios  
**Producto del ecosistema AIR SISTEMAS**

---

## 🧩 ¿Qué es VENDRA?

**VENDRA** es una plataforma **SaaS (Software as a Service)** orientada a comercios y emprendedores, diseñada para centralizar y simplificar la **gestión de ventas**, **productos**, **clientes**, **stock**, **usuarios** y **suscripciones**, todo desde un único sistema.

Forma parte del ecosistema de aplicaciones de **AIR SISTEMAS**, con foco en soluciones reales para negocios de la provincia de Formosa, con proyección de crecimiento regional.

VENDRA no es un proyecto académico ni de demostración: es un **producto en desarrollo activo**, pensado para uso comercial real.

---

## 🎯 Objetivo del producto

- Brindar a los comercios una herramienta simple, moderna y accesible.
- Permitir gestionar ventas y stock sin conocimientos técnicos.
- Ofrecer un modelo **freemium**, con planes escalables según el crecimiento del negocio.
- Centralizar múltiples comercios en un único sistema, manteniendo **aislamiento total de datos**.

---

## 🧠 Modelo SaaS – Multi‑Cliente

VENDRA está construido bajo un modelo **multi‑cliente (multi‑tenant)**:

- Un mismo sistema es utilizado por múltiples comercios.
- Cada comercio se representa como un **Negocio**.
- Todas las entidades operativas se asocian a un `negocio_id`.
- El sistema filtra y valida los datos por negocio para evitar cruces de información.

👉 Un comerciante **nunca puede ver ni modificar datos de otro comercio**.

---

## 👥 Usuarios y Negocios

- Un **Negocio** puede tener **varios usuarios** (dueño, empleados, vendedores).
- Un **Usuario** puede pertenecer a uno o más negocios.
- La relación se gestiona mediante una **tabla pivote** (`negocio_user`).
- Los permisos se controlan mediante **roles globales** y **roles internos por negocio**.

Esto permite escalar el sistema a:
- equipos de trabajo
- múltiples puntos de venta
- futuras cadenas de comercios

---

## 📦 Módulos principales

### 🏪 Negocios
Datos del comercio, rubro, estado, imagen y configuración general.

### 📂 Categorías
Organización de productos por rubro o tipo.
Soporta categorías propias del negocio y categorías globales.

### 🛒 Productos
Gestión de precios, stock, estado y relación con categorías.

### 👤 Clientes
Registro de clientes del comercio con historial de compras.

### 💰 Ventas
- Ventas con detalle de productos.
- Métodos de pago múltiples.
- Estados de pago.
- Asociación a clientes y vendedores.

### 📦 Stock
Control automático de stock mediante movimientos:
- entradas
- salidas
- ajustes

### 🎟️ Tickets de Soporte
Sistema interno de soporte para usuarios del sistema:
- prioridades
- estados
- asignación a personal de soporte

### 📊 Reportes (módulo derivado)
- Reportes generados dinámicamente.
- No duplican datos.
- Acceso según plan contratado.

---

## 💎 Planes y Suscripciones

VENDRA funciona bajo un esquema **freemium**:

### 🆓 Plan Gratuito
- Límite de productos
- Límite de ventas mensuales
- Reportes básicos

### 💎 Plan Premium
- Productos y ventas ilimitadas
- Reportes avanzados
- Página pública del negocio
- Múltiples puntos de venta

### 💳 Pagos
- Sistema de pagos **agnóstico al proveedor**.
- Soporta MercadoPago, transferencias, pagos manuales u otros.
- Los datos específicos de cada método se almacenan de forma flexible.

---

## 🛠️ Stack tecnológico

### Backend
- PHP 8.2+
- Laravel 12
- MySQL / MariaDB
- Spatie Laravel Permission

### Frontend
- React 19
- Inertia.js
- Vite
- Tailwind CSS
- TypeScript

### Arquitectura
- SPA con backend Laravel
- API interna desacoplada
- Seguridad por políticas y permisos
- Diseño escalable y mantenible

---

## 🔐 Seguridad y aislamiento

- Filtros obligatorios por negocio.
- Validaciones cruzadas para evitar asociaciones inválidas.
- Control de acceso mediante roles y permisos.
- Preparado para auditoría y crecimiento.

---

## 🚀 Estado del proyecto

VENDRA se encuentra en **desarrollo activo** como producto comercial.
Las funcionalidades se implementan de forma progresiva siguiendo un roadmap definido.

Este repositorio refleja la **base técnica del sistema**, no un ejemplo educativo.

---

## 🧭 Visión a futuro

- Multi‑usuarios avanzados por negocio
- Puntos de venta (cajas)
- Integraciones fiscales y de pago
- Panel de métricas
- Expansión del ecosistema AIR SISTEMAS

---

## 🏢 AIR SISTEMAS

VENDRA es parte del ecosistema **AIR SISTEMAS**, un conjunto de aplicaciones orientadas a digitalizar procesos reales de organizaciones, comercios e instituciones.

---

**VENDRA**  
Producto desarrollado con visión de negocio, escalabilidad y uso real.
