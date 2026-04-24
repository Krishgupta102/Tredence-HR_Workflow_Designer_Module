import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Zap, AlertCircle, AlertTriangle } from 'lucide-react';
import type { AutomatedNodeData } from '../../types/nodes';
import { useWorkflowStore } from '../../store/workflowStore';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { clsx } from 'clsx';

const AutomatedNode = memo(({ id, data, selected }: NodeProps<AutomatedNodeData>) => {
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
      <div className="node-header bg-amber-50 text-amber-700 rounded-t-xl">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500 text-white flex-shrink-0">
          <Zap size={12} />
        </div>
        <span className="truncate">{data.title || 'Automated Step'}</span>
        {hasError && <AlertCircle size={14} className="ml-auto text-red-500 flex-shrink-0" />}
        {hasWarning && !hasError && <AlertTriangle size={14} className="ml-auto text-amber-500 flex-shrink-0" />}
      </div>
      <div className="node-body">
        <span className="badge bg-amber-50 text-amber-600">Automated</span>
        {data.actionId && (
          <p className="mt-1 text-slate-400 truncate font-mono text-[10px]">{data.actionId}</p>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

AutomatedNode.displayName = 'AutomatedNode';
export default AutomatedNode;
