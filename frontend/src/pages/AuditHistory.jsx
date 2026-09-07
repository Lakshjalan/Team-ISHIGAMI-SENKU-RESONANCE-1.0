import React, { useState } from 'react';
import { CryptographicAuditLedger } from '../components/CryptographicAuditLedger';
import { initialRuns, initialAuditLogs } from '../types';

/**
 * AuditHistory page
 * Audit ledger & time-travel record history view
 */
export default function AuditHistoryPage(props) {
  const [runs] = useState(initialRuns);
  const [auditLogs] = useState(initialAuditLogs);

  return (
    <CryptographicAuditLedger
      darkMode={props.darkMode ?? true}
      runs={props.runs ?? runs}
      auditLogs={props.auditLogs ?? auditLogs}
      onTriggerToast={props.onTriggerToast ?? ((msg) => console.log('Toast:', msg))}
    />
  );
}

export { CryptographicAuditLedger as AuditHistory };
