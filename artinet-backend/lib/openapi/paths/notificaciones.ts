export const notificacionesPaths = {
  '/api/notificaciones': {
    get: {
      tags: ['Notificaciones'],
      summary: 'Listar notificaciones del usuario autenticado',
      description: 'Obtiene las notificaciones del usuario, con filtro opcional por leída/no leída.',
      security: [
        {
          cookieAuth: [],
        },
      ],
      parameters: [
        {
          name: 'leida',
          in: 'query',
          schema: {
            type: 'boolean',
          },
          description: 'Filtrar por notificaciones leídas o no leídas.',
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
            enum: ['id', 'created_at', 'leida'],
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
          description: 'Listado de notificaciones',
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
                      $ref: '#/components/schemas/Notificacion',
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
        '401': {
          $ref: '#/components/responses/Unauthorized',
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

  '/api/notificaciones/{id}': {
    get: {
      tags: ['Notificaciones'],
      summary: 'Obtener notificación por ID',
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
          description: 'ID de la notificación.',
        },
      ],
      responses: {
        '200': {
          description: 'Notificación encontrada',
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
                    $ref: '#/components/schemas/Notificacion',
                  },
                },
              },
            },
          },
        },
        '401': {
          $ref: '#/components/responses/Unauthorized',
        },
        '404': {
          $ref: '#/components/responses/NotFound',
        },
      },
    },

    delete: {
      tags: ['Notificaciones'],
      summary: 'Eliminar notificación',
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
          description: 'ID de la notificación.',
        },
      ],
      responses: {
        '200': {
          description: 'Notificación eliminada',
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
                    type: 'object',
                    properties: {
                      eliminado: {
                        type: 'boolean',
                        example: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          $ref: '#/components/responses/Unauthorized',
        },
        '404': {
          $ref: '#/components/responses/NotFound',
        },
      },
    },
  },

  '/api/notificaciones/{id}/leida': {
    patch: {
      tags: ['Notificaciones'],
      summary: 'Marcar notificación como leída',
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
          description: 'ID de la notificación.',
        },
      ],
      responses: {
        '200': {
          description: 'Notificación marcada como leída',
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
                    $ref: '#/components/schemas/Notificacion',
                  },
                },
              },
            },
          },
        },
        '401': {
          $ref: '#/components/responses/Unauthorized',
        },
        '404': {
          $ref: '#/components/responses/NotFound',
        },
      },
    },
  },

  '/api/notificaciones/no-leidas': {
    get: {
      tags: ['Notificaciones'],
      summary: 'Contador de notificaciones no leídas',
      description: 'Devuelve el total de notificaciones sin leer del usuario autenticado, útil para el badge de la campana.',
      security: [
        {
          cookieAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Contador de no leídas',
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
                    type: 'object',
                    properties: {
                      noLeidas: {
                        type: 'integer',
                        example: 3,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          $ref: '#/components/responses/Unauthorized',
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

  '/api/notificaciones/marcar-todas': {
    patch: {
      tags: ['Notificaciones'],
      summary: 'Marcar todas las notificaciones como leídas',
      security: [
        {
          cookieAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Notificaciones actualizadas',
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
                    type: 'object',
                    properties: {
                      actualizado: {
                        type: 'boolean',
                        example: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          $ref: '#/components/responses/Unauthorized',
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
} as const