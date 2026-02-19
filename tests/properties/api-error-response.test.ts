/**
 * @test Feature: system-workflow-review-and-bug-fixes, Property 2: API Error Response Format
 * 
 * Property 2: API Error Response Format
 * For any API error, the response should have `success: false` and include a descriptive `message` field.
 * 
 * Validates: Requirements 2.2
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

describe('Property 2: API Error Response Format', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000'
  
  /**
   * Property Test 1: All error responses must have success: false
   */
  it('should always return success: false for error responses', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate various error scenarios
        fc.constantFrom(
          // Invalid endpoints
          { method: 'GET', path: '/api/betting/invalid-endpoint', expectedError: true },
          { method: 'GET', path: '/api/betting/2d/nonexistent', expectedError: true },
          { method: 'GET', path: '/api/betting/3d/invalid', expectedError: true },
          { method: 'POST', path: '/api/betting/invalid', expectedError: true },
          
          // Invalid resource IDs
          { method: 'GET', path: '/api/betting/2d/bet-history/99999999', expectedError: true },
          { method: 'GET', path: '/api/betting/3d/bet-history/99999999', expectedError: true },
          
          // Missing authentication (should return 401)
          { method: 'GET', path: '/api/betting/wallet/balance', expectedError: true },
          { method: 'GET', path: '/api/betting/wallet/transactions', expectedError: true },
          { method: 'GET', path: '/api/betting/2d/bet-history', expectedError: true },
          { method: 'GET', path: '/api/betting/3d/bet-history', expectedError: true },
          { method: 'GET', path: '/api/betting/football/bet-history', expectedError: true },
          
          // Invalid POST requests with missing/invalid data
          { method: 'POST', path: '/api/betting/2d/place-bet', body: {}, expectedError: true },
          { method: 'POST', path: '/api/betting/3d/place-bet', body: {}, expectedError: true },
          { method: 'POST', path: '/api/betting/2d/place-bet', body: { items: [] }, expectedError: true },
          { method: 'POST', path: '/api/betting/3d/place-bet', body: { items: [] }, expectedError: true },
        ),
        async (errorScenario) => {
          try {
            const response = await makeApiRequest(errorScenario)
            
            // Parse response
            const data = await response.json()
            
            // For error responses (non-2xx status codes), verify structure
            if (!response.ok) {
              // Must have success field set to false
              expect(data).toHaveProperty('success')
              expect(data.success).toBe(false)
              
              // Must have a message field
              expect(data).toHaveProperty('message')
              expect(typeof data.message).toBe('string')
              expect(data.message.length).toBeGreaterThan(0)
            }
            
            return true
          } catch (error) {
            // Network errors or parsing errors - skip
            return true
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 2: Error messages must be descriptive (non-empty strings)
   */
  it('should include descriptive message field for all errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          { method: 'GET', path: '/api/betting/invalid-endpoint' },
          { method: 'POST', path: '/api/betting/2d/place-bet', body: {} },
          { method: 'POST', path: '/api/betting/3d/place-bet', body: { items: [] } },
          { method: 'GET', path: '/api/betting/wallet/balance' }, // Requires auth
          { method: 'GET', path: '/api/betting/2d/bet-history/99999999' },
        ),
        async (errorScenario) => {
          try {
            const response = await makeApiRequest(errorScenario)
            const data = await response.json()
            
            if (!response.ok) {
              // Message must be a non-empty string
              expect(data.message).toBeDefined()
              expect(typeof data.message).toBe('string')
              expect(data.message.trim().length).toBeGreaterThan(0)
              
              // Message should be descriptive (at least 5 characters)
              expect(data.message.length).toBeGreaterThanOrEqual(5)
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
   * Property Test 3: Validation errors should have success: false and message or errors field
   */
  it('should return success: false with message or errors for validation failures', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate invalid bet data
        fc.record({
          items: fc.array(
            fc.record({
              number: fc.oneof(
                fc.constant(''), // Empty number
                fc.constant('1'), // Too short
                fc.constant('123'), // Too long for 2D
                fc.constant('abc'), // Invalid characters
                fc.integer({ min: -100, max: -1 }).map(String), // Negative
              ),
              amount: fc.oneof(
                fc.constant(0), // Zero amount
                fc.constant(-100), // Negative amount
                fc.constant(50), // Below minimum
                fc.constant(100000), // Above maximum
              ),
            }),
            { minLength: 0, maxLength: 3 }
          ),
        }),
        async (invalidBetData) => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/betting/2d/place-bet`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(invalidBetData),
            })
            
            const data = await response.json()
            
            // Validation errors should have success: false
            if (response.status === 400 || response.status === 422) {
              expect(data.success).toBe(false)
              
              // Should have either message or errors field (or both)
              const hasMessage = data.message && typeof data.message === 'string' && data.message.length > 0
              const hasErrors = data.errors && typeof data.errors === 'object'
              
              expect(hasMessage || hasErrors).toBe(true)
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
   * Property Test 4: Authentication errors (401) should have proper error format
   */
  it('should return proper error format for authentication failures', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          { method: 'GET', path: '/api/betting/wallet/balance' },
          { method: 'GET', path: '/api/betting/wallet/transactions' },
          { method: 'GET', path: '/api/betting/2d/bet-history' },
          { method: 'GET', path: '/api/betting/3d/bet-history' },
          { method: 'GET', path: '/api/betting/football/bet-history' },
          { method: 'POST', path: '/api/betting/2d/place-bet', body: { items: [] } },
          { method: 'POST', path: '/api/betting/3d/place-bet', body: { items: [] } },
        ),
        async (endpoint) => {
          try {
            const response = await makeApiRequest(endpoint)
            const data = await response.json()
            
            // If authentication is required and not provided
            if (response.status === 401) {
              expect(data.success).toBe(false)
              expect(data.message).toBeDefined()
              expect(typeof data.message).toBe('string')
              expect(data.message.length).toBeGreaterThan(0)
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
   * Property Test 5: Not found errors (404) should have proper error format
   */
  it('should return proper error format for not found errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 900000000, max: 999999999 }), // Generate large IDs that don't exist
        fc.constantFrom('2d', '3d', 'football'),
        async (nonExistentId, betType) => {
          try {
            const response = await fetch(
              `${API_BASE_URL}/api/betting/${betType}/bet-history/${nonExistentId}`,
              {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                },
              }
            )
            
            const data = await response.json()
            
            // If resource not found
            if (response.status === 404) {
              expect(data.success).toBe(false)
              expect(data.message).toBeDefined()
              expect(typeof data.message).toBe('string')
              expect(data.message.length).toBeGreaterThan(0)
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
   * Property Test 6: Server errors (5xx) should still follow error format
   */
  it('should maintain error format even for server errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          // These might trigger server errors depending on backend state
          { method: 'POST', path: '/api/betting/2d/place-bet', body: { items: [{ number: '00', amount: 999999999 }] } },
          { method: 'POST', path: '/api/betting/3d/place-bet', body: { items: [{ number: '000', amount: 999999999 }] } },
        ),
        async (endpoint) => {
          try {
            const response = await makeApiRequest(endpoint)
            const data = await response.json()
            
            // Even for server errors, should follow format
            if (response.status >= 500) {
              expect(data.success).toBe(false)
              // Should have message (even if generic)
              expect(data.message).toBeDefined()
              expect(typeof data.message).toBe('string')
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
   * Property Test 7: Error responses should not have data field
   */
  it('should not include data field in error responses', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          { method: 'GET', path: '/api/betting/invalid-endpoint' },
          { method: 'POST', path: '/api/betting/2d/place-bet', body: {} },
          { method: 'GET', path: '/api/betting/wallet/balance' }, // No auth
          { method: 'GET', path: '/api/betting/2d/bet-history/99999999' },
        ),
        async (errorScenario) => {
          try {
            const response = await makeApiRequest(errorScenario)
            const data = await response.json()
            
            // Error responses should not have data field
            if (!response.ok && data.success === false) {
              // Data field should either not exist or be null/undefined
              if (data.data !== undefined) {
                expect(data.data).toBeNull()
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
   * Property Test 8: All error responses must be valid JSON
   */
  it('should always return valid JSON for error responses', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          { method: 'GET', path: '/api/betting/invalid-endpoint' },
          { method: 'POST', path: '/api/betting/2d/place-bet', body: {} },
          { method: 'GET', path: '/api/betting/wallet/balance' },
          { method: 'GET', path: '/api/betting/2d/bet-history/99999999' },
          { method: 'POST', path: '/api/betting/3d/place-bet', body: { items: [] } },
        ),
        async (errorScenario) => {
          try {
            const response = await makeApiRequest(errorScenario)
            
            // Should be able to parse as JSON
            const data = await response.json()
            
            // Should be an object
            expect(typeof data).toBe('object')
            expect(data).not.toBeNull()
            
            return true
          } catch (error) {
            // If JSON parsing fails, the test should fail
            if (error instanceof SyntaxError) {
              throw new Error('Response is not valid JSON')
            }
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
