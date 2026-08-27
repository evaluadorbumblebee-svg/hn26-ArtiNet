export const pagosPaths = {

  '/api/pagos/{id}/comprobantes': {

    get: {

      tags: ['Pagos'],

      summary: 'Listar comprobantes de un pago',

      description: 'Obtiene los comprobantes asociados a un pago específico. El acceso está permitido al administrador, al cliente del pedido o al propietario de la tienda.',

      parameters: [

        {

          name: 'id',

          in: 'path',

          required: true,

          schema: {

            type: 'integer',

          },

          description: 'ID del pago',

        },

      ],

      responses: {

        '200': {

          description: 'Listado de comprobantes del pago',

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

                      $ref: '#/components/schemas/Comprobante',

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

        '403': {

          $ref: '#/components/responses/Forbidden',

        },

        '404': {

          $ref: '#/components/responses/NotFound',

        },

        '500': {

          $ref: '#/components/responses/InternalServerError',

        },

      },

    },

    post: {

      tags: ['Pagos'],

      summary: 'Registrar comprobante de pago',

      description: 'Registra un comprobante de pago mediante una imagen. La imagen se almacena en Supabase Storage y su URL se guarda en la tabla comprobantes.',

      parameters: [

        {

          name: 'id',

          in: 'path',

          required: true,

          schema: {

            type: 'integer',

          },

          description: 'ID del pago',

        },

      ],

      requestBody: {

        required: true,

        content: {

          'multipart/form-data': {

            schema: {

              $ref: '#/components/schemas/CrearComprobante',

            },

          },

        },

      },

      responses: {

        '201': {

          description: 'Comprobante registrado correctamente',

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

                    $ref: '#/components/schemas/Comprobante',

                  },

                },

              },

            },

          },

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

        '422': {

          description: 'Archivo inválido o datos incorrectos',

          content: {

            'application/json': {

              schema: {

                $ref: '#/components/schemas/Error',

              },

            },

          },

        },

        '500': {

          $ref: '#/components/responses/InternalServerError',

        },

      },

    },

  },

  '/api/pagos/{id}/estado': {

    get: {

      tags: ['Pagos'],

      summary: 'Obtener estado del pago',

      description: 'Obtiene la información y el estado actual de un pago.',

      parameters: [

        {

          name: 'id',

          in: 'path',

          required: true,

          schema: {

            type: 'integer',

          },

          description: 'ID del pago',

        },

      ],

      responses: {

        '200': {

          description: 'Estado del pago',

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

                    $ref: '#/components/schemas/Pago',

                  },

                },

              },

            },

          },

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

        '500': {

          $ref: '#/components/responses/InternalServerError',

        },

      },

    },

  },

} as const