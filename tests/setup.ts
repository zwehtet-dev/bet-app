import { vi } from 'vitest'
import { ref, readonly } from 'vue'

// Make vi globally available
global.vi = vi

// Mock Nuxt auto-imports
global.useState = vi.fn((key: string, init?: () => any) => {
  return ref(init ? init() : undefined)
})

global.readonly = readonly

global.ref = ref

global.useApi = vi.fn(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))
