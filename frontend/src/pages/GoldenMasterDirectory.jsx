import React, { useState } from 'react';
import { GoldenMasterDirectory } from '../components/GoldenMasterDirectory';
import { initialGoldenRecords } from '../types';

/**
 * GoldenMasterDirectory page
 * Canonical entity registry and golden master record inspection
 */
export default function GoldenMasterDirectoryPage(props) {
  const [goldenRecords] = useState(initialGoldenRecords);

  return (
    <GoldenMasterDirectory
      darkMode={props.darkMode ?? true}
      goldenRecords={props.goldenRecords ?? goldenRecords}
      onTriggerToast={props.onTriggerToast ?? ((msg) => console.log('Toast:', msg))}
    />
  );
}

export { GoldenMasterDirectory };
