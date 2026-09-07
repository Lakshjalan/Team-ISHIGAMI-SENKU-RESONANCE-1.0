import React, { useState } from 'react';
import { SystemSettings } from '../components/SystemSettings';
import { initialSources } from '../types';

/**
 * SystemSettings page
 * Governance, match threshold sliders, webhook orchestration, and team RBAC
 */
export default function SystemSettingsPage(props) {
  const [sources] = useState(initialSources);

  return (
    <SystemSettings
      darkMode={props.darkMode ?? true}
      sources={props.sources ?? sources}
      onTriggerToast={props.onTriggerToast ?? ((msg) => console.log('Toast:', msg))}
    />
  );
}

export { SystemSettings };
