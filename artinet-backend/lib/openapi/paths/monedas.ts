export const monedasPaths = {
  '/api/monedas': {
    get: {
      tags: ['Monedas'],
      summary: 'Listar monedas',
      description: 'Obtiene las monedas registradas en el catálogo.',
      parameters: [
        {
          name: 'activo',
          in: 'query',
          schema: {
            type: 'boolean',
          },
          description: 'Filtrar monedas activas o inactivas.',
        },
        {
          name: 'q',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Buscar moneda por nombre.',
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
            enum: ['id', 'nombre', 'codigo', 'simbolo', 'activo'],
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
          description: 'Listado de monedas',
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
                      $ref: '#/components/schemas/Moneda',
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

  '/api/monedas/{id}': {
    get: {
      tags: ['Monedas'],
      summary: 'Obtener moneda por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la moneda',
        },
      ],
      responses: {
        '200': {
          description: 'Moneda encontrada',
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
                    $ref: '#/components/schemas/Moneda',
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
