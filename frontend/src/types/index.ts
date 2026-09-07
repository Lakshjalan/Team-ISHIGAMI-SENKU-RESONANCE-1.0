// ============================================================================
// SHARED TYPES & DATA MODELS FOR RECONCILE.AI
// ============================================================================

export interface SourceCandidate {
  name: string;
  value: string;
  trust: number;
  timestamp: string;
  sourceId: string;
}

export interface ConflictItem {
  id: string;
  name: string;
  field: 'Email' | 'Phone' | 'Name' | 'Address';
  sourceA: SourceCandidate;
  sourceB: SourceCandidate;
  confidence: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  matchReason: string;
}

export interface GoldenRecord {
  id: string;
  masterId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  confidence: number;
  sourcesMerged: string[];
  lastUpdated: string;
  blockHash: string;
}

export interface RunRecord {
  id: string;
  timestamp: string;
  recordCount: number;
  confidence: number;
  status: 'Completed' | 'Review Required' | 'Processing';
  hash: string;
  operator: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  operator: string;
  time: string;
  blockHash: string;
  type: 'auto' | 'human' | 'system';
}

export interface SourceRegistry {
  id: string;
  name: string;
  tag: string;
  trust: number;
  records: string;
  protocol: string;
  status: 'Active' | 'Syncing' | 'Paused';
  syncCycle: string;
  lastUpdated: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Triage Reviewer' | 'Auditor' | 'Data Engineer';
  lastActive: string;
  avatar: string;
}

export interface APIKeyConfig {
  keyId: string;
  name: string;
  maskedKey: string;
  createdAt: string;
  lastUsed: string;
}

export type AppScreen =
  | 'command'
  | 'ingestion'
  | 'triage'
  | 'directory'
  | 'audit'
  | 'auth'
  | 'settings'
  | 'errors';
