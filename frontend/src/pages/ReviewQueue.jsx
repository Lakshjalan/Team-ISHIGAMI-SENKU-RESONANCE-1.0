import React, { useState } from 'react';
import { ConflictReviewQueue } from '../components/ConflictReviewQueue';
import { initialConflicts } from '../types';

/**
 * ReviewQueue page
 * Conflict triage interface for ambiguous record pairs
 */
export default function ReviewQueuePage(props) {
  const [conflicts, setConflicts] = useState(initialConflicts);

  const handleResolve = (conflictId, chosenValue, sourceName, rememberRule) => {
    setConflicts((prev) => prev.filter((c) => c.id !== conflictId));
    if (props.onResolveConflict) {
      props.onResolveConflict(conflictId, chosenValue, sourceName, rememberRule);
    }
  };

  const handleBatchResolve = (ids) => {
    setConflicts((prev) => prev.filter((c) => !ids.includes(c.id)));
    if (props.onBatchResolve) {
      props.onBatchResolve(ids);
    }
  };

  return (
    <ConflictReviewQueue
      darkMode={props.darkMode ?? true}
      conflicts={props.conflicts ?? conflicts}
      onResolveConflict={props.onResolveConflict ?? handleResolve}
      onBatchResolve={props.onBatchResolve ?? handleBatchResolve}
      onTriggerToast={props.onTriggerToast ?? ((msg) => console.log('Toast:', msg))}
    />
  );
}

export { ConflictReviewQueue as ReviewQueue };
