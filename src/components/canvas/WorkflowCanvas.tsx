import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../../store/workflowStore';
import { useWorkflowBuilder } from '../../hooks/useWorkflowBuilder';

import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomatedNode from '../nodes/AutomatedNode';
import EndNode from '../nodes/EndNode';
import type { NodeTypes } from 'reactflow';

const nodeTypes: NodeTypes = {
  startNode:     StartNode,
  taskNode:      TaskNode,
  approvalNode:  ApprovalNode,
  automatedNode: AutomatedNode,
  endNode:       EndNode,
};

const NODE_COLORS: Record<string, string> = {
  startNode:     '#10b981',
  taskNode:      '#3b82f6',
  approvalNode:  '#8b5cf6',
  automatedNode: '#f59e0b',
  endNode:       '#f43f5e',
};

export function WorkflowCanvas() {
  const nodes         = useWorkflowStore((s) => s.nodes);
  const edges         = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect     = useWorkflowStore((s) => s.onConnect);
  const selectNode    = useWorkflowStore((s) => s.selectNode);
  const clearSelection = useWorkflowStore((s) => s.clearSelection);

  const { onDragOver, onDrop } = useWorkflowBuilder();

  const onPaneClick = useCallback(() => clearSelection(), [clearSelection]);

  const miniMapNodeColor = useCallback(
    (node: { type?: string | undefined }) => NODE_COLORS[node.type ?? ''] ?? '#94a3b8',
    []
  );

  return (
    <div
      className="flex-1 h-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeClick={(_, node) => selectNode(node.id)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode={['Backspace', 'Delete']}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={miniMapNodeColor}
          maskColor="rgba(248,250,252,0.85)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
