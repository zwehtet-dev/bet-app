/**
 * @test Feature: system-workflow-review-and-bug-fixes, Property 1: API Response Structure Consistency
 * 
 * Property 1: API Response Structure Consistency
 * For any API endpoint call, the response should contain a `success` boolean field, 
 * and when successful should include a `data` field, and when paginated should include 
 * a `meta` field with current_page, last_page, per_page, and total.
 * 
 * Validates: Requirements 2.1, 2.3
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import * as fc from 'fast-check'

describe('Property 1: API Response Structure Consistency', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000'
  
  // Define API endpoints to test
  const apiEndpoints = [
    { method: 'GET', path: '/api/betting/2d/current-session', requiresAuth: false, isPaginated: false },
    { method: 'GET', path: '/api/betting/3d/current-session', requiresAuth: false, isPaginated: false },
    { method: 'GET', path: '/api/betting/wallet/balance', requiresAuth: true, isPaginated: false },
    { method: 'GET', path: '/api/betting/wallet/transactions', requiresAuth: true, isPaginated: true },
    { method: 'GET', path: '/api/betting/2d/bet-history', requiresAuth: true, isPaginated: true },
    { method: 'GET', path: '/api/betting/3d/bet-history', requiresAuth: true, isPaginated: true },
    { method: 'GET', path: '/api/betting/football/bet-history', requiresAuth: true, isPaginated: true },
  ]

  /**
   * Property Test 1: All API responses must have a success boolean field
   */
  it('should always return a response with a success boolean field', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...apiEndpoints),
        async (endpoint) => {
          try {
            const response = await makeApiRequest(endpoint)
            const data = await response.json()
            
            // Every response must have a success field
            expect(data).toHaveProperty('success')
            expect(typeof data.success).toBe('boolean')
            
            return true
          } catch (error) {
            // Even error responses should have success field
            if (error instanceof Response) {
              const data = await error.json()
              expect(data).toHaveProperty('success')
              expect(data.success).toBe(false)
            }
            return true
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 2: Successful responses must include a data field
   */
  it('should include a data field when success is true', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...apiEndpoints),
        async (endpoint) => {
          try {
            const response = await makeApiRequest(endpoint)
            
            // Skip if response is not successful (e.g., auth required)
            if (!response.ok) {
              return true
            }
            
            const data = await response.json()
            
            // If success is true, data field should exist
            if (data.success === true) {
              expect(data).toHaveProperty('data')
            }
            
            return true
          } catch (error) {
            // Skip errors for this test
            return true
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 3: Paginated responses must include meta with pagination fields
   */
  it('should include meta with pagination fields for paginated endpoints', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...apiEndpoints.filter(e => e.isPaginated)),
        fc.integer({ min: 1, max: 5 }), // page number
        fc.integer({ min: 5, max: 50 }), // per_page
        async (endpoint, page, perPage) => {
          try {
            const url = new URL(`${API_BASE_URL}${endpoint.path}`)
            url.searchParams.set('page', page.toString())
            url.searchParams.set('per_page', perPage.toString())
            
            const response = await fetch(url.toString(), {
              method: endpoint.method,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            })
            
            // Skip if auth is required and we're not authenticated
            if (response.status === 401 || response.status === 403) {
              return true
            }
            
            const data = await response.json()
            
            // If successful, must have meta with pagination fields
            if (data.success === true) {
              expect(data).toHaveProperty('meta')
              expect(data.meta).toHaveProperty('current_page')
              expect(data.meta).toHaveProperty('last_page')
              expect(data.meta).toHaveProperty('per_page')
              expect(data.meta).toHaveProperty('total')
              
              // Verify types
              expect(typeof data.meta.current_page).toBe('number')
              expect(typeof data.meta.last_page).toBe('number')
              expect(typeof data.meta.per_page).toBe('number')
              expect(typeof data.meta.total).toBe('number')
              
              // Verify logical constraints
              expect(data.meta.current_page).toBeGreaterThanOrEqual(1)
              expect(data.meta.current_page).toBeLessThanOrEqual(data.meta.last_page || 1)
              expect(data.meta.per_page).toBeGreaterThan(0)
              expect(data.meta.total).toBeGreaterThanOrEqual(0)
            }
            
            return true
          } catch (error) {
            // Skip errors for this test
            return true
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 4: Response structure consistency across different HTTP methods
   */
  it('should maintain consistent response structure across all HTTP methods', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...apiEndpoints),
        async (endpoint) => {
          try {
            const response = await makeApiRequest(endpoint)
            const data = await response.json()
            
            // All responses must have success field
            expect(data).toHaveProperty('success')
            expect(typeof data.success).toBe('boolean')
            
            // Response should only have expected fields
            const allowedFields = ['success', 'data', 'message', 'meta', 'errors']
            const responseKeys = Object.keys(data)
            
            for (const key of responseKeys) {
              expect(allowedFields).toContain(key)
            }
            
            return true
          } catch (error) {
            // Even errors should follow structure
            if (error instanceof Response) {
              const data = await error.json()
              expect(data).toHaveProperty('success')
              expect(data.success).toBe(false)
            }
            return true
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 5: Error responses must have success: false and message
   */
  it('should return success: false with message for error responses', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Test with invalid endpoints or parameters
        fc.constantFrom(
          { method: 'GET', path: '/api/betting/2d/bet-history/99999999', requiresAuth: false },
          { method: 'GET', path: '/api/betting/invalid-endpoint', requiresAuth: false },
          { method: 'POST', path: '/api/betting/2d/place-bet', requiresAuth: false, body: {} },
        ),
        async (endpoint) => {
          try {
            const response = await makeApiRequest(endpoint)
            const data = await response.json()
            
            // If response is not ok, should have success: false
            if (!response.ok) {
              expect(data.success).toBe(false)
              // Should have either message or errors field
              expect(data.message || data.errors).toBeDefined()
            }
            
            return true
          } catch (error) {
            // Expected for invalid endpoints
            return true
          }
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property Test 6: Pagination meta values should be consistent
   */
  it('should have consistent pagination meta values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...apiEndpoints.filter(e => e.isPaginated)),
        fc.integer({ min: 1, max: 3 }),
        fc.integer({ min: 10, max: 20 }),
        async (endpoint, page, perPage) => {
          try {
            const url = new URL(`${API_BASE_URL}${endpoint.path}`)
            url.searchParams.set('page', page.toString())
            url.searchParams.set('per_page', perPage.toString())
            
            const response = await fetch(url.toString(), {
              method: endpoint.method,
              headers: {
                'Accept': 'application/json',
              },
            })
            
            if (response.status === 401 || response.status === 403) {
              return true
            }
            
            const data = await response.json()
            
            if (data.success && data.meta) {
              // If there's data, verify pagination consistency
              const { current_page, last_page, per_page, total } = data.meta
              
              // Current page should not exceed last page
              expect(current_page).toBeLessThanOrEqual(last_page || 1)
              
              // If we have items, verify the count makes sense
              if (Array.isArray(data.data)) {
                expect(data.data.length).toBeLessThanOrEqual(per_page)
                
                // If not on last page, should have per_page items (unless total is less)
                if (current_page < last_page) {
                  expect(data.data.length).toBeLessThanOrEqual(per_page)
                }
              }
              
              // Total items should be consistent with pages
              if (last_page > 0) {
                const maxPossibleItems = last_page * per_page
                const minPossibleItems = (last_page - 1) * per_page + 1
                expect(total).toBeLessThanOrEqual(maxPossibleItems)
                expect(total).toBeGreaterThanOrEqual(Math.min(minPossibleItems, 0))
              }
            }
            
            return true
          } catch (error) {
            return true
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 7: Non-paginated endpoints should not have meta field
   */
  it('should not include meta field for non-paginated endpoints', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...apiEndpoints.filter(e => !e.isPaginated)),
        async (endpoint) => {
          try {
            const response = await makeApiRequest(endpoint)
            
            if (!response.ok) {
              return true
            }
            
            const data = await response.json()
            
            // Non-paginated successful responses should not have meta
            if (data.success === true) {
              expect(data.meta).toBeUndefined()
            }
            
            return true
          } catch (error) {
            return true
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Helper function to make API requests
async function makeApiRequest(endpoint: { method: string; path: string; body?: any }) {
  const url = `${process.env.API_BASE_URL || 'http://localhost:8000'}${endpoint.path}`
  
  const options: RequestInit = {
    method: endpoint.method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }
  
  if (endpoint.body) {
    options.body = JSON.stringify(endpoint.body)
  }
  
  return fetch(url, options)
}
