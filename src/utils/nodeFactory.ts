import type { WorkflowNodeType, WorkflowNode } from '../types/workflow';
import type { NodeData } from '../types/nodes';

let nodeCounter = 1;

const DEFAULT_DATA: Record<WorkflowNodeType, () => NodeData> = {
  startNode: () => ({
    type: 'startNode',
    startTitle: 'Start',
    metadata: [],
  }),
  taskNode: () => ({
    type: 'taskNode',
    title: 'New Task',
    description: '',
    assignee: '',
    dueDate: '',
    customFields: [],
  }),
  approvalNode: () => ({
    type: 'approvalNode',
    title: 'Approval Required',
    approverRole: 'Manager',
    autoApproveThreshold: 0,
  }),
  automatedNode: () => ({
    type: 'automatedNode',
    title: 'Automated Step',
    actionId: '',
    actionParams: [],
  }),
  endNode: () => ({
    type: 'endNode',
    endMessage: 'Workflow Complete',
    summaryFlag: false,
  }),
};

/** Create a new WorkflowNode with default data for the given type */
export function createNode(
  type: WorkflowNodeType,
  position: { x: number; y: number }
): WorkflowNode {
  const id = `${type}-${nodeCounter++}`;
  return {
    id,
    type,
    position,
    data: DEFAULT_DATA[type](),
  };
}
