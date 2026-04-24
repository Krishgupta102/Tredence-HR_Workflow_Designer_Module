import type { WorkflowNode, WorkflowEdge, ValidationResult, ValidationIssue } from '../types/workflow';

let issueCounter = 0;
function makeIssue(
  severity: ValidationIssue['severity'],
  message: string,
  nodeId?: string
): ValidationIssue {
  return { id: `issue-${++issueCounter}`, severity, message, nodeId };
}

/**
 * Validates the workflow graph against HR workflow rules.
 * Returns a ValidationResult with issues categorised as errors or warnings.
 */
export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationResult {
  issueCounter = 0;
  const issues: ValidationIssue[] = [];

  if (nodes.length === 0) {
    issues.push(makeIssue('error', 'Canvas is empty. Add at least a Start and End node.'));
    return { valid: false, issues };
  }

  // ── 1. Exactly one Start Node ────────────────────────────────────────────
  const startNodes = nodes.filter((n) => n.type === 'startNode');
  if (startNodes.length === 0) {
    issues.push(makeIssue('error', 'Workflow must have exactly one Start Node.'));
  } else if (startNodes.length > 1) {
    startNodes.forEach((n) =>
      issues.push(makeIssue('error', 'Multiple Start Nodes found. Only one is allowed.', n.id))
    );
  }

  // ── 2. At least one End Node ─────────────────────────────────────────────
  const endNodes = nodes.filter((n) => n.type === 'endNode');
  if (endNodes.length === 0) {
    issues.push(makeIssue('error', 'Workflow must have at least one End Node.'));
  }

  // ── 3. Start Node must not have incoming edges ───────────────────────────
  startNodes.forEach((startNode) => {
    const incomingToStart = edges.filter((e) => e.target === startNode.id);
    if (incomingToStart.length > 0) {
      issues.push(
        makeIssue('error', 'Start Node must not have incoming edges.', startNode.id)
      );
    }
  });

  // ── 4. End Node must not have outgoing edges ─────────────────────────────
  endNodes.forEach((endNode) => {
    const outgoingFromEnd = edges.filter((e) => e.source === endNode.id);
    if (outgoingFromEnd.length > 0) {
      issues.push(
        makeIssue('error', 'End Node must not have outgoing edges.', endNode.id)
      );
    }
  });

  // ── 5. Reachability from Start Node ─────────────────────────────────────
  if (startNodes.length === 1) {
    const startId = startNodes[0].id;
    const reachable = new Set<string>();
    const queue = [startId];
    reachable.add(startId);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = edges
        .filter((e) => e.source === current)
        .map((e) => e.target);
      for (const neighbor of neighbors) {
        if (!reachable.has(neighbor)) {
          reachable.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    nodes.forEach((node) => {
      if (!reachable.has(node.id)) {
        issues.push(
          makeIssue(
            'warning',
            `Node "${getNodeLabel(node)}" is not reachable from the Start Node.`,
            node.id
          )
        );
      }
    });
  }

  // ── 6. Cycle Detection ───────────────────────────────────────────────────
  const adjList = new Map<string, string[]>();
  nodes.forEach((n) => adjList.set(n.id, []));
  edges.forEach((e) => adjList.get(e.source)?.push(e.target));

  const visited = new Set<string>();
  const inStack = new Set<string>();
  let cycleDetected = false;

  function dfs(nodeId: string): void {
    if (inStack.has(nodeId)) {
      cycleDetected = true;
      return;
    }
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    inStack.add(nodeId);
    for (const neighbor of adjList.get(nodeId) ?? []) {
      dfs(neighbor);
    }
    inStack.delete(nodeId);
  }

  nodes.forEach((n) => dfs(n.id));

  if (cycleDetected) {
    issues.push(makeIssue('error', 'Cycle detected in the workflow graph. Workflows must be acyclic.'));
  }

  // ── 7. Isolated Nodes ────────────────────────────────────────────────────
  nodes.forEach((node) => {
    const isConnected =
      edges.some((e) => e.source === node.id) ||
      edges.some((e) => e.target === node.id);
    if (!isConnected) {
      issues.push(
        makeIssue(
          'warning',
          `Node "${getNodeLabel(node)}" has no connections.`,
          node.id
        )
      );
    }
  });

  const hasErrors = issues.some((i) => i.severity === 'error');
  return { valid: !hasErrors, issues };
}

function getNodeLabel(node: WorkflowNode): string {
  const data = node.data as unknown as Record<string, unknown>;
  return (
    (data['startTitle'] as string) ||
    (data['title'] as string) ||
    (data['endMessage'] as string) ||
    node.type ||
    node.id
  );
}
