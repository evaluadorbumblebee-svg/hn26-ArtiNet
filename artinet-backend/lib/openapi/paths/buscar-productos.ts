export const buscarProductosPaths = {
  // ============================================================
  // BUSCAR PRODUCTOS
  // ============================================================
  '/api/productos/buscar': {
    get: {
      tags: ['Productos'],

      summary: 'Buscar y filtrar productos',

      description: `
Busca productos utilizando múltiples filtros y criterios de ordenamiento.

La búsqueda está diseñada para funcionar de forma similar a un
buscador de marketplace como Amazon, permitiendo combinar:

- Búsqueda por texto.
- Categoría.
- Tienda.
- Rango de precios.
- Calificación mínima.
- Productos destacados.
- Disponibilidad.
- Estado del producto para administradores.
- Ordenamiento.
- Paginación.

La búsqueda, filtrado, ordenamiento y paginación se ejecutan mediante
la función PostgreSQL "buscar_productos", evitando cargar grandes
cantidades de productos en memoria del servidor.

El parámetro "q" permite realizar búsquedas parciales por texto.
Por ejemplo:

/api/productos/buscar?q=camisa

Puede devolver productos como:
- Camisa casual de algodón
- Camisa deportiva
- Camisa manga larga

Los usuarios normales solamente pueden consultar productos visibles
y activos. Los administradores pueden utilizar el filtro "estado" y
consultar productos inactivos.
      `.trim(),

      parameters: [
        // ========================================================
        // BÚSQUEDA
        // ========================================================
        {
          name: 'q',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            minLength: 1,
            maxLength: 150,
          },
          description:
            'Texto utilizado para buscar productos por coincidencia parcial. Puede utilizarse con otros filtros.',
          example: 'iphone',
        },

        // ========================================================
        // FILTRO POR CATEGORÍA
        // ========================================================
        {
          name: 'categoria_id',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
          },
          description:
            'Filtra los productos pertenecientes a una categoría específica.',
          example: 8,
        },

        // ========================================================
        // FILTRO POR TIENDA
        // ========================================================
        {
          name: 'tienda_id',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
          },
          description:
            'Filtra los productos pertenecientes a una tienda específica.',
          example: 3,
        },

        // ========================================================
        // PRECIO MÍNIMO
        // ========================================================
        {
          name: 'precio_min',
          in: 'query',
          required: false,
          schema: {
            type: 'number',
            format: 'double',
            minimum: 0,
          },
          description:
            'Precio mínimo permitido. Se compara contra el precio de las variantes disponibles del producto.',
          example: 100,
        },

        // ========================================================
        // PRECIO MÁXIMO
        // ========================================================
        {
          name: 'precio_max',
          in: 'query',
          required: false,
          schema: {
            type: 'number',
            format: 'double',
            minimum: 0,
          },
          description:
            'Precio máximo permitido. Se compara contra el precio de las variantes disponibles del producto.',
          example: 1500,
        },

        // ========================================================
        // CALIFICACIÓN
        // ========================================================
        {
          name: 'calificacion_min',
          in: 'query',
          required: false,
          schema: {
            type: 'number',
            format: 'double',
            minimum: 0,
            maximum: 5,
          },
          description:
            'Filtra productos cuya calificación promedio sea igual o superior al valor indicado.',
          example: 4,
        },

        // ========================================================
        // DESTACADOS
        // ========================================================
        {
          name: 'destacado',
          in: 'query',
          required: false,
          schema: {
            type: 'boolean',
          },
          description:
            'Filtra productos destacados. true devuelve únicamente productos destacados y false únicamente productos no destacados.',
          example: true,
        },

        // ========================================================
        // DISPONIBILIDAD
        // ========================================================
        {
          name: 'disponible',
          in: 'query',
          required: false,
          schema: {
            type: 'boolean',
          },
          description:
            'Filtra productos según disponibilidad de stock. Un producto se considera disponible cuando posee al menos una variante activa con stock disponible.',
          example: true,
        },

        // ========================================================
        // ESTADO
        // ========================================================
        {
          name: 'estado',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: [
              'activo',
              'inactivo',
            ],
          },
          description:
            'Filtra por estado del producto. Este parámetro solamente es aplicado cuando el usuario autenticado tiene rol de administrador.',
          example: 'activo',
        },

        // ========================================================
        // ORDENAMIENTO
        // ========================================================
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
          description: `
Criterio utilizado para ordenar los resultados.

relevancia:
Ordena los resultados considerando la coincidencia de búsqueda.

mas_recientes:
Muestra primero los productos creados más recientemente.

mas_vendidos:
Muestra primero los productos con mayor cantidad de ventas.

mejor_calificados:
Muestra primero los productos con mejor calificación.

precio_asc:
Ordena del precio más bajo al más alto.

precio_desc:
Ordena del precio más alto al más bajo.
          `.trim(),
          example: 'relevancia',
        },

        // ========================================================
        // PAGINACIÓN
        // ========================================================
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
          description:
            'Número de página que se desea obtener.',
          example: 1,
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
          description:
            'Cantidad máxima de productos que se devolverán por página.',
          example: 20,
        },
      ],

      // ============================================================
      // RESPUESTAS
      // ============================================================
      responses: {
        // ----------------------------------------------------------
        // 200 OK
        // ----------------------------------------------------------
        '200': {
          description:
            'Productos encontrados correctamente.',

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

                    description:
                      'Lista de productos encontrados.',

                    items: {
                      $ref: '#/components/schemas/ProductoBusqueda',
                    },
                  },

                  meta: {
                    type: 'object',

                    description:
                      'Información de paginación y cantidad total de resultados.',

                    properties: {
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
                        example: 156,
                      },
                    },

                    required: [
                      'page',
                      'pageSize',
                      'total',
                    ],
                  },
                },

                required: [
                  'ok',
                  'data',
                  'meta',
                ],
              },

              examples: {
                productosEncontrados: {
                  summary: 'Resultados de búsqueda',

                  value: {
                    ok: true,

                    data: [
                      {
                        id: 15,
                        tienda_id: 3,
                        categoria_id: 8,
                        nombre: 'iPhone 15 Pro',
                        slug: 'iphone-15-pro',
                        descripcion:
                          'Smartphone Apple iPhone 15 Pro.',
                        material: 'Aluminio',
                        peso: 0.187,
                        largo: 15,
                        ancho: 7.1,
                        alto: 0.8,
                        estado: 'activo',
                        destacado: true,
                        calificacion: 4.8,
                        total_ventas: 125,
                        visitas: 1250,
                        favoritos: 86,
                        activo: true,
                        created_at:
                          '2026-08-19T10:00:00Z',
                        updated_at:
                          '2026-08-19T10:00:00Z',
                        tienda_nombre:
                          'Tecnología Nica',
                        categoria_nombre:
                          'Celulares',
                        precio_minimo: 899.99,
                        precio_maximo: 1099.99,
                        disponible: true,
                        imagen_principal:
                          'https://example.com/iphone-15-pro.jpg',
                      },
                    ],

                    meta: {
                      page: 1,
                      pageSize: 20,
                      total: 156,
                    },
                  },
                },
              },
            },
          },
        },

        // ----------------------------------------------------------
        // 500 SERVER ERROR
        // ----------------------------------------------------------
        '500': {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },
} as const