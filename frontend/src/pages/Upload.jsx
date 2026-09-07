import React, { useState } from 'react';
import { DataIngestion } from '../components/DataIngestion';
import { initialSources } from '../types';

/**
 * Upload page
 * Multi-source dataset ingestion page
 */
export default function UploadPage(props) {
  const [sources, setSources] = useState(initialSources);

  const handleAddSource = (newSource) => {
    setSources((prev) => [newSource, ...prev]);
    if (props.onAddSource) props.onAddSource(newSource);
  };

  return (
    <DataIngestion
      darkMode={props.darkMode ?? true}
      sources={props.sources ?? sources}
      onAddSource={props.onAddSource ?? handleAddSource}
      onTriggerToast={props.onTriggerToast ?? ((msg) => console.log('Toast:', msg))}
    />
  );
}

export { DataIngestion as Upload };
