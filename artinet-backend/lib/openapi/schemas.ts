export const schemas = {
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
        example: 'Tiendas dedicadas a productos artesanales.',
      },

      activo: {
        type: 'boolean',
        example: true,
      },
    },
  },

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
        example: 'Productos relacionados con calzado artesanal.',
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
      example: 'Pago mediante transferencia bancaria.',
    },
    activo: {
      type: 'boolean',
      example: true,
    },
  },
},

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

  Tienda: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 9 },
      propietario_id: { type: 'string', format: 'uuid' },
      categoria_id: { type: 'integer', nullable: true },
      moneda_id: { type: 'integer' },
      nombre: { type: 'string', example: 'Estelí Cuero Artesanal' },
      slug: { type: 'string', example: 'esteli-cuero-artesanal' },
      descripcion: { type: 'string', nullable: true },
      logo: { type: 'string', nullable: true },
      banner: { type: 'string', nullable: true },
      pais: { type: 'string', example: 'Nicaragua' },
      departamento: { type: 'string', example: 'Estelí' },
      ciudad: { type: 'string', example: 'Estelí' },
      direccion: { type: 'string' },
      ruc: { type: 'string', nullable: true },
      tipo_negocio: {
        type: 'string',
        enum: ['persona_natural', 'empresa'],
      },
      horario: { type: 'string', nullable: true },
      telefono: { type: 'string', nullable: true },
      whatsapp: { type: 'string', nullable: true },
      email: { type: 'string', nullable: true },
      facebook: { type: 'string', nullable: true },
      instagram: { type: 'string', nullable: true },
      sitio_web: { type: 'string', nullable: true },
      porcentaje_comision: { type: 'number', example: 15 },
      calificacion: { type: 'number', example: 4.9 },
      estado: {
        type: 'string',
        enum: ['pendiente', 'activa', 'suspendida'],
      },
      activo: { type: 'boolean' },
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
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
} as const

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
    description: 'Conflicto (ej. slug duplicado)',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
} as const
