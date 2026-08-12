export const categoriasProductoPaths = {
  '/api/categorias-producto': {
    get: {
      tags: ['Categorías de Producto'],
      summary: 'Listar categorías de producto',
      description: 'Obtiene las categorías de productos registradas.',
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
              'categoria_padre_id',
              'activo',
              'created_at',
              'updated_at',
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
          description: 'Listado de categorías de producto',
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
                      $ref: '#/components/schemas/CategoriaProducto',
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
      tags: ['Categorías de Producto'],
      summary: 'Crear categoría de producto',
      description: 'Crea una nueva categoría de producto.',
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
                    $ref: '#/components/schemas/CategoriaProducto',
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

  '/api/categorias-producto/{id}': {
    get: {
      tags: ['Categorías de Producto'],
      summary: 'Obtener categoría por ID',
      description: 'Obtiene una categoría de producto específica.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la categoría de producto.',
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
                    $ref: '#/components/schemas/CategoriaProducto',
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
      tags: ['Categorías de Producto'],
      summary: 'Actualizar categoría de producto',
      description: 'Actualiza uno o varios campos de una categoría existente.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la categoría de producto.',
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
                  example: 'Calzado artesanal',
                },
                descripcion: {
                  type: 'string',
                  nullable: true,
                  example: 'Calzado elaborado por artesanos.',
                },
                categoria_padre_id: {
                  type: 'integer',
                  nullable: true,
                  example: 1,
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
                    $ref: '#/components/schemas/CategoriaProducto',
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