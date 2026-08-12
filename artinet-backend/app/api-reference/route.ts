import { ApiReference } from '@scalar/nextjs-api-reference'

const config = {
  spec: {
    url: '/api/openapi.json',
  },
  theme: 'purple',
} as const

export const GET = ApiReference(config)
