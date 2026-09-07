const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  checkHealth: () => request('/health'),
  fetchSources: () => request('/sources'),
  uploadRecords: (source_name, reliability_score, records) =>
    request('/upload', {
      method: 'POST',
      body: JSON.stringify({ source_name, reliability_score, records })
    }),
  fetchReviewQueue: () => request('/review/queue'),
  resolveConflict: (conflict_id, decision, resolved_by = 'reviewer', golden_override) =>
    request('/review/resolve', {
      method: 'POST',
      body: JSON.stringify({ conflict_id, decision, resolved_by, golden_override })
    }),
  fetchMasterStudents: () => request('/entities/master'),
  fetchAuditTrail: (masterId) => request(`/entities/${masterId}/audit`)
};
