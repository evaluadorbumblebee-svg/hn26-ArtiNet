export const productosPaths = {
  // ============================================================
  // GET /api/productos
  // ============================================================
  '/api/productos': {
    get: {
      tags: ['Productos'],
      summary: 'Listar productos',
      description:
        'Obtiene una lista paginada de productos con sus imágenes y variantes. Los administradores pueden filtrar por estado; los demás usuarios solo reciben productos activos.',

      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
          description: 'Número de página.',
        },
        {
          name: 'pageSize',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 10,
          },
          description: 'Cantidad de productos por página.',
        },
        {
          name: 'sortBy',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            default: 'created_at',
          },
          description: 'Campo por el cual ordenar los productos.',
        },
        {
          name: 'sortOrder',
          in: 'query',
          required: false,
          schema: {
            type: 'boolean',
            default: false,
          },
          description:
            'Orden de los resultados. true para ascendente y false para descendente.',
        },
        {
          name: 'tienda_id',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
          },
          description:
            'Filtra los productos pertenecientes a una tienda específica.',
        },
        {
          name: 'categoria_id',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
          },
          description:
            'Filtra los productos pertenecientes a una categoría específica.',
        },
        {
          name: 'destacado',
          in: 'query',
          required: false,
          schema: {
            type: 'boolean',
          },
          description:
            'Filtra los productos destacados.',
        },
        {
          name: 'estado',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
          },
          description:
            'Filtra por estado del producto. Este filtro es aplicado para usuarios con rol administrador.',
        },
        {
          name: 'q',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
          },
          description:
            'Busca productos por coincidencia parcial en el nombre.',
        },
      ],

      responses: {
        '200': {
          description: 'Listado de productos obtenido correctamente.',
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
                      $ref: '#/components/schemas/Producto',
                    },
                  },
                  meta: {
                    type: 'object',
                    properties: {
                      page: {
                        type: 'integer',
                        example: 1,
                      },
                      pageSize: {
                        type: 'integer',
                        example: 10,
                      },
                      total: {
                        type: 'integer',
                        example: 25,
                      },
                    },
                  },
                },
              },
            },
          },
        },

        '500': {
          description: 'Error interno del servidor.',
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

    // ==========================================================
    // POST /api/productos
    // ==========================================================
    post: {
      tags: ['Productos'],
      summary: 'Crear producto completo',
      description:
        'Crea un producto asociado automáticamente a la tienda del vendedor autenticado. Permite registrar sus variantes, imágenes generales e imágenes asociadas a cada variante.',

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',

              required: [
                'categoria_id',
                'nombre',
                'variantes',
                'imagenes',
              ],

              properties: {
                categoria_id: {
                  type: 'integer',
                  description:
                    'ID de la categoría activa a la que pertenece el producto.',
                  example: 3,
                },

                nombre: {
                  type: 'string',
                  minLength: 2,
                  description: 'Nombre del producto.',
                  example: 'Camisa casual de algodón',
                },

                slug: {
                  type: 'string',
                  nullable: true,
                  description:
                    'Slug del producto. Si no se envía, se genera automáticamente a partir del nombre.',
                  example: 'camisa-casual-de-algodon',
                },

                descripcion: {
                  type: 'string',
                  nullable: true,
                  description: 'Descripción del producto.',
                  example:
                    'Camisa casual confeccionada en algodón.',
                },

                material: {
                  type: 'string',
                  nullable: true,
                  description: 'Material del producto.',
                  example: 'Algodón',
                },

                peso: {
                  type: 'number',
                  nullable: true,
                  format: 'float',
                  description: 'Peso del producto.',
                  example: 0.5,
                },

                largo: {
                  type: 'number',
                  nullable: true,
                  format: 'float',
                  description: 'Largo del producto.',
                  example: 70,
                },

                ancho: {
                  type: 'number',
                  nullable: true,
                  format: 'float',
                  description: 'Ancho del producto.',
                  example: 50,
                },

                alto: {
                  type: 'number',
                  nullable: true,
                  format: 'float',
                  description: 'Alto del producto.',
                  example: 5,
                },

                destacado: {
                  type: 'boolean',
                  default: false,
                  description:
                    'Indica si el producto será marcado como destacado.',
                },

                variantes: {
                  type: 'string',
                  description:
                    'JSON con las variantes del producto. Debe contener al menos una variante.',
                  example: JSON.stringify([
                    {
                      color: 'Rojo',
                      talla: 'M',
                      sku: 'CAM-ROJO-M',
                      precio: 500,
                      stock: 10,
                      activo: true,
                    },
                    {
                      color: 'Azul',
                      talla: 'L',
                      sku: 'CAM-AZUL-L',
                      precio: 550,
                      stock: 8,
                      activo: true,
                    },
                  ]),
                },

                imagenes: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                  description:
                    'Imágenes generales del producto. Debe existir al menos una imagen entre las imágenes generales y las imágenes de variantes.',
                },

                imagen_variante_0: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                  description:
                    'Imágenes correspondientes a la primera variante.',
                },

                imagen_variante_1: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                  description:
                    'Imágenes correspondientes a la segunda variante.',
                },

                imagen_variante_2: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                  description:
                    'Imágenes correspondientes a la tercera variante.',
                },
              },
            },
          },
        },
      },

      responses: {
        '201': {
          description: 'Producto creado correctamente.',
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
                    $ref: '#/components/schemas/Producto',
                  },
                },
              },
            },
          },
        },

        '400': {
          description: 'Datos de validación incorrectos.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },

        '401': {
          description: 'Usuario no autenticado.',
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
            'El usuario no tiene permisos para crear productos o su tienda no existe/no está activa.',
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
            'Conflicto. El slug o uno de los SKU ya existe.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },

        '500': {
          description: 'Error interno del servidor.',
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