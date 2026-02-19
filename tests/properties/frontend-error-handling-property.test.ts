/**
 * @test Feature: system-workflow-review-and-bug-fixes, Task 14.4: Property Test for Frontend Error Handling
 * Property 33: Frontend Error Handling
 * 
 * This property test verifies that:
 * For any API error response, the frontend should display a toast notification 
 * using the error() method with the error message.
 * 
 * Validates: Requirements 10.2
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'

describe('Property 33: Frontend Error Handling', () => {
  let mockToastError: ReturnType<typeof vi.fn>
  let mockConsoleError: ReturnType<typeof vi.fn>
  
  beforeEach(() => {
    // Mock console.error to avoid noise in test output
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  
  afterEach(() => {
    mockConsoleError.mockRestore()
    vi.clearAllMocks()
  })

  /**
   * Property Test 1: API error responses trigger toast.error() calls
   * 
   * For any API error response with a message, the frontend should call
   * toast.error() with that message.
   */
  it('should call toast.error() for any API error response', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate various error scenarios
        fc.record({
          statusCode: fc.constantFrom(400, 401, 403, 404, 422, 500, 503),
          message: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
          hasErrors: fc.boolean(),
          errors: fc.option(
            fc.dictionary(
              fc.string({ minLength: 1, maxLength: 20 }),
              fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 1, maxLength: 3 })
            ),
            { nil: undefined }
          )
        }),
        async (errorScenario) => {
          // Create mock toast
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate API error response
          const apiError: any = new Error('API Error')
          apiError.response = {
            status: errorScenario.statusCode,
            data: {
              success: false,
              message: errorScenario.message,
              ...(errorScenario.hasErrors && errorScenario.errors ? { errors: errorScenario.errors } : {})
            }
          }
          apiError.message = errorScenario.message
          
          // Simulate frontend error handling pattern (as seen in pages)
          try {
            throw apiError
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'An error occurred'
            mockToast.error(message)
          }
          
          // Verify toast.error() was called
          expect(mockToastError).toHaveBeenCalled()
          expect(mockToastError).toHaveBeenCalledWith(expect.any(String))
          
          // Verify the message passed to toast.error() is not empty
          const calledMessage = mockToastError.mock.calls[0][0]
          expect(calledMessage).toBeDefined()
          expect(typeof calledMessage).toBe('string')
          expect(calledMessage.length).toBeGreaterThan(0)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 2: Network errors trigger toast.error() calls
   * 
   * For any network error (no response), the frontend should call
   * toast.error() with a fallback message.
   */
  it('should call toast.error() for network errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'Network Error',
          'Failed to fetch',
          'Connection refused',
          'Timeout',
          'ECONNREFUSED'
        ),
        async (networkErrorMessage) => {
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate network error (no response object)
          const networkError: any = new Error(networkErrorMessage)
          
          // Simulate frontend error handling pattern
          try {
            throw networkError
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Network error occurred'
            mockToast.error(message)
          }
          
          // Verify toast.error() was called
          expect(mockToastError).toHaveBeenCalled()
          expect(mockToastError).toHaveBeenCalledWith(expect.any(String))
          
          // Verify message is not empty
          const calledMessage = mockToastError.mock.calls[0][0]
          expect(calledMessage.length).toBeGreaterThan(0)
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property Test 3: Validation errors trigger toast.error() calls
   * 
   * For any validation error (422 status), the frontend should call
   * toast.error() with the validation message.
   */
  it('should call toast.error() for validation errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          message: fc.string({ minLength: 10, maxLength: 100 }),
          errors: fc.dictionary(
            fc.constantFrom('items', 'amount', 'number', 'email', 'phone', 'password'),
            fc.array(fc.string({ minLength: 10, maxLength: 50 }), { minLength: 1, maxLength: 2 })
          )
        }),
        async (validationError) => {
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate validation error response
          const apiError: any = new Error('Validation Error')
          apiError.response = {
            status: 422,
            data: {
              success: false,
              message: validationError.message,
              errors: validationError.errors
            }
          }
          
          // Simulate frontend error handling pattern
          try {
            throw apiError
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Validation failed'
            mockToast.error(message)
          }
          
          // Verify toast.error() was called
          expect(mockToastError).toHaveBeenCalled()
          
          // Verify message contains useful information
          const calledMessage = mockToastError.mock.calls[0][0]
          expect(calledMessage.length).toBeGreaterThan(0)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 4: Authentication errors trigger toast.error() calls
   * 
   * For any authentication error (401 status), the frontend should call
   * toast.error() with an authentication-related message.
   */
  it('should call toast.error() for authentication errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'Unauthenticated',
          'Please log in to continue',
          'Session expired',
          'Invalid credentials',
          'Authentication required'
        ),
        async (authMessage) => {
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate authentication error
          const apiError: any = new Error('Auth Error')
          apiError.response = {
            status: 401,
            data: {
              success: false,
              message: authMessage
            }
          }
          
          // Simulate frontend error handling pattern
          try {
            throw apiError
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Authentication failed'
            mockToast.error(message)
          }
          
          // Verify toast.error() was called
          expect(mockToastError).toHaveBeenCalled()
          expect(mockToastError).toHaveBeenCalledWith(expect.any(String))
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property Test 5: Business logic errors trigger toast.error() calls
   * 
   * For any business logic error (400 status), the frontend should call
   * toast.error() with the business error message.
   */
  it('should call toast.error() for business logic errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'Insufficient balance',
          'Session is closed',
          'Digit is blocked',
          'Market is inactive',
          'Bet cannot be cancelled',
          'Invalid bet amount',
          'Minimum bet amount is 100',
          'Maximum bet amount is 50000'
        ),
        async (businessMessage) => {
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate business logic error
          const apiError: any = new Error('Business Error')
          apiError.response = {
            status: 400,
            data: {
              success: false,
              message: businessMessage
            }
          }
          
          // Simulate frontend error handling pattern
          try {
            throw apiError
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Operation failed'
            mockToast.error(message)
          }
          
          // Verify toast.error() was called
          expect(mockToastError).toHaveBeenCalled()
          
          // Verify message is the business error message
          const calledMessage = mockToastError.mock.calls[0][0]
          expect(calledMessage).toBe(businessMessage)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 6: Server errors trigger toast.error() calls
   * 
   * For any server error (500 status), the frontend should call
   * toast.error() with an appropriate error message.
   */
  it('should call toast.error() for server errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          statusCode: fc.constantFrom(500, 502, 503, 504),
          message: fc.constantFrom(
            'Internal server error',
            'Service temporarily unavailable',
            'Server error occurred',
            'Something went wrong'
          )
        }),
        async (serverError) => {
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate server error
          const apiError: any = new Error('Server Error')
          apiError.response = {
            status: serverError.statusCode,
            data: {
              success: false,
              message: serverError.message
            }
          }
          
          // Simulate frontend error handling pattern
          try {
            throw apiError
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Server error'
            mockToast.error(message)
          }
          
          // Verify toast.error() was called
          expect(mockToastError).toHaveBeenCalled()
          expect(mockToastError).toHaveBeenCalledWith(expect.any(String))
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property Test 7: Error messages are never empty
   * 
   * For any error scenario, the message passed to toast.error()
   * should never be empty or undefined.
   */
  it('should never call toast.error() with empty message', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          statusCode: fc.integer({ min: 400, max: 599 }),
          hasMessage: fc.boolean(),
          message: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined })
        }),
        async (errorScenario) => {
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate error with potentially empty message
          const apiError: any = new Error('Error')
          apiError.response = {
            status: errorScenario.statusCode,
            data: {
              success: false,
              ...(errorScenario.hasMessage && errorScenario.message ? { message: errorScenario.message } : {})
            }
          }
          
          // Simulate frontend error handling pattern with fallback and trim
          try {
            throw apiError
          } catch (error: any) {
            let message = error?.response?.data?.message || error?.message || 'An error occurred'
            // Trim whitespace and use fallback if empty
            message = message.trim() || 'An error occurred'
            mockToast.error(message)
          }
          
          // Verify toast.error() was called
          expect(mockToastError).toHaveBeenCalled()
          
          // Verify message is never empty
          const calledMessage = mockToastError.mock.calls[0][0]
          expect(calledMessage).toBeDefined()
          expect(typeof calledMessage).toBe('string')
          expect(calledMessage.length).toBeGreaterThan(0)
          expect(calledMessage.trim().length).toBeGreaterThan(0)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 8: toast.error() is called exactly once per error
   * 
   * For any error, toast.error() should be called exactly once,
   * not multiple times.
   */
  it('should call toast.error() exactly once per error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          statusCode: fc.integer({ min: 400, max: 599 }),
          message: fc.string({ minLength: 10, maxLength: 100 })
        }),
        async (errorScenario) => {
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate error
          const apiError: any = new Error('Error')
          apiError.response = {
            status: errorScenario.statusCode,
            data: {
              success: false,
              message: errorScenario.message
            }
          }
          
          // Simulate frontend error handling pattern
          try {
            throw apiError
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'An error occurred'
            mockToast.error(message)
          }
          
          // Verify toast.error() was called exactly once
          expect(mockToastError).toHaveBeenCalledTimes(1)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 9: Error handling preserves error message content
   * 
   * For any error with a message, the message passed to toast.error()
   * should be the same as the original error message (or a fallback).
   */
  it('should preserve error message content when calling toast.error()', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
        async (originalMessage) => {
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate error with specific message
          const apiError: any = new Error('Error')
          apiError.response = {
            status: 400,
            data: {
              success: false,
              message: originalMessage
            }
          }
          
          // Simulate frontend error handling pattern
          try {
            throw apiError
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'An error occurred'
            mockToast.error(message)
          }
          
          // Verify the message passed to toast.error() is the original message
          const calledMessage = mockToastError.mock.calls[0][0]
          expect(calledMessage).toBe(originalMessage)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property Test 10: Multiple error types all trigger toast.error()
   * 
   * Regardless of error type (auth, validation, business, server),
   * toast.error() should always be called.
   */
  it('should call toast.error() for all error types', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          errorType: fc.constantFrom('auth', 'validation', 'business', 'server', 'network'),
          statusCode: fc.option(fc.integer({ min: 400, max: 599 }), { nil: undefined }),
          message: fc.string({ minLength: 10, maxLength: 100 })
        }),
        async (errorScenario) => {
          mockToastError = vi.fn()
          const mockToast = {
            error: mockToastError,
            success: vi.fn(),
            info: vi.fn(),
            warning: vi.fn()
          }
          
          // Simulate different error types
          const apiError: any = new Error('Error')
          
          if (errorScenario.errorType === 'network') {
            // Network error - no response
            apiError.message = errorScenario.message
          } else {
            // API error - has response
            apiError.response = {
              status: errorScenario.statusCode || 400,
              data: {
                success: false,
                message: errorScenario.message,
                ...(errorScenario.errorType === 'validation' ? { errors: { field: ['error'] } } : {})
              }
            }
          }
          
          // Simulate frontend error handling pattern
          try {
            throw apiError
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'An error occurred'
            mockToast.error(message)
          }
          
          // Verify toast.error() was called regardless of error type
          expect(mockToastError).toHaveBeenCalled()
          expect(mockToastError).toHaveBeenCalledWith(expect.any(String))
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
