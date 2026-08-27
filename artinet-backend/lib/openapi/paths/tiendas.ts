/*export const tiendasPaths = {
  '/api/tiendas': {
    get: {
      tags: ['Tiendas'],
      summary: 'Listar tiendas',
      description: 'Obtiene las tiendas registradas en el catálogo.',
      parameters: [
        {
          name: 'categoria_id',
          in: 'query',
          schema: {
            type: 'integer',
          },
          description: 'Filtrar tiendas por categoría.',
        },
        {
          name: 'ciudad',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Filtrar tiendas por ciudad.',
        },
        {
          name: 'departamento',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Filtrar tiendas por departamento.',
        },
        {
          name: 'q',
          in: 'query',
          schema: {
            type: 'string',
          },
          description: 'Buscar tienda por nombre.',
        },
        {
          name: 'estado',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['pendiente', 'activa', 'suspendida'],
          },
          description: 'Filtrar tiendas por estado.',
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
          description: 'Listado de tiendas',
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
                      $ref: '#/components/schemas/Tienda',
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

    post: {
      tags: ['Tiendas'],
      summary: 'Crear tienda',
      description: 'Crea una nueva tienda.',
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
              required: [
                'moneda_id',
                'nombre',
                'pais',
                'departamento',
                'ciudad',
                'direccion',
                'tipo_negocio',
              ],
              properties: {
                categoria_id: {
                  type: 'integer',
                  nullable: true,
                },
                moneda_id: {
                  type: 'integer',
                },
                nombre: {
                  type: 'string',
                },
                slug: {
                  type: 'string',
                },
                descripcion: {
                  type: 'string',
                  nullable: true,
                },
                logo: {
                  type: 'string',
                  nullable: true,
                },
                banner: {
                  type: 'string',
                  nullable: true,
                },
                pais: {
                  type: 'string',
                },
                departamento: {
                  type: 'string',
                },
                ciudad: {
                  type: 'string',
                },
                direccion: {
                  type: 'string',
                },
                ruc: {
                  type: 'string',
                  nullable: true,
                },
                tipo_negocio: {
                  type: 'string',
                  enum: ['persona_natural', 'empresa'],
                },
                horario: {
                  type: 'string',
                  nullable: true,
                },
                telefono: {
                  type: 'string',
                  nullable: true,
                },
                whatsapp: {
                  type: 'string',
                  nullable: true,
                },
                email: {
                  type: 'string',
                  nullable: true,
                },
                facebook: {
                  type: 'string',
                  nullable: true,
                },
                instagram: {
                  type: 'string',
                  nullable: true,
                },
                sitio_web: {
                  type: 'string',
                  nullable: true,
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Tienda creada',
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
                    $ref: '#/components/schemas/Tienda',
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
        '403': {
          $ref: '#/components/responses/Forbidden',
        },
        '409': {
          $ref: '#/components/responses/Conflict',
        },
      },
    },
  },

  '/api/tiendas/{id}': {
    get: {
      tags: ['Tiendas'],
      summary: 'Obtener tienda por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la tienda.',
        },
      ],
      responses: {
        '200': {
          description: 'Tienda encontrada',
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
                    $ref: '#/components/schemas/Tienda',
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

    patch: {
      tags: ['Tiendas'],
      summary: 'Actualizar tienda',
      description: 'Actualiza los datos de una tienda.',
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
          description: 'ID de la tienda.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                categoria_id: {
                  type: 'integer',
                  nullable: true,
                },
                moneda_id: {
                  type: 'integer',
                },
                nombre: {
                  type: 'string',
                },
                slug: {
                  type: 'string',
                },
                descripcion: {
                  type: 'string',
                  nullable: true,
                },
                logo: {
                  type: 'string',
                  nullable: true,
                },
                banner: {
                  type: 'string',
                  nullable: true,
                },
                pais: {
                  type: 'string',
                },
                departamento: {
                  type: 'string',
                },
                ciudad: {
                  type: 'string',
                },
                direccion: {
                  type: 'string',
                },
                ruc: {
                  type: 'string',
                  nullable: true,
                },
                tipo_negocio: {
                  type: 'string',
                  enum: ['persona_natural', 'empresa'],
                },
                horario: {
                  type: 'string',
                  nullable: true,
                },
                telefono: {
                  type: 'string',
                  nullable: true,
                },
                whatsapp: {
                  type: 'string',
                  nullable: true,
                },
                email: {
                  type: 'string',
                  nullable: true,
                },
                facebook: {
                  type: 'string',
                  nullable: true,
                },
                instagram: {
                  type: 'string',
                  nullable: true,
                },
                sitio_web: {
                  type: 'string',
                  nullable: true,
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Tienda actualizada',
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
                    $ref: '#/components/schemas/Tienda',
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
        '403': {
          $ref: '#/components/responses/Forbidden',
        },
        '404': {
          $ref: '#/components/responses/NotFound',
        },
      },
    },
  },
} as const*/
 export const tiendasPaths = {
  '/api/tiendas': {
    get: {
      tags: ['Tiendas'],
      summary: 'Listar tiendas',
      description:
        'Listado paginado y ordenable de tiendas. Los usuarios no administradores solo ven tiendas activas.',
      security: [
        {
          supabaseSession: [],
        },
        {},
      ],
      parameters: [
        {
          name: 'categoria_id',
          in: 'query',
          schema: {
            type: 'integer',
          },
        },
        {
          name: 'ciudad',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'departamento',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'q',
          in: 'query',
          schema: {
            type: 'string',
          },
          description:
            'Búsqueda parcial sobre el nombre de la tienda.',
        },
        {
          name: 'estado',
          in: 'query',
          schema: {
            type: 'string',
            enum: [
              'pendiente',
              'activa',
              'rechazada',
              'suspendida',
            ],
          },
          description:
            'Filtro disponible para administradores.',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: {
            type: 'string',
            default: 'created_at',
          },
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1,
          },
        },
        {
          name: 'pageSize',
          in: 'query',
          schema: {
            type: 'integer',
            default: 20,
            minimum: 1,
            maximum: 100,
          },
        },
      ],
      responses: {
        '200': {
          description: 'Listado de tiendas.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Tienda',
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
          description: 'Error de base de datos.',
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
      tags: ['Tiendas'],
      summary: 'Solicitar una tienda nueva',
      description:
        'Crea una tienda en estado pendiente. Solo usuarios con rol vendedor.',
      security: [
        {
          supabaseSession: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'moneda_id',
                'nombre',
                'pais',
                'departamento',
                'ciudad',
                'direccion',
                'tipo_negocio',
              ],
              properties: {
                categoria_id: {
                  type: 'integer',
                },
                moneda_id: {
                  type: 'integer',
                },
                nombre: {
                  type: 'string',
                  minLength: 2,
                },
                slug: {
                  type: 'string',
                },
                descripcion: {
                  type: 'string',
                },
                logo: {
                  type: 'string',
                },
                banner: {
                  type: 'string',
                },
                pais: {
                  type: 'string',
                },
                departamento: {
                  type: 'string',
                },
                ciudad: {
                  type: 'string',
                },
                direccion: {
                  type: 'string',
                },
                ruc: {
                  type: 'string',
                },
                tipo_negocio: {
                  type: 'string',
                },
                horario: {
                  type: 'string',
                },
                telefono: {
                  type: 'string',
                },
                whatsapp: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                facebook: {
                  type: 'string',
                },
                instagram: {
                  type: 'string',
                },
                sitio_web: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Tienda creada en estado pendiente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Tienda',
              },
            },
          },
        },
        '400': {
          description: 'Datos requeridos faltantes o inválidos.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '401': {
          description: 'No autenticado.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '403': {
          description: 'El usuario no tiene rol vendedor.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '409': {
          description:
            'El propietario ya tiene una tienda pendiente o activa, o el slug ya existe.',
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

  '/api/tiendas/{id}': {
    get: {
      tags: ['Tiendas'],
      summary: 'Obtener detalle de una tienda',
      description:
        'Obtiene una tienda utilizando un ID numérico o el slug.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'ID numérico o slug de la tienda.',
        },
      ],
      responses: {
        '200': {
          description: 'Detalle de la tienda.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Tienda',
              },
            },
          },
        },
        '404': {
          description: 'Tienda no encontrada.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '500': {
          description: 'Error de base de datos.',
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

    patch: {
      tags: ['Tiendas'],
      summary: 'Actualizar datos de la tienda',
      description:
        'Permite al propietario o administrador actualizar los datos de la tienda. El porcentaje de comisión solo puede ser modificado por un administrador.',
      security: [
        {
          supabaseSession: [],
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
          description: 'ID de la tienda.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                categoria_id: {
                  type: 'integer',
                },
                nombre: {
                  type: 'string',
                },
                slug: {
                  type: 'string',
                },
                descripcion: {
                  type: 'string',
                },
                logo: {
                  type: 'string',
                },
                banner: {
                  type: 'string',
                },
                pais: {
                  type: 'string',
                },
                departamento: {
                  type: 'string',
                },
                ciudad: {
                  type: 'string',
                },
                direccion: {
                  type: 'string',
                },
                ruc: {
                  type: 'string',
                },
                tipo_negocio: {
                  type: 'string',
                },
                horario: {
                  type: 'string',
                },
                telefono: {
                  type: 'string',
                },
                whatsapp: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                facebook: {
                  type: 'string',
                },
                instagram: {
                  type: 'string',
                },
                sitio_web: {
                  type: 'string',
                },
                porcentaje_comision: {
                  type: 'number',
                  format: 'float',
                  description:
                    'Solo editable por administradores.',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Tienda actualizada.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Tienda',
              },
            },
          },
        },
        '400': {
          description:
            'No se envió ningún campo actualizable.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '401': {
          description: 'No autenticado.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '403': {
          description:
            'El usuario no es propietario ni administrador.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '404': {
          description: 'Tienda no encontrada.',
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

  '/api/tiendas/{id}/aprobar': {
    patch: {
      tags: ['Tiendas'],
      summary: 'Aprobar o rechazar una tienda',
      description:
        'Actualiza el estado de una tienda. Solo administradores.',
      security: [
        {
          supabaseSession: [],
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
          description: 'ID de la tienda.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['accion'],
              properties: {
                accion: {
                  type: 'string',
                  enum: ['aprobar', 'rechazar'],
                },
                observaciones: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Estado de la tienda actualizado.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Tienda',
              },
            },
          },
        },
        '403': {
          description: 'Solo administradores.',
        },
      },
    },
  },

  '/api/tiendas/{id}/comisiones': {
    get: {
      tags: ['Finanzas'],
      summary: 'Listar comisiones de la tienda',
      description:
        'Obtiene las comisiones asociadas a una tienda.',
      security: [
        {
          supabaseSession: [],
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
          description: 'ID de la tienda.',
        },
        {
          name: 'estado',
          in: 'query',
          schema: {
            type: 'string',
            enum: [
              'pendiente',
              'en_liquidacion',
              'liquidada',
            ],
          },
        },
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1,
          },
        },
        {
          name: 'pageSize',
          in: 'query',
          schema: {
            type: 'integer',
            default: 20,
            minimum: 1,
            maximum: 100,
          },
        },
      ],
      responses: {
        '200': {
          description: 'Listado de comisiones.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  comisiones: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        pedido_id: {
                          type: 'integer',
                        },
                        monto_venta: {
                          type: 'number',
                        },
                        monto_comision: {
                          type: 'number',
                        },
                        monto_vendedor: {
                          type: 'number',
                        },
                        estado: {
                          type: 'string',
                        },
                        created_at: {
                          type: 'string',
                          format: 'date-time',
                        },
                      },
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
        '403': {
          description:
            'No es propietario ni administrador.',
        },
      },
    },
  },

  '/api/tiendas/{id}/cuentas-bancarias': {
    get: {
      tags: ['Cuentas bancarias'],
      summary: 'Listar cuentas bancarias de la tienda',
      security: [
        {
          supabaseSession: [],
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
          description: 'ID de la tienda.',
        },
      ],
      responses: {
        '200': {
          description: 'Listado de cuentas bancarias.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/CuentaBancaria',
                },
              },
            },
          },
        },
        '403': {
          description:
            'No es propietario ni administrador.',
        },
      },
    },

    post: {
      tags: ['Cuentas bancarias'],
      summary: 'Agregar una cuenta bancaria',
      description:
        'Agrega una cuenta bancaria a la tienda.',
      security: [
        {
          supabaseSession: [],
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
          description: 'ID de la tienda.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: [
                'banco_id',
                'metodo_pago_id',
                'titular',
                'numero_cuenta',
              ],
              properties: {
                banco_id: {
                  type: 'integer',
                },
                metodo_pago_id: {
                  type: 'integer',
                },
                titular: {
                  type: 'string',
                },
                numero_cuenta: {
                  type: 'string',
                },
                principal: {
                  type: 'boolean',
                  default: false,
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Cuenta bancaria creada.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CuentaBancaria',
              },
            },
          },
        },
        '400': {
          description: 'Datos inválidos.',
        },
        '403': {
          description:
            'No es propietario ni administrador.',
        },
      },
    },
  },

  '/api/tiendas/{id}/dashboard': {
    get: {
      tags: ['Finanzas'],
      summary: 'Dashboard financiero y operativo',
      description:
        'Devuelve un resumen consolidado de ventas, productos, reseñas y finanzas de la tienda.',
      security: [
        {
          supabaseSession: [],
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
          description: 'ID de la tienda.',
        },
        {
          name: 'desde',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            format: 'date',
          },
          description:
            'Filtra pedidos con created_at >= desde.',
        },
        {
          name: 'hasta',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            format: 'date',
          },
          description:
            'Filtra pedidos con created_at <= hasta.',
        },
      ],
      responses: {
        '200': {
          description: 'Resumen del dashboard.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DashboardTienda',
              },
            },
          },
        },
        '401': {
          description: 'No autenticado.',
        },
        '403': {
          description:
            'No es propietario ni administrador.',
        },
        '404': {
          description: 'Tienda no encontrada.',
        },
      },
    },
  },

  '/api/tiendas/{id}/movimientos-financieros': {
    get: {
      tags: ['Finanzas'],
      summary: 'Historial de movimientos financieros',
      description:
        'Lista paginada del libro de movimientos financieros con saldo corriente y resumen de ingresos y egresos.',
      security: [
        {
          supabaseSession: [],
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
          description: 'ID de la tienda.',
        },
        {
          name: 'tipo',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
          },
          description:
            'Tipo de movimiento, por ejemplo venta o liquidacion.',
        },
        {
          name: 'desde',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            format: 'date-time',
          },
        },
        {
          name: 'hasta',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            format: 'date-time',
          },
        },
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1,
          },
        },
        {
          name: 'pageSize',
          in: 'query',
          schema: {
            type: 'integer',
            default: 20,
            minimum: 1,
            maximum: 100,
          },
        },
      ],
      responses: {
        '200': {
          description:
            'Historial de movimientos con saldo actual.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  saldo_actual: {
                    type: 'number',
                    format: 'float',
                  },
                  resumen_pagina: {
                    type: 'object',
                    properties: {
                      ingresos: {
                        type: 'number',
                        format: 'float',
                      },
                      egresos: {
                        type: 'number',
                        format: 'float',
                      },
                    },
                  },
                  movimientos: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/MovimientoFinanciero',
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
          description: 'No autenticado.',
        },
        '403': {
          description:
            'No es propietario ni administrador.',
        },
        '404': {
          description: 'Tienda no encontrada.',
        },
      },
    },
  },

  '/api/tiendas/{id}/liquidaciones': {
    get: {
      tags: ['Finanzas'],
      summary: 'Listar liquidaciones de la tienda',
      description:
        'Historial de liquidaciones y monto pendiente por liquidar.',
      security: [
        {
          supabaseSession: [],
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
          description: 'ID de la tienda.',
        },
        {
          name: 'estado',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: [
              'pendiente',
              'procesada',
              'rechazada',
            ],
          },
        },
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1,
          },
        },
        {
          name: 'pageSize',
          in: 'query',
          schema: {
            type: 'integer',
            default: 20,
            minimum: 1,
            maximum: 100,
          },
        },
      ],
      responses: {
        '200': {
          description: 'Listado de liquidaciones.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  total_pendiente_por_liquidar: {
                    type: 'number',
                    format: 'float',
                  },
                  liquidaciones: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Liquidacion',
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
          description: 'No autenticado.',
        },
        '403': {
          description:
            'No es propietario ni administrador.',
        },
        '404': {
          description: 'Tienda no encontrada.',
        },
      },
    },

    post: {
      tags: ['Finanzas'],
      summary: 'Solicitar una nueva liquidación',
      description:
        'Agrupa todas las comisiones pendientes de la tienda en una nueva liquidación.',
      security: [
        {
          supabaseSession: [],
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
          description: 'ID de la tienda.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['cuenta_bancaria_id'],
              properties: {
                cuenta_bancaria_id: {
                  type: 'integer',
                  description:
                    'Debe pertenecer a la tienda y estar activa.',
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Liquidación creada.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  liquidacion_id: {
                    type: 'integer',
                  },
                  monto_total: {
                    type: 'number',
                    format: 'float',
                  },
                },
              },
            },
          },
        },
        '400': {
          description:
            'Sin comisiones pendientes, cuenta bancaria inválida o tienda no activa/aprobada.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '401': {
          description: 'No autenticado.',
        },
        '403': {
          description:
            'No es propietario ni administrador.',
        },
        '404': {
          description: 'Tienda no encontrada.',
        },
      },
    },
  },
} as const