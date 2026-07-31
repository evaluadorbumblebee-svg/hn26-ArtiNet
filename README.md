# 🎨 ArtiNet

**La plataforma que conecta el talento artesanal de Nicaragua con el mundo.**

Proyecto desarrollado para **Hackathon Nicaragua 2026 (HN26)**.

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

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Next.js (API Routes) |
| Despliegue | Vercel |
| Lenguaje | TypeScript |
| Control de versiones | Git / GitHub |

---

## 📡 Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/pedidos` | Lista todos los pedidos |
| POST | `/api/pedidos` | Crea un nuevo pedido/propuesta |

*(Más endpoints en desarrollo: talleres, productos, usuarios)*

---

## 🚀 Cómo correr el proyecto localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 💰 Modelo de Negocio

- Comisión por venta/transacción.
- Suscripción premium para talleres o compradores frecuentes.
- Servicios logísticos adicionales.

---

## 🌍 Impacto Social

Alineado con los Objetivos de Desarrollo Sostenible (ODS):

- **ODS 8** — Trabajo decente y crecimiento económico.
- **ODS 9** — Industria, innovación e infraestructura.
- **ODS 10** — Reducción de desigualdades.
- **ODS 11** — Protección del patrimonio cultural.

---

## 📈 Escalabilidad

El proyecto puede iniciar en **Masaya**, expandirse a **San Juan de Oriente, Catarina, León y Granada**, y eventualmente a otros países de Centroamérica.

---

## 👥 Equipo

Hackathon Nicaragua 2026 — HN26

---

> "No estamos creando una aplicación para vender artesanías. Estamos construyendo la infraestructura digital que permite a los artesanos nicaragüenses conectar su talento con compradores de todo el mundo."
