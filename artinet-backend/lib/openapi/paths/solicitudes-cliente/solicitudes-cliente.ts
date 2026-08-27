export const solicitudesClientePaths = {
  '/api/solicitudes-cliente': {
    get: {
      tags: ['Solicitudes de cliente'],

      summary: 'Listar solicitudes de cliente',

      description:
        'Obtiene una lista paginada de solicitudes. Los clientes pueden consultar sus propias solicitudes utilizando mine=true. Los administradores pueden consultar todas las solicitudes. Los demás usuarios pueden navegar únicamente las solicitudes que se encuentran abiertas.',

      operationId: 'listarSolicitudesCliente',

      security: [
        {
          bearerAuth: [],
        },
      ],

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
          description: 'Cantidad de solicitudes por página.',
          schema: {
            type: 'integer',
            minimum: 1,
            example: 20,
          },
        },

        {
          name: 'mine',
          in: 'query',
          required: false,
          description:
            'Si es true, el cliente obtiene únicamente sus propias solicitudes.',
          schema: {
            type: 'boolean',
            default: false,
            example: true,
          },
        },

        {
          name: 'categoria_id',
          in: 'query',
          required: false,
          description: 'Filtrar por categoría.',
          schema: {
            type: 'integer',
            example: 3,
          },
        },

        {
          name: 'ciudad',
          in: 'query',
          required: false,
          description: 'Filtrar por ciudad.',
          schema: {
            type: 'string',
            example: 'Managua',
          },
        },

        {
          name: 'departamento',
          in: 'query',
          required: false,
          description: 'Filtrar por departamento.',
          schema: {
            type: 'string',
            example: 'Managua',
          },
        },

        {
          name: 'estado',
          in: 'query',
          required: false,
          description:
            'Filtrar por estado. Cuando mine=true puede utilizarse para consultar las solicitudes propias por estado.',
          schema: {
            type: 'string',
            enum: [
              'abierta',
              'cerrada',
              'cancelada',
            ],
            example: 'abierta',
          },
        },
      ],

      responses: {
        200: {
          description: 'Solicitudes obtenidas correctamente.',

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
                      $ref:
                        '#/components/schemas/SolicitudCliente',
                    },
                  },

                  page: {
                    type: 'integer',
                    example: 1,
                  },

                  pageSize: {
                    type: 'integer',
                    example: 20,
                  },

                  total: {
                    type: 'integer',
                    example: 35,
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
      tags: ['Solicitudes de cliente'],

      summary: 'Crear una solicitud de cliente',

      description:
        'Crea una nueva solicitud de cliente. El usuario autenticado se establece automáticamente como cliente_id y la solicitud se crea inicialmente con estado abierta.',

      operationId: 'crearSolicitudCliente',

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
                '#/components/schemas/CrearSolicitudCliente',
            },
          },
        },
      },

      responses: {
        201: {
          description:
            'Solicitud creada correctamente.',

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
                      '#/components/schemas/SolicitudCliente',
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            'Datos de la solicitud inválidos.',
        },

        401: {
          description:
            'Usuario no autenticado.',
        },

        500: {
          description:
            'Error interno del servidor.',
        },
      },
    },
  },

  '/api/solicitudes-cliente/{id}': {
    get: {
      tags: ['Solicitudes de cliente'],

      summary: 'Obtener una solicitud específica',

      description:
        'Obtiene una solicitud de cliente por su identificador. El propietario y los administradores pueden verla independientemente de su estado. Las solicitudes abiertas también pueden ser consultadas por otros usuarios para participar en el marketplace.',

      operationId: 'obtenerSolicitudCliente',

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
          description: 'ID de la solicitud.',
          schema: {
            type: 'integer',
            example: 15,
          },
        },
      ],

      responses: {
        200: {
          description:
            'Solicitud obtenida correctamente.',

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
                      '#/components/schemas/SolicitudCliente',
                  },
                },
              },
            },
          },
        },

        401: {
          description:
            'Usuario no autenticado.',
        },

        403: {
          description:
            'El usuario no tiene permiso para consultar esta solicitud.',
        },

        404: {
          description:
            'Solicitud no encontrada.',
        },

        500: {
          description:
            'Error interno del servidor.',
        },
      },
    },

    patch: {
      tags: ['Solicitudes de cliente'],

      summary: 'Actualizar una solicitud de cliente',

      description:
        'Permite al propietario de la solicitud o a un administrador modificar una solicitud mientras permanezca abierta. El único cambio de estado permitido manualmente es pasarla a cancelada. El estado cerrada se establece automáticamente al aceptar una propuesta.',

      operationId: 'actualizarSolicitudCliente',

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
          description: 'ID de la solicitud.',
          schema: {
            type: 'integer',
            example: 15,
          },
        },
      ],

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref:
                '#/components/schemas/ActualizarSolicitudCliente',
            },
          },
        },
      },

      responses: {
        200: {
          description:
            'Solicitud actualizada correctamente.',

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
                      '#/components/schemas/SolicitudCliente',
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            'Datos inválidos o la solicitud ya no está abierta.',
        },

        401: {
          description:
            'Usuario no autenticado.',
        },

        403: {
          description:
            'El usuario no es propietario de la solicitud ni administrador.',
        },

        404: {
          description:
            'Solicitud no encontrada.',
        },

        500: {
          description:
            'Error interno del servidor.',
        },
      },
    },
  },

  '/api/solicitudes-cliente/{id}/propuestas': {
    get: {
      tags: ['Propuestas de solicitud'],

      summary: 'Listar propuestas de una solicitud',

      description:
        'Obtiene las propuestas recibidas para una solicitud. El cliente propietario y los administradores pueden ver todas las propuestas. Un vendedor solamente puede ver la propuesta de su propia tienda, evitando que pueda consultar las propuestas de la competencia.',

      operationId: 'listarPropuestasSolicitud',

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
          description:
            'ID de la solicitud de cliente.',
          schema: {
            type: 'integer',
            example: 15,
          },
        },
      ],

      responses: {
        200: {
          description:
            'Propuestas obtenidas correctamente.',

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
                      $ref:
                        '#/components/schemas/PropuestaConTienda',
                    },
                  },
                },
              },
            },
          },
        },

        401: {
          description:
            'Usuario no autenticado.',
        },

        404: {
          description:
            'Solicitud no encontrada.',
        },

        500: {
          description:
            'Error interno del servidor.',
        },
      },
    },

    post: {
      tags: ['Propuestas de solicitud'],

      summary: 'Enviar una propuesta a una solicitud',

      description:
        'Permite a un vendedor enviar una propuesta para una solicitud abierta. La tienda se obtiene de las tiendas activas pertenecientes al vendedor autenticado. Si el vendedor posee varias tiendas, debe indicar tienda_id. Una misma tienda no puede enviar más de una propuesta para la misma solicitud.',

      operationId: 'crearPropuestaSolicitud',

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
          description:
            'ID de la solicitud a la que se desea enviar la propuesta.',
          schema: {
            type: 'integer',
            example: 15,
          },
        },
      ],

      requestBody: {
        required: true,

        content: {
          'application/json': {
            schema: {
              $ref:
                '#/components/schemas/CrearPropuestaSolicitud',
            },
          },
        },
      },

      responses: {
        201: {
          description:
            'Propuesta enviada correctamente.',

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
                      '#/components/schemas/PropuestaSolicitud',
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            'Datos inválidos. La solicitud puede estar cerrada, la descripción puede ser inválida, el monto puede ser incorrecto o puede faltar moneda_id.',

        },

        401: {
          description:
            'Usuario no autenticado.',
        },

        403: {
          description:
            'El usuario no tiene una tienda activa disponible para realizar la propuesta o intenta utilizar una tienda que no le pertenece.',
        },

        404: {
          description:
            'Solicitud no encontrada.',
        },

        409: {
          description:
            'La tienda ya envió una propuesta para esta solicitud.',
        },

        500: {
          description:
            'Error interno del servidor.',
        },
      },
    },
  },
}