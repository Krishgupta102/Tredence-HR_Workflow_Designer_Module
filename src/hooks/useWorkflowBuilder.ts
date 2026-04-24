import { useCallback, useRef } from 'react';
import type { DragEvent } from 'react';
import { useReactFlow } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';
import { createNode } from '../utils/nodeFactory';
import type { WorkflowNodeType } from '../types/workflow';

/**
 * Handles drag-and-drop from the NodePalette onto the ReactFlow canvas.
 * Also exposes canvas-level reset and load-sample actions.
 */
export function useWorkflowBuilder() {
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useWorkflowStore((s) => s.addNode);
  const resetCanvas = useWorkflowStore((s) => s.resetCanvas);
  const loadSample = useWorkflowStore((s) => s.loadSample);

  const dragTypeRef = useRef<WorkflowNodeType | null>(null);

  const onDragStart = useCallback(
    (_: DragEvent, nodeType: WorkflowNodeType) => {
      dragTypeRef.current = nodeType;
    },
    []
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const type = dragTypeRef.current;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const node = createNode(type, position);
      addNode(node);
      dragTypeRef.current = null;
    },
    [screenToFlowPosition, addNode]
  );

  return { onDragStart, onDragOver, onDrop, resetCanvas, loadSample };
}
