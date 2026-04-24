import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import type { ApprovalNodeData } from '../../types/nodes';
import { useWorkflowStore } from '../../store/workflowStore';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { clsx } from 'clsx';

const ApprovalNode = memo(({ id, data, selected }: NodeProps<ApprovalNodeData>) => {
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
      <div className="node-header bg-violet-50 text-violet-700 rounded-t-xl">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-violet-500 text-white flex-shrink-0">
          <ShieldCheck size={12} />
        </div>
        <span className="truncate">{data.title || 'Approval'}</span>
        {hasError && <AlertCircle size={14} className="ml-auto text-red-500 flex-shrink-0" />}
        {hasWarning && !hasError && <AlertTriangle size={14} className="ml-auto text-amber-500 flex-shrink-0" />}
      </div>
      <div className="node-body">
        <span className="badge bg-violet-50 text-violet-600">Approval</span>
        {data.approverRole && (
          <p className="mt-1 text-slate-400">🧑‍💼 {data.approverRole}</p>
        )}
        {data.autoApproveThreshold > 0 && (
          <p className="text-slate-400">Auto ≥ {data.autoApproveThreshold}d</p>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

ApprovalNode.displayName = 'ApprovalNode';
export default ApprovalNode;
