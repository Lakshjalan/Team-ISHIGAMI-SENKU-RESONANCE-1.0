/**
 * SYNTRA / Veritas ER - API Client Service
 * Shared service layer integrating with FastAPI / Supabase / Express backend with fallback to mock data
 */

export const API_BASE = (function () {
  const envUrl = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE_URL;
  const normalizedUrl = envUrl ? String(envUrl).replace(/\/+$/, '') : '';
  return normalizedUrl
    ? (normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`)
    : '/api';
})();
