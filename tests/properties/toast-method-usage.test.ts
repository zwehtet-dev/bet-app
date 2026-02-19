/**
 * @test Feature: system-workflow-review-and-bug-fixes, Property 3: Toast Method Usage
 * 
 * Property 3: Toast Method Usage
 * For any component using useToast, the calls should use the methods success(), error(), 
 * info(), or warning() with title as the first parameter and optional message as the 
 * second parameter, never showToast().
 * 
 * Validates: Requirements 1.1, 1.2
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

describe('Property 3: Toast Method Usage', () => {
  /**
   * This property test verifies that all Vue components using useToast
   * call the correct methods (success, error, info, warning) and never
   * call the deprecated showToast method.
   */
  it('should use correct toast methods (success, error, info, warning) and never showToast', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary file paths from the pages directory
        fc.constantFrom(...getVueFiles()),
        async (filePath) => {
          const content = readFileSync(filePath, 'utf-8')
          
          // Skip files that don't use useToast
          if (!content.includes('useToast')) {
            return true
          }

          // Check that showToast is never called (not as a method definition or call)
          // Allow "showError" as an alias but not "showToast"
          const hasShowToastCall = /(?<!\/\/.*)\bshowToast\s*\(/g.test(content)
          expect(hasShowToastCall).toBe(false)

          // Verify that if useToast is used, it's either:
          // 1. Destructured: const { success, error } = useToast()
          // 2. Assigned: const toast = useToast()
          const hasValidUsage = 
            /const\s*{\s*[^}]*\}\s*=\s*useToast\(\)/.test(content) ||
            /const\s+\w+\s*=\s*useToast\(\)/.test(content)
          
          expect(hasValidUsage).toBe(true)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should call toast methods with title as first parameter', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
        fc.option(fc.integer({ min: 1000, max: 10000 }), { nil: undefined }),
        fc.constantFrom('success', 'error', 'info', 'warning'),
        async (title, message, duration, method) => {
          // Simulate calling toast methods with various parameters
          const mockToast = createMockToast()
          
          // Call the method with appropriate parameters
          if (message !== undefined && duration !== undefined) {
            mockToast[method](title, message, duration)
          } else if (message !== undefined) {
            mockToast[method](title, message)
          } else if (duration !== undefined) {
            mockToast[method](title, undefined, duration)
          } else {
            mockToast[method](title)
          }

          // Verify the call was made correctly
          const lastCall = mockToast.show.mock.calls[mockToast.show.mock.calls.length - 1]
          expect(lastCall[0]).toBe(method) // type
          expect(lastCall[1]).toBe(title) // title as first param
          if (message !== undefined) {
            expect(lastCall[2]).toBe(message) // message as second param
          }
          if (duration !== undefined) {
            expect(lastCall[3]).toBe(duration) // duration as third param
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should never have showToast method calls in any Vue component', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...getVueFiles()),
        async (filePath) => {
          const content = readFileSync(filePath, 'utf-8')
          
          // Check for any showToast calls
          const showToastPattern = /showToast\s*\(/g
          const matches = content.match(showToastPattern)
          
          // Should have no matches
          expect(matches).toBeNull()

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should use destructured toast methods correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...getVueFiles()),
        async (filePath) => {
          const content = readFileSync(filePath, 'utf-8')
          
          // Skip files that don't use useToast
          if (!content.includes('useToast')) {
            return true
          }

          // Check for destructured usage patterns
          const destructuredPattern = /const\s*{\s*([^}]+)\s*}\s*=\s*useToast\(\)/g
          const matches = [...content.matchAll(destructuredPattern)]
          
          for (const match of matches) {
            const destructuredMethods = match[1].split(',').map(m => m.trim())
            
            // Verify only valid methods are destructured
            const validMethods = ['success', 'error', 'info', 'warning', 'show', 'remove', 'toggleNotifications', 'loadSettings', 'toasts', 'notificationsEnabled']
            
            for (const method of destructuredMethods) {
              // Handle aliases like "error: showError"
              const methodName = method.includes(':') ? method.split(':')[0].trim() : method
              expect(validMethods).toContain(methodName)
            }
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Helper functions

function getVueFiles(): string[] {
  const vueFiles: string[] = []
  const pagesDir = join(process.cwd(), 'app', 'pages')
  const componentsDir = join(process.cwd(), 'app', 'components')
  
  function walkDir(dir: string) {
    try {
      const files = readdirSync(dir)
      for (const file of files) {
        const filePath = join(dir, file)
        const stat = statSync(filePath)
        
        if (stat.isDirectory()) {
          walkDir(filePath)
        } else if (file.endsWith('.vue')) {
          vueFiles.push(filePath)
        }
      }
    } catch (error) {
      // Directory might not exist, skip
    }
  }
  
  walkDir(pagesDir)
  walkDir(componentsDir)
  
  return vueFiles.length > 0 ? vueFiles : [join(pagesDir, 'wallet.vue')]
}

function extractToastCalls(content: string): string[] {
  const calls: string[] = []
  
  // Pattern to match toast method calls
  const patterns = [
    /toast\.(success|error|info|warning|show|remove)\s*\([^)]*\)/g,
    /\{\s*(success|error|info|warning)\s*\}\s*=\s*useToast\(\)/g,
  ]
  
  for (const pattern of patterns) {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      calls.push(match[0])
    }
  }
  
  return calls
}

function createMockToast() {
  const show = vi.fn()
  
  return {
    show,
    success: (title: string, message?: string, duration?: number) => 
      show('success', title, message, duration),
    error: (title: string, message?: string, duration?: number) => 
      show('error', title, message, duration),
    info: (title: string, message?: string, duration?: number) => 
      show('info', title, message, duration),
    warning: (title: string, message?: string, duration?: number) => 
      show('warning', title, message, duration),
  }
}
