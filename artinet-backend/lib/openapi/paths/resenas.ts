export const resenasPaths = {
  '/api/resenas': {
    get: {
      tags: ['Reseñas'],

      summary: 'Listar reseñas',

      description:
        'Obtiene una lista paginada de reseñas. Permite filtrar por producto, tienda, usuario y calificación. Cuando se especifica un producto o una tienda, también devuelve estadísticas de distribución de las calificaciones.',

      operationId: 'listarResenas',

      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Número de página.',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
            example: 1,
          },
        },

        {
          name: 'pageSize',
          in: 'query',
          required: false,
          description: 'Cantidad de reseñas por página.',
          schema: {
            type: 'integer',
            minimum: 1,
            example: 20,
          },
        },

        {
          name: 'producto_id',
          in: 'query',
          required: false,
          description:
            'Filtra las reseñas pertenecientes a un producto específico. Al utilizar este filtro también se calculan estadísticas de calificación.',
          schema: {
            type: 'integer',
            example: 45,
          },
        },

        {
          name: 'tienda_id',
          in: 'query',
          required: false,
          description:
            'Filtra las reseñas pertenecientes a una tienda específica. Al utilizar este filtro también se calculan estadísticas de calificación.',
          schema: {
            type: 'integer',
            example: 8,
          },
        },

        {
          name: 'usuario_id',
          in: 'query',
          required: false,
          description:
            'Filtra las reseñas realizadas por un usuario específico.',
          schema: {
            type: 'string',
            format: 'uuid',
            example:
              '550e8400-e29b-41d4-a716-446655440000',
          },
        },

        {
          name: 'calificacion',
          in: 'query',
          required: false,
          description:
            'Filtra las reseñas por cantidad de estrellas.',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            example: 5,
          },
        },
      ],

      responses: {
        200: {
          description:
            'Reseñas obtenidas correctamente.',

          content: {
            'application/json': {
              schema: {
                $ref:
                  '#/components/schemas/ResenaConEstadisticas',
              },
            },
          },
        },

        500: {
          description:
            'Error interno del servidor.',
        },
      },
    },

    post: {
      tags: ['Reseñas'],

      summary: 'Crear una reseña',

      description:
        'Permite a un cliente crear una reseña sobre un producto que haya comprado en un pedido ya entregado. El producto debe pertenecer realmente al pedido y no se permite crear más de una reseña para la combinación pedido-producto. La tienda_id se obtiene directamente del pedido y no se acepta desde el cliente.',

      operationId: 'crearResena',

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref:
                '#/components/schemas/CrearResena',
            },
          },
        },
      },

      responses: {
        201: {
          description:
            'Reseña creada correctamente.',

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
                    $ref:
                      '#/components/schemas/Resena',
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            'Datos inválidos. El pedido, producto o calificación no cumplen las condiciones requeridas.',

          content: {
            'application/json': {
              schema: {
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
                        example: 'VALIDATION_ERROR',
                      },

                      message: {
                        type: 'string',
                        example:
                          'Solo puedes reseñar productos de pedidos ya entregados.',
                      },
                    },
                  },
                },
              },
            },
          },
        },

        401: {
          description:
            'El usuario no está autenticado.',
        },

        403: {
          description:
            'El pedido no pertenece al usuario autenticado.',
        },

        404: {
          description:
            'El pedido no existe.',
        },

        409: {
          description:
            'El usuario ya realizó una reseña para ese producto dentro del pedido.',

          content: {
            'application/json': {
              schema: {
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
                        example: 'CONFLICT',
                      },

                      message: {
                        type: 'string',
                        example:
                          'Ya reseñaste este producto para este pedido.',
                      },
                    },
                  },
                },
              },
            },
          },
        },

        500: {
          description:
            'Error interno del servidor.',
        },
      },
    },
  },
}