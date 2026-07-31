# 🎨 ArtiNet

**La plataforma que conecta el talento artesanal de Nicaragua con el mundo.**

[![Hackathon](https://img.shields.io/badge/Hackathon-Nicaragua%202026-orange)](https://github.com/evaluadorbumblebee-svg/hn26-ArtiNet)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

**Equipo:** Bumblebee
**Evento:** Hackathon Nicaragua 2026 (HN26) — Sprint 1

---

## 📌 Resumen Ejecutivo

ArtiNet es una plataforma de venta al por mayor que conecta a **compradores** (hoteles, tiendas, exportadores) con **talleres artesanales nicaragüenses**, permitiendo gestionar pedidos, propuestas y producción de forma organizada y transparente.

Actualmente, miles de artesanos venden poco por depender de intermediarios o no tener acceso a compradores nacionales e internacionales. Por otro lado, los compradores no saben dónde encontrar proveedores confiables ni cómo gestionar pedidos grandes. **ArtiNet elimina esa barrera.**

---

## 🧩 El Problema

**Para los artesanos/talleres:**
- No tienen presencia digital.
- Dependen de intermediarios y pierden ganancias.
- No pueden aceptar pedidos grandes trabajando solos.

**Para los compradores:**
- No saben qué taller produce determinado artículo.
- Desconocen precios, tiempos de producción y confiabilidad.
- No existe una plataforma especializada para comparar proveedores.

---

## 💡 Nuestra Solución

Una plataforma donde los compradores publican pedidos o propuestas, y los talleres artesanales los reciben, evalúan y responden — todo centralizado, con **búsqueda inteligente** que facilita encontrar al taller adecuado según producto, ubicación y disponibilidad.

### ¿Cómo funciona?

1. **Publicación de pedidos** — El comprador publica qué necesita: producto, cantidad, presupuesto, tiempo de entrega.
2. **Búsqueda inteligente de talleres** — El sistema permite filtrar y encontrar talleres según especialidad, ubicación y capacidad de producción.
3. **Propuestas de talleres** — Los talleres interesados responden con su propuesta (precio, tiempo de fabricación, condiciones).
4. **Seguimiento del pedido** — El comprador puede ver el estado del pedido: pendiente, en producción, entregado.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Next.js 16 (API Routes) |
| Lenguaje | TypeScript |
| Despliegue | Vercel |
| Control de versiones | Git / GitHub |

---

## 📡 API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/pedidos` | Lista todos los pedidos |
| `POST` | `/api/pedidos` | Crea un nuevo pedido/propuesta |

*Próximamente: `/api/talleres`, `/api/productos`, `/api/usuarios`*

---

## 🚀 Instalación y ejecución local

```bash
# Clonar el repositorio
git clone https://github.com/evaluadorbumblebee-svg/hn26-ArtiNet.git
cd hn26-ArtiNet

# Instalar dependencias
npm install

# Correr en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 💰 Modelo de Negocio

- Comisión por venta/transacción.
- Servicios logísticos adicionales.

---

## 🌍 Impacto Social

Alineado con los Objetivos de Desarrollo Sostenible (ODS):

| ODS | Descripción |
|---|---|
| **8** | Trabajo decente y crecimiento económico |
| **9** | Industria, innovación e infraestructura |
| **10** | Reducción de desigualdades |
| **11** | Protección del patrimonio cultural |

---

## 📈 Plan de Escalabilidad

Inicio en **Masaya** → expansión a **San Juan de Oriente, Catarina, León y Granada** → proyección hacia otros países de Centroamérica.

---

## 👥 Equipo Bumblebee

Proyecto desarrollado con 🧡 para **Hackathon Nicaragua 2026**.

---

> *"No estamos creando una aplicación para vender artesanías. Estamos construyendo la infraestructura digital que permite a los artesanos nicaragüenses conectar su talento con compradores de todas partes de Nicaragua y, en el futuro, de todo el mundo.”*
