// ==========================================
// TYPES
// ==========================================
export interface ConflictItem {
  id: string;
  name: string;
  field: 'Email' | 'Phone' | 'Name' | 'Address';
  sourceA: { name: string; value: string; trust: number; recordId: string; extra: string };
  sourceB: { name: string; value: string; trust: number; recordId: string; extra: string };
  confidence: number;
  priority: 'High' | 'Medium' | 'Low';
  type: string;
  notes: string;
}

export interface RunRecord {
  id: string;
  timestamp: string;
  recordCount: number;
  confidence: number;
  status: 'Completed' | 'Review Required' | 'Processing';
}

export interface SourceReliability {
  name: string;
  trust: number;
  records: string;
  tag: string;
  status: 'Active' | 'Syncing' | 'Dormant';
  lastSync: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  time: string;
  icon: string;
}

export interface AuditNode {
  id: number;
  type: 'MERGE_APPROVED' | 'MANUAL_OVERRIDE' | 'INITIAL_INGESTION';
  timestamp: string;
  operator: string;
  summary: string;
  prevHash: string;
  currentHash: string;
  masterProfile?: string;
}

export interface GoldenRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  sources: number;
  confidence: number;
  lastUpdated: string;
  status: 'Verified' | 'Pending Review' | 'Needs Merge';
}

export interface TeamMember {
  email: string;
  role: 'Super Admin' | 'Triage Reviewer' | 'Read-Only Auditor';
  lastActive: string;
  avatar: string;
}

export interface PipelineStage {
  stage: string;
  label: string;
  count: string;
  status: 'DONE' | 'REVIEW' | 'ACTIVE';
}

// ==========================================
// MOCK DATA
// ==========================================
export const CONFLICTS: ConflictItem[] = [
  {
    id: 'CONF-101', name: 'Rahul Sharma', field: 'Email',
    sourceA: { name: 'Alumni Network Database', value: 'rahul.sharma@alumni.org', trust: 75, recordId: 'REC-ERP-9921', extra: 'Last Active: 14 days ago | IP: 103.21.54.1' },
    sourceB: { name: 'Campus Enterprise Directory', value: 'r.sharma@techcorp.io', trust: 88, recordId: 'REC-CAMPUS-4402', extra: 'Last Active: 2 hours ago | Department: Computer Science & Systems' },
    confidence: 89, priority: 'High', type: 'EMAIL MISMATCH & IDENTITY AMBIGUITY',
    notes: 'Deterministic phone match (+91 98440 12091) confirms single biological entity. Discrepancy originating from recent corporate domain alias change.'
  },
  {
    id: 'CONF-102', name: 'Priya Singh', field: 'Phone',
    sourceA: { name: 'Corporate Central ERP', value: '+91 98765 43210', trust: 95, recordId: 'REC-ERP-1024', extra: 'Verified: OTP Auth Dec 2024 | Designation: Principal Architect' },
    sourceB: { name: 'Campus Directory v2', value: '+91 98111 22334', trust: 88, recordId: 'REC-CAMPUS-7719', extra: 'Verified: SMS Notification 2023 | Status: Visiting Faculty' },
    confidence: 94, priority: 'High', type: 'PHONE NUMBER COLLISION & DUAL ASSIGNMENT',
    notes: 'PAN / Tax Identifier matches with 100% cryptographic checksum. Suggesting primary consolidation to ERP verified line.'
  },
  {
    id: 'CONF-103', name: 'Amit Kumar', field: 'Address',
    sourceA: { name: 'Corporate Central ERP', value: 'Tower 4, Sector 62, Noida, UP - 201309', trust: 95, recordId: 'REC-ERP-8832', extra: 'Utility Bill Proof: June 2024 | Status: Permanent Resident' },
    sourceB: { name: 'Alumni Association Portal', value: 'Flat 12B, Indirapuram, Ghaziabad, UP - 201014', trust: 75, recordId: 'REC-ALUM-3310', extra: 'Last Self-Updated: Oct 2021 | Source Type: Web Form' },
    confidence: 81, priority: 'Medium', type: 'PHYSICAL RESIDENCE PARSER DRIFT',
    notes: 'Postal code and geographic radius span less than 7km. High likelihood of historical address lag in Alumni Portal.'
  },
  {
    id: 'CONF-104', name: 'Neha Verma', field: 'Name',
    sourceA: { name: 'ERP System', value: 'Neha Verma', trust: 95, recordId: 'REC-ERP-5501', extra: 'Official Record | Last Verified: Aug 2026' },
    sourceB: { name: 'LinkedIn Sync', value: 'Neha V. Sharma', trust: 70, recordId: 'REC-LI-2290', extra: 'Profile Scrape: Jul 2026 | Confidence: Low' },
    confidence: 78, priority: 'Medium', type: 'NAME VARIANCE & ALIAS DETECTION',
    notes: 'Possible maiden vs married name scenario. Requires manual human verification before merge.'
  },
];

export const RUN_HISTORY: RunRecord[] = [
  { id: '#1048', timestamp: 'Today, 18:30', recordCount: 42890, confidence: 94.2, status: 'Completed' },
  { id: '#1047', timestamp: 'Yesterday, 14:15', recordCount: 38500, confidence: 92.8, status: 'Completed' },
  { id: '#1046', timestamp: '05 Sep 2026', recordCount: 61200, confidence: 88.5, status: 'Review Required' },
  { id: '#1045', timestamp: '02 Sep 2026', recordCount: 29000, confidence: 96.1, status: 'Completed' },
];

export const SOURCE_RELIABILITY: SourceReliability[] = [
  { name: 'Enterprise ERP (SAP)', trust: 95, records: '84,200', tag: 'Primary Golden Source', status: 'Active', lastSync: '2 minutes ago' },
  { name: 'Campus Placement System', trust: 88, records: '38,400', tag: 'High Freshness', status: 'Active', lastSync: '15 minutes ago' },
  { name: 'Alumni Directory Database', trust: 75, records: '20,290', tag: 'Periodic Sync', status: 'Dormant', lastSync: '3 days ago' },
];

export const ACTIVITY_LOG: ActivityLog[] = [
  { id: '1', action: 'Auto-resolved 312 records using ERP Golden Rule', time: '12m ago', icon: 'auto_fix_high' },
  { id: '2', action: 'Admin approved conflict resolution for Amit Patel', time: '44m ago', icon: 'check_circle' },
  { id: '3', action: 'Run #1048 completed ingestion (142,890 records)', time: '2h ago', icon: 'cloud_done' },
  { id: '4', action: 'Flagged 4 ambiguous phone conflicts for human verification', time: '3h ago', icon: 'flag' },
];

export const PIPELINE_STAGES: PipelineStage[] = [
  { stage: '01', label: 'INGEST', count: '142,890', status: 'DONE' },
  { stage: '02', label: 'MATCH', count: '139,120', status: 'DONE' },
  { stage: '03', label: 'CONFLICT', count: '3,770', status: 'REVIEW' },
  { stage: '04', label: 'RESOLVE', count: '102,880', status: 'ACTIVE' },
];

export const AUDIT_NODES: AuditNode[] = [
  {
    id: 3, type: 'MERGE_APPROVED', timestamp: 'Sep 07, 2026 · 21:55:42 UTC', operator: 'admin@reconcile.ai',
    summary: 'Approve merge between Banking System (SRC_A) & Hostel ERP (SRC_B)',
    prevHash: '4b1c88d2...a90f', currentHash: '8a7f92bc...e19d', masterProfile: 'Rahul Sharma (MST-1004)'
  },
  {
    id: 2, type: 'MANUAL_OVERRIDE', timestamp: 'Sep 07, 2026 · 21:20:10 UTC', operator: 'operator_2',
    summary: 'Updated golden_phone_number to +91 98765 43210',
    prevHash: '0000...0000', currentHash: '4b1c88d2...a90f'
  },
  {
    id: 1, type: 'INITIAL_INGESTION', timestamp: 'Sep 07, 2026 · 21:00:00 UTC', operator: 'SYSTEM GENESIS',
    summary: 'Initial batch ingestion of 142,890 raw entity records from 3 enterprise sources',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000', currentHash: '0000...0000'
  },
];

export const GOLDEN_RECORDS: GoldenRecord[] = [
  { id: 'MST-1001', name: 'Laksh Agarwal', email: 'laksh@reconcile.ai', phone: '+91 99887 76655', department: 'Engineering', sources: 3, confidence: 98.2, lastUpdated: 'Just now', status: 'Verified' },
  { id: 'MST-1002', name: 'Priya Singh', email: 'priya.singh@enterprise.com', phone: '+91 98765 43210', department: 'Architecture', sources: 2, confidence: 94.1, lastUpdated: '2 hours ago', status: 'Verified' },
  { id: 'MST-1003', name: 'Amit Kumar', email: 'amit.k@campus.edu', phone: '+91 91234 56789', department: 'Data Science', sources: 2, confidence: 81.0, lastUpdated: '1 day ago', status: 'Pending Review' },
  { id: 'MST-1004', name: 'Rahul Sharma', email: 'r.sharma@techcorp.io', phone: '+91 98440 12091', department: 'Computer Science', sources: 3, confidence: 89.4, lastUpdated: '3 hours ago', status: 'Needs Merge' },
  { id: 'MST-1005', name: 'Neha Verma', email: 'neha.v@enterprise.com', phone: '+91 87654 32100', department: 'HR Operations', sources: 2, confidence: 78.5, lastUpdated: '5 hours ago', status: 'Pending Review' },
  { id: 'MST-1006', name: 'Arjun Mehta', email: 'arjun.m@alumni.org', phone: '+91 95511 22334', department: 'Finance', sources: 3, confidence: 96.7, lastUpdated: '30 minutes ago', status: 'Verified' },
];

export const TEAM_MEMBERS: TeamMember[] = [
  { email: 'laksh@reconcile.ai', role: 'Super Admin', lastActive: 'Just Now', avatar: 'LA' },
  { email: 'reviewer_1@enterprise.com', role: 'Triage Reviewer', lastActive: '2 hours ago', avatar: 'R1' },
  { email: 'auditor@enterprise.com', role: 'Read-Only Auditor', lastActive: '1 day ago', avatar: 'AU' },
];

export const METRIC_CARDS = [
  { icon: 'verified_user', label: 'System Health', value: '98.4%', badge: '+0.4%', footerLeft: 'Threshold: 85%', footerRight: 'High Reliability', progress: 98.4 },
  { icon: 'dataset', label: 'Ingested Records', value: '142,890', badge: 'LIVE BATCH', footerLeft: 'Across 3 Sources', footerRight: 'ERP • Campus • Alumni', progress: undefined },
  { icon: 'fingerprint', label: 'Master Identities', value: '118,420', badge: 'CONSENSUS', footerLeft: 'Single ID Consensus', footerRight: '92.8% Resolution', progress: 92.8 },
];
