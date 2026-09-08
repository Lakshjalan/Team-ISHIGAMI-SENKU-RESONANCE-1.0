/**
 * RECONCILE.AI / Veritas ER - API Client Service
 * Shared service layer for Frontend Engineer 1 & 2
 * Integrates with FastAPI / Supabase backend with mock fallback for standalone preview
 */

const API_BASE = import.meta.env?.VITE_API_URL || import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('reconcile_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Fallback for ${endpoint}:`, err.message);
    return null;
  }
}

export const authApi = {
  async login(email, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res?.token) {
      localStorage.setItem('reconcile_token', res.token);
      localStorage.setItem('reconcile_user', JSON.stringify(res.user));
      return res;
    }
    const mockUser = {
      id: 'usr_sec_9941',
      email: email || 'sec-admin@veritas.internal',
      name: 'Dr. Senku Ishigami',
      role: 'Super Admin / Lead Data Scientist',
      clearance: 'LEVEL-5-ALPHA',
    };
    const mockToken = 'mock_jwt_' + Math.random().toString(36).substring(2);
    localStorage.setItem('reconcile_token', mockToken);
    localStorage.setItem('reconcile_user', JSON.stringify(mockUser));
    return { token: mockToken, user: mockUser };
  },

  logout() {
    localStorage.removeItem('reconcile_token');
    localStorage.removeItem('reconcile_user');
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('reconcile_user');
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
        name: 'Core Banking Ledger',
        type: 'PostgreSQL Direct',
        reliabilityScore: 0.98,
        recordCount: 1420500,
        lastIngested: '12m ago',
        status: 'SYNCED',
        activeWeight: 0.95,
      },
      {
        id: 'src-salesforce-crm',
        name: 'Global CRM Feed (Salesforce)',
        type: 'REST Stream',
        reliabilityScore: 0.84,
        recordCount: 890400,
        lastIngested: '2m ago',
        status: 'SYNCING',
        activeWeight: 0.85,
      },
      {
        id: 'src-legacy-csv',
        name: 'Legacy FinCorp Batch Export',
        type: 'CSV Batch',
        reliabilityScore: 0.68,
        recordCount: 412000,
        lastIngested: '1d ago',
        status: 'PENDING',
        activeWeight: 0.70,
      },
    ];
  },

  async uploadDataset(file, _metadata) {
    return {
      success: true,
      batchId: 'batch_' + Date.now().toString(16),
      filename: file?.name || 'dataset.csv',
      recordsParsed: 14250,
      timestamp: new Date().toISOString(),
    };
  },

  async updateSourceWeight(sourceId, weight) {
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
    return [
      {
        id: 'CR-88219',
        confidenceScore: 0.78,
        status: 'PENDING',
        similarityMetrics: {
          jaroWinkler: 0.91,
          cosineEmbedding: 0.84,
          levenshtein: 0.82,
          overallConfidence: 0.78,
        },
        candidateA: {
          source: 'Core Banking Ledger',
          sourceTrust: 0.98,
          timestamp: '2026-03-01 09:12:00',
          recordId: 'REC-9014-A',
          data: {
            legalName: 'Alexander J. Vance',
            taxId: '***-**-4910',
            dob: '1984-11-23',
            residence: '742 Evergreen Terrace, Springfield, OR',
            phone: '+1 (503) 555-0199',
            email: 'avance@vancetech.io',
          },
        },
        candidateB: {
          source: 'Legacy FinCorp Batch Export',
          sourceTrust: 0.68,
          timestamp: '2026-02-15 14:30:11',
          recordId: 'REC-3382-B',
          data: {
            legalName: 'Alex Vance',
            taxId: '***-**-4910',
            dob: '1984-11-23',
            residence: '742 Evergreen Terr., Springfield, OR',
            phone: '+1 (503) 555-0142',
            email: 'alex.vance@gmail.com',
          },
        },
        llmReasoning:
          'Identity correlation score is 0.78. Strong deterministic convergence on SSN/Tax ID and DOB (exact match). Address strings exhibit minor standard postal abbreviation variation ("Terrace" vs "Terr."). Discrepancy observed in secondary phone number and personal email. Core Banking carries higher source trust (0.98) versus Legacy FinCorp (0.68). Recommended action: MERGE under Core Banking golden master profile with secondary phone retained as alias.',
      },
    ];
  },

  async resolveConflict(conflictId, resolution, overrideData = null) {
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
    return [
      {
        id: 'GMR-0982-4112',
        canonicalName: 'Alexander J. Vance',
        entityType: 'INDIVIDUAL',
        confidenceScore: 0.98,
        verificationStatus: 'VERIFIED',
        sourcesMergedCount: 4,
        attributes: {
          ssnHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
          dob: '1984-11-23',
          primaryAddress: '742 Evergreen Terrace, Springfield, OR',
          primaryEmail: 'avance@vancetech.io',
          primaryPhone: '+1 (503) 555-0199',
        },
        linkedSources: ['Core Banking', 'CRM Salesforce', 'FinCorp Batch', 'KYC Portal'],
        lastUpdated: '4m ago',
      },
      {
        id: 'GMR-4412-8819',
        canonicalName: 'Dr. Elena Rostova',
        entityType: 'INDIVIDUAL',
        confidenceScore: 0.94,
        verificationStatus: 'VERIFIED',
        sourcesMergedCount: 3,
        attributes: {
          ssnHash: 'sha256:3b92dc18148a1d65dfc2d4b1fa3d677284addd200126d90697f83b1657ff1fc5',
          dob: '1979-04-12',
          primaryAddress: '1200 Grand Ave, Suite 400, Chicago, IL',
          primaryEmail: 'elena.rostova@quantum-res.org',
          primaryPhone: '+1 (312) 555-8901',
        },
        linkedSources: ['Core Banking', 'Healthcare Reg', 'CRM Salesforce'],
        lastUpdated: '18m ago',
      },
    ];
  },

  async getAuditTrail(entityId) {
    const res = await request(`/entities/${entityId}/audit`);
    if (res) return res;
    return [
      {
        blockIndex: 41209,
        timestamp: '2026-03-01 10:14:22 UTC',
        operator: 'sec-admin@veritas.internal',
        action: 'HUMAN_RESOLVE_MERGE',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        prevHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        details: 'Approved merge of CR-88219 into Golden Master GMR-0982-4112.',
      },
    ];
  },
};

export const dashboardApi = {
  async getStats() {
    const res = await request('/dashboard/stats');
    if (res) return res;
    return {
      totalEntitiesProcessed: 2724900,
      autoMergedCount: 2681400,
      activeConflictQueue: 42,
      activeHoldQueue: 18,
      averageConfidence: 0.964,
      nodeLatencyMs: 24,
      clusterStatus: 'HEALTHY_SYNCED',
    };
  },
};

export const api = {
  checkHealth: () => request('/health'),
  fetchSources: () => ingestionApi.getSources(),
  uploadRecords: (source_name, reliability_score, records) =>
    request('/upload', {
      method: 'POST',
      body: JSON.stringify({ source_name, reliability_score, records })
    }),
  fetchReviewQueue: () => reviewApi.getQueue(),
  resolveConflict: (conflict_id, decision, resolved_by = 'reviewer', golden_override) =>
    reviewApi.resolveConflict(conflict_id, decision, golden_override),
  fetchMasterStudents: () => masterApi.searchRecords(),
  fetchAuditTrail: (masterId) => masterApi.getAuditTrail(masterId)
};

export default {
  auth: authApi,
  ingestion: ingestionApi,
  review: reviewApi,
  master: masterApi,
  dashboard: dashboardApi,
  api,
};
