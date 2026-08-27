export const propuestasPaths = {
  '/api/propuestas/{id}/aceptar': {
    post: {
      tags: ['Propuestas'],
      summary: 'Aceptar una propuesta',
      description:
        'Acepta una propuesta pendiente. Al aceptar una propuesta, las demás propuestas pendientes de la misma solicitud son rechazadas automáticamente y la solicitud del cliente se cierra.',

      operationId: 'aceptarPropuesta',

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
          description: 'ID de la propuesta',
          schema: {
            type: 'integer',
            example: 15,
          },
        },
      ],

      responses: {
        200: {
          description: 'Propuesta aceptada correctamente',
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
                    $ref: '#/components/schemas/PropuestaSolicitud',
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            'La propuesta ya fue procesada o la solicitud ya fue cerrada',
        },

        401: {
          description: 'No autenticado',
        },

        403: {
          description:
            'No tiene permisos para aceptar esta propuesta',
        },

        404: {
          description: 'Propuesta no encontrada',
        },

        500: {
          description: 'Error interno del servidor',
        },
      },
    },
  },

  '/api/propuestas/{id}/rechazar': {
    post: {
      tags: ['Propuestas'],
      summary: 'Rechazar una propuesta',
      description:
        'Rechaza una propuesta pendiente. Opcionalmente permite agregar observaciones explicando el motivo del rechazo.',

      operationId: 'rechazarPropuesta',

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
          description: 'ID de la propuesta',
          schema: {
            type: 'integer',
            example: 15,
          },
        },
      ],

      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RechazarPropuesta',
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Propuesta rechazada correctamente',
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
                    $ref: '#/components/schemas/PropuestaSolicitud',
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            'La propuesta ya fue procesada y no puede ser rechazada',
        },

        401: {
          description: 'No autenticado',
        },

        403: {
          description:
            'No tiene permisos para rechazar esta propuesta',
        },

        404: {
          description: 'Propuesta no encontrada',
        },

        500: {
          description: 'Error interno del servidor',
        },
      },
    },
  },
}