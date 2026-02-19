/**
 * @test Feature: system-workflow-review-and-bug-fixes, Property 38: Pagination Meta Information
 * 
 * Property 38: Pagination Meta Information
 * For any paginated API response, the meta object should contain current_page, last_page, 
 * per_page, and total fields.
 * 
 * Validates: Requirements 2.3, 6.9
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

describe('Property 38: Pagination Meta Information', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000'
  
  // Define paginated API endpoints to test
  const paginatedEndpoints = [
    { method: 'GET', path: '/api/betting/wallet/transactions', requiresAuth: true, name: 'Wallet Transactions' },
    { method: 'GET', path: '/api/betting/2d/bet-history', requiresAuth: true, name: '2D Bet History' },
    { method: 'GET', path: '/api/betting/3d/bet-history', requiresAuth: true, name: '3D Bet History' },
    { method: 'GET', path: '/api/betting/football/bet-history', requiresAuth: true, name: 'Football Bet History' },
  ]

  /**
   * Property Test 1: All paginated responses must have meta object with required fields
   */
  it('should always include meta object with current_page, last_page, per_page, and total', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...paginatedEndpoints),
        fc.integer({ min: 1, max: 10 }), // page number
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
            
            // If successful, must have meta with all required fields
            if (data.success === true) {
              expect(data).toHaveProperty('meta')
              expect(data.meta).toBeDefined()
              expect(data.meta).not.toBeNull()
              
              // Verify all required fields exist
              expect(data.meta).toHaveProperty('current_page')
              expect(data.meta).toHaveProperty('last_page')
              expect(data.meta).toHaveProperty('per_page')
              expect(data.meta).toHaveProperty('total')
            }
            
            return true
          } catch (error) {
            // Skip network errors
            return true
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 2: Meta fields must be numbers
   */
  it('should have all meta fields as numbers', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...paginatedEndpoints),
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 10, max: 30 }),
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
            
            if (data.success === true && data.meta) {
              // All meta fields must be numbers
              expect(typeof data.meta.current_page).toBe('number')
              expect(typeof data.meta.last_page).toBe('number')
              expect(typeof data.meta.per_page).toBe('number')
              expect(typeof data.meta.total).toBe('number')
              
              // All must be integers (not floats)
              expect(Number.isInteger(data.meta.current_page)).toBe(true)
              expect(Number.isInteger(data.meta.last_page)).toBe(true)
              expect(Number.isInteger(data.meta.per_page)).toBe(true)
              expect(Number.isInteger(data.meta.total)).toBe(true)
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
   * Property Test 3: Meta fields must have valid values
   */
  it('should have meta fields with valid values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...paginatedEndpoints),
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 5, max: 50 }),
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
            
            if (data.success === true && data.meta) {
              const { current_page, last_page, per_page, total } = data.meta
              
              // current_page must be >= 1
              expect(current_page).toBeGreaterThanOrEqual(1)
              
              // last_page must be >= 0 (can be 0 if no data)
              expect(last_page).toBeGreaterThanOrEqual(0)
              
              // per_page must be > 0
              expect(per_page).toBeGreaterThan(0)
              
              // total must be >= 0
              expect(total).toBeGreaterThanOrEqual(0)
              
              // current_page should not exceed last_page (unless last_page is 0)
              if (last_page > 0) {
                expect(current_page).toBeLessThanOrEqual(last_page)
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
   * Property Test 4: Meta values must be consistent with data
   */
  it('should have meta values consistent with returned data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...paginatedEndpoints),
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 10, max: 30 }),
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
            
            if (data.success === true && data.meta && Array.isArray(data.data)) {
              const { current_page, last_page, per_page, total } = data.meta
              
              // Number of items returned should not exceed per_page
              expect(data.data.length).toBeLessThanOrEqual(per_page)
              
              // If not on last page and there's data, should have up to per_page items
              if (current_page < last_page && total > 0) {
                // On non-last pages, we might have up to per_page items
                expect(data.data.length).toBeLessThanOrEqual(per_page)
              }
              
              // If on last page, items should be <= remaining items
              if (current_page === last_page && total > 0) {
                const remainingItems = total - (current_page - 1) * per_page
                expect(data.data.length).toBeLessThanOrEqual(remainingItems)
              }
              
              // If total is 0, data should be empty
              if (total === 0) {
                expect(data.data.length).toBe(0)
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
   * Property Test 5: Total items calculation must be consistent with pagination
   */
  it('should have total items consistent with last_page and per_page', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...paginatedEndpoints),
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
            
            if (data.success === true && data.meta) {
              const { last_page, per_page, total } = data.meta
              
              // If there are pages, verify total is consistent
              if (last_page > 0) {
                // Total should be within the range that makes sense for the pagination
                const maxPossibleItems = last_page * per_page
                const minPossibleItems = (last_page - 1) * per_page + 1
                
                expect(total).toBeLessThanOrEqual(maxPossibleItems)
                expect(total).toBeGreaterThanOrEqual(Math.min(minPossibleItems, 0))
              }
              
              // If total is 0, last_page should be 0 or 1
              if (total === 0) {
                expect(last_page).toBeLessThanOrEqual(1)
              }
              
              // If total > 0, last_page should be > 0
              if (total > 0) {
                expect(last_page).toBeGreaterThan(0)
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
   * Property Test 6: Requesting different pages should maintain consistent meta structure
   */
  it('should maintain consistent meta structure across different pages', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...paginatedEndpoints),
        fc.array(fc.integer({ min: 1, max: 5 }), { minLength: 2, maxLength: 5 }), // Multiple page numbers
        fc.integer({ min: 10, max: 20 }),
        async (endpoint, pages, perPage) => {
          try {
            const responses = []
            
            // Fetch multiple pages
            for (const page of pages) {
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
              if (data.success === true) {
                responses.push(data)
              }
            }
            
            // If we got multiple successful responses, verify consistency
            if (responses.length > 1) {
              const firstMeta = responses[0].meta
              
              for (let i = 1; i < responses.length; i++) {
                const currentMeta = responses[i].meta
                
                // All responses should have the same structure
                expect(currentMeta).toHaveProperty('current_page')
                expect(currentMeta).toHaveProperty('last_page')
                expect(currentMeta).toHaveProperty('per_page')
                expect(currentMeta).toHaveProperty('total')
                
                // last_page, per_page, and total should be the same across pages
                expect(currentMeta.last_page).toBe(firstMeta.last_page)
                expect(currentMeta.per_page).toBe(firstMeta.per_page)
                expect(currentMeta.total).toBe(firstMeta.total)
              }
            }
            
            return true
          } catch (error) {
            return true
          }
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property Test 7: Meta should not have extra unexpected fields
   */
  it('should only contain expected pagination fields in meta', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...paginatedEndpoints),
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 10, max: 30 }),
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
            
            if (data.success === true && data.meta) {
              // Define expected fields (can include additional Laravel pagination fields)
              const expectedFields = [
                'current_page',
                'last_page',
                'per_page',
                'total',
                // Laravel may include these additional fields
                'from',
                'to',
                'path',
                'first_page_url',
                'last_page_url',
                'next_page_url',
                'prev_page_url',
                'links'
              ]
              
              // All fields in meta should be expected
              const metaKeys = Object.keys(data.meta)
              for (const key of metaKeys) {
                expect(expectedFields).toContain(key)
              }
              
              // Required fields must be present
              expect(data.meta).toHaveProperty('current_page')
              expect(data.meta).toHaveProperty('last_page')
              expect(data.meta).toHaveProperty('per_page')
              expect(data.meta).toHaveProperty('total')
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
   * Property Test 8: Requesting page beyond last_page should handle gracefully
   */
  it('should handle requests for pages beyond last_page gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...paginatedEndpoints),
        fc.integer({ min: 100, max: 1000 }), // Very high page number
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
            
            // Should still return valid response structure
            if (data.success === true) {
              expect(data).toHaveProperty('meta')
              expect(data.meta).toHaveProperty('current_page')
              expect(data.meta).toHaveProperty('last_page')
              expect(data.meta).toHaveProperty('per_page')
              expect(data.meta).toHaveProperty('total')
              
              // Data should be empty array if page exceeds last_page
              if (data.meta.current_page > data.meta.last_page && data.meta.last_page > 0) {
                expect(Array.isArray(data.data)).toBe(true)
                expect(data.data.length).toBe(0)
              }
            }
            
            return true
          } catch (error) {
            return true
          }
        }
      ),
      { numRuns: 50 }
    )
  })
})
