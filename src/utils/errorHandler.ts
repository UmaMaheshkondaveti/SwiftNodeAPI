// src/utils/errorHandler.ts

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: string;
}

/**
 * Create an error response object
 */
export function createErrorResponse(message: string): ErrorResponse {
  return { error: message };
}

/**
 * Helper function to handle API errors
 */
export function handleError(error: any): { statusCode: number, errorResponse: ErrorResponse } {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      errorResponse: createErrorResponse(error.message)
    };
  }
  
  // Default to 500 Internal Server Error for unhandled errors
  return {
    statusCode: 500,
    errorResponse: createErrorResponse('Internal Server Error')
  };
}