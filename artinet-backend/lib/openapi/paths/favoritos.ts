export const favoritosPaths = {
 '/api/favoritos': {
    get: {
      tags: ['Favoritos'],
      summary: 'Listar favoritos',
      description: 'Obtiene los favoritos registrados.',
      parameters: [
        {
          name: 'usuario_id',
          in: 'query',
          schema: {
            type: 'string',
            format: 'uuid',
          },
          description: 'Filtrar favoritos por usuario.',
        },
        {
          name: 'producto_id',
          in: 'query',
          schema: {
            type: 'integer',
          },
          description: 'Filtrar favoritos por producto.',
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
            enum: ['id', 'usuario_id', 'producto_id', 'created_at'],
            default: 'id',
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
          description: 'Listado de favoritos',
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
                      $ref: '#/components/schemas/Favorito',
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

  '/api/favoritos/{id}': {
    get: {
      tags: ['Favoritos'],
      summary: 'Obtener favorito por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID del favorito.',
        },
      ],
      responses: {
        '200': {
          description: 'Favorito encontrado',
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
                    $ref: '#/components/schemas/Favorito',
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