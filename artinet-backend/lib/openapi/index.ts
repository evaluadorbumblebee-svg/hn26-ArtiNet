import { schemas, responses } from './schemas'
import { monedasPaths } from './paths/monedas'
import { bancosPaths } from './paths/bancos'
import { tiendasPaths } from './paths/tiendas'
import { metodosPagoPaths } from './paths/metodoPago'
import { categoriasProductoPaths } from './paths/categorias-produto'
import { categoriasTiendaPaths } from './paths/categorias-tienda'
import { imagenesPaths } from './paths/productos/imagenes'
import { productosPaths} from './paths/productos/productos'
import { carritoPaths } from './paths/carritos'
import { resenasPaths } from './paths/productos/resenas'
import { buscarProductosPaths } from './paths/buscar-productos'
import { auditoriaPaths } from './paths/auditoria/auditoria'
import { fa } from 'zod/locales'
import { favoritosPaths } from './paths/favoritos'
import { notificacionesPaths } from './paths/notificaciones'
import { pagosPaths } from './paths/pagos'
import { pedidosPaths } from './paths/pedidos'
import { propuestasPaths } from './paths/propuestas'
import { reportesPaths } from './paths/reportes/reportes'
import { solicitudesClientePaths } from './paths/solicitudes-cliente/solicitudes-cliente'
import { solicitudesVendedorPaths } from './paths/solicitudes-vendedor/solicitudes-vendedor'



export const openApiSpec = {
  openapi: '3.0.0',

  info: {
    title: 'ArtiNet API',
    version: '1.0.0',
    description:
      'API del marketplace ArtiNet — vendedores, productos, pedidos y pagos.',
  },

  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Desarrollo local',
    },
  ],

  tags: [
    {
      name: 'Tiendas',
      description: 'Gestión de tiendas de vendedores',
    },
    {
      name: 'Monedas',
      description: 'Catálogo de monedas',
    },
    {
      name: 'Bancos',
      description: 'Catálogo de bancos',
    },
  ],

  paths: {
    ...tiendasPaths,
    ...monedasPaths,
    ...bancosPaths,
    ...metodosPagoPaths,
    ...categoriasProductoPaths,
    ...categoriasTiendaPaths,
    ...imagenesPaths,
    ...productosPaths,
    ...carritoPaths,
    ...resenasPaths,
    ...buscarProductosPaths,
    ...auditoriaPaths,
    ...favoritosPaths,
    ...notificacionesPaths,
    ...pagosPaths,
    ...pedidosPaths,
    ...propuestasPaths,
    ...reportesPaths,
    ...resenasPaths,
    ...solicitudesClientePaths,
    ...solicitudesVendedorPaths,
  },

  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'sb-access-token',
        description: 'Sesión de Supabase Auth (cookie SSR)',
      },
    },

    schemas,

    responses,
  },
} as const
