import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Play, AlertCircle, AlertTriangle } from 'lucide-react';
import type { StartNodeData } from '../../types/nodes';
import { useWorkflowStore } from '../../store/workflowStore';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { clsx } from 'clsx';

const StartNode = memo(({ id, data, selected }: NodeProps<StartNodeData>) => {
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const { getNodeIssues } = useWorkflowValidation();
  const issues = getNodeIssues(id);
  const hasError = issues.some((i) => i.severity === 'error');
  const hasWarning = issues.some((i) => i.severity === 'warning');

  return (
    <div
      className={clsx(
        'node-base',
        selected && 'node-selected',
        hasError && 'border-red-400',
        hasWarning && !hasError && 'border-amber-400'
      )}
      onClick={() => selectNode(id)}
      style={{ minWidth: 180 }}
    >
      <div className="node-header bg-emerald-50 text-emerald-700 rounded-t-xl">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500 text-white flex-shrink-0">
          <Play size={12} fill="white" />
        </div>
        <span className="truncate">{data.startTitle || 'Start'}</span>
        {hasError && <AlertCircle size={14} className="ml-auto text-red-500 flex-shrink-0" />}
        {hasWarning && !hasError && <AlertTriangle size={14} className="ml-auto text-amber-500 flex-shrink-0" />}
      </div>
      <div className="node-body">
        <span className="badge bg-emerald-50 text-emerald-600">Start Node</span>
        {data.metadata && data.metadata.length > 0 && (
          <p className="mt-1 text-slate-400">{data.metadata.length} metadata field{data.metadata.length > 1 ? 's' : ''}</p>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

StartNode.displayName = 'StartNode';
export default StartNode;
