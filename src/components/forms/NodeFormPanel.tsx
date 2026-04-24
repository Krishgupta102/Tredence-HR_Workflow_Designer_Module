import { X, Trash2 } from 'lucide-react';
import { useNodeSelection } from '../../hooks/useNodeSelection';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { StartNodeForm } from './forms/StartNodeForm';
import { TaskNodeForm } from './forms/TaskNodeForm';
import { ApprovalNodeForm } from './forms/ApprovalNodeForm';
import { AutomatedNodeForm } from './forms/AutomatedNodeForm';
import { EndNodeForm } from './forms/EndNodeForm';
import type { NodeData } from '../../types/nodes';

const NODE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  startNode:     { label: 'Start Node',      color: 'bg-emerald-500' },
  taskNode:      { label: 'Task Node',        color: 'bg-blue-500'   },
  approvalNode:  { label: 'Approval Node',    color: 'bg-violet-500' },
  automatedNode: { label: 'Automated Step',   color: 'bg-amber-500'  },
  endNode:       { label: 'End Node',         color: 'bg-rose-500'   },
};

export function NodeFormPanel() {
  const { selectedNode, clearSelection, handleDeleteSelected } = useNodeSelection();
  const { getNodeIssues } = useWorkflowValidation();

  if (!selectedNode) {
    return (
      <aside className="w-72 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-slate-400">
            <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600">No node selected</p>
        <p className="text-xs text-slate-400 mt-1">Click a node on the canvas to configure it</p>
      </aside>
    );
  }

  const nodeType = selectedNode.type ?? '';
  const meta = NODE_TYPE_LABELS[nodeType];
  const data = selectedNode.data as NodeData;
  const issues = getNodeIssues(selectedNode.id);

  return (
    <aside className="w-72 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${meta?.color ?? 'bg-slate-400'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400">Configure</p>
          <p className="text-sm font-semibold text-slate-800 truncate">{meta?.label ?? nodeType}</p>
        </div>
        <button onClick={clearSelection} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Validation issues */}
      {issues.length > 0 && (
        <div className="px-4 py-2 border-b border-slate-100 space-y-1">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className={`flex items-start gap-2 text-xs p-2 rounded-lg ${
                issue.severity === 'error'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              <span className="mt-0.5">{issue.severity === 'error' ? '⚠' : '○'}</span>
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Form body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {data.type === 'startNode' && (
          <StartNodeForm nodeId={selectedNode.id} data={data} />
        )}
        {data.type === 'taskNode' && (
          <TaskNodeForm nodeId={selectedNode.id} data={data} />
        )}
        {data.type === 'approvalNode' && (
          <ApprovalNodeForm nodeId={selectedNode.id} data={data} />
        )}
        {data.type === 'automatedNode' && (
          <AutomatedNodeForm nodeId={selectedNode.id} data={data} />
        )}
        {data.type === 'endNode' && (
          <EndNodeForm nodeId={selectedNode.id} data={data} />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100">
        <button
          onClick={handleDeleteSelected}
          className="btn-danger w-full justify-center"
        >
          <Trash2 size={14} /> Delete Node
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">ID: {selectedNode.id}</p>
      </div>
    </aside>
  );
}
