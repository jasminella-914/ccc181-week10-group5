export interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

// 'unauthorized' = 400/401 (wrong login or bad token)
// 'network'      = server stopped or wrong address
// 'server'       = 500 or anything unexpected
export type ApiErrorKind = 'unauthorized' | 'network' | 'server';

export class ApiError extends Error {
  kind: ApiErrorKind;

  constructor(kind: ApiErrorKind, message: string) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
  }
}


const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/+$/,
  '',
);

const TOKEN_KEY = 'campusconnect_token';

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.name === 'string' &&
    typeof v.email === 'string'
  );
}

function isLoginResponse(value: unknown): value is LoginResponse {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.token === 'string' && isUser(v.user);
}

async function request(
  path: string,
  init: RequestInit,
): Promise<{ status: number; data: unknown }> {
  if (!API_URL) {
    console.error('VITE_API_URL is missing. Copy .env.example to .env and restart npm run dev.');
    throw new ApiError('network', 'API address is not set');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    // fetch only throws when the server cannot be reached.
    throw new ApiError('network', 'Cannot reach the server');
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null; // the body was not JSON
  }
  return { status: response.status, data };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { status, data } = await request('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (status === 200 && isLoginResponse(data)) {
    return data;
  }
  if (status === 400 || status === 401) {
    throw new ApiError('unauthorized', 'Wrong email or password');
  }
  throw new ApiError('server', `Unexpected status ${status}`);
}

export async function getMe(token: string): Promise<User> {
  const { status, data } = await request('/users/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (status === 200 && isUser(data)) {
    return data;
  }
  if (status === 401) {
    throw new ApiError('unauthorized', 'Not logged in');
  }
  throw new ApiError('server', `Unexpected status ${status}`);
}

// The text the user sees. Never show raw errors like "TypeError: Failed to fetch".
export function friendlyMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.kind === 'unauthorized') return 'Wrong email or password.';
    if (error.kind === 'network') return 'Cannot reach the server. Please try again.';
  }
  return 'Something went wrong on our side. Please try again later.';
}