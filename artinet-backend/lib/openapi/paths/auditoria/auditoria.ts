export const auditoriaPaths = {
  '/api/auditoria': {
    get: {
      tags: ['Auditoria'],
      summary: 'Listar eventos de auditoría',
      description:
        'Lista paginada del log de auditoría con filtros. Solo accesible para administradores.',
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: 'tabla',
          in: 'query',
          description: 'Filtra por nombre de tabla afectada (ej: productos, tiendas)',
          schema: { type: 'string' },
        },
        {
          name: 'registro_id',
          in: 'query',
          description: 'Filtra por el id del registro afectado',
          schema: { type: 'string', format: 'uuid' },
        },
        {
          name: 'usuario_id',
          in: 'query',
          description: 'Filtra por el usuario que realizó la acción',
          schema: { type: 'string', format: 'uuid' },
        },
        {
          name: 'accion',
          in: 'query',
          description: 'Filtra por tipo de acción',
          schema: {
            type: 'string',
            enum: ['crear', 'actualizar', 'eliminar', 'aprobar', 'rechazar', 'suspender'],
          },
        },
        {
          name: 'desde',
          in: 'query',
          description: 'Fecha inicial (YYYY-MM-DD)',
          schema: { type: 'string', format: 'date' },
        },
        {
          name: 'hasta',
          in: 'query',
          description: 'Fecha final (YYYY-MM-DD)',
          schema: { type: 'string', format: 'date' },
        },
        { $ref: '#/components/parameters/Page' },
        { $ref: '#/components/parameters/PageSize' },
        { $ref: '#/components/parameters/SortBy' },
        { $ref: '#/components/parameters/SortOrder' },
      ],
      responses: {
        '200': {
          description: 'Listado de eventos de auditoría',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuditoriaListResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/auditoria/{id}': {
    get: {
      tags: ['Auditoria'],
      summary: 'Obtener un evento de auditoría',
      description: 'Detalle de un evento puntual del log de auditoría. Solo administradores.',
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      responses: {
        '200': {
          description: 'Evento de auditoría',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuditoriaDetalleResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/auditoria/registro/{tabla}/{registroId}': {
    get: {
      tags: ['Auditoria'],
      summary: 'Historial de un registro específico',
      description:
        'Devuelve, en orden cronológico, todos los eventos de auditoría asociados a un registro puntual (ej: todos los cambios de un producto). Solo administradores.',
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: 'tabla',
          in: 'path',
          required: true,
          description: 'Nombre de la tabla (ej: productos, tiendas, pedidos)',
          schema: { type: 'string' },
        },
        {
          name: 'registroId',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      responses: {
        '200': {
          description: 'Historial cronológico del registro',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuditoriaListResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '404': { $ref: '#/components/responses/NotFound' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/auditoria/resumen': {
    get: {
      tags: ['Auditoria'],
      summary: 'Resumen estadístico de auditoría',
      description:
        'Totales agrupados por tabla y por tipo de acción, más los últimos 10 eventos. Solo administradores.',
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: 'desde',
          in: 'query',
          description: 'Fecha inicial (YYYY-MM-DD)',
          schema: { type: 'string', format: 'date' },
        },
        {
          name: 'hasta',
          in: 'query',
          description: 'Fecha final (YYYY-MM-DD)',
          schema: { type: 'string', format: 'date' },
        },
      ],
      responses: {
        '200': {
          description: 'Resumen estadístico',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuditoriaResumenResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '403': { $ref: '#/components/responses/Forbidden' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },
} as const