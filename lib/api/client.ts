import { apiUrl } from "@/lib/api/config";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = apiUrl(path);
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    let errBody: unknown = null;
    try {
      errBody = text ? (JSON.parse(text) as unknown) : null;
    } catch {
      errBody = text;
    }
    throw new ApiError(res.statusText || "Request failed", res.status, errBody);
  }

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
