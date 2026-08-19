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
