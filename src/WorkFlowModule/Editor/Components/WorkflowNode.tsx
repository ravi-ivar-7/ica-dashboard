import React from 'react';
import { WorkflowNode as WFNode } from '@/WorkFlowModule/Types/workflow';
import { getNodeUI } from '@/WorkFlowModule/Editor/Nodes/index';

interface WorkflowNodeProps {
  data: WFNode & {
    onUpdate: (node: WFNode) => void;
    onDelete: () => void;
    isSelected: boolean;
  };
}

export default function WorkflowNode({ data }: WorkflowNodeProps) {
  // Get the specific node UI component for this node type
  const NodeUIComponent = getNodeUI(data.type);
  
  if (!NodeUIComponent) {
    // Fallback to a generic node UI if no specific component is found
    return (
      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 min-w-[200px]">
        <div className="text-red-700 font-semibold">Unknown Node Type</div>
        <div className="text-red-600 text-sm">{data.type}</div>
        <div className="text-red-500 text-xs mt-2">
          No UI component found for this node type. Please check the node registry.
        </div>
      </div>
    );
  }

  // Render the specific node UI component
  return <NodeUIComponent data={data} />;
}

