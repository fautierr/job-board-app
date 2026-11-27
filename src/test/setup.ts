import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Los tests no dependen del `.env` local ni de una API real.
vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test/api')

afterEach(() => {
  cleanup()
})
