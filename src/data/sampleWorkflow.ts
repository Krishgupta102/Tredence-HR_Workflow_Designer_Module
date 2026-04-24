import type { WorkflowNode, WorkflowEdge } from '../types/workflow';

export const SAMPLE_NODES: WorkflowNode[] = [
  {
    id: 'startNode-sample',
    type: 'startNode',
    position: { x: 80, y: 200 },
    data: {
      type: 'startNode',
      startTitle: 'Employee Onboarding',
      metadata: [{ key: 'department', value: 'Engineering' }],
    },
  },
  {
    id: 'taskNode-sample-1',
    type: 'taskNode',
    position: { x: 320, y: 120 },
    data: {
      type: 'taskNode',
      title: 'Collect Documents',
      description: 'Gather all required onboarding documents from the new employee.',
      assignee: 'Employee',
      dueDate: '2025-05-01',
      customFields: [{ key: 'priority', value: 'high' }],
    },
  },
  {
    id: 'approvalNode-sample',
    type: 'approvalNode',
    position: { x: 320, y: 320 },
    data: {
      type: 'approvalNode',
      title: 'Manager Approval',
      approverRole: 'Manager',
      autoApproveThreshold: 3,
    },
  },
  {
    id: 'automatedNode-sample',
    type: 'automatedNode',
    position: { x: 580, y: 200 },
    data: {
      type: 'automatedNode',
      title: 'Send Welcome Email',
      actionId: 'send_email',
      actionParams: [
        { key: 'to', value: 'employee@company.com' },
        { key: 'subject', value: 'Welcome to the Team!' },
      ],
    },
  },
  {
    id: 'endNode-sample',
    type: 'endNode',
    position: { x: 820, y: 200 },
    data: {
      type: 'endNode',
      endMessage: 'Onboarding Complete 🎉',
      summaryFlag: true,
    },
  },
];

export const SAMPLE_EDGES: WorkflowEdge[] = [
  {
    id: 'e1',
    source: 'startNode-sample',
    target: 'taskNode-sample-1',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'e2',
    source: 'startNode-sample',
    target: 'approvalNode-sample',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'e3',
    source: 'taskNode-sample-1',
    target: 'automatedNode-sample',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'e4',
    source: 'approvalNode-sample',
    target: 'automatedNode-sample',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'e5',
    source: 'automatedNode-sample',
    target: 'endNode-sample',
    type: 'smoothstep',
    animated: true,
  },
];
