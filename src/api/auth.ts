const API_URL = import.meta.env.VITE_API_URL as string;

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return { status: response.status, data };
}

export async function getMe(token: string) {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return { status: response.status, data };
}