import type { WorkflowNode, WorkflowEdge, SerializedWorkflow } from '../types/workflow';

let workflowCounter = 1;

/** Serialize the current canvas into a portable workflow object */
export function serializeWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  name = 'Untitled Workflow'
): SerializedWorkflow {
  return {
    id: `workflow-${workflowCounter++}`,
    name,
    createdAt: new Date().toISOString(),
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
  };
}

/** Convert serialized workflow to a pretty JSON string */
export function workflowToJSON(workflow: SerializedWorkflow): string {
  return JSON.stringify(workflow, null, 2);
}

/** Parse a JSON string back into a SerializedWorkflow */
export function workflowFromJSON(json: string): SerializedWorkflow {
  const parsed = JSON.parse(json) as SerializedWorkflow;
  if (!parsed.nodes || !parsed.edges) {
    throw new Error('Invalid workflow JSON: missing nodes or edges');
  }
  return parsed;
}
