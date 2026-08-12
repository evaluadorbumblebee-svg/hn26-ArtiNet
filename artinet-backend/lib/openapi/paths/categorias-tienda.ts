export const categoriasTiendaPaths = {
  '/api/categorias-tienda': {
    get: {
      tags: ['Categorías de Tienda'],
      summary: 'Listar categorías de tienda',
      description: 'Obtiene las categorías de tiendas registradas.',
      parameters: [
        {
          name: 'activo',
          in: 'query',
          schema: {
            type: 'boolean',
          },
          description: 'Filtrar categorías activas o inactivas.',
        },
        {
          name: 'q',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Buscar categoría por nombre.',
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
            enum: [
              'id',
              'nombre',
              'descripcion',
              'activo',
            ],
            default: 'id',
          },
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'asc',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Listado de categorías de tienda',
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
                      $ref: '#/components/schemas/CategoriaTienda',
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
          $ref: '#/components/responses/ServerError',
        },
      },
    },

    post: {
      tags: ['Categorías de Tienda'],
      summary: 'Crear categoría de tienda',
      description: 'Crea una nueva categoría de tienda.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['nombre'],
              properties: {
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
          },
        },
      },
      responses: {
        '201': {
          description: 'Categoría creada correctamente',
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
                    $ref: '#/components/schemas/CategoriaTienda',
                  },
                },
              },
            },
          },
        },
        '400': {
          $ref: '#/components/responses/ValidationError',
        },
        '500': {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/api/categorias-tienda/{id}': {
    get: {
      tags: ['Categorías de Tienda'],
      summary: 'Obtener categoría de tienda por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la categoría de tienda.',
        },
      ],
      responses: {
        '200': {
          description: 'Categoría encontrada',
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
                    $ref: '#/components/schemas/CategoriaTienda',
                  },
                },
              },
            },
          },
        },
        '400': {
          $ref: '#/components/responses/ValidationError',
        },
        '404': {
          $ref: '#/components/responses/NotFound',
        },
        '500': {
          $ref: '#/components/responses/ServerError',
        },
      },
    },

    patch: {
      tags: ['Categorías de Tienda'],
      summary: 'Actualizar categoría de tienda',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la categoría de tienda.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'Artesanía tradicional',
                },
                descripcion: {
                  type: 'string',
                  nullable: true,
                  example: 'Tiendas de artesanía tradicional.',
                },
                activo: {
                  type: 'boolean',
                  example: true,
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Categoría actualizada correctamente',
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
                    $ref: '#/components/schemas/CategoriaTienda',
                  },
                },
              },
            },
          },
        },
        '400': {
          $ref: '#/components/responses/ValidationError',
        },
        '404': {
          $ref: '#/components/responses/NotFound',
        },
        '500': {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },
} as const