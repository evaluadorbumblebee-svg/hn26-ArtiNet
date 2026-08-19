# 🎨 ArtiNet

> **La infraestructura digital que conecta el talento artesanal de Nicaragua con compradores nacionales e internacionales.**

[![Hackathon](https://img.shields.io/badge/Hackathon-Nicaragua%202026-orange)](https://github.com/evaluadorbumblebee-svg/hn26-ArtiNet)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

**Equipo:** Bumblebee
**Evento:** Hackathon Nicaragua 2026 — HN26
**Proyecto:** ArtiNet

---

# 📌 Resumen Ejecutivo

**ArtiNet** es una plataforma digital de comercio electrónico especializado que conecta a compradores con talleres, tiendas y productores artesanales nicaragüenses.

La plataforma busca solucionar uno de los principales problemas del sector artesanal: la dificultad para encontrar compradores, proveedores confiables y oportunidades comerciales de mayor volumen.

ArtiNet centraliza en una sola plataforma:

* 🛍️ Catálogo de productos.
* 🔍 Búsqueda de productos.
* 🏪 Tiendas y talleres.
* 🖼️ Imágenes de productos.
* 🎨 Variantes.
* ⭐ Reseñas y calificaciones.
* 🛒 Carrito de compras.
* 📦 Pedidos.
* 💳 Pagos.
* 🏦 Métodos de pago y bancos.
* 💰 Monedas.
* 🤝 Solicitudes y propuestas comerciales.
* 🔔 Notificaciones.
* 📍 Seguimiento de pedidos.
* 📊 Reportes.
* 🔐 Auditoría.
* 👤 Perfiles.
* 📚 Documentación OpenAPI.

---

# 🧩 El problema

## Para los artesanos y talleres

Muchos productores artesanales nicaragüenses:

* No cuentan con presencia digital.
* Dependen de intermediarios.
* Tienen dificultades para encontrar compradores.
* No poseen herramientas especializadas para administrar pedidos.
* Tienen poca visibilidad frente a compradores nacionales e internacionales.
* Pierden oportunidades de negocios de mayor volumen.

## Para los compradores

Los compradores necesitan:

* Encontrar productores especializados.
* Buscar productos de manera rápida.
* Comparar diferentes opciones.
* Conocer precios y disponibilidad.
* Revisar tiendas y reputación.
* Contactar proveedores.
* Realizar pedidos.
* Gestionar pagos.
* Dar seguimiento a sus compras.

---

# 💡 Nuestra solución

ArtiNet crea un ecosistema digital donde compradores y productores pueden conectarse y gestionar operaciones comerciales desde una misma plataforma.

### Flujo de compra

```text
             COMPRADOR
                 │
                 ▼
       🔍 Buscar productos
                 │
                 ▼
       🛍️ Explorar catálogo
                 │
                 ▼
    Producto + Variantes + Imágenes
                 │
                 ▼
         ⭐ Reseñas
                 │
                 ▼
            🛒 Carrito
                 │
                 ▼
            📦 Pedido
                 │
                 ▼
             💳 Pago
                 │
                 ▼
        📍 Seguimiento
                 │
                 ▼
             ENTREGA
```

### Flujo de negociación

```text
             COMPRADOR
                 │
                 ▼
       📋 Solicitud de producto
                 │
                 ▼
       🏪 Talleres / Vendedores
                 │
                 ▼
          🤝 Propuestas
                 │
                 ▼
          ✅ Aceptación
                 │
                 ▼
             📦 Pedido
```

---

# 🏗️ Arquitectura

ArtiNet utiliza una arquitectura basada en API REST sobre Next.js.

```text
┌─────────────────────────────────────┐
│             CLIENTE                 │
│        Web / Aplicación             │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│           NEXT.JS API               │
│                                     │
│  Autenticación                      │
│  Productos                          │
│  Tiendas                            │
│  Carrito                            │
│  Pedidos                            │
│  Pagos                              │
│  Propuestas                         │
│  Solicitudes                        │
│  Notificaciones                     │
│  Reseñas                            │
│  Reportes                           │
│  Auditoría                          │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│              SUPABASE               │
│                                     │
│        Base de datos                │
│        Autenticación                │
└─────────────────────────────────────┘
```

---

# 🛠️ Stack tecnológico

| Tecnología                 | Uso                           |
| -------------------------- | ----------------------------- |
| **Next.js 16**             | Framework backend y API       |
| **TypeScript**             | Lenguaje principal            |
| **React 19**               | Capa de interfaz              |
| **Supabase**               | Base de datos y autenticación |
| **Supabase SSR**           | Integración server-side       |
| **Zod**                    | Validación de datos           |
| **OpenAPI**                | Especificación de API         |
| **Scalar**                 | Documentación interactiva     |
| **Tailwind CSS / PostCSS** | Estilos                       |
| **Git**                    | Control de versiones          |
| **GitHub**                 | Repositorio                   |
| **Vercel**                 | Despliegue                    |

---

# 📡 API REST

La API está disponible bajo:

```text
/api
```

## Documentación interactiva

```text
/api-reference
```

En desarrollo:

```text
http://localhost:3000/api-reference
```

## Especificación OpenAPI

```text
/api/openapi.json
```

En desarrollo:

```text
http://localhost:3000/api/openapi.json
```

---

# ❤️ Health Check

Permite comprobar la disponibilidad del backend.

### Endpoint

```http
GET /api/health
```

---

# 👤 Perfiles

## Perfil actual

```http
GET /api/perfiles/me
```

Permite consultar la información del perfil del usuario autenticado.

---

# 🛍️ Productos

## Listar productos

```http
GET /api/productos
```

Obtiene el catálogo de productos.

## Crear producto

```http
POST /api/productos
```

Permite registrar un nuevo producto.

## Obtener producto

```http
GET /api/productos/[id]
```

Obtiene la información de un producto específico.

## Actualizar producto

```http
PUT /api/productos/[id]
```

Actualiza la información de un producto.

## Eliminar producto

```http
DELETE /api/productos/[id]
```

Elimina un producto.

---

# 🔍 Búsqueda de productos

## Buscar productos

```http
GET /api/productos/buscar?q={termino}
```

Permite buscar productos mediante palabras o términos relacionados.

### Ejemplo

```bash
curl "http://localhost:3000/api/productos/buscar?q=Bota"
```

Otros ejemplos:

```bash
curl "http://localhost:3000/api/productos/buscar?q=Bolso"
```

```bash
curl "http://localhost:3000/api/productos/buscar?q=negro"
```

```bash
curl "http://localhost:3000/api/productos/buscar?q=masaya"
```

---

# 🔎 Búsqueda relacionada con productos

```http
GET /api/productos/[id]/buscar
```

Endpoint destinado a operaciones de búsqueda relacionadas con un producto específico.

---

# 🖼️ Imágenes de productos

## Listar imágenes

```http
GET /api/productos/[id]/imagenes
```

Obtiene las imágenes asociadas a un producto.

## Agregar imagen

```http
POST /api/productos/[id]/imagenes
```

Permite agregar una imagen a un producto.

---

# ⭐ Reseñas de productos

## Listar reseñas

```http
GET /api/productos/[id]/resenas
```

Obtiene las reseñas asociadas a un producto.

## Crear reseña

```http
POST /api/productos/[id]/resenas
```

Permite registrar una nueva reseña.

---

# 🎨 Variantes

```http
/api/productos/[id]/variantes
```

Módulo destinado a la gestión de variantes asociadas a productos.

También existe:

```http
/api/variantes/[id]
```

para operaciones relacionadas con una variante específica.

---

# 🏪 Tiendas

## Listar tiendas

```http
GET /api/tiendas
```

Obtiene las tiendas disponibles.

## Crear tienda

```http
POST /api/tiendas
```

Permite registrar una nueva tienda.

## Obtener tienda

```http
GET /api/tiendas/[id]
```

Obtiene una tienda específica.

## Actualizar tienda

```http
PATCH /api/tiendas/[id]
```

Actualiza información de una tienda.

---

# ✅ Aprobación de tiendas

```http
/api/tiendas/[id]/aprobar
```

Endpoint destinado al proceso de aprobación de tiendas.

---

# 🏦 Cuentas bancarias de tiendas

```http
/api/tiendas/[id]/cuentas-bancarias
```

Permite gestionar las cuentas bancarias asociadas a una tienda.

---

# 🗂️ Categorías de productos

## Listar categorías

```http
GET /api/categorias-producto
```

Obtiene las categorías disponibles para productos.

## Crear categoría

```http
POST /api/categorias-producto
```

Crea una nueva categoría de producto.

## Obtener categoría

```http
GET /api/categorias-producto/[id]
```

Obtiene una categoría específica.

## Actualizar categoría

```http
PATCH /api/categorias-producto/[id]
```

Actualiza una categoría.

---

# 🏪 Categorías de tiendas

## Listar categorías

```http
GET /api/categorias-tienda
```

## Crear categoría

```http
POST /api/categorias-tienda
```

## Obtener categoría

```http
GET /api/categorias-tienda/[id]
```

## Actualizar categoría

```http
PATCH /api/categorias-tienda/[id]
```

---

# 🛒 Carrito

## Obtener carrito

```http
GET /api/carrito
```

Obtiene el carrito del usuario.

## Vaciar carrito

```http
DELETE /api/carrito
```

Elimina los elementos del carrito.

---

# 🛒 Items del carrito

## Listar items

```http
GET /api/carrito/items
```

Obtiene los productos actualmente agregados.

## Agregar producto

```http
POST /api/carrito/items
```

Agrega un producto al carrito.

## Actualizar item

```http
PATCH /api/carrito/items/[id]
```

Actualiza un elemento del carrito.

## Eliminar item

```http
DELETE /api/carrito/items/[id]
```

Elimina un elemento específico.

---

# 📦 Pedidos

El módulo de pedidos permite administrar el ciclo de vida de las compras.

```http
/api/pedidos
```

```http
/api/pedidos/[id]
```

## Estado del pedido

```http
/api/pedidos/[id]/estado
```

## Pagos asociados

```http
/api/pedidos/[id]/pagos
```

## Seguimiento

```http
/api/pedidos/[id]/seguimiento
```

---

# 💳 Pagos

El sistema incorpora infraestructura para gestionar operaciones de pago.

```http
/api/pagos/[id]/estado
```

Permite consultar el estado de un pago.

## Comprobantes

```http
/api/pagos/[id]/comprobantes
```

Permite gestionar comprobantes asociados a pagos.

---

# 💵 Métodos de pago

## Listar métodos

```http
GET /api/metodos-pagos
```

Obtiene los métodos de pago disponibles.

## Método específico

```http
GET /api/metodos-pagos/[id]
```

Obtiene un método de pago específico.

---

# 🏦 Bancos

## Listar bancos

```http
GET /api/bancos
```

Obtiene el catálogo de bancos.

## Banco específico

```http
GET /api/bancos/[id]
```

Obtiene información de un banco.

## Bancos favoritos

```http
/api/bancos/favoritos
```

Permite gestionar los bancos favoritos del usuario.

## Banco favorito específico

```http
/api/bancos/favoritos/[id]
```

---

# 💰 Monedas

## Listar monedas

```http
GET /api/monedas
```

Obtiene las monedas disponibles.

## Moneda específica

```http
GET /api/monedas/[id]
```

Obtiene información de una moneda.

---

# ⭐ Reseñas

Además de las reseñas asociadas directamente a productos, existe un endpoint general:

```http
/api/resenas
```

Este módulo centraliza operaciones relacionadas con reseñas dentro de la plataforma.

---

# 🔔 Notificaciones

## Notificaciones

```http
/api/notificaciones
```

Gestiona las notificaciones de los usuarios.

## Marcar como leída

```http
/api/notificaciones/[id]/leida
```

Permite marcar una notificación como leída.

---

# 🤝 Solicitudes de clientes

```http
/api/solicitudes-cliente
```

Permite gestionar solicitudes realizadas por compradores.

## Propuestas

```http
/api/solicitudes-cliente/[id]/propuestas
```

Permite consultar propuestas asociadas a una solicitud.

---

# 🤝 Solicitudes de vendedores

```http
/api/solicitudes-vendedor
```

Gestiona solicitudes relacionadas con vendedores.

## Solicitud individual

```http
/api/solicitudes-vendedor/[id]
```

Permite trabajar con una solicitud específica.

---

# ✅ Propuestas

## Aceptar propuesta

```http
/api/propuestas/[id]/aceptar
```

Permite aceptar una propuesta comercial.

---

# 📊 Reportes

## Reportes

```http
/api/reportes
```

Módulo para gestionar reportes.

## Reporte específico

```http
/api/reportes/[id]
```

Permite consultar o gestionar un reporte específico.

---

# 🔐 Auditoría

```http
/api/auditoria
```

La auditoría permite mantener trazabilidad de operaciones importantes realizadas dentro de la plataforma.

Esto proporciona una base para:

* Seguridad.
* Trazabilidad.
* Administración.
* Investigación de operaciones.
* Control de cambios.

---

# 🖼️ Imágenes

```http
/api/imagenes/[id]
```

Endpoint destinado a operaciones sobre imágenes mediante identificador.

---

# 📚 OpenAPI

ArtiNet cuenta con documentación basada en OpenAPI.

Los principales archivos son:

```text
lib/openapi/
├── index.ts
├── schemas.ts
└── paths/
```

La especificación se expone mediante:

```http
GET /api/openapi.json
```

La interfaz interactiva está disponible mediante:

```text
/api-reference
```

---

# 🧪 Ejemplos rápidos

## Buscar productos

```bash
curl "http://localhost:3000/api/productos/buscar?q=Bota"
```

## Consultar productos

```bash
curl "http://localhost:3000/api/productos"
```

## Consultar tiendas

```bash
curl "http://localhost:3000/api/tiendas"
```

## Health check

```bash
curl "http://localhost:3000/api/health"
```

## Documentación OpenAPI

```bash
curl "http://localhost:3000/api/openapi.json"
```

---

# 🔐 Validación y seguridad

El backend incorpora diferentes mecanismos para proteger y validar las operaciones:

* Autenticación mediante Supabase.
* Manejo de sesiones.
* Middleware.
* Control de permisos.
* Validación mediante Zod.
* Respuestas HTTP estructuradas.
* Manejo centralizado de errores.
* Auditoría.
* Validación de datos de entrada.

Archivos principales:

```text
lib/auth.ts
lib/middleware.ts
lib/permissions.ts
lib/validators.ts
lib/responses.ts
lib/supabase/
```

---

# 📂 Estructura del proyecto

```text
artinet-backend/
│
├── app/
│   ├── api/
│   │   ├── auditoria/
│   │   ├── bancos/
│   │   ├── carrito/
│   │   ├── categorias-producto/
│   │   ├── categorias-tienda/
│   │   ├── health/
│   │   ├── imagenes/
│   │   ├── metodos-pagos/
│   │   ├── monedas/
│   │   ├── notificaciones/
│   │   ├── openapi.json/
│   │   ├── pagos/
│   │   ├── pedidos/
│   │   ├── perfiles/
│   │   ├── productos/
│   │   ├── propuestas/
│   │   ├── reportes/
│   │   ├── resenas/
│   │   ├── solicitudes-cliente/
│   │   ├── solicitudes-vendedor/
│   │   ├── tiendas/
│   │   └── variantes/
│   │
│   ├── api-reference/
│   ├── auth/
│   ├── login/
│   └── page.tsx
│
├── lib/
│   ├── openapi/
│   │   ├── paths/
│   │   ├── index.ts
│   │   └── schemas.ts
│   ├── auth.ts
│   ├── middleware.ts
│   ├── pagination.ts
│   ├── permissions.ts
│   ├── responses.ts
│   ├── validators.ts
│   └── supabase/
│
├── package.json
├── package-lock.json
├── postcss.config.mjs
└── README.md
```

---

# 🚀 Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/evaluadorbumblebee-svg/hn26-ArtiNet.git
```

## 2. Entrar al backend

```bash
cd hn26-ArtiNet/artinet-backend
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Configurar variables de entorno

Crear un archivo:

```text
.env.local
```

y configurar las variables necesarias para el entorno y Supabase.

## 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

La documentación estará disponible en:

```text
http://localhost:3000/api-reference
```

---

# 📜 Scripts

| Comando         | Descripción                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Ejecuta el servidor de desarrollo |
| `npm run build` | Compila el proyecto               |
| `npm start`     | Ejecuta la versión de producción  |
| `npm run lint`  | Ejecuta ESLint                    |

---

# 📈 Estado actual del proyecto

## 🟢 Implementado

* ✅ Backend REST con Next.js.
* ✅ TypeScript.
* ✅ Supabase.
* ✅ Autenticación.
* ✅ Perfiles.
* ✅ Productos.
* ✅ Búsqueda de productos.
* ✅ Variantes.
* ✅ Imágenes.
* ✅ Reseñas.
* ✅ Tiendas.
* ✅ Categorías de productos.
* ✅ Categorías de tiendas.
* ✅ Carrito.
* ✅ Pedidos.
* ✅ Pagos.
* ✅ Comprobantes.
* ✅ Métodos de pago.
* ✅ Bancos.
* ✅ Bancos favoritos.
* ✅ Monedas.
* ✅ Notificaciones.
* ✅ Solicitudes.
* ✅ Propuestas.
* ✅ Reportes.
* ✅ Auditoría.
* ✅ Seguimiento de pedidos.
* ✅ OpenAPI.
* ✅ Documentación interactiva con Scalar.

---

# 🔮 Roadmap

La arquitectura de ArtiNet está preparada para incorporar nuevas funcionalidades.

## 👤 Usuarios

```text
/api/usuarios
/api/usuarios/[id]
/api/usuarios/[id]/roles
/api/usuarios/[id]/permisos
```

## 🏪 Talleres

```text
/api/talleres
/api/talleres/[id]
/api/talleres/[id]/productos
/api/talleres/[id]/reseñas
/api/talleres/[id]/estadisticas
```

## ❤️ Favoritos

```text
/api/favoritos
/api/favoritos/productos
/api/favoritos/tiendas
```

## 🔍 Búsqueda avanzada

```text
/api/productos/recomendados
/api/productos/populares
/api/productos/mas-vendidos
```

Filtros previstos:

* Categoría.
* Precio.
* Ubicación.
* Disponibilidad.
* Valoración.
* Tienda.
* Tipo de producto.
* Variantes.

## 📦 Inventario

```text
/api/inventario
/api/inventario/[id]
/api/inventario/movimientos
```

## 🚚 Logística

```text
/api/envios
/api/envios/[id]
/api/envios/[id]/seguimiento
/api/direcciones
/api/direcciones/[id]
```

## 🎟️ Promociones

```text
/api/promociones
/api/promociones/[id]
/api/cupones
/api/cupones/[codigo]
```

## 📊 Analítica

```text
/api/estadisticas
/api/estadisticas/ventas
/api/estadisticas/productos
/api/estadisticas/tiendas
/api/estadisticas/pedidos
```

## 💬 Comunicación

```text
/api/mensajes
/api/conversaciones
/api/conversaciones/[id]
```

## 🌎 Internacionalización

```text
/api/idiomas
/api/tasas-cambio
```

Permitirá ampliar ArtiNet hacia compradores internacionales y soportar diferentes monedas e idiomas.

## 🛡️ Administración

```text
/api/admin/usuarios
/api/admin/tiendas
/api/admin/productos
/api/admin/pedidos
/api/admin/reportes
/api/admin/auditoria
```

---

# 🌎 Plan de expansión

El crecimiento de ArtiNet contempla comenzar en los principales polos artesanales de Nicaragua.

```text
Masaya
   │
   ├── San Juan de Oriente
   │
   ├── Catarina
   │
   ├── Granada
   │
   └── León
          │
          ▼
      Nicaragua
          │
          ▼
     Centroamérica
          │
          ▼
  Mercado internacional
```

---

# 💰 Modelo de negocio

ArtiNet contempla diferentes fuentes de monetización:

* 💳 Comisión por transacción.
* 🚚 Servicios logísticos.
* ⭐ Productos destacados.
* 🏪 Planes premium para vendedores.
* 📊 Herramientas comerciales para talleres.
* 🏢 Servicios para compradores mayoristas.
* 🔗 Integraciones empresariales.

---

# 🌱 Impacto social

ArtiNet busca contribuir a la digitalización y crecimiento económico del sector artesanal nicaragüense.

| ODS        | Impacto                                 |
| ---------- | --------------------------------------- |
| **ODS 8**  | Trabajo decente y crecimiento económico |
| **ODS 9**  | Industria, innovación e infraestructura |
| **ODS 10** | Reducción de desigualdades              |
| **ODS 11** | Comunidades y patrimonio cultural       |
| **ODS 12** | Producción y consumo responsables       |

---

# 🎯 Visión

ArtiNet no busca ser únicamente una tienda en línea.

Busca convertirse en una **infraestructura digital para el ecosistema artesanal de Nicaragua**, permitiendo que los productores puedan mostrar sus productos, encontrar compradores, negociar pedidos, recibir pagos y crecer comercialmente.

---

# 🏆 Hackathon Nicaragua 2026

**ArtiNet** es desarrollado por el equipo **Bumblebee** para Hackathon Nicaragua 2026.

Nuestro objetivo es conectar el talento artesanal nicaragüense con nuevas oportunidades comerciales mediante tecnología.

```text
        MOSTRAR
           ↓
        CONECTAR
           ↓
        NEGOCIAR
           ↓
          VENDER
           ↓
         CRECER
```

---

# 👥 Equipo Bumblebee

Proyecto desarrollado con 🧡 para **Hackathon Nicaragua 2026**.

---

> **“No estamos creando una aplicación para vender artesanías. Estamos construyendo la infraestructura digital que permite a los artesanos nicaragüenses conectar su talento con compradores de todas partes de Nicaragua y, en el futuro, de todo el mundo.”**
