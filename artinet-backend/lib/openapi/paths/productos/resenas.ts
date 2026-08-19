export const resenasPaths = {
  '/api/productos/{id}/resenas': {
    get: {
      tags: ['Reseñas'],

      summary: 'Obtener reseñas de un producto',

      description:
        'Obtiene todas las reseñas registradas para un producto, incluyendo la información básica del usuario que realizó cada reseña.',

      parameters: [
        {
          name: 'id',

          in: 'path',

          required: true,

          schema: {
            type: 'string',
          },

          description: 'ID del producto.',
        },
      ],

      responses: {
        '200': {
          description: 'Listado de reseñas del producto',

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
                      $ref: '#/components/schemas/Resena',
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
      tags: ['Reseñas'],

      summary: 'Crear una reseña para un producto',

      description:
        'Permite a un usuario autenticado crear una reseña de un producto que haya comprado y cuyo pedido ya haya sido entregado. El usuario_id se obtiene automáticamente de la sesión autenticada.',

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          name: 'id',

          in: 'path',

          required: true,

          schema: {
            type: 'string',
          },

          description: 'ID del producto que se desea reseñar.',
        },
      ],

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              type: 'object',

              required: ['pedido_id', 'calificacion'],

              properties: {
                pedido_id: {
                  type: 'string',

                  description:
                    'ID del pedido que contiene el producto que se desea reseñar.',

                  example: '550e8400-e29b-41d4-a716-446655440000',
                },

                calificacion: {
                  type: 'integer',

                  minimum: 1,

                  maximum: 5,

                  description:
                    'Calificación otorgada al producto. Debe ser un número entero entre 1 y 5.',

                  example: 5,
                },

                comentario: {
                  type: 'string',

                  nullable: true,

                  description: 'Comentario opcional sobre el producto.',

                  example: 'Excelente producto, cumplió con mis expectativas.',
                },
              },
            },
          },
        },
      },

      responses: {
        '201': {
          description: 'Reseña creada correctamente',

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
                    $ref: '#/components/schemas/Resena',
                  },
                },
              },
            },
          },
        },

        '400': {
          description:
            'Datos inválidos, pedido inexistente, pedido no pertenece al usuario, producto no pertenece al pedido, pedido no entregado o reseña duplicada.',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },

        '401': {
          description: 'Usuario no autenticado',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
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
} as const