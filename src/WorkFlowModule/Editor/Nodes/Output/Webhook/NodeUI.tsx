import React, { useState, useCallback } from 'react';
import { WorkflowNode } from '@/WorkFlowModule/Types/workflow';

interface NodeUIProps {
  node: WorkflowNode;
  onUpdate: (updates: Partial<WorkflowNode>) => void;
  onDelete: () => void;
  isSelected: boolean;
}

const NodeUI: React.FC<NodeUIProps> = ({ node, onUpdate, onDelete, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleConfigChange = useCallback((key: string, value: any) => {
    onUpdate({
      config: {
        ...node.config,
        [key]: value,
      },
    });
  }, [node.config, onUpdate]);

  return (
    <div className={`node-ui ${isSelected ? 'selected' : ''}`}>
      <div className="node-header">
        <span className="node-icon">{node.icon || '⚙️'}</span>
        <span className="node-title">{node.name}</span>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? '✓' : '✏️'}
        </button>
        <button onClick={onDelete}>🗑️</button>
      </div>
      
      {isEditing && (
        <div className="node-config">
          {Object.entries(node.config || {}).map(([key, value]) => (
            <div key={key} className="config-field">
              <label>{key}:</label>
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={String(value)}
                onChange={(e) => handleConfigChange(key, 
                  typeof value === 'number' ? Number(e.target.value) : e.target.value
                )}
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="node-inputs">
        {node.inputs?.map((input, index) => (
          <div key={index} className="input-port">
            <span>{input.name}</span>
          </div>
        ))}
      </div>
      
      <div className="node-outputs">
        {node.outputs?.map((output, index) => (
          <div key={index} className="output-port">
            <span>{output.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeUI;
