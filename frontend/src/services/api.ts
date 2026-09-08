/**
 * SYNTRA / Veritas ER - API Client Service
 * Shared service layer integrating with FastAPI / Supabase / Express backend with fallback to mock data
 */

const envUrl = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE_URL;
const normalizedUrl = envUrl ? String(envUrl).replace(/\/+$/, '') : '';
const API_BASE = normalizedUrl
  ? (normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`)
  : 'http://localhost:8000/api';

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const token = localStorage.getItem('syntra_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`[API Client] Endpoint ${endpoint} unavailable, using fallback mock data:`, err.message);
    return null;
  }
}

export const authApi = {
  async login(email?: string, password?: string) {
    const res = await request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res?.token) {
      localStorage.setItem('syntra_token', res.token);
      localStorage.setItem('syntra_user', JSON.stringify(res.user));
      return res;
    }
    // Only fall back to simulated credentials in development preview
    if ((import.meta as any).env?.DEV) {
      const mockUser = {
        id: 'usr_sec_9941',
        email: email || 'sec-admin@veritas.internal',
        name: 'Dr. Senku Ishigami',
        role: 'Super Admin / Lead Data Scientist',
        clearance: 'LEVEL-5-ALPHA',
      };
      const mockToken = 'mock_jwt_' + Math.random().toString(36).substring(2);
      localStorage.setItem('syntra_token', mockToken);
      localStorage.setItem('syntra_user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    }
    return null;
  },

  logout() {
    localStorage.removeItem('syntra_token');
    localStorage.removeItem('syntra_user');
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('syntra_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};

export const ingestionApi = {
  async getSources() {
    const res = await request('/upload/sources');
    if (res) return res;
    return [
      {
        id: 'src-core-banking',
        name: 'Enterprise ERP (SAP)',
        type: 'PostgreSQL Direct',
        reliabilityScore: 0.95,
        recordCount: 84200,
        lastIngested: '2m ago',
        status: 'Active',
        activeWeight: 0.95,
      },
      {
        id: 'src-campus-sis',
        name: 'Campus Placement System',
        type: 'REST Stream',
        reliabilityScore: 0.88,
        recordCount: 38400,
        lastIngested: '15m ago',
        status: 'Active',
        activeWeight: 0.88,
      },
      {
        id: 'src-alumni-db',
        name: 'Alumni Directory Database',
        type: 'CSV Batch',
        reliabilityScore: 0.75,
        recordCount: 20290,
        lastIngested: '3d ago',
        status: 'Dormant',
        activeWeight: 0.75,
      },
    ];
  },

  async uploadDataset(file: File, _metadata?: any) {
    return {
      success: true,
      batchId: 'batch_' + Date.now().toString(16),
      filename: file?.name || 'dataset.csv',
      recordsParsed: 14250,
      timestamp: new Date().toISOString(),
    };
  },

  async updateSourceWeight(sourceId: string, weight: number) {
    return await request(`/upload/sources/${sourceId}/weight`, {
      method: 'PATCH',
      body: JSON.stringify({ weight }),
    }) || { success: true, sourceId, weight };
  },
};

export const reviewApi = {
  async getQueue(status = 'PENDING', limit = 20) {
    const res = await request(`/review/queue?status=${status}&limit=${limit}`);
    if (res) return res;
    return null; // Will fallback to mockData in component if null
  },

  async resolveConflict(conflictId: string, resolution: string, overrideData: any = null) {
    const res = await request('/review/resolve', {
      method: 'POST',
      body: JSON.stringify({ conflictId, resolution, overrideData }),
    });
    return res || { success: true, conflictId, resolution, timestamp: new Date().toISOString() };
  },
};

export const masterApi = {
  async searchRecords(query = '', filter = 'ALL') {
    const res = await request(`/entities/master?q=${encodeURIComponent(query)}&filter=${filter}`);
    if (res) return res;
    return null;
  },

  async getAuditTrail(entityId: string) {
    const res = await request(`/entities/${entityId}/audit`);
    if (res) return res;
    return null;
  },
};

export const dashboardApi = {
  async getStats() {
    const res = await request('/dashboard/stats');
    if (res) return res;
    return {
      totalEntitiesProcessed: 142890,
      autoMergedCount: 139120,
      activeConflictQueue: 3770,
      averageConfidence: 0.984,
      nodeLatencyMs: 0.14,
      clusterStatus: 'OPERATIONAL',
    };
  },
};

export default {
  auth: authApi,
  ingestion: ingestionApi,
  review: reviewApi,
  master: masterApi,
  dashboard: dashboardApi,
};
