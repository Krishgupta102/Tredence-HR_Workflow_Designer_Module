import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Flag, AlertCircle, AlertTriangle } from 'lucide-react';
import type { EndNodeData } from '../../types/nodes';
import { useWorkflowStore } from '../../store/workflowStore';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { clsx } from 'clsx';

const EndNode = memo(({ id, data, selected }: NodeProps<EndNodeData>) => {
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
      <Handle type="target" position={Position.Left} />
      <div className="node-header bg-rose-50 text-rose-700 rounded-t-xl">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-rose-500 text-white flex-shrink-0">
          <Flag size={12} />
        </div>
        <span className="truncate">{data.endMessage || 'End'}</span>
        {hasError && <AlertCircle size={14} className="ml-auto text-red-500 flex-shrink-0" />}
        {hasWarning && !hasError && <AlertTriangle size={14} className="ml-auto text-amber-500 flex-shrink-0" />}
      </div>
      <div className="node-body">
        <span className="badge bg-rose-50 text-rose-600">End Node</span>
        {data.summaryFlag && (
          <p className="mt-1 text-slate-400">📊 Summary enabled</p>
        )}
      </div>
    </div>
  );
});

EndNode.displayName = 'EndNode';
export default EndNode;
