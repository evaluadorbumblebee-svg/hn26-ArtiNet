export const tiendasPaths = {
  '/api/tiendas': {
    get: {
      tags: ['Tiendas'],
      summary: 'Listar tiendas',
      description: 'Obtiene las tiendas registradas en el catálogo.',
      parameters: [
        {
          name: 'categoria_id',
          in: 'query',
          schema: {
            type: 'integer',
          },
          description: 'Filtrar tiendas por categoría.',
        },
        {
          name: 'ciudad',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Filtrar tiendas por ciudad.',
        },
        {
          name: 'departamento',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Filtrar tiendas por departamento.',
        },
        {
          name: 'q',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Buscar tienda por nombre.',
        },
        {
          name: 'estado',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['pendiente', 'activa', 'suspendida'],
          },
          description: 'Filtrar tiendas por estado.',
        },
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
          },
        },
        {
          name: 'pageSize',
          in: 'query',
          schema: {
            type: 'integer',
            default: 20,
          },
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: {
            type: 'string',
            default: 'created_at',
          },
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Listado de tiendas',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Tienda',
                    },
                  },
                  meta: {
                    type: 'object',
                    properties: {
                      page: {
                        type: 'integer',
                      },
                      pageSize: {
                        type: 'integer',
                      },
                      total: {
                        type: 'integer',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '500': {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },

    post: {
      tags: ['Tiendas'],
      summary: 'Crear tienda',
      description: 'Crea una nueva tienda.',
      security: [
        {
          cookieAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'moneda_id',
                'nombre',
                'pais',
                'departamento',
                'ciudad',
                'direccion',
                'tipo_negocio',
              ],
              properties: {
                categoria_id: {
                  type: 'integer',
                  nullable: true,
                },
                moneda_id: {
                  type: 'integer',
                },
                nombre: {
                  type: 'string',
                },
                slug: {
                  type: 'string',
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
                },
                departamento: {
                  type: 'string',
                },
                ciudad: {
                  type: 'string',
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
                  enum: ['persona_natural', 'empresa'],
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
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Tienda creada',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    $ref: '#/components/schemas/Tienda',
                  },
                },
              },
            },
          },
        },
        '400': {
          $ref: '#/components/responses/ValidationError',
        },
        '401': {
          $ref: '#/components/responses/Unauthorized',
        },
        '403': {
          $ref: '#/components/responses/Forbidden',
        },
        '409': {
          $ref: '#/components/responses/Conflict',
        },
      },
    },
  },

  '/api/tiendas/{id}': {
    get: {
      tags: ['Tiendas'],
      summary: 'Obtener tienda por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la tienda.',
        },
      ],
      responses: {
        '200': {
          description: 'Tienda encontrada',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    $ref: '#/components/schemas/Tienda',
                  },
                },
              },
            },
          },
        },
        '404': {
          $ref: '#/components/responses/NotFound',
        },
      },
    },

    patch: {
      tags: ['Tiendas'],
      summary: 'Actualizar tienda',
      description: 'Actualiza los datos de una tienda.',
      security: [
        {
          cookieAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la tienda.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                categoria_id: {
                  type: 'integer',
                  nullable: true,
                },
                moneda_id: {
                  type: 'integer',
                },
                nombre: {
                  type: 'string',
                },
                slug: {
                  type: 'string',
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
                },
                departamento: {
                  type: 'string',
                },
                ciudad: {
                  type: 'string',
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
                  enum: ['persona_natural', 'empresa'],
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
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Tienda actualizada',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    $ref: '#/components/schemas/Tienda',
                  },
                },
              },
            },
          },
        },
        '400': {
          $ref: '#/components/responses/ValidationError',
        },
        '401': {
          $ref: '#/components/responses/Unauthorized',
        },
        '403': {
          $ref: '#/components/responses/Forbidden',
        },
        '404': {
          $ref: '#/components/responses/NotFound',
        },
      },
    },
  },
} as const