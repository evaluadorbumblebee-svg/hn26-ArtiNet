export const metodosPagoPaths = {
  '/api/metodos-pagos': {
    get: {
      tags: ['Métodos de pago'],
      summary: 'Listar métodos de pago',
      description: 'Obtiene los métodos de pago registrados en el catálogo.',
      parameters: [
        {
          name: 'activo',
          in: 'query',
          schema: {
            type: 'boolean',
          },
          description: 'Filtrar métodos de pago activos o inactivos.',
        },
        {
          name: 'q',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Buscar método de pago por nombre.',
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
            enum: ['id', 'nombre', 'descripcion', 'activo'],
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
          description: 'Listado de métodos de pago',
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
                      $ref: '#/components/schemas/MetodoPago',
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
  },

  '/api/metodos-pagos/{id}': {
    get: {
      tags: ['Métodos de pago'],
      summary: 'Obtener método de pago por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID del método de pago',
        },
      ],
      responses: {
        '200': {
          description: 'Método de pago encontrado',
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
                    $ref: '#/components/schemas/MetodoPago',
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
  },
} as const