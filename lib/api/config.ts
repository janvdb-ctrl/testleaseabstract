/**
 * API base URL for Flow 2 endpoints.
 * When unset, the client uses same-origin `/api/...` (Next route handlers + dev store).
 * Set `NEXT_PUBLIC_API_BASE_URL` to your backend origin (no trailing slash), e.g. `https://api.example.com`.
 */
export function getApiBaseUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw || raw.trim() === "") return undefined;
  return raw.replace(/\/$/, "");
}

/**
 * Full URL for a spec path such as `/properties/:id/tenants` (leading slash required).
 */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  if (!base) {
    return `/api${path}`;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
