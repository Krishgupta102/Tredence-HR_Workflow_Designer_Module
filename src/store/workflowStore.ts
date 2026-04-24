import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import type {
  NodeChange,
  EdgeChange,
  Connection,
} from 'reactflow';
import type { WorkflowNode, WorkflowEdge } from '../types/workflow';
import type { NodeData } from '../types/nodes';
import { serializeWorkflow } from '../utils/workflowSerializer';
import { SAMPLE_NODES, SAMPLE_EDGES } from '../data/sampleWorkflow';

export interface WorkflowStore {
  // ── State ──────────────────────────────────────────────────────────────────
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;

  // ── Computed ───────────────────────────────────────────────────────────────
  selectedNode: WorkflowNode | null;

  // ── React Flow handlers ────────────────────────────────────────────────────
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // ── Node CRUD ──────────────────────────────────────────────────────────────
  addNode: (node: WorkflowNode) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;

  // ── Selection ──────────────────────────────────────────────────────────────
  selectNode: (nodeId: string | null) => void;
  clearSelection: () => void;

  // ── Canvas ops ─────────────────────────────────────────────────────────────
  resetCanvas: () => void;
  loadSample: () => void;

  // ── Serialization ──────────────────────────────────────────────────────────
  serializeWorkflow: (name?: string) => ReturnType<typeof serializeWorkflow>;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: SAMPLE_NODES,
  edges: SAMPLE_EDGES,
  selectedNodeId: null,

  get selectedNode() {
    const { nodes, selectedNodeId } = get();
    return nodes.find((n) => n.id === selectedNodeId) ?? null;
  },

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges) as WorkflowEdge[],
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(
        { ...connection, type: 'smoothstep', animated: true },
        state.edges
      ) as WorkflowEdge[],
    })),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...data } as unknown as NodeData }
          : n
      ),
    })),

  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
      selectedNodeId:
        state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  clearSelection: () => set({ selectedNodeId: null }),

  resetCanvas: () =>
    set({ nodes: [], edges: [], selectedNodeId: null }),

  loadSample: () =>
    set({ nodes: SAMPLE_NODES, edges: SAMPLE_EDGES, selectedNodeId: null }),

  serializeWorkflow: (name) => {
    const { nodes, edges } = get();
    return serializeWorkflow(nodes, edges, name);
  },
}));
