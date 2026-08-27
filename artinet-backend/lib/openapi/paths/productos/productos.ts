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
          description: 'Filtra los productos destacados.',
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

    // ============================================================
    // POST /api/productos
    // ============================================================

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

  // ============================================================
  // GET /api/productos/buscar
  // ============================================================

  '/api/productos/buscar': {
    get: {
      tags: ['Productos'],
      summary: 'Buscar productos',
      description:
        'Búsqueda avanzada de productos mediante texto, categoría, tienda, rango de precios, calificación, disponibilidad, estado y ordenamiento.',

      parameters: [
        {
          name: 'q',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
          },
          description:
            'Busca coincidencias parciales en el nombre o descripción.',
        },

        {
          name: 'categoria_id',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
          },
        },

        {
          name: 'tienda_id',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
          },
        },

        {
          name: 'precio_min',
          in: 'query',
          required: false,
          schema: {
            type: 'number',
            format: 'float',
          },
        },

        {
          name: 'precio_max',
          in: 'query',
          required: false,
          schema: {
            type: 'number',
            format: 'float',
          },
        },

        {
          name: 'calificacion_min',
          in: 'query',
          required: false,
          schema: {
            type: 'number',
            format: 'float',
          },
        },

        {
          name: 'destacado',
          in: 'query',
          required: false,
          schema: {
            type: 'boolean',
          },
        },

        {
          name: 'disponible',
          in: 'query',
          required: false,
          schema: {
            type: 'boolean',
          },
        },

        {
          name: 'estado',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
          },
        },

        {
          name: 'incluir_inactivos',
          in: 'query',
          required: false,
          schema: {
            type: 'boolean',
            default: false,
          },
        },

        {
          name: 'ordenar',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: [
              'relevancia',
              'mas_recientes',
              'mas_vendidos',
              'mejor_calificados',
              'precio_asc',
              'precio_desc',
            ],
            default: 'relevancia',
          },
        },

        {
          name: 'page',
          in: 'query',
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
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20,
          },
        },
      ],

      responses: {
        '200': {
          description: 'Resultados de búsqueda.',
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
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        tienda_id: {
                          type: 'integer',
                        },
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
                          nullable: true,
                        },
                        material: {
                          type: 'string',
                          nullable: true,
                        },
                        peso: {
                          type: 'number',
                          nullable: true,
                        },
                        largo: {
                          type: 'number',
                          nullable: true,
                        },
                        ancho: {
                          type: 'number',
                          nullable: true,
                        },
                        alto: {
                          type: 'number',
                          nullable: true,
                        },
                        estado: {
                          type: 'string',
                        },
                        destacado: {
                          type: 'boolean',
                        },
                        calificacion: {
                          type: 'number',
                        },
                        total_ventas: {
                          type: 'integer',
                        },
                        visitas: {
                          type: 'integer',
                        },
                        favoritos: {
                          type: 'integer',
                        },
                        activo: {
                          type: 'boolean',
                        },
                        created_at: {
                          type: 'string',
                          format: 'date-time',
                        },
                        updated_at: {
                          type: 'string',
                          format: 'date-time',
                        },
                        tienda_nombre: {
                          type: 'string',
                        },
                        categoria_nombre: {
                          type: 'string',
                        },
                        precio_minimo: {
                          type: 'number',
                        },
                        precio_maximo: {
                          type: 'number',
                        },
                        disponible: {
                          type: 'boolean',
                        },
                        imagen_principal: {
                          type: 'string',
                          nullable: true,
                        },
                        total_count: {
                          type: 'integer',
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

        '400': {
          description: 'Parámetros de búsqueda inválidos.',
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

  // ============================================================
  // GET /api/productos/{id}/variantes
  // POST /api/productos/{id}/variantes
  // ============================================================

  '/api/productos/{id}/variantes': {
    get: {
      tags: ['Productos'],
      summary: 'Listar variantes de un producto',
      description:
        'Obtiene todas las variantes asociadas a un producto, incluyendo sus imágenes.',

      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID del producto.',
        },
      ],

      responses: {
        '200': {
          description: 'Listado de variantes.',
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
                      $ref: '#/components/schemas/VarianteProducto',
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

    post: {
      tags: ['Productos'],
      summary: 'Agregar una variante',
      description:
        'Agrega una nueva variante a un producto. Requiere que el usuario sea propietario de la tienda o administrador.',

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
          description: 'ID del producto.',
        },
      ],

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['sku', 'precio', 'stock'],
              properties: {
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
                },

                precio: {
                  type: 'number',
                  format: 'float',
                  minimum: 0,
                },

                stock: {
                  type: 'integer',
                  minimum: 0,
                },

                activo: {
                  type: 'boolean',
                  default: true,
                },
              },
            },
          },
        },
      },

      responses: {
        '201': {
          description: 'Variante creada correctamente.',
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
                    $ref: '#/components/schemas/VarianteProducto',
                  },
                },
              },
            },
          },
        },

        '400': {
          description: 'Datos inválidos.',
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
        },

        '403': {
          description:
            'El usuario no es propietario de la tienda ni administrador.',
        },

        '404': {
          description: 'Producto no encontrado.',
        },

        '409': {
          description: 'El SKU ya existe.',
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

  // ============================================================
  // PATCH /api/productos/{id}/variantes/{varianteId}
  // DELETE /api/productos/{id}/variantes/{varianteId}
  // ============================================================

  '/api/productos/{id}/variantes/{varianteId}': {
    patch: {
      tags: ['Productos'],
      summary: 'Actualizar una variante',
      description:
        'Actualiza parcialmente una variante existente. Requiere ser propietario de la tienda o administrador.',

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
          description: 'ID del producto.',
        },

        {
          name: 'varianteId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la variante.',
        },
      ],

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
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
                },

                precio: {
                  type: 'number',
                  format: 'float',
                  minimum: 0,
                },

                stock: {
                  type: 'integer',
                  minimum: 0,
                },

                activo: {
                  type: 'boolean',
                },
              },
            },
          },
        },
      },

      responses: {
        '200': {
          description: 'Variante actualizada correctamente.',
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
                    $ref: '#/components/schemas/VarianteProducto',
                  },
                },
              },
            },
          },
        },

        '400': {
          description: 'Datos inválidos o ningún campo enviado.',
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
        },

        '403': {
          description:
            'El usuario no es propietario de la tienda ni administrador.',
        },

        '404': {
          description:
            'Producto o variante no encontrada.',
        },

        '409': {
          description: 'El SKU ya existe.',
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

    delete: {
      tags: ['Productos'],
      summary: 'Desactivar una variante',
      description:
        'Realiza un soft delete de la variante estableciendo activo en false.',

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
          description: 'ID del producto.',
        },

        {
          name: 'varianteId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la variante.',
        },
      ],

      responses: {
        '200': {
          description: 'Variante desactivada correctamente.',
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
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example:
                          'Variante desactivada correctamente.',
                      },
                    },
                  },
                },
              },
            },
          },
        },

        '401': {
          description: 'Usuario no autenticado.',
        },

        '403': {
          description:
            'El usuario no es propietario de la tienda ni administrador.',
        },

        '404': {
          description:
            'Producto o variante no encontrada.',
        },
      },
    },
  },

  // ============================================================
  // PATCH /api/productos/{id}/variantes/{varianteId}/stock
  // ============================================================

  '/api/productos/{id}/variantes/{varianteId}/stock': {
    patch: {
      tags: ['Productos'],
      summary: 'Ajustar stock de una variante',
      description:
        'Ajusta el stock de forma atómica mediante la función SQL ajustar_stock_variante. Una cantidad negativa descuenta stock y una cantidad positiva repone stock.',

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
          description: 'ID del producto.',
        },

        {
          name: 'varianteId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID de la variante.',
        },
      ],

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['cantidad'],
              properties: {
                cantidad: {
                  type: 'integer',
                  description:
                    'Cantidad a ajustar. Negativo para descontar y positivo para reponer. No puede ser 0.',
                  example: -2,
                },
              },
            },
          },
        },
      },

      responses: {
        '200': {
          description: 'Stock ajustado correctamente.',
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
                    type: 'object',
                    properties: {
                      variante_id: {
                        type: 'integer',
                      },

                      stock_anterior: {
                        type: 'integer',
                      },

                      stock_nuevo: {
                        type: 'integer',
                      },
                    },
                  },
                },
              },
            },
          },
        },

        '400': {
          description:
            'Cantidad inválida, variante inexistente o stock insuficiente.',
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
        },

        '403': {
          description:
            'El usuario no es propietario de la tienda ni administrador.',
        },

        '404': {
          description: 'Producto no encontrado.',
        },
      },
    },
  },
} as const

/*export const productosPaths = {
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
} as const */