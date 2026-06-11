const API_BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    const message =
      data.message ||
      (res.status === 503
        ? 'Database unavailable — start the backend and check MongoDB'
        : res.status >= 500
          ? 'Server error — is the Saas backend running on port 3000?'
          : 'Request failed');
    throw new ApiError(message, res.status);
  }

  return data;
}
