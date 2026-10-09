const API_URL = import.meta.env.VITE_API_URL;

export interface ApiError {
  message: string;
  code: string;
  errors?: Record<string, string>;
  available?: number;
}

export class ApiRequestError extends Error {
  code: string;
  errors?: Record<string, string>;
  available?: number;
  status: number;

  constructor(status: number, body: ApiError) {
    super(body.message);
    this.name = 'ApiRequestError';
    this.code = body.code;
    this.errors = body.errors;
    this.available = body.available;
    this.status = status;
  }
}
type UnauthorizedListener = () => void;
let unauthorizedListener: UnauthorizedListener | null = null;

export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListener = listener;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

    if (!response.ok) {
    const errorBody = (data as ApiError) ?? { message: 'Something went wrong', code: 'UNKNOWN_ERROR' };

    if (response.status === 401 && errorBody.code === 'TOKEN_EXPIRED') {
      unauthorizedListener?.();
    }

    throw new ApiRequestError(response.status, errorBody);
  }

  return data as T;
}