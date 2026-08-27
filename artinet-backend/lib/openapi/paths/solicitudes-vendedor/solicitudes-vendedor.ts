/**
 * OpenAPI Path: Solicitudes de vendedor
 *
 * Endpoints:
 * - GET  /api/solicitudes-vendedor
 * - POST /api/solicitudes-vendedor
 * - GET  /api/solicitudes-vendedor/{id}
 * - PATCH /api/solicitudes-vendedor/{id}
 *
 * Reglas principales:
 * - Un usuario autenticado puede consultar sus propias postulaciones.
 * - Un administrador puede consultar todas las postulaciones.
 * - Un usuario puede crear una postulación para convertirse en vendedor.
 * - Un administrador puede aprobar o rechazar una postulación.
 * - Al aprobar una postulación, el usuario pasa automáticamente a rol vendedor.
 */

export const solicitudesVendedorPaths = {
  '/api/solicitudes-vendedor': {
    get: {
      tags: ['Solicitudes de vendedor'],
      summary: 'Listar solicitudes de vendedor',
      description: `
Obtiene una lista paginada de solicitudes para convertirse en vendedor.

### Permisos

- **Administrador:** puede consultar todas las solicitudes y filtrarlas por estado.
- **Usuario autenticado:** únicamente puede consultar sus propias solicitudes.

### Filtros

El administrador puede utilizar el parámetro \`estado\` para filtrar las solicitudes.

### Paginación

Soporta los parámetros estándar de paginación utilizados por la API:
- \`page\`
- \`pageSize\`
- \`sortBy\`
- \`sortOrder\`
      `.trim(),

      operationId: 'listarSolicitudesVendedor',

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          $ref: '#/components/parameters/Page',
        },
        {
          $ref: '#/components/parameters/PageSize',
        },
        {
          $ref: '#/components/parameters/SortBy',
        },
        {
          $ref: '#/components/parameters/SortOrder',
        },
        {
          name: 'estado',
          in: 'query',
          required: false,
          description:
            'Filtra las solicitudes por estado. Este filtro está destinado principalmente a administradores.',
          schema: {
            $ref: '#/components/schemas/EstadoSolicitudVendedor',
          },
        },
      ],

      responses: {
        200: {
          description: 'Lista paginada de solicitudes de vendedor obtenida correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SolicitudesVendedorListResponse',
              },
            },
          },
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },

    post: {
      tags: ['Solicitudes de vendedor'],
      summary: 'Crear solicitud para convertirse en vendedor',
      description: `
Permite a un usuario autenticado enviar una solicitud para convertirse en vendedor.

### Reglas

- El usuario debe estar autenticado.
- Un usuario que ya tiene rol \`vendedor\` no puede volver a postular.
- Un administrador no necesita realizar una postulación.
- No se permite tener más de una postulación pendiente.
- La descripción debe contener al menos 10 caracteres.
- La solicitud se crea inicialmente con estado \`pendiente\`.

El campo \`usuario_id\` se obtiene del usuario autenticado y **no debe ser enviado por el cliente**.
      `.trim(),

      operationId: 'crearSolicitudVendedor',

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,
        description: 'Datos de la postulación para convertirse en vendedor.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SolicitudVendedorCreate',
            },
            example: {
              descripcion:
                'Tengo experiencia en ventas y deseo crear una tienda para comercializar productos en la plataforma.',
            },
          },
        },
      },

      responses: {
        201: {
          description: 'Solicitud creada correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SolicitudVendedorResponse',
              },
            },
          },
        },

        400: {
          $ref: '#/components/responses/ValidationError',
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        409: {
          $ref: '#/components/responses/Conflict',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/api/solicitudes-vendedor/{id}': {
    get: {
      tags: ['Solicitudes de vendedor'],
      summary: 'Obtener una solicitud de vendedor por ID',
      description: `
Obtiene el detalle de una solicitud específica para convertirse en vendedor.

### Permisos

- **Administrador:** puede consultar cualquier solicitud.
- **Usuario autenticado:** únicamente puede consultar sus propias solicitudes.

El parámetro \`id\` corresponde al identificador de la solicitud.
      `.trim(),

      operationId: 'obtenerSolicitudVendedor',

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          $ref: '#/components/parameters/SolicitudVendedorId',
        },
      ],

      responses: {
        200: {
          description: 'Solicitud obtenida correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SolicitudVendedorResponse',
              },
            },
          },
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        404: {
          $ref: '#/components/responses/NotFound',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },

    patch: {
      tags: ['Solicitudes de vendedor'],
      summary: 'Aprobar o rechazar una solicitud de vendedor',
      description: `
Permite a un administrador aprobar o rechazar una solicitud para convertirse en vendedor.

### Solo administradores

Este endpoint requiere que el usuario autenticado tenga el rol \`administrador\`.

### Estados permitidos

El administrador únicamente puede cambiar una solicitud pendiente a:

- \`aprobada\`
- \`rechazada\`

Una solicitud que ya fue revisada no puede volver a procesarse.

### Aprobación

Cuando la solicitud es aprobada:

1. La solicitud cambia a estado \`aprobada\`.
2. Se registra el administrador que realizó la revisión.
3. Se registra la fecha de revisión.
4. El usuario pasa automáticamente a rol \`vendedor\`.
5. Se genera una notificación para el usuario.

### Rechazo

Cuando la solicitud es rechazada:

1. La solicitud cambia a estado \`rechazada\`.
2. Se registran las observaciones.
3. Se registra el administrador que realizó la revisión.
4. Se registra la fecha de revisión.
5. Se genera una notificación para el usuario.

El campo \`revisado_por\` se obtiene del usuario autenticado y no debe enviarse manualmente.
      `.trim(),

      operationId: 'revisarSolicitudVendedor',

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          $ref: '#/components/parameters/SolicitudVendedorId',
        },
      ],

      requestBody: {
        required: true,
        description: 'Resultado de la revisión administrativa.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SolicitudVendedorReview',
            },
            examples: {
              aprobada: {
                summary: 'Aprobar solicitud',
                value: {
                  estado: 'aprobada',
                  observaciones:
                    'Solicitud aprobada. El usuario puede comenzar a crear su tienda.',
                },
              },
              rechazada: {
                summary: 'Rechazar solicitud',
                value: {
                  estado: 'rechazada',
                  observaciones:
                    'La información proporcionada no cumple con los requisitos.',
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: 'Solicitud revisada correctamente.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SolicitudVendedorResponse',
              },
            },
          },
        },

        400: {
          $ref: '#/components/responses/ValidationError',
        },

        401: {
          $ref: '#/components/responses/Unauthorized',
        },

        403: {
          $ref: '#/components/responses/Forbidden',
        },

        404: {
          $ref: '#/components/responses/NotFound',
        },

        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },
}