import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

/**
 * Provides the currently selected node and selection management helpers.
 */
export function useNodeSelection() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const selectedNode = useWorkflowStore((s) => s.selectedNode);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const clearSelection = useWorkflowStore((s) => s.clearSelection);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNodeId) deleteNode(selectedNodeId);
  }, [selectedNodeId, deleteNode]);

  return {
    selectedNodeId,
    selectedNode,
    selectNode,
    clearSelection,
    handleDeleteSelected,
  };
}
