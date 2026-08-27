export const pedidosPaths = {
  '/api/pedidos': {
    get: {
      tags: ['Pedidos'],
      summary: 'Listar pedidos',
      description:
        'Obtiene los pedidos según el rol del usuario autenticado. Los administradores pueden consultar todos, los vendedores los de sus tiendas y los clientes únicamente sus propios pedidos.',
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Número de página.',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
        {
          name: 'pageSize',
          in: 'query',
          description: 'Cantidad de registros por página.',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 20,
          },
        },
        {
          name: 'sortBy',
          in: 'query',
          description: 'Campo utilizado para ordenar.',
          required: false,
          schema: {
            type: 'string',
            default: 'created_at',
          },
        },
        {
          name: 'sortOrder',
          in: 'query',
          description: 'Dirección del ordenamiento.',
          required: false,
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc',
          },
        },
        {
          name: 'from',
          in: 'query',
          description: 'Índice inicial de registros.',
          required: false,
          schema: {
            type: 'integer',
            minimum: 0,
          },
        },
        {
          name: 'to',
          in: 'query',
          description: 'Índice final de registros.',
          required: false,
          schema: {
            type: 'integer',
            minimum: 0,
          },
        },
        {
          name: 'estado',
          in: 'query',
          description: 'Filtrar pedidos por estado.',
          required: false,
          schema: {
            type: 'string',
            enum: [
              'pendiente',
              'confirmado',
              'en_preparacion',
              'enviado',
              'entregado',
              'cancelado',
            ],
          },
        },
        {
          name: 'tienda_id',
          in: 'query',
          description: 'Filtrar pedidos por tienda.',
          required: false,
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      responses: {
        200: {
          description: 'Lista de pedidos obtenida correctamente.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Pedido',
                    },
                  },
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
        401: {
          description: 'Usuario no autenticado.',
        },
        500: {
          description: 'Error interno del servidor.',
        },
      },
    },

    post: {
      tags: ['Pedidos'],
      summary: 'Crear pedido',
      description:
        'Crea un pedido utilizando los productos del carrito activo que pertenecen a la tienda seleccionada. También registra el seguimiento inicial, descuenta el stock y elimina los artículos procesados del carrito.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PedidoCreate',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Pedido creado correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Pedido',
              },
            },
          },
        },
        400: {
          description: 'Datos de validación incorrectos.',
        },
        401: {
          description: 'Usuario no autenticado.',
        },
        500: {
          description: 'Error interno del servidor.',
        },
      },
    },
  },

  '/api/pedidos/{id}': {
    get: {
      tags: ['Pedidos'],
      summary: 'Obtener pedido por ID',
      description:
        'Obtiene la información completa de un pedido, incluyendo sus detalles, variantes, productos e imágenes.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del pedido.',
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      responses: {
        200: {
          description: 'Pedido obtenido correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PedidoDetalleCompleto',
              },
            },
          },
        },
        401: {
          description: 'Usuario no autenticado.',
        },
        403: {
          description: 'El usuario no tiene permisos para consultar este pedido.',
        },
        404: {
          description: 'Pedido no encontrado.',
        },
        500: {
          description: 'Error interno del servidor.',
        },
      },
    },

    patch: {
      tags: ['Pedidos'],
      summary: 'Actualizar datos del pedido',
      description:
        'Actualiza observaciones, dirección de entrega o tipo de entrega. El estado del pedido debe modificarse mediante el endpoint /estado.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del pedido.',
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PedidoUpdate',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Pedido actualizado correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Pedido',
              },
            },
          },
        },
        400: {
          description: 'No se enviaron campos válidos para actualizar.',
        },
        401: {
          description: 'Usuario no autenticado.',
        },
        403: {
          description: 'El usuario no tiene permisos para modificar este pedido.',
        },
        404: {
          description: 'Pedido no encontrado.',
        },
        500: {
          description: 'Error interno del servidor.',
        },
      },
    },
  },

  '/api/pedidos/{id}/estado': {
    patch: {
      tags: ['Pedidos'],
      summary: 'Actualizar estado del pedido',
      description:
        'Actualiza el estado formal del pedido y registra automáticamente el cambio en seguimiento_pedido.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del pedido.',
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PedidoEstadoUpdate',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Estado actualizado correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Pedido',
              },
            },
          },
        },
        400: {
          description: 'Estado inválido o faltante.',
        },
        401: {
          description: 'Usuario no autenticado.',
        },
        403: {
          description:
            'Solo el administrador o propietario de la tienda puede cambiar el estado.',
        },
        404: {
          description: 'Pedido no encontrado.',
        },
        500: {
          description: 'Error interno del servidor.',
        },
      },
    },
  },

  '/api/pedidos/{id}/pagos': {
    get: {
      tags: ['Pagos de pedidos'],
      summary: 'Listar pagos de un pedido',
      description:
        'Obtiene todos los pagos asociados al pedido, incluyendo sus comprobantes.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del pedido.',
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      responses: {
        200: {
          description: 'Pagos obtenidos correctamente.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Pago',
                },
              },
            },
          },
        },
        401: {
          description: 'Usuario no autenticado.',
        },
        403: {
          description:
            'El usuario no tiene permisos para consultar los pagos del pedido.',
        },
        404: {
          description: 'Pedido no encontrado.',
        },
        500: {
          description: 'Error interno del servidor.',
        },
      },
    },

    post: {
      tags: ['Pagos de pedidos'],
      summary: 'Registrar pago',
      description:
        'Registra un pago realizado por el cliente. El pago queda inicialmente en estado pendiente de confirmación.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del pedido.',
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PagoCreate',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Pago registrado correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Pago',
              },
            },
          },
        },
        400: {
          description: 'Datos del pago inválidos.',
        },
        401: {
          description: 'Usuario no autenticado.',
        },
        403: {
          description: 'Solo el cliente propietario del pedido puede registrar el pago.',
        },
        404: {
          description: 'Pedido no encontrado.',
        },
        500: {
          description: 'Error interno del servidor.',
        },
      },
    },
  },

  '/api/pedidos/{id}/seguimiento': {
    get: {
      tags: ['Seguimiento de pedidos'],
      summary: 'Consultar seguimiento del pedido',
      description:
        'Obtiene el historial completo de estados y comentarios registrados para el pedido.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del pedido.',
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      responses: {
        200: {
          description: 'Seguimiento obtenido correctamente.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/PedidoSeguimiento',
                },
              },
            },
          },
        },
        401: {
          description: 'Usuario no autenticado.',
        },
        403: {
          description:
            'El usuario no tiene permisos para consultar el seguimiento.',
        },
        404: {
          description: 'Pedido no encontrado.',
        },
        500: {
          description: 'Error interno del servidor.',
        },
      },
    },

    post: {
      tags: ['Seguimiento de pedidos'],
      summary: 'Agregar comentario al seguimiento',
      description:
        'Agrega un comentario al seguimiento del pedido sin cambiar formalmente su estado.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID del pedido.',
          schema: {
            type: 'integer',
            format: 'int64',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PedidoSeguimientoCreate',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Comentario agregado correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PedidoSeguimiento',
              },
            },
          },
        },
        400: {
          description: 'El comentario es requerido.',
        },
        401: {
          description: 'Usuario no autenticado.',
        },
        403: {
          description:
            'Solo el administrador o propietario de la tienda puede agregar comentarios.',
        },
        404: {
          description: 'Pedido no encontrado.',
        },
        500: {
          description: 'Error interno del servidor.',
        },
      },
    },
  },
}