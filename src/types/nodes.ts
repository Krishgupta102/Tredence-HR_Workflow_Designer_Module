// ─── Shared ───────────────────────────────────────────────────────────────────
export interface KeyValuePair {
  key: string;
  value: string;
}

// ─── Start Node ───────────────────────────────────────────────────────────────
export interface StartNodeData {
  type: 'startNode';
  startTitle: string;
  metadata: KeyValuePair[];
}

// ─── Task Node ────────────────────────────────────────────────────────────────
export interface TaskNodeData {
  type: 'taskNode';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
}

// ─── Approval Node ────────────────────────────────────────────────────────────
export type ApproverRole = 'Manager' | 'HRBP' | 'Director';

export interface ApprovalNodeData {
  type: 'approvalNode';
  title: string;
  approverRole: ApproverRole;
  autoApproveThreshold: number;
}

// ─── Automated Node ───────────────────────────────────────────────────────────
export interface AutomatedNodeData {
  type: 'automatedNode';
  title: string;
  actionId: string;
  actionParams: KeyValuePair[];
}

// ─── End Node ─────────────────────────────────────────────────────────────────
export interface EndNodeData {
  type: 'endNode';
  endMessage: string;
  summaryFlag: boolean;
}

// ─── Discriminated Union ──────────────────────────────────────────────────────
export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;
