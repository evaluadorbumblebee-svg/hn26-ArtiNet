export const reportesPaths = {
  '/api/reportes': {
    get: {
      tags: ['Reportes'],
      summary: 'Listar reportes',
      description:
        'Obtiene una lista paginada de reportes. Los administradores pueden filtrar por estado, producto y tienda. Los usuarios normales solo pueden consultar los reportes creados por ellos mismos.',
      operationId: 'listarReportes',

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
          description: 'Cantidad de registros por página.',
          schema: {
            type: 'integer',
            minimum: 1,
            example: 20,
          },
        },
        {
          name: 'estado',
          in: 'query',
          required: false,
          description: 'Filtrar por estado. Disponible para administradores.',
          schema: {
            type: 'string',
            enum: [
              'pendiente',
              'en_revision',
              'resuelto',
              'descartado',
            ],
            example: 'pendiente',
          },
        },
        {
          name: 'producto_id',
          in: 'query',
          required: false,
          description: 'Filtrar por producto. Disponible para administradores.',
          schema: {
            type: 'integer',
            example: 25,
          },
        },
        {
          name: 'tienda_id',
          in: 'query',
          required: false,
          description: 'Filtrar por tienda. Disponible para administradores.',
          schema: {
            type: 'integer',
            example: 4,
          },
        },
      ],

      responses: {
        200: {
          description: 'Reportes obtenidos correctamente',
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
                      $ref: '#/components/schemas/Reporte',
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
                    example: 45,
                  },
                },
              },
            },
          },
        },

        401: {
          description: 'No autenticado',
        },

        500: {
          description: 'Error interno del servidor',
        },
      },
    },

    post: {
      tags: ['Reportes'],
      summary: 'Crear un reporte',
      description:
        'Crea un nuevo reporte sobre un producto o una tienda. Solo se puede reportar un producto o una tienda por solicitud.',
      operationId: 'crearReporte',

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
              $ref: '#/components/schemas/CrearReporte',
            },
          },
        },
      },

      responses: {
        201: {
          description: 'Reporte creado correctamente',
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
                    $ref: '#/components/schemas/Reporte',
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            'Datos inválidos. Debes indicar producto_id o tienda_id, pero no ambos, y el motivo es obligatorio.',
        },

        401: {
          description: 'No autenticado',
        },

        404: {
          description: 'Producto o tienda no encontrado',
        },

        500: {
          description: 'Error interno del servidor',
        },
      },
    },
  },

  '/api/reportes/{id}': {
    get: {
      tags: ['Reportes'],
      summary: 'Obtener un reporte',
      description:
        'Obtiene un reporte específico junto con la información básica del producto y la tienda asociados.',
      operationId: 'obtenerReporte',

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
          description: 'ID del reporte.',
          schema: {
            type: 'integer',
            example: 1,
          },
        },
      ],

      responses: {
        200: {
          description: 'Reporte obtenido correctamente',
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
                    allOf: [
                      {
                        $ref: '#/components/schemas/Reporte',
                      },
                      {
                        type: 'object',
                        properties: {
                          productos: {
                            type: 'object',
                            nullable: true,
                            properties: {
                              id: {
                                type: 'integer',
                                example: 25,
                              },
                              nombre: {
                                type: 'string',
                                example: 'Bota Ranchera',
                              },
                              slug: {
                                type: 'string',
                                example: 'bota-ranchera',
                              },
                            },
                          },
                          tiendas: {
                            type: 'object',
                            nullable: true,
                            properties: {
                              id: {
                                type: 'integer',
                                example: 4,
                              },
                              nombre: {
                                type: 'string',
                                example: 'Tienda Esmeralda',
                              },
                              slug: {
                                type: 'string',
                                example: 'tienda-esmeralda',
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },

        401: {
          description: 'No autenticado',
        },

        403: {
          description:
            'No tiene permisos para consultar este reporte.',
        },

        404: {
          description: 'Reporte no encontrado',
        },

        500: {
          description: 'Error interno del servidor',
        },
      },
    },

    patch: {
      tags: ['Reportes'],
      summary: 'Actualizar un reporte',
      description:
        'Actualiza el estado de un reporte y opcionalmente su descripción. Esta operación solo puede ser realizada por un administrador.',
      operationId: 'actualizarReporte',

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
          description: 'ID del reporte.',
          schema: {
            type: 'integer',
            example: 1,
          },
        },
      ],

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ActualizarReporte',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Reporte actualizado correctamente',
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
                    $ref: '#/components/schemas/Reporte',
                  },
                },
              },
            },
          },
        },

        400: {
          description: 'Estado inválido o no enviado',
        },

        401: {
          description: 'No autenticado',
        },

        403: {
          description:
            'Solo los administradores pueden actualizar reportes.',
        },

        404: {
          description: 'Reporte no encontrado',
        },

        500: {
          description: 'Error interno del servidor',
        },
      },
    },
  },
}