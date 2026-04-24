import type { SerializedWorkflow } from '../types/workflow';
import type { SimulationResponse } from '../types/api';

export function mockSimulate(workflow: SerializedWorkflow): SimulationResponse {
  const nodes = workflow.nodes;
  const logs: string[] = [];

  const startNode = nodes.find((n) => n.type === 'startNode');
  const endNode = nodes.find((n) => n.type === 'endNode');

  if (!startNode) {
    return {
      success: false,
      logs: [],
      errorMessage: 'No Start Node found in workflow.',
    };
  }

  logs.push(`🚀 Started workflow: "${workflow.name}"`);

  for (const node of nodes) {
    const data = node.data as unknown as Record<string, unknown>;
    if (node.type === 'startNode') {
      logs.push(`  ▶ Workflow initiated: ${(data['startTitle'] as string) || 'Untitled Start'}`);
    } else if (node.type === 'taskNode') {
      logs.push(`  📋 Task assigned: "${(data['title'] as string) || 'Task'}" → ${(data['assignee'] as string) || 'Unassigned'}`);
    } else if (node.type === 'approvalNode') {
      logs.push(`  ✅ Approval requested: "${(data['title'] as string) || 'Approval'}" from ${(data['approverRole'] as string) || 'Manager'}`);
    } else if (node.type === 'automatedNode') {
      logs.push(`  ⚡ Automation executed: "${(data['title'] as string) || 'Auto'}" (action: ${(data['actionId'] as string) || 'unknown'})`);
    } else if (node.type === 'endNode') {
      logs.push(`  🏁 Workflow completed: ${(data['endMessage'] as string) || 'Done'}`);
    }
  }

  if (!endNode) {
    logs.push('⚠️  Warning: No End Node found. Workflow may be incomplete.');
  }

  logs.push(`✨ Simulation finished — ${nodes.length} nodes processed, ${workflow.edges.length} edges traversed.`);

  return { success: true, logs };
}
