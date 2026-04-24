import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { CheckSquare, AlertCircle, AlertTriangle } from 'lucide-react';
import type { TaskNodeData } from '../../types/nodes';
import { useWorkflowStore } from '../../store/workflowStore';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { clsx } from 'clsx';

const TaskNode = memo(({ id, data, selected }: NodeProps<TaskNodeData>) => {
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
      <div className="node-header bg-blue-50 text-blue-700 rounded-t-xl">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500 text-white flex-shrink-0">
          <CheckSquare size={12} />
        </div>
        <span className="truncate">{data.title || 'Task'}</span>
        {hasError && <AlertCircle size={14} className="ml-auto text-red-500 flex-shrink-0" />}
        {hasWarning && !hasError && <AlertTriangle size={14} className="ml-auto text-amber-500 flex-shrink-0" />}
      </div>
      <div className="node-body">
        <span className="badge bg-blue-50 text-blue-600">Task</span>
        {data.assignee && (
          <p className="mt-1 text-slate-400 truncate">👤 {data.assignee}</p>
        )}
        {data.dueDate && (
          <p className="text-slate-400 truncate">📅 {data.dueDate}</p>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

TaskNode.displayName = 'TaskNode';
export default TaskNode;
