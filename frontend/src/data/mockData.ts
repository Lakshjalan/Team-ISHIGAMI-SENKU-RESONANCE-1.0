// ==========================================
// TYPES
// ==========================================
export interface ConflictItem {
  id: string;
  name: string;
  field: 'Email' | 'Phone' | 'Name' | 'Address' | 'Department';
  sourceA: {
    name: string;
    value: string;
    trust: number;
    recordId: string;
    lastUpdated: string;
  };
  sourceB: {
    name: string;
    value: string;
    trust: number;
    recordId: string;
    lastUpdated: string;
  };
  confidence: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Resolved' | 'Ignored';
  reasoning: string;
  recommendation: 'Source A' | 'Source B' | 'Merge';
  assignedTo?: string;
  assignedAt?: string;
}

export interface RunRecord {
  id: string;
  timestamp: string;
  recordCount: number;
  conflictsFound: number;
  autoResolved: number;
  pendingReview: number;
  status: 'Completed' | 'Review Required' | 'Processing';
}

export interface SourceReliability {
  id: string;
  name: string;
  trust: number;
  recordCount: number;
  format: 'CSV' | 'Database' | 'API';
  status: 'Connected' | 'Syncing' | 'Inactive';
  lastSync: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  time: string;
  icon: string;
  operator: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  entityName: string;
  masterId: string;
  field: string;
  previousValue: string;
  resolvedValue: string;
  selectedSource: string;
  operator: string;
  actionType: 'AUTO_RESOLVE' | 'MANUAL_APPROVAL' | 'OVERRIDE' | 'SPLIT';
  rationale: string;
}

export interface GoldenRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  sourcesCount: number;
  confidence: number;
  lastUpdated: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
  provenance: {
    nameSource: string;
    emailSource: string;
    phoneSource: string;
    departmentSource: string;
  };
}

export interface PipelineStage {
  stage: string;
  label: string;
  count: string;
  status: 'DONE' | 'REVIEW' | 'ACTIVE';
}

// ==========================================
// MOCK DATA (Clean, Evidence-Based)
// ==========================================
export const CONFLICTS: any[] = [];

export const RUN_HISTORY: any[] = [];

export const SOURCE_RELIABILITY: any[] = [];

export const PIPELINE_STAGES: PipelineStage[] = [
  { stage: '', label: 'INGEST', count: '0', status: 'DONE' },
  { stage: '', label: 'FUZZY MATCH', count: '0', status: 'DONE' },
  { stage: '', label: 'CONFLICT TRIAGE', count: '0', status: 'REVIEW' },
  { stage: '', label: 'GOLDEN MASTER', count: '0', status: 'ACTIVE' },
];

export const AUDIT_RECORDS: any[] = [];

export const GOLDEN_RECORDS: any[] = [];

export const METRIC_CARDS = [
  {
    icon: 'storage',
    label: 'Total Ingested',
    value: '0',
    badge: '0 Sources',
    footerLeft: 'Awaiting Sync',
    footerRight: 'Pending',
    progress: 0
  },
  {
    icon: 'compare_arrows',
    label: 'Entity Matches',
    value: '0',
    badge: '0.0% Match Rate',
    footerLeft: 'Awaiting Ingestion',
    footerRight: '0 Collisions',
    progress: 0
  },
  {
    icon: 'rule',
    label: 'Actionable Conflicts',
    value: '0',
    badge: 'Empty',
    footerLeft: '0.0% Auto-Resolved',
    footerRight: 'All Clear',
    progress: 0
  },
  {
    icon: 'verified',
    label: 'Golden Master Entities',
    value: '0',
    badge: 'None',
    footerLeft: 'Awaiting Run',
    footerRight: 'Pending',
    progress: 0
  }
];
