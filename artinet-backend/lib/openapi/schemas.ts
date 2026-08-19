export const schemas = {
   // ============================================================
  // Buscar productos
  // ============================================================

  ProductoBusqueda: {
    type: 'object',

    description: 'Producto retornado por el buscador de productos.',

    properties: {
      id: {
        type: 'integer',
        description: 'Identificador único del producto.',
        example: 15,
      },

      tienda_id: {
        type: 'integer',
        description: 'ID de la tienda propietaria del producto.',
        example: 3,
      },

      categoria_id: {
        type: 'integer',
        description: 'ID de la categoría del producto.',
        example: 8,
      },

      nombre: {
        type: 'string',
        description: 'Nombre del producto.',
        example: 'iPhone 15 Pro',
      },

      slug: {
        type: 'string',
        description: 'Identificador amigable utilizado en URLs.',
        example: 'iphone-15-pro',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        description: 'Descripción del producto.',
        example: 'Smartphone Apple iPhone 15 Pro.',
      },

      material: {
        type: 'string',
        nullable: true,
        description: 'Material del producto.',
        example: 'Aluminio',
      },

      peso: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Peso del producto.',
        example: 0.187,
      },

      largo: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Largo del producto.',
        example: 15.0,
      },

      ancho: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Ancho del producto.',
        example: 7.1,
      },

      alto: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Alto del producto.',
        example: 0.8,
      },

      estado: {
        type: 'string',
        description: 'Estado actual del producto.',
        example: 'activo',
      },

      destacado: {
        type: 'boolean',
        description: 'Indica si el producto está destacado.',
        example: true,
      },

      calificacion: {
        type: 'number',
        format: 'double',
        minimum: 0,
        maximum: 5,
        description: 'Calificación promedio del producto.',
        example: 4.8,
      },

      total_ventas: {
        type: 'integer',
        minimum: 0,
        description: 'Cantidad total de unidades vendidas.',
        example: 125,
      },

      visitas: {
        type: 'integer',
        minimum: 0,
        description: 'Cantidad de visitas recibidas por el producto.',
        example: 1250,
      },

      favoritos: {
        type: 'integer',
        minimum: 0,
        description: 'Cantidad de usuarios que han agregado el producto a favoritos.',
        example: 86,
      },

      activo: {
        type: 'boolean',
        description: 'Indica si el producto está activo.',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de creación del producto.',
        example: '2026-08-19T10:00:00Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de última actualización.',
        example: '2026-08-19T10:00:00Z',
      },

      tienda_nombre: {
        type: 'string',
        nullable: true,
        description: 'Nombre de la tienda.',
        example: 'Tecnología Nica',
      },

      categoria_nombre: {
        type: 'string',
        nullable: true,
        description: 'Nombre de la categoría.',
        example: 'Celulares',
      },

      precio_minimo: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Precio más bajo disponible entre las variantes activas.',
        example: 899.99,
      },

      precio_maximo: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Precio más alto disponible entre las variantes activas.',
        example: 1099.99,
      },

      disponible: {
        type: 'boolean',
        description:
          'Indica si existe al menos una variante activa con stock disponible.',
        example: true,
      },

      imagen_principal: {
        type: 'string',
        format: 'uri',
        nullable: true,
        description: 'URL de la imagen principal del producto.',
        example: 'https://example.com/iphone-15-pro.jpg',
      },
    },

    required: [
      'id',
      'tienda_id',
      'categoria_id',
      'nombre',
      'slug',
      'estado',
      'destacado',
      'calificacion',
      'total_ventas',
      'visitas',
      'favoritos',
      'activo',
      'created_at',
      'updated_at',
      'precio_minimo',
      'precio_maximo',
      'disponible',
    ],
  },

  VarianteProducto: {
    type: 'object',

    description: 'Variante de un producto.',

    properties: {
      id: {
        type: 'integer',
        example: 25,
      },

      producto_id: {
        type: 'integer',
        example: 15,
      },

      color: {
        type: 'string',
        nullable: true,
        example: 'Negro',
      },

      talla: {
        type: 'string',
        nullable: true,
        example: 'L',
      },

      sku: {
        type: 'string',
        example: 'IPH15-BLK-128',
      },

      precio: {
        type: 'number',
        format: 'double',
        minimum: 0,
        example: 899.99,
      },

      stock: {
        type: 'integer',
        minimum: 0,
        example: 15,
      },

      activo: {
        type: 'boolean',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-19T10:00:00Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-19T10:00:00Z',
      },
    },

    required: [
      'id',
      'producto_id',
      'sku',
      'precio',
      'stock',
      'activo',
    ],
  },


  // ============================================================
  // Resenas de productos
  // ============================================================

  Resena: {
    type: 'object',

    properties: {
      id: {
        type: 'string',

        example: '550e8400-e29b-41d4-a716-446655440000',
      },

      calificacion: {
        type: 'integer',

        minimum: 1,

        maximum: 5,

        example: 5,
      },

      comentario: {
        type: 'string',

        nullable: true,

        example: 'Excelente producto.',
      },

      created_at: {
        type: 'string',

        format: 'date-time',

        example: '2026-08-19T15:30:00Z',
      },

      updated_at: {
        type: 'string',

        format: 'date-time',

        nullable: true,

        example: '2026-08-19T15:30:00Z',
      },

      usuario_id: {
        type: 'string',

        example: '550e8400-e29b-41d4-a716-446655440000',
      },

      pedido_id: {
        type: 'string',

        example: '550e8400-e29b-41d4-a716-446655440000',
      },

      perfiles: {
        type: 'object',

        nullable: true,

        properties: {
          nombres: {
            type: 'string',

            example: 'Juan',
          },

          apellidos: {
            type: 'string',

            example: 'Pérez',
          },

          foto: {
            type: 'string',

            nullable: true,

            example: 'https://ejemplo.com/foto.jpg',
          },
        },
      },
    },
  },

  // ============================================================
  // Carrito
  // ============================================================
    Carrito: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },
      usuario_id: {
        type: 'string',
        format: 'uuid',
      },
      subtotal: {
        type: 'number',
        format: 'float',
        example: 149.9,
      },
      total: {
        type: 'number',
        format: 'float',
        example: 149.9,
      },
      estado: {
        type: 'string',
        enum: ['activo', 'convertido', 'abandonado'],
        example: 'activo',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
 
  ItemCarrito: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 10,
      },
      cantidad: {
        type: 'integer',
        example: 2,
      },
      precio_unitario: {
        type: 'number',
        format: 'float',
        example: 74.95,
      },
      subtotal: {
        type: 'number',
        format: 'float',
        example: 149.9,
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
      variantes_producto: {
        $ref: '#/components/schemas/VarianteProductoCarrito',
      },
    },
  },
 
  CarritoConItems: {
    allOf: [
      {
        $ref: '#/components/schemas/Carrito',
      },
      {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ItemCarrito',
            },
          },
        },
      },
    ],
  },
 
  VarianteProductoCarrito: {
    type: 'object',
    description: 'Variante de producto embebida dentro de un item de carrito.',
    properties: {
      id: {
        type: 'integer',
      },
      color: {
        type: 'string',
        nullable: true,
      },
      talla: {
        type: 'string',
        nullable: true,
      },
      sku: {
        type: 'string',
        nullable: true,
      },
      precio: {
        type: 'number',
        format: 'float',
      },
      stock: {
        type: 'integer',
      },
      activo: {
        type: 'boolean',
      },
      productos: {
        $ref: '#/components/schemas/ProductoCarrito',
      },
    },
  },
 
  ProductoCarrito: {
    type: 'object',
    description: 'Producto embebido dentro de la variante de un item de carrito.',
    properties: {
      id: {
        type: 'integer',
      },
      nombre: {
        type: 'string',
      },
      slug: {
        type: 'string',
      },
      tienda_id: {
        type: 'integer',
      },
      imagenes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
            },
            principal: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },

  // ============================================================
  // VARIANTE PRODUCTO
  // ============================================================
  VarianteProductos: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      producto_id: {
        type: 'integer',
        example: 10,
      },

      color: {
        type: 'string',
        nullable: true,
        example: 'Rojo',
      },

      talla: {
        type: 'string',
        nullable: true,
        example: 'M',
      },

      sku: {
        type: 'string',
        example: 'CAM-ROJO-M',
      },

      precio: {
        type: 'number',
        format: 'float',
        example: 599.99,
      },

      stock: {
        type: 'integer',
        example: 15,
      },

      activo: {
        type: 'boolean',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-13T10:30:00.000Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-13T10:30:00.000Z',
      },
    },
  },

  // ============================================================
  // IMAGEN
  // ============================================================
  Imagen: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      producto_id: {
        type: 'integer',
        example: 9,
      },

      variante_id: {
        type: 'integer',
        nullable: true,
        example: null,
      },

      url: {
        type: 'string',
        format: 'uri',
        example:
          'https://fhjdcbidplapakkuxuok.supabase.co/storage/v1/object/public/artinet-images/productos/9-1723471234567.webp',
      },

      principal: {
        type: 'boolean',
        example: true,
      },

      orden: {
        type: 'integer',
        example: 1,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-12T15:35:34.602256+00:00',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-12T15:35:34.602256+00:00',
      },
    },

    required: [
      'id',
      'producto_id',
      'url',
      'principal',
      'orden',
    ],
  },

  // ============================================================
  // PRODUCTO
  // ============================================================
  Producto: {
    type: 'object',

    properties: {
      id: {
        type: 'integer',
        example: 10,
      },

      tienda_id: {
        type: 'integer',
        example: 2,
      },

      categoria_id: {
        type: 'integer',
        example: 5,
      },

      nombre: {
        type: 'string',
        example: 'Camisa casual de algodón',
      },

      slug: {
        type: 'string',
        example: 'camisa-casual-de-algodon',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Camisa casual de algodón disponible en diferentes colores y tallas.',
      },

      material: {
        type: 'string',
        nullable: true,
        example: 'Algodón',
      },

      peso: {
        type: 'number',
        format: 'float',
        nullable: true,
        example: 0.5,
      },

      largo: {
        type: 'number',
        format: 'float',
        nullable: true,
        example: 70,
      },

      ancho: {
        type: 'number',
        format: 'float',
        nullable: true,
        example: 50,
      },

      alto: {
        type: 'number',
        format: 'float',
        nullable: true,
        example: 5,
      },

      estado: {
        type: 'string',
        example: 'activo',
      },

      destacado: {
        type: 'boolean',
        example: false,
      },

      calificacion: {
        type: 'number',
        format: 'float',
        example: 4.5,
      },

      total_ventas: {
        type: 'integer',
        example: 25,
      },

      visitas: {
        type: 'integer',
        example: 150,
      },

      favoritos: {
        type: 'integer',
        example: 18,
      },

      activo: {
        type: 'boolean',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-13T10:30:00.000Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-13T10:30:00.000Z',
      },

      imagenes: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Imagen',
        },
      },

      variantes_producto: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/VarianteProducto',
        },
      },
    },
  },

  // ============================================================
  // CATEGORIA TIENDA
  // ============================================================
  CategoriaTienda: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Artesanía',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Tiendas dedicadas a productos artesanales.',
      },

      activo: {
        type: 'boolean',
        example: true,
      },
    },
  },

  // ============================================================
  // CATEGORIA PRODUCTO
  // ============================================================
  CategoriaProducto: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Calzado',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Productos relacionados con calzado artesanal.',
      },

      categoria_padre_id: {
        type: 'integer',
        nullable: true,
        example: null,
      },

      activo: {
        type: 'boolean',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-11T10:30:00Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-11T10:30:00Z',
      },
    },
  },

  // ============================================================
  // METODOS DE PAGO
  // ============================================================
  MetodosPagos: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Transferencia bancaria',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Pago mediante transferencia bancaria.',
      },

      activo: {
        type: 'boolean',
        example: true,
      },
    },
  },

  // ============================================================
  // MONEDA
  // ============================================================
  Moneda: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Córdoba',
      },

      codigo: {
        type: 'string',
        example: 'NIO',
      },

      simbolo: {
        type: 'string',
        example: 'C$',
      },

      activo: {
        type: 'boolean',
        example: true,
      },
    },
  },

  // ============================================================
  // BANCO
  // ============================================================
  Banco: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Banco de América Central',
      },

      activo: {
        type: 'boolean',
        example: true,
      },
    },
  },

  // ============================================================
  // TIENDA
  // ============================================================
  Tienda: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 9,
      },

      propietario_id: {
        type: 'string',
        format: 'uuid',
      },

      categoria_id: {
        type: 'integer',
        nullable: true,
      },

      moneda_id: {
        type: 'integer',
      },

      nombre: {
        type: 'string',
        example: 'Estelí Cuero Artesanal',
      },

      slug: {
        type: 'string',
        example: 'esteli-cuero-artesanal',
      },

      descripcion: {
        type: 'string',
        nullable: true,
      },

      logo: {
        type: 'string',
        nullable: true,
      },

      banner: {
        type: 'string',
        nullable: true,
      },

      pais: {
        type: 'string',
        example: 'Nicaragua',
      },

      departamento: {
        type: 'string',
        example: 'Estelí',
      },

      ciudad: {
        type: 'string',
        example: 'Estelí',
      },

      direccion: {
        type: 'string',
      },

      ruc: {
        type: 'string',
        nullable: true,
      },

      tipo_negocio: {
        type: 'string',
        enum: [
          'persona_natural',
          'empresa',
        ],
      },

      horario: {
        type: 'string',
        nullable: true,
      },

      telefono: {
        type: 'string',
        nullable: true,
      },

      whatsapp: {
        type: 'string',
        nullable: true,
      },

      email: {
        type: 'string',
        nullable: true,
      },

      facebook: {
        type: 'string',
        nullable: true,
      },

      instagram: {
        type: 'string',
        nullable: true,
      },

      sitio_web: {
        type: 'string',
        nullable: true,
      },

      porcentaje_comision: {
        type: 'number',
        example: 15,
      },

      calificacion: {
        type: 'number',
        example: 4.9,
      },

      estado: {
        type: 'string',
        enum: [
          'pendiente',
          'activa',
          'suspendida',
        ],
      },

      activo: {
        type: 'boolean',
      },

      fecha_aprobacion: {
        type: 'string',
        format: 'date-time',
        nullable: true,
      },

      aprobado_por: {
        type: 'string',
        format: 'uuid',
        nullable: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  // ============================================================
  // ERROR
  // ============================================================
  Error: {
    type: 'object',

    properties: {
      ok: {
        type: 'boolean',
        example: false,
      },

      error: {
        type: 'object',

        properties: {
          code: {
            type: 'string',
            example: 'NOT_FOUND',
          },

          message: {
            type: 'string',
            example: 'Producto no encontrado.',
          },
        },
      },
    },
  },
} as const

// ============================================================
// RESPONSES REUTILIZABLES
// ============================================================

export const responses = {
  ValidationError: {
    description: 'Datos inválidos en la petición',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  Unauthorized: {
    description: 'No hay sesión activa',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  Forbidden: {
    description: 'Sin permiso para esta acción',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  NotFound: {
    description: 'Recurso no encontrado',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  Conflict: {
    description: 'Conflicto: el recurso ya existe',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  ServerError: {
    description: 'Error interno del servidor',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
} as const