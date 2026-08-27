import { NextResponse } from 'next/server'

export function ok(
  data: unknown,
  status = 200,
  meta?: Record<string, unknown>
) {
  return NextResponse.json(
    { ok: true, data, ...(meta ? { meta } : {}) },
    { status }
  )
}

export function fail(
  code: string,
  message: string,
  status = 400
) {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    { status }
  )
}

export const errors = {
  unauthorized: () =>
    fail('UNAUTHORIZED', 'Debes iniciar sesión.', 401),

  forbidden: () =>
    fail('FORBIDDEN', 'No tienes permiso para esta acción.', 403),

  notFound: (msg = 'Recurso no encontrado.') =>
    fail('NOT_FOUND', msg, 404),

  badRequest: (msg = 'Solicitud inválida.') =>
    fail('BAD_REQUEST', msg, 400),

  validation: (msg: string) =>
    fail('VALIDATION_ERROR', msg, 400),

  conflict: (msg: string) =>
    fail('CONFLICT', msg, 409),

  server: (msg = 'Error inesperado en el servidor.') =>
    fail('SERVER_ERROR', msg, 500),
}