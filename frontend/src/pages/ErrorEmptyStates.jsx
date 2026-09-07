import React from 'react';
import { ErrorEmptyStates } from '../components/ErrorEmptyStates';

/**
 * ErrorEmptyStates page
 * Resilient 404, 500 error boundaries, and empty state diagnostics
 */
export default function ErrorEmptyStatesPage(props) {
  return (
    <ErrorEmptyStates
      darkMode={props.darkMode ?? true}
      onNavigate={props.onNavigate ?? ((screen) => console.log('Navigate to', screen))}
      onTriggerToast={props.onTriggerToast ?? ((msg) => console.log('Toast:', msg))}
    />
  );
}

export { ErrorEmptyStates };
