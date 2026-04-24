export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export function simulateDelay(minMs = 200, maxMs = 800): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function simulateNetworkLatency(): Promise<void> {
  return simulateDelay(100, 300);
}

export function simulateSlowNetwork(): Promise<void> {
  return simulateDelay(1500, 3000);
}

export function shouldSimulateFailure(failureRate = 0): boolean {
  return Math.random() < failureRate;
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse<T>(message: string): ApiResponse<T> {
  return {
    data: null as unknown as T,
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    data: paginatedItems,
    pagination: {
      page,
      pageSize,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / pageSize),
    },
  };
}

export class MockApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'MockApiError';
  }
}

export const MOCK_ERROR_MESSAGES = {
  UNAUTHORIZED: 'Authentication required. Please log in.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  INTERNAL_ERROR: 'An internal server error occurred. Please try again later.',
  NETWORK_ERROR: 'Network connection failed. Please check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
};
