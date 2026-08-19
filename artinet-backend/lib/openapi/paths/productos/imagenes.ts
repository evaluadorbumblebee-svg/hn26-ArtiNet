export const imagenesPaths = {
  '/api/productos/{id}/imagenes': {
    get: {
      tags: ['Imágenes'],
      summary: 'Listar imágenes de un producto',
      description:
        'Obtiene todas las imágenes asociadas a un producto, ordenadas por el campo orden.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID del producto',
        },
      ],
      responses: {
        '200': {
          description: 'Listado de imágenes del producto',
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
                      $ref: '#/components/schemas/Imagen',
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
      tags: ['Imágenes'],
      summary: 'Subir imagen de un producto',
      description:
        'Sube una imagen al almacenamiento de Supabase y crea el registro correspondiente en la tabla imagenes. El usuario debe ser propietario de la tienda del producto o administrador.',
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
          schema: {
            type: 'integer',
          },
          description: 'ID del producto',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['file'],
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description:
                    'Archivo de imagen. Formatos permitidos: JPG, PNG, WEBP o GIF. Tamaño máximo: 5MB.',
                },
                variante_id: {
                  type: 'integer',
                  nullable: true,
                  description: 'ID de la variante asociada a la imagen.',
                },
                principal: {
                  type: 'boolean',
                  default: false,
                  description:
                    'Indica si la imagen será la imagen principal del producto.',
                },
                orden: {
                  type: 'integer',
                  default: 1,
                  description: 'Orden de visualización de la imagen.',
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Imagen subida correctamente',
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
                    $ref: '#/components/schemas/Imagen',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Datos de validación incorrectos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '401': {
          description: 'Usuario no autenticado',
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
            'El usuario no es propietario del producto ni administrador',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '404': {
          description: 'Producto no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
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
  },
} as const