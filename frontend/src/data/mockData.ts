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
export const CONFLICTS: ConflictItem[] = [
  {
    id: 'CONF-101',
    name: 'Rahul Sharma',
    field: 'Email',
    sourceA: {
      name: 'Campus SIS Directory',
      value: 'r.sharma@techcorp.io',
      trust: 88,
      recordId: 'SIS-4402',
      lastUpdated: '2 hours ago'
    },
    sourceB: {
      name: 'Alumni Network Database',
      value: 'rahul.sharma@alumni.org',
      trust: 75,
      recordId: 'ALUM-9921',
      lastUpdated: '14 days ago'
    },
    confidence: 91,
    priority: 'High',
    status: 'Pending',
    reasoning: 'Verified active phone match (+91 98440 12091). Email difference stems from recent corporate alias update vs older alumni registration.',
    recommendation: 'Source A'
  },
  {
    id: 'CONF-102',
    name: 'Priya Singh',
    field: 'Phone',
    sourceA: {
      name: 'Corporate Central ERP',
      value: '+91 98765 43210',
      trust: 95,
      recordId: 'ERP-1024',
      lastUpdated: 'Yesterday'
    },
    sourceB: {
      name: 'Campus Directory v2',
      value: '+91 98111 22334',
      trust: 88,
      recordId: 'SIS-7719',
      lastUpdated: '8 months ago'
    },
    confidence: 94,
    priority: 'High',
    status: 'Pending',
    reasoning: 'Tax Identifier and National ID match with 100% agreement. ERP source has recent 2FA phone confirmation.',
    recommendation: 'Source A'
  },
  {
    id: 'CONF-103',
    name: 'Amit Kumar',
    field: 'Address',
    sourceA: {
      name: 'Corporate Central ERP',
      value: 'Tower 4, Sector 62, Noida, UP - 201309',
      trust: 95,
      recordId: 'ERP-8832',
      lastUpdated: '3 weeks ago'
    },
    sourceB: {
      name: 'Alumni Portal',
      value: 'Flat 12B, Indirapuram, Ghaziabad, UP - 201014',
      trust: 75,
      recordId: 'ALUM-3310',
      lastUpdated: '2 years ago'
    },
    confidence: 82,
    priority: 'Medium',
    status: 'Pending',
    reasoning: 'Both addresses are within 6km. Alumni record appears outdated based on recent utility proof in ERP.',
    recommendation: 'Source A'
  },
  {
    id: 'CONF-104',
    name: 'Neha Verma',
    field: 'Name',
    sourceA: {
      name: 'Official ERP Record',
      value: 'Neha Verma',
      trust: 95,
      recordId: 'ERP-5501',
      lastUpdated: '1 month ago'
    },
    sourceB: {
      name: 'Professional Registry',
      value: 'Neha V. Sharma',
      trust: 72,
      recordId: 'REG-2290',
      lastUpdated: '2 months ago'
    },
    confidence: 79,
    priority: 'Medium',
    status: 'Pending',
    reasoning: 'Probable maiden vs married name variant. Employee ID matches, but human confirmation recommended.',
    recommendation: 'Merge'
  },
  {
    id: 'CONF-105',
    name: 'Arjun Mehta',
    field: 'Department',
    sourceA: {
      name: 'Corporate Central ERP',
      value: 'Finance Operations',
      trust: 95,
      recordId: 'ERP-6602',
      lastUpdated: 'Today'
    },
    sourceB: {
      name: 'Campus SIS Directory',
      value: 'Accounting & Audit',
      trust: 88,
      recordId: 'SIS-3109',
      lastUpdated: '3 months ago'
    },
    confidence: 88,
    priority: 'Low',
    status: 'Pending',
    reasoning: 'Semantic synonym discrepancy. Finance Operations is the parent organizational unit.',
    recommendation: 'Source A'
  }
];

export const RUN_HISTORY: RunRecord[] = [
  { id: '#RUN-1048', timestamp: 'Today, 18:30', recordCount: 142890, conflictsFound: 3770, autoResolved: 3410, pendingReview: 360, status: 'Completed' },
  { id: '#RUN-1047', timestamp: 'Yesterday, 14:15', recordCount: 98400, conflictsFound: 2150, autoResolved: 2010, pendingReview: 140, status: 'Completed' },
  { id: '#RUN-1046', timestamp: '05 Sep 2026', recordCount: 61200, conflictsFound: 1890, autoResolved: 1540, pendingReview: 350, status: 'Review Required' },
  { id: '#RUN-1045', timestamp: '02 Sep 2026', recordCount: 45000, conflictsFound: 820, autoResolved: 790, pendingReview: 30, status: 'Completed' },
];

export const SOURCE_RELIABILITY: SourceReliability[] = [
  {
    id: 'SRC-01',
    name: 'Corporate Central ERP (SAP)',
    trust: 95,
    recordCount: 84200,
    format: 'CSV',
    status: 'Connected',
    lastSync: '5 mins ago',
    description: 'Primary verified institutional directory with multi-factor authentication'
  },
  {
    id: 'SRC-02',
    name: 'Campus SIS Directory',
    trust: 88,
    recordCount: 38400,
    format: 'CSV',
    status: 'Connected',
    lastSync: '20 mins ago',
    description: 'Student & faculty academic records, updated every semester'
  },
  {
    id: 'SRC-03',
    name: 'Alumni Network Database',
    trust: 75,
    recordCount: 20290,
    format: 'CSV',
    status: 'Connected',
    lastSync: '2 days ago',
    description: 'Self-reported alumni directory portal with periodic verification'
  },
];

export const PIPELINE_STAGES: PipelineStage[] = [
  { stage: '01', label: 'INGEST', count: '142,890 records', status: 'DONE' },
  { stage: '02', label: 'FUZZY MATCH', count: '139,120 matches', status: 'DONE' },
  { stage: '03', label: 'CONFLICT TRIAGE', count: '360 pending review', status: 'REVIEW' },
  { stage: '04', label: 'GOLDEN MASTER', count: '118,420 sealed', status: 'ACTIVE' },
];

export const AUDIT_RECORDS: AuditRecord[] = [
  {
    id: 'AUD-301',
    timestamp: 'Today, 18:42:10',
    entityName: 'Rahul Sharma',
    masterId: 'MST-1004',
    field: 'Email',
    previousValue: 'rahul.sharma@alumni.org (Alumni DB)',
    resolvedValue: 'r.sharma@techcorp.io',
    selectedSource: 'Campus SIS Directory',
    operator: 'admin@reconcile.ai',
    actionType: 'MANUAL_APPROVAL',
    rationale: 'Operator accepted AI suggestion favoring recent active campus directory record'
  },
  {
    id: 'AUD-302',
    timestamp: 'Today, 18:31:05',
    entityName: 'Priya Singh',
    masterId: 'MST-1002',
    field: 'Phone',
    previousValue: '+91 98111 22334 (Campus SIS)',
    resolvedValue: '+91 98765 43210',
    selectedSource: 'Corporate Central ERP',
    operator: 'Auto-Resolution Engine',
    actionType: 'AUTO_RESOLVE',
    rationale: '95% ERP trust weight exceeded 90% threshold; verified OTP timestamp confirmed recency'
  },
  {
    id: 'AUD-303',
    timestamp: 'Today, 17:15:22',
    entityName: 'Vikram Malhotra',
    masterId: 'MST-1008',
    field: 'Department',
    previousValue: 'IT Helpdesk',
    resolvedValue: 'Infrastructure & Cloud Ops',
    selectedSource: 'Corporate Central ERP',
    operator: 'operator_1@reconcile.ai',
    actionType: 'OVERRIDE',
    rationale: 'Manual override based on official promotion document review'
  },
  {
    id: 'AUD-304',
    timestamp: 'Yesterday, 14:22:18',
    entityName: 'Sneha Patel',
    masterId: 'MST-1007',
    field: 'Address',
    previousValue: 'Indiranagar, Bangalore',
    resolvedValue: 'Whitefield, Bangalore',
    selectedSource: 'Alumni Network Database',
    operator: 'Auto-Resolution Engine',
    actionType: 'AUTO_RESOLVE',
    rationale: 'Alumni record timestamp (Aug 2026) newer than ERP record (Jan 2024)'
  }
];

export const GOLDEN_RECORDS: GoldenRecord[] = [
  {
    id: 'MST-1001',
    name: 'Laksh Agarwal',
    email: 'laksh@reconcile.ai',
    phone: '+91 99887 76655',
    department: 'Engineering Systems',
    sourcesCount: 3,
    confidence: 98.5,
    lastUpdated: '10 mins ago',
    status: 'Verified',
    provenance: {
      nameSource: 'Corporate ERP (95%)',
      emailSource: 'Campus SIS (88%)',
      phoneSource: 'Corporate ERP (95%)',
      departmentSource: 'Corporate ERP (95%)'
    }
  },
  {
    id: 'MST-1002',
    name: 'Priya Singh',
    email: 'priya.singh@enterprise.com',
    phone: '+91 98765 43210',
    department: 'Architecture & Design',
    sourcesCount: 2,
    confidence: 94.2,
    lastUpdated: '1 hour ago',
    status: 'Verified',
    provenance: {
      nameSource: 'Corporate ERP (95%)',
      emailSource: 'Corporate ERP (95%)',
      phoneSource: 'Corporate ERP (95%)',
      departmentSource: 'Campus SIS (88%)'
    }
  },
  {
    id: 'MST-1003',
    name: 'Amit Kumar',
    email: 'amit.k@campus.edu',
    phone: '+91 91234 56789',
    department: 'Data Science & AI',
    sourcesCount: 2,
    confidence: 82.0,
    lastUpdated: 'Yesterday',
    status: 'Pending Review',
    provenance: {
      nameSource: 'Corporate ERP (95%)',
      emailSource: 'Campus SIS (88%)',
      phoneSource: 'Alumni Portal (75%)',
      departmentSource: 'Campus SIS (88%)'
    }
  },
  {
    id: 'MST-1004',
    name: 'Rahul Sharma',
    email: 'r.sharma@techcorp.io',
    phone: '+91 98440 12091',
    department: 'Computer Science',
    sourcesCount: 3,
    confidence: 91.4,
    lastUpdated: '2 hours ago',
    status: 'Verified',
    provenance: {
      nameSource: 'Corporate ERP (95%)',
      emailSource: 'Campus SIS (88%)',
      phoneSource: 'Corporate ERP (95%)',
      departmentSource: 'Campus SIS (88%)'
    }
  },
  {
    id: 'MST-1005',
    name: 'Neha Verma',
    email: 'neha.v@enterprise.com',
    phone: '+91 87654 32100',
    department: 'People & Culture',
    sourcesCount: 2,
    confidence: 78.5,
    lastUpdated: '5 hours ago',
    status: 'Pending Review',
    provenance: {
      nameSource: 'Corporate ERP (95%)',
      emailSource: 'Corporate ERP (95%)',
      phoneSource: 'Professional Registry (72%)',
      departmentSource: 'Corporate ERP (95%)'
    }
  },
  {
    id: 'MST-1006',
    name: 'Arjun Mehta',
    email: 'arjun.m@alumni.org',
    phone: '+91 95511 22334',
    department: 'Finance Operations',
    sourcesCount: 3,
    confidence: 96.8,
    lastUpdated: '30 mins ago',
    status: 'Verified',
    provenance: {
      nameSource: 'Corporate ERP (95%)',
      emailSource: 'Alumni Portal (75%)',
      phoneSource: 'Corporate ERP (95%)',
      departmentSource: 'Corporate ERP (95%)'
    }
  }
];

export const METRIC_CARDS = [
  {
    icon: 'storage',
    label: 'Total Ingested',
    value: '142,890',
    badge: '3 Sources',
    footerLeft: 'ERP • SIS • Alumni',
    footerRight: 'Sync Nominal',
    progress: 100
  },
  {
    icon: 'compare_arrows',
    label: 'Entity Matches',
    value: '139,120',
    badge: '97.4% Match Rate',
    footerLeft: 'Fuzzy & Exact Signals',
    footerRight: '3,770 Collisions',
    progress: 97.4
  },
  {
    icon: 'rule',
    label: 'Actionable Conflicts',
    value: '360',
    badge: 'Urgent',
    footerLeft: '90.4% Auto-Resolved',
    footerRight: 'Needs Review',
    progress: 9.6
  },
  {
    icon: 'verified',
    label: 'Golden Master Entities',
    value: '118,420',
    badge: 'Consensus Sealed',
    footerLeft: 'Non-destructive',
    footerRight: 'Audit Ready',
    progress: 94.8
  }
];
