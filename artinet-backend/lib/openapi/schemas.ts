export const schemas = {
// ============================================================*
// solicitude clientes
//===========================================================*
  SolicitudCliente: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 15,
        description: 'Identificador único de la solicitud.',
      },

      cliente_id: {
        type: 'string',
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Usuario que creó la solicitud.',
      },

      categoria_id: {
        type: 'integer',
        nullable: true,
        example: 3,
        description: 'Categoría asociada a la solicitud.',
      },

      titulo: {
        type: 'string',
        example: 'Necesito una laptop para diseño gráfico',
        description: 'Título de la solicitud.',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Busco una laptop adecuada para trabajar con programas de diseño.',
        description: 'Descripción detallada de lo solicitado.',
      },

      presupuesto: {
        type: 'number',
        format: 'float',
        nullable: true,
        example: 850,
        description: 'Presupuesto máximo o estimado del cliente.',
      },

      moneda_id: {
        type: 'integer',
        example: 1,
        description: 'Moneda utilizada para expresar el presupuesto.',
      },

      pais: {
        type: 'string',
        example: 'Nicaragua',
        description: 'País donde se requiere el producto o servicio.',
      },

      departamento: {
        type: 'string',
        example: 'Managua',
        description: 'Departamento donde se requiere el producto o servicio.',
      },

      ciudad: {
        type: 'string',
        example: 'Managua',
        description: 'Ciudad donde se requiere el producto o servicio.',
      },

      direccion: {
        type: 'string',
        example: 'Villa Fontana, Managua',
        description: 'Dirección indicada por el cliente.',
      },

      imagen_referencia: {
        type: 'string',
        nullable: true,
        format: 'uri',
        example: 'https://example.com/referencia.jpg',
        description: 'Imagen de referencia proporcionada por el cliente.',
      },

      fecha_limite: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-09-15T23:59:59Z',
        description: 'Fecha límite para recibir propuestas.',
      },

      estado: {
        type: 'string',
        enum: [
          'abierta',
          'cerrada',
          'cancelada',
        ],
        example: 'abierta',
        description: 'Estado actual de la solicitud.',
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-27T14:30:00Z',
        description: 'Fecha de creación.',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-27T15:30:00Z',
        description: 'Fecha de última actualización.',
      },
    },
  },

  CrearSolicitudCliente: {
    type: 'object',

    required: [
      'titulo',
      'moneda_id',
      'pais',
      'departamento',
      'ciudad',
      'direccion',
    ],

    properties: {
      categoria_id: {
        type: 'integer',
        nullable: true,
        example: 3,
        description: 'Categoría de la solicitud.',
      },

      titulo: {
        type: 'string',
        minLength: 3,
        example: 'Necesito una laptop para diseño gráfico',
        description:
          'Título de la solicitud. Debe tener al menos 3 caracteres.',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Busco una laptop con buenas características para diseño.',
      },

      presupuesto: {
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: 0,
        example: 850,
        description: 'Presupuesto disponible para la solicitud.',
      },

      moneda_id: {
        type: 'integer',
        example: 1,
        description: 'ID de la moneda utilizada.',
      },

      pais: {
        type: 'string',
        example: 'Nicaragua',
      },

      departamento: {
        type: 'string',
        example: 'Managua',
      },

      ciudad: {
        type: 'string',
        example: 'Managua',
      },

      direccion: {
        type: 'string',
        example: 'Villa Fontana, Managua',
      },

      imagen_referencia: {
        type: 'string',
        nullable: true,
        format: 'uri',
        example: 'https://example.com/referencia.jpg',
      },

      fecha_limite: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-09-15T23:59:59Z',
      },
    },
  },

  ActualizarSolicitudCliente: {
    type: 'object',

    description:
      'Campos que pueden modificarse mientras la solicitud permanezca abierta. El estado solo puede cambiarse manualmente a cancelada.',

    properties: {
      categoria_id: {
        type: 'integer',
        nullable: true,
        example: 3,
      },

      titulo: {
        type: 'string',
        minLength: 3,
        example: 'Necesito una laptop para diseño gráfico',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example: 'Descripción actualizada de la solicitud.',
      },

      presupuesto: {
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: 0,
        example: 900,
      },

      moneda_id: {
        type: 'integer',
        example: 1,
      },

      pais: {
        type: 'string',
        example: 'Nicaragua',
      },

      departamento: {
        type: 'string',
        example: 'Managua',
      },

      ciudad: {
        type: 'string',
        example: 'Managua',
      },

      direccion: {
        type: 'string',
        example: 'Ciudad de Managua',
      },

      imagen_referencia: {
        type: 'string',
        nullable: true,
        format: 'uri',
        example: 'https://example.com/nueva-referencia.jpg',
      },

      fecha_limite: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-09-20T23:59:59Z',
      },

      estado: {
        type: 'string',
        enum: ['cancelada'],
        example: 'cancelada',
        description:
          "El único cambio de estado permitido mediante este endpoint es 'cancelada'.",
      },
    },
  },

  PropuestaSolicitud: {
    type: 'object',

    properties: {
      id: {
        type: 'integer',
        example: 45,
      },

      solicitud_id: {
        type: 'integer',
        example: 15,
      },

      tienda_id: {
        type: 'integer',
        example: 8,
      },

      descripcion: {
        type: 'string',
        example:
          'Podemos ofrecer el producto solicitado con entrega incluida.',
      },

      monto: {
        type: 'number',
        format: 'float',
        example: 780,
      },

      moneda_id: {
        type: 'integer',
        example: 1,
      },

      tiempo_entrega: {
        type: 'string',
        nullable: true,
        example: '3 días',
      },

      observaciones: {
        type: 'string',
        nullable: true,
        example: 'Disponible para entrega inmediata.',
      },

      estado: {
        type: 'string',
        enum: [
          'pendiente',
          'aceptada',
          'rechazada',
        ],
        example: 'pendiente',
      },

      created_at: {
        type: 'string',
        format: 'date-time',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  CrearPropuestaSolicitud: {
    type: 'object',

    required: [
      'descripcion',
      'monto',
      'moneda_id',
    ],

    properties: {
      tienda_id: {
        type: 'integer',
        nullable: true,
        example: 8,
        description:
          'Tienda desde la cual se envía la propuesta. Es opcional si el vendedor solo tiene una tienda. Si tiene varias, debe especificarla.',
      },

      descripcion: {
        type: 'string',
        minLength: 1,
        example:
          'Ofrecemos el producto solicitado con entrega incluida.',
        description: 'Descripción de la propuesta.',
      },

      monto: {
        type: 'number',
        format: 'float',
        exclusiveMinimum: 0,
        example: 780,
        description: 'Monto ofrecido en la propuesta.',
      },

      moneda_id: {
        type: 'integer',
        example: 1,
        description: 'Moneda utilizada para el monto.',
      },

      tiempo_entrega: {
        type: 'string',
        nullable: true,
        example: '3 días',
        description: 'Tiempo estimado de entrega.',
      },

      observaciones: {
        type: 'string',
        nullable: true,
        example: 'Producto disponible actualmente.',
        description: 'Observaciones adicionales.',
      },
    },
  },

  PropuestaConTienda: {
    allOf: [
      {
        $ref: '#/components/schemas/PropuestaSolicitud',
      },
      {
        type: 'object',
        properties: {
          tiendas: {
            type: 'object',
            nullable: true,
            properties: {
              id: {
                type: 'integer',
                example: 8,
              },

              nombre: {
                type: 'string',
                example: 'Tienda Esmeralda',
              },

              slug: {
                type: 'string',
                example: 'tienda-esmeralda',
              },

              logo: {
                type: 'string',
                nullable: true,
                format: 'uri',
                example: 'https://example.com/logo.png',
              },

              calificacion: {
                type: 'number',
                format: 'float',
                nullable: true,
                example: 4.75,
              },
            },
          },
        },
      },
    ],
  },

// ============================================================*
// Reseñas de productos
//===========================================================*
  Resena: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 25,
        description: 'Identificador único de la reseña.',
      },

      usuario_id: {
        type: 'string',
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Usuario que realizó la reseña.',
      },

      pedido_id: {
        type: 'integer',
        example: 120,
        description: 'Pedido al que pertenece la reseña.',
      },

      producto_id: {
        type: 'integer',
        example: 45,
        description: 'Producto reseñado.',
      },

      tienda_id: {
        type: 'integer',
        example: 8,
        description: 'Tienda a la que pertenece el producto.',
      },

      calificacion: {
        type: 'integer',
        minimum: 1,
        maximum: 5,
        example: 5,
        description: 'Calificación otorgada al producto, de 1 a 5 estrellas.',
      },

      comentario: {
        type: 'string',
        nullable: true,
        example: 'Excelente producto, buena calidad.',
        description: 'Comentario opcional realizado por el cliente.',
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-27T15:30:00Z',
        description: 'Fecha de creación de la reseña.',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-27T15:30:00Z',
        description: 'Fecha de última actualización.',
      },

      perfiles: {
        type: 'object',
        nullable: true,
        description: 'Información pública básica del usuario que realizó la reseña.',
        properties: {
          nombres: {
            type: 'string',
            example: 'Byron',
          },

          apellidos: {
            type: 'string',
            example: 'Picado',
          },

          foto: {
            type: 'string',
            nullable: true,
            format: 'uri',
            example: 'https://example.com/foto.jpg',
          },
        },
      },
    },
  },

  CrearResena: {
    type: 'object',

    required: [
      'pedido_id',
      'producto_id',
      'calificacion',
    ],

    properties: {
      pedido_id: {
        type: 'integer',
        example: 120,
        description:
          'ID del pedido entregado al que pertenece el producto.',
      },

      producto_id: {
        type: 'integer',
        example: 45,
        description:
          'ID del producto que se desea reseñar. Debe pertenecer al pedido indicado.',
      },

      calificacion: {
        type: 'integer',
        minimum: 1,
        maximum: 5,
        example: 5,
        description:
          'Calificación del producto. Debe estar entre 1 y 5 estrellas.',
      },

      comentario: {
        type: 'string',
        nullable: true,
        example:
          'El producto llegó en excelente estado y cumple con la descripción.',
        description: 'Comentario opcional sobre el producto.',
      },
    },
  },

  DistribucionCalificaciones: {
    type: 'object',

    properties: {
      total: {
        type: 'integer',
        example: 125,
        description: 'Cantidad total de reseñas.',
      },

      promedio: {
        type: 'number',
        format: 'float',
        minimum: 0,
        maximum: 5,
        example: 4.36,
        description: 'Promedio de las calificaciones.',
      },

      distribucion: {
        type: 'object',
        description:
          'Cantidad de reseñas agrupadas según la cantidad de estrellas.',
        properties: {
          '1': {
            type: 'integer',
            example: 5,
          },

          '2': {
            type: 'integer',
            example: 8,
          },

          '3': {
            type: 'integer',
            example: 12,
          },

          '4': {
            type: 'integer',
            example: 30,
          },

          '5': {
            type: 'integer',
            example: 70,
          },
        },
      },
    },
  },

  ResenaConEstadisticas: {
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
        example: 125,
      },

      stats: {
        nullable: true,
        allOf: [
          {
            $ref: '#/components/schemas/DistribucionCalificaciones',
          },
        ],
      },
    },
  },  
// ============================================================*
// Reportes
//===========================================================*

  Reporte: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },
      usuario_id: {
        type: 'string',
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
      },
      producto_id: {
        type: 'integer',
        nullable: true,
        example: 25,
      },
      tienda_id: {
        type: 'integer',
        nullable: true,
        example: 4,
      },
      motivo: {
        type: 'string',
        example: 'Producto incorrecto',
      },
      descripcion: {
        type: 'string',
        nullable: true,
        example: 'El producto mostrado no corresponde con la descripción.',
      },
      estado: {
        type: 'string',
        enum: [
          'pendiente',
          'en_revision',
          'resuelto',
          'descartado',
        ],
        example: 'pendiente',
      },
      revisado_por: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        example: '550e8400-e29b-41d4-a716-446655440000',
      },
      fecha_revision: {
        type: 'string',
        format: 'date-time',
        nullable: true,
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  CrearReporte: {
    type: 'object',
    required: ['motivo'],
    properties: {
      producto_id: {
        type: 'integer',
        nullable: true,
        example: 25,
        description: 'ID del producto a reportar.',
      },
      tienda_id: {
        type: 'integer',
        nullable: true,
        example: 4,
        description: 'ID de la tienda a reportar.',
      },
      motivo: {
        type: 'string',
        minLength: 1,
        example: 'Producto incorrecto',
      },
      descripcion: {
        type: 'string',
        nullable: true,
        example: 'El producto mostrado no corresponde con la descripción.',
      },
    },
  },

  ActualizarReporte: {
    type: 'object',
    required: ['estado'],
    properties: {
      estado: {
        type: 'string',
        enum: [
          'pendiente',
          'en_revision',
          'resuelto',
          'descartado',
        ],
        example: 'resuelto',
      },
      descripcion: {
        type: 'string',
        nullable: true,
        example: 'El reporte fue revisado y se corrigió la información.',
      },
    },
  },

// ============================================================*
// propuestas
// ============================================================*

    PropuestaSolicitudes: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 15,
      },
      solicitud_id: {
        type: 'integer',
        example: 8,
      },
      tienda_id: {
        type: 'integer',
        example: 3,
      },
      estado: {
        type: 'string',
        enum: [
          'pendiente',
          'aceptada',
          'rechazada',
        ],
        example: 'pendiente',
      },
      precio_total: {
        type: 'number',
        format: 'float',
        example: 1250.00,
      },
      observaciones: {
        type: 'string',
        nullable: true,
        example: 'Disponible para entrega inmediata.',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-27T14:30:00Z',
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-27T15:00:00Z',
      },
    },
  },

  RechazarPropuesta: {
    type: 'object',
    properties: {
      observaciones: {
        type: 'string',
        nullable: true,
        example: 'No contamos con disponibilidad del producto solicitado.',
      },
    },
  },
// ============================================================*
// pedidos
// ============================================================*


  Pedido: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        format: 'int64',
        example: 15,
      },
      numero_orden: {
        type: 'string',
        example: 'ORD-20260826-5832',
      },
      cliente_id: {
        type: 'string',
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
      },
      tienda_id: {
        type: 'integer',
        format: 'int64',
        example: 3,
      },
      direccion_entrega_id: {
        type: 'integer',
        format: 'int64',
        example: 7,
      },
      metodo_pago_id: {
        type: 'integer',
        format: 'int64',
        example: 2,
      },
      moneda_id: {
        type: 'integer',
        format: 'int64',
        example: 1,
      },
      tipo_entrega: {
        type: 'string',
        example: 'domicilio',
      },
      subtotal: {
        type: 'number',
        format: 'float',
        example: 850,
      },
      monto_comision: {
        type: 'number',
        format: 'float',
        example: 10,
      },
      total: {
        type: 'number',
        format: 'float',
        example: 850,
      },
      estado: {
        type: 'string',
        enum: [
          'pendiente',
          'confirmado',
          'en_preparacion',
          'enviado',
          'entregado',
          'cancelado',
        ],
        example: 'pendiente',
      },
      observaciones: {
        type: 'string',
        nullable: true,
        example: 'Entregar por la tarde.',
      },
      solicitud_cliente_id: {
        type: 'integer',
        format: 'int64',
        nullable: true,
        example: 12,
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-26T18:30:00Z',
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-26T19:00:00Z',
      },
      tiendas: {
        $ref: '#/components/schemas/TiendaPropietario',
      },
    },
  },

  TiendaPropietario: {
    type: 'object',
    nullable: true,
    properties: {
      propietario_id: {
        type: 'string',
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
  },

  PedidoDetalle: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        format: 'int64',
        example: 25,
      },
      cantidad: {
        type: 'integer',
        example: 2,
      },
      precio_unitario: {
        type: 'number',
        format: 'float',
        example: 425,
      },
      subtotal: {
        type: 'number',
        format: 'float',
        example: 850,
      },
      variantes_producto: {
        type: 'object',
        nullable: true,
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
            example: 10,
          },
          color: {
            type: 'string',
            nullable: true,
            example: 'Negro',
          },
          talla: {
            type: 'string',
            nullable: true,
            example: '40',
          },
          sku: {
            type: 'string',
            nullable: true,
            example: 'ZAP-NEG-40',
          },
          productos: {
            type: 'object',
            nullable: true,
            properties: {
              id: {
                type: 'integer',
                format: 'int64',
                example: 5,
              },
              nombre: {
                type: 'string',
                example: 'Zapato artesanal',
              },
              slug: {
                type: 'string',
                example: 'zapato-artesanal',
              },
              imagenes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    url: {
                      type: 'string',
                      format: 'uri',
                      example: 'https://ejemplo.com/zapato.jpg',
                    },
                    principal: {
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
    },
  },

  PedidoDetalleCompleto: {
    allOf: [
      {
        $ref: '#/components/schemas/Pedido',
      },
      {
        type: 'object',
        properties: {
          detalle: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PedidoDetalle',
            },
          },
        },
      },
    ],
  },

  PedidoEstadoUpdate: {
    type: 'object',
    required: ['estado'],
    properties: {
      estado: {
        type: 'string',
        enum: [
          'pendiente',
          'confirmado',
          'en_preparacion',
          'enviado',
          'entregado',
          'cancelado',
        ],
        example: 'confirmado',
      },
      comentario: {
        type: 'string',
        nullable: true,
        example: 'Pedido confirmado por la tienda.',
      },
    },
  },

  PedidoSeguimiento: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        format: 'int64',
        example: 30,
      },
      pedido_id: {
        type: 'integer',
        format: 'int64',
        example: 15,
      },
      estado: {
        type: 'string',
        enum: [
          'pendiente',
          'confirmado',
          'en_preparacion',
          'enviado',
          'entregado',
          'cancelado',
        ],
        example: 'confirmado',
      },
      comentario: {
        type: 'string',
        nullable: true,
        example: 'El pedido fue confirmado por la tienda.',
      },
      actualizado_por: {
        type: 'string',
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-26T19:15:00Z',
      },
    },
  },

  PedidoSeguimientoCreate: {
    type: 'object',
    required: ['comentario'],
    properties: {
      comentario: {
        type: 'string',
        example: 'El pedido está siendo preparado.',
      },
    },
  },

  PedidoUpdate: {
    type: 'object',
    properties: {
      observaciones: {
        type: 'string',
        nullable: true,
        example: 'Llamar antes de entregar.',
      },
      direccion_entrega_id: {
        type: 'integer',
        format: 'int64',
        example: 8,
      },
      tipo_entrega: {
        type: 'string',
        example: 'domicilio',
      },
    },
  },

  PedidoCreate: {
    type: 'object',
    required: [
      'tienda_id',
      'direccion_entrega_id',
      'metodo_pago_id',
      'moneda_id',
      'tipo_entrega',
    ],
    properties: {
      tienda_id: {
        type: 'integer',
        format: 'int64',
        example: 3,
      },
      direccion_entrega_id: {
        type: 'integer',
        format: 'int64',
        example: 7,
      },
      metodo_pago_id: {
        type: 'integer',
        format: 'int64',
        example: 2,
      },
      moneda_id: {
        type: 'integer',
        format: 'int64',
        example: 1,
      },
      tipo_entrega: {
        type: 'string',
        example: 'domicilio',
      },
      observaciones: {
        type: 'string',
        nullable: true,
        example: 'Entregar después de las 5 PM.',
      },
      solicitud_cliente_id: {
        type: 'integer',
        format: 'int64',
        nullable: true,
        example: 12,
      },
    },
  },

  Pago: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        format: 'int64',
        example: 20,
      },
      pedido_id: {
        type: 'integer',
        format: 'int64',
        example: 15,
      },
      metodo_pago_id: {
        type: 'integer',
        format: 'int64',
        example: 2,
      },
      referencia: {
        type: 'string',
        nullable: true,
        example: 'TRX-982173',
      },
      monto: {
        type: 'number',
        format: 'float',
        example: 850,
      },
      estado: {
        type: 'string',
        example: 'pendiente',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-26T19:20:00Z',
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-26T19:25:00Z',
      },
      comprobantes: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ComprobantePago',
        },
      },
    },
  },

  ComprobantePago: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        format: 'int64',
        example: 5,
      },
      archivo: {
        type: 'string',
        example: 'comprobantes/pago-15.jpg',
      },
      observacion: {
        type: 'string',
        nullable: true,
        example: 'Comprobante de transferencia.',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-26T19:21:00Z',
      },
    },
  },

  PagoCreate: {
    type: 'object',
    required: [
      'metodo_pago_id',
      'monto',
    ],
    properties: {
      metodo_pago_id: {
        type: 'integer',
        format: 'int64',
        example: 2,
      },
      referencia: {
        type: 'string',
        nullable: true,
        example: 'TRX-982173',
      },
      monto: {
        type: 'number',
        format: 'float',
        minimum: 0.01,
        example: 850,
      },
    },
  },


// ============================================================*
// PAGOS
// ============================================================*



Comprobante: {

  type: 'object',

  properties: {

    id: {

      type: 'integer',

      example: 1,

    },

    pago_id: {

      type: 'integer',

      example: 15,

    },

    archivo: {

      type: 'string',

      format: 'uri',

      example: 'https://xxxxx.supabase.co/storage/v1/object/public/artinet-images/comprobantes/15-1756234567890.jpg',

      description: 'URL pública de la imagen del comprobante almacenada en Supabase Storage.',

    },

    observacion: {

      type: 'string',

      nullable: true,

      example: 'Comprobante de transferencia bancaria',

    },

    created_at: {

      type: 'string',

      format: 'date-time',

    },

  },

},

CrearComprobante: {

  type: 'object',

  properties: {

    file: {

      type: 'string',

      format: 'binary',

      description: 'Imagen del comprobante de pago. Formatos permitidos: JPG, PNG, WEBP o GIF. Tamaño máximo: 5MB.',

    },

    observacion: {

      type: 'string',

      nullable: true,

      example: 'Comprobante de transferencia',

    },

  },

},

   // ============================================================
  // Notificaciones
  // ============================================================

  Notificacion: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 15,
      },
      usuario_id: {
        type: 'string',
        format: 'uuid',
      },
      titulo: {
        type: 'string',
        example: 'Nuevo pago recibido',
      },
      mensaje: {
        type: 'string',
        example: 'Se registró un pago de 150.00 para uno de tus pedidos.',
      },
      enlace: {
        type: 'string',
        nullable: true,
        example: '/tienda/pedidos/42',
      },
      leida: {
        type: 'boolean',
        example: false,
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
    },
    required: ['id', 'usuario_id', 'titulo', 'mensaje', 'leida', 'created_at'],
  },

  // ============================================================
  // Favoritos
  // ============================================================
  Favorito: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 10,
      },
      usuario_id: {
        type: 'string',
        format: 'uuid',
      },
      producto_id: {
        type: 'integer',
        example: 55,
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
    },
    required: ['id', 'usuario_id', 'producto_id'],
  },



  // ============================================================
  // Auditoria
  // ============================================================

  Auditoria: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      usuario_id: { type: 'string', format: 'uuid', nullable: true },
      tabla: { type: 'string', example: 'productos' },
      registro_id: { type: 'string', format: 'uuid' },
      accion: {
        type: 'string',
        enum: ['crear', 'actualizar', 'eliminar', 'aprobar', 'rechazar', 'suspender'],
      },
      datos_anteriores: {
        type: 'object',
        nullable: true,
        additionalProperties: true,
        description: 'Snapshot del registro antes del cambio (null si es creación)',
      },
      datos_nuevos: {
        type: 'object',
        nullable: true,
        additionalProperties: true,
        description: 'Snapshot del registro después del cambio (null si es eliminación)',
      },
      ip: { type: 'string', nullable: true, example: '190.86.10.24' },
      user_agent: { type: 'string', nullable: true },
      created_at: { type: 'string', format: 'date-time' },
      usuario: {
        type: 'object',
        nullable: true,
        description: 'Presente cuando el endpoint hace join con perfiles',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nombres: { type: 'string' },
          apellidos: { type: 'string' },
          rol: { type: 'string' },
        },
      },
    },
    required: ['id', 'tabla', 'registro_id', 'accion', 'created_at'],
  },
 
  AuditoriaListResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Auditoria' },
      },
      meta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          pageSize: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 134 },
        },
      },
    },
  },
 
  AuditoriaDetalleResponse: {
    type: 'object',
    properties: {
      data: { $ref: '#/components/schemas/Auditoria' },
    },
  },
 
  AuditoriaResumenResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          total_eventos: { type: 'integer', example: 342 },
          por_tabla: {
            type: 'object',
            additionalProperties: { type: 'integer' },
            example: { productos: 120, tiendas: 40, pedidos: 182 },
          },
          por_accion: {
            type: 'object',
            additionalProperties: { type: 'integer' },
            example: { crear: 150, actualizar: 160, eliminar: 32 },
          },
          ultimos_eventos: {
            type: 'array',
            items: { $ref: '#/components/schemas/Auditoria' },
          },
        },
      },
    },
  },
   // ============================================================
  // Buscar productos
  // ============================================================

  ProductoBusqueda: {
    type: 'object',

    description: 'Producto retornado por el buscador de productos.',

    properties: {
      id: {
        type: 'integer',
        description: 'Identificador único del producto.',
        example: 15,
      },

      tienda_id: {
        type: 'integer',
        description: 'ID de la tienda propietaria del producto.',
        example: 3,
      },

      categoria_id: {
        type: 'integer',
        description: 'ID de la categoría del producto.',
        example: 8,
      },

      nombre: {
        type: 'string',
        description: 'Nombre del producto.',
        example: 'iPhone 15 Pro',
      },

      slug: {
        type: 'string',
        description: 'Identificador amigable utilizado en URLs.',
        example: 'iphone-15-pro',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        description: 'Descripción del producto.',
        example: 'Smartphone Apple iPhone 15 Pro.',
      },

      material: {
        type: 'string',
        nullable: true,
        description: 'Material del producto.',
        example: 'Aluminio',
      },

      peso: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Peso del producto.',
        example: 0.187,
      },

      largo: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Largo del producto.',
        example: 15.0,
      },

      ancho: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Ancho del producto.',
        example: 7.1,
      },

      alto: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Alto del producto.',
        example: 0.8,
      },

      estado: {
        type: 'string',
        description: 'Estado actual del producto.',
        example: 'activo',
      },

      destacado: {
        type: 'boolean',
        description: 'Indica si el producto está destacado.',
        example: true,
      },

      calificacion: {
        type: 'number',
        format: 'double',
        minimum: 0,
        maximum: 5,
        description: 'Calificación promedio del producto.',
        example: 4.8,
      },

      total_ventas: {
        type: 'integer',
        minimum: 0,
        description: 'Cantidad total de unidades vendidas.',
        example: 125,
      },

      visitas: {
        type: 'integer',
        minimum: 0,
        description: 'Cantidad de visitas recibidas por el producto.',
        example: 1250,
      },

      favoritos: {
        type: 'integer',
        minimum: 0,
        description: 'Cantidad de usuarios que han agregado el producto a favoritos.',
        example: 86,
      },

      activo: {
        type: 'boolean',
        description: 'Indica si el producto está activo.',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de creación del producto.',
        example: '2026-08-19T10:00:00Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de última actualización.',
        example: '2026-08-19T10:00:00Z',
      },

      tienda_nombre: {
        type: 'string',
        nullable: true,
        description: 'Nombre de la tienda.',
        example: 'Tecnología Nica',
      },

      categoria_nombre: {
        type: 'string',
        nullable: true,
        description: 'Nombre de la categoría.',
        example: 'Celulares',
      },

      precio_minimo: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Precio más bajo disponible entre las variantes activas.',
        example: 899.99,
      },

      precio_maximo: {
        type: 'number',
        format: 'double',
        nullable: true,
        description: 'Precio más alto disponible entre las variantes activas.',
        example: 1099.99,
      },

      disponible: {
        type: 'boolean',
        description:
          'Indica si existe al menos una variante activa con stock disponible.',
        example: true,
      },

      imagen_principal: {
        type: 'string',
        format: 'uri',
        nullable: true,
        description: 'URL de la imagen principal del producto.',
        example: 'https://example.com/iphone-15-pro.jpg',
      },
    },

    required: [
      'id',
      'tienda_id',
      'categoria_id',
      'nombre',
      'slug',
      'estado',
      'destacado',
      'calificacion',
      'total_ventas',
      'visitas',
      'favoritos',
      'activo',
      'created_at',
      'updated_at',
      'precio_minimo',
      'precio_maximo',
      'disponible',
    ],
  },

  VarianteProducto: {
    type: 'object',

    description: 'Variante de un producto.',

    properties: {
      id: {
        type: 'integer',
        example: 25,
      },

      producto_id: {
        type: 'integer',
        example: 15,
      },

      color: {
        type: 'string',
        nullable: true,
        example: 'Negro',
      },

      talla: {
        type: 'string',
        nullable: true,
        example: 'L',
      },

      sku: {
        type: 'string',
        example: 'IPH15-BLK-128',
      },

      precio: {
        type: 'number',
        format: 'double',
        minimum: 0,
        example: 899.99,
      },

      stock: {
        type: 'integer',
        minimum: 0,
        example: 15,
      },

      activo: {
        type: 'boolean',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-19T10:00:00Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-19T10:00:00Z',
      },
    },

    required: [
      'id',
      'producto_id',
      'sku',
      'precio',
      'stock',
      'activo',
    ],
  },






  // ============================================================
  // Carrito
  // ============================================================
    Carrito: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },
      usuario_id: {
        type: 'string',
        format: 'uuid',
      },
      subtotal: {
        type: 'number',
        format: 'float',
        example: 149.9,
      },
      total: {
        type: 'number',
        format: 'float',
        example: 149.9,
      },
      estado: {
        type: 'string',
        enum: ['activo', 'convertido', 'abandonado'],
        example: 'activo',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
 
  ItemCarrito: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 10,
      },
      cantidad: {
        type: 'integer',
        example: 2,
      },
      precio_unitario: {
        type: 'number',
        format: 'float',
        example: 74.95,
      },
      subtotal: {
        type: 'number',
        format: 'float',
        example: 149.9,
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
      variantes_producto: {
        $ref: '#/components/schemas/VarianteProductoCarrito',
      },
    },
  },
 
  CarritoConItems: {
    allOf: [
      {
        $ref: '#/components/schemas/Carrito',
      },
      {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ItemCarrito',
            },
          },
        },
      },
    ],
  },
 
  VarianteProductoCarrito: {
    type: 'object',
    description: 'Variante de producto embebida dentro de un item de carrito.',
    properties: {
      id: {
        type: 'integer',
      },
      color: {
        type: 'string',
        nullable: true,
      },
      talla: {
        type: 'string',
        nullable: true,
      },
      sku: {
        type: 'string',
        nullable: true,
      },
      precio: {
        type: 'number',
        format: 'float',
      },
      stock: {
        type: 'integer',
      },
      activo: {
        type: 'boolean',
      },
      productos: {
        $ref: '#/components/schemas/ProductoCarrito',
      },
    },
  },
 
  ProductoCarrito: {
    type: 'object',
    description: 'Producto embebido dentro de la variante de un item de carrito.',
    properties: {
      id: {
        type: 'integer',
      },
      nombre: {
        type: 'string',
      },
      slug: {
        type: 'string',
      },
      tienda_id: {
        type: 'integer',
      },
      imagenes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
            },
            principal: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },

  // ============================================================
  // VARIANTE PRODUCTO
  // ============================================================
  VarianteProductos: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      producto_id: {
        type: 'integer',
        example: 10,
      },

      color: {
        type: 'string',
        nullable: true,
        example: 'Rojo',
      },

      talla: {
        type: 'string',
        nullable: true,
        example: 'M',
      },

      sku: {
        type: 'string',
        example: 'CAM-ROJO-M',
      },

      precio: {
        type: 'number',
        format: 'float',
        example: 599.99,
      },

      stock: {
        type: 'integer',
        example: 15,
      },

      activo: {
        type: 'boolean',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-13T10:30:00.000Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-13T10:30:00.000Z',
      },
    },
  },

  // ============================================================
  // IMAGEN
  // ============================================================
  Imagen: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      producto_id: {
        type: 'integer',
        example: 9,
      },

      variante_id: {
        type: 'integer',
        nullable: true,
        example: null,
      },

      url: {
        type: 'string',
        format: 'uri',
        example:
          'https://fhjdcbidplapakkuxuok.supabase.co/storage/v1/object/public/artinet-images/productos/9-1723471234567.webp',
      },

      principal: {
        type: 'boolean',
        example: true,
      },

      orden: {
        type: 'integer',
        example: 1,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-12T15:35:34.602256+00:00',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-12T15:35:34.602256+00:00',
      },
    },

    required: [
      'id',
      'producto_id',
      'url',
      'principal',
      'orden',
    ],
  },

  // ============================================================
  // PRODUCTO
  // ============================================================
  Producto: {
    type: 'object',

    properties: {
      id: {
        type: 'integer',
        example: 10,
      },

      tienda_id: {
        type: 'integer',
        example: 2,
      },

      categoria_id: {
        type: 'integer',
        example: 5,
      },

      nombre: {
        type: 'string',
        example: 'Camisa casual de algodón',
      },

      slug: {
        type: 'string',
        example: 'camisa-casual-de-algodon',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Camisa casual de algodón disponible en diferentes colores y tallas.',
      },

      material: {
        type: 'string',
        nullable: true,
        example: 'Algodón',
      },

      peso: {
        type: 'number',
        format: 'float',
        nullable: true,
        example: 0.5,
      },

      largo: {
        type: 'number',
        format: 'float',
        nullable: true,
        example: 70,
      },

      ancho: {
        type: 'number',
        format: 'float',
        nullable: true,
        example: 50,
      },

      alto: {
        type: 'number',
        format: 'float',
        nullable: true,
        example: 5,
      },

      estado: {
        type: 'string',
        example: 'activo',
      },

      destacado: {
        type: 'boolean',
        example: false,
      },

      calificacion: {
        type: 'number',
        format: 'float',
        example: 4.5,
      },

      total_ventas: {
        type: 'integer',
        example: 25,
      },

      visitas: {
        type: 'integer',
        example: 150,
      },

      favoritos: {
        type: 'integer',
        example: 18,
      },

      activo: {
        type: 'boolean',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-13T10:30:00.000Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-08-13T10:30:00.000Z',
      },

      imagenes: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Imagen',
        },
      },

      variantes_producto: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/VarianteProducto',
        },
      },
    },
  },

  // ============================================================
  // CATEGORIA TIENDA
  // ============================================================
  CategoriaTienda: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Artesanía',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Tiendas dedicadas a productos artesanales.',
      },

      activo: {
        type: 'boolean',
        example: true,
      },
    },
  },

  // ============================================================
  // CATEGORIA PRODUCTO
  // ============================================================
  CategoriaProducto: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Calzado',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Productos relacionados con calzado artesanal.',
      },

      categoria_padre_id: {
        type: 'integer',
        nullable: true,
        example: null,
      },

      activo: {
        type: 'boolean',
        example: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-11T10:30:00Z',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2026-08-11T10:30:00Z',
      },
    },
  },

  // ============================================================
  // METODOS DE PAGO
  // ============================================================
  MetodosPagos: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Transferencia bancaria',
      },

      descripcion: {
        type: 'string',
        nullable: true,
        example:
          'Pago mediante transferencia bancaria.',
      },

      activo: {
        type: 'boolean',
        example: true,
      },
    },
  },

  // ============================================================
  // MONEDA
  // ============================================================
  Moneda: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Córdoba',
      },

      codigo: {
        type: 'string',
        example: 'NIO',
      },

      simbolo: {
        type: 'string',
        example: 'C$',
      },

      activo: {
        type: 'boolean',
        example: true,
      },
    },
  },

  // ============================================================
  // BANCO
  // ============================================================
  Banco: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
      },

      nombre: {
        type: 'string',
        example: 'Banco de América Central',
      },

      activo: {
        type: 'boolean',
        example: true,
      },
    },
  },

  // ============================================================
  // TIENDA
  // ============================================================
  Tienda: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 9,
      },

      propietario_id: {
        type: 'string',
        format: 'uuid',
      },

      categoria_id: {
        type: 'integer',
        nullable: true,
      },

      moneda_id: {
        type: 'integer',
      },

      nombre: {
        type: 'string',
        example: 'Estelí Cuero Artesanal',
      },

      slug: {
        type: 'string',
        example: 'esteli-cuero-artesanal',
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
        example: 'Nicaragua',
      },

      departamento: {
        type: 'string',
        example: 'Estelí',
      },

      ciudad: {
        type: 'string',
        example: 'Estelí',
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
        enum: [
          'persona_natural',
          'empresa',
        ],
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

      porcentaje_comision: {
        type: 'number',
        example: 15,
      },

      calificacion: {
        type: 'number',
        example: 4.9,
      },

      estado: {
        type: 'string',
        enum: [
          'pendiente',
          'activa',
          'suspendida',
        ],
      },

      activo: {
        type: 'boolean',
      },

      fecha_aprobacion: {
        type: 'string',
        format: 'date-time',
        nullable: true,
      },

      aprobado_por: {
        type: 'string',
        format: 'uuid',
        nullable: true,
      },

      created_at: {
        type: 'string',
        format: 'date-time',
      },

      updated_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  // ============================================================
  // ERROR
  // ============================================================
  Error: {
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
            example: 'NOT_FOUND',
          },

          message: {
            type: 'string',
            example: 'Producto no encontrado.',
          },
        },
      },
    },
  },
} as const

// ============================================================
// RESPONSES REUTILIZABLES
// ============================================================

export const responses = {
  ValidationError: {
    description: 'Datos inválidos en la petición',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  Unauthorized: {
    description: 'No hay sesión activa',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  Forbidden: {
    description: 'Sin permiso para esta acción',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  NotFound: {
    description: 'Recurso no encontrado',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  Conflict: {
    description: 'Conflicto: el recurso ya existe',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },

  ServerError: {
    description: 'Error interno del servidor',

    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error',
        },
      },
    },
  },
} as const