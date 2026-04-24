import type { Node, Edge } from 'reactflow';
import type { NodeData } from './nodes';

// ─── Workflow Node ────────────────────────────────────────────────────────────
export type WorkflowNode = Node<NodeData>;
export type WorkflowEdge = Edge;

// ─── Serialized Workflow ──────────────────────────────────────────────────────
export interface SerializedWorkflow {
  id: string;
  name: string;
  createdAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// ─── Validation ───────────────────────────────────────────────────────────────
export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  message: string;
  nodeId?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

// ─── Node Type Enum ───────────────────────────────────────────────────────────
export type WorkflowNodeType =
  | 'startNode'
  | 'taskNode'
  | 'approvalNode'
  | 'automatedNode'
  | 'endNode';

// ─── Palette Item ─────────────────────────────────────────────────────────────
export interface PaletteItem {
  type: WorkflowNodeType;
  label: string;
  description: string;
  color: string;
  icon: string;
}
