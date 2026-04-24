import { useMemo } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { validateWorkflow } from '../utils/graphValidation';

/**
 * Reactively validates the current workflow graph.
 * Recalculates whenever nodes or edges change.
 */
export function useWorkflowValidation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const validationResult = useMemo(
    () => validateWorkflow(nodes, edges),
    [nodes, edges]
  );

  /** Returns the issues for a specific node */
  function getNodeIssues(nodeId: string) {
    return validationResult.issues.filter((i) => i.nodeId === nodeId);
  }

  return { validationResult, getNodeIssues };
}
