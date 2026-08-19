export const carritoPaths = {
  '/api/carrito': {
    get: {
      tags: ['Carrito'],
      summary: 'Obtener carrito activo',
      description:
        'Obtiene el carrito activo del usuario autenticado junto con sus items. Si no existe un carrito activo, se crea uno automáticamente.',
      security: [
        {
          cookieAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Carrito activo con items',
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
                    $ref: '#/components/schemas/CarritoConItems',
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
 
    delete: {
      tags: ['Carrito'],
      summary: 'Vaciar carrito',
      description: 'Elimina todos los items del carrito activo y reinicia sus totales a 0.',
      security: [
        {
          cookieAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Carrito vaciado',
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
                    $ref: '#/components/schemas/Carrito',
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
 
  '/api/carrito/items': {
    get: {
      tags: ['Carrito'],
      summary: 'Listar items del carrito',
      description: 'Obtiene los items del carrito activo del usuario autenticado.',
      security: [
        {
          cookieAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Listado de items del carrito',
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
                      $ref: '#/components/schemas/ItemCarrito',
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
      },
    },
 
    post: {
      tags: ['Carrito'],
      summary: 'Agregar item al carrito',
      description:
        'Agrega una variante de producto al carrito. Si la variante ya existe en el carrito, suma la cantidad enviada a la existente. Valida el stock disponible.',
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
              required: ['variante_id', 'cantidad'],
              properties: {
                variante_id: {
                  type: 'integer',
                },
                cantidad: {
                  type: 'integer',
                  minimum: 1,
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Item agregado (o actualizado) en el carrito',
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
                    $ref: '#/components/schemas/ItemCarrito',
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
        '404': {
          $ref: '#/components/responses/NotFound',
        },
      },
    },
  },
 
  '/api/carrito/items/{id}': {
    patch: {
      tags: ['Carrito'],
      summary: 'Actualizar cantidad de un item',
      description: 'Actualiza la cantidad de un item del carrito. Valida el stock disponible.',
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
          description: 'ID del item de carrito (detalle_carrito).',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['cantidad'],
              properties: {
                cantidad: {
                  type: 'integer',
                  minimum: 1,
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Item actualizado',
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
                    $ref: '#/components/schemas/ItemCarrito',
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
        '404': {
          $ref: '#/components/responses/NotFound',
        },
      },
    },
 
    delete: {
      tags: ['Carrito'],
      summary: 'Eliminar item del carrito',
      description: 'Elimina un item específico del carrito activo del usuario.',
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
          description: 'ID del item de carrito (detalle_carrito).',
        },
      ],
      responses: {
        '200': {
          description: 'Item eliminado',
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
                      deleted: {
                        type: 'boolean',
                        example: true,
                      },
                      id: {
                        type: 'string',
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
} as const