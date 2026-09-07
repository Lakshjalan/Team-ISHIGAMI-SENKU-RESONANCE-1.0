import React, { useState } from 'react';
import { CommandCenter } from '../components/CommandCenter';
import { initialConflicts, initialSources } from '../types';

/**
 * Dashboard page
 * Analytics & system metrics dashboard
 */
export default function DashboardPage(props) {
  const [conflicts] = useState(initialConflicts);
  const [sources] = useState(initialSources);
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);

  const handleTriggerRun = () => {
    setIsSimulatingRun(true);
    setTimeout(() => {
      setIsSimulatingRun(false);
    }, 1500);
  };

  return (
    <CommandCenter
      darkMode={props.darkMode ?? true}
      conflicts={props.conflicts ?? conflicts}
      sources={props.sources ?? sources}
      onNavigate={props.onNavigate ?? ((screen) => console.log('Navigate to', screen))}
      onOpenConflictModal={props.onOpenConflictModal ?? ((item) => console.log('Open conflict', item))}
      onTriggerNewRun={props.onTriggerNewRun ?? handleTriggerRun}
      isSimulatingRun={props.isSimulatingRun ?? isSimulatingRun}
    />
  );
}

export { CommandCenter as Dashboard };
