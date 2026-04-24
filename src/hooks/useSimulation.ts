import { useState, useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { validateWorkflow } from '../utils/graphValidation';
import { simulateWorkflow } from '../services/simulationApi';
import type { SimulationResponse } from '../types/api';
import type { ValidationResult } from '../types/workflow';

export type SimulationStatus = 'idle' | 'validating' | 'running' | 'done' | 'error';

export interface SimulationState {
  status: SimulationStatus;
  validationResult: ValidationResult | null;
  response: SimulationResponse | null;
  error: string | null;
}

/**
 * Manages workflow simulation flow:
 *   1. Validate the graph
 *   2. Call simulateWorkflow (mock API)
 *   3. Return logs / errors
 */
export function useSimulation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const serializeWorkflowFn = useWorkflowStore((s) => s.serializeWorkflow);

  const [state, setState] = useState<SimulationState>({
    status: 'idle',
    validationResult: null,
    response: null,
    error: null,
  });

  const run = useCallback(
    async (workflowName = 'Untitled Workflow') => {
      setState({ status: 'validating', validationResult: null, response: null, error: null });

      const validation = validateWorkflow(nodes, edges);
      if (!validation.valid) {
        setState({
          status: 'error',
          validationResult: validation,
          response: null,
          error: 'Workflow validation failed. Fix the errors before simulating.',
        });
        return;
      }

      setState((prev) => ({ ...prev, status: 'running', validationResult: validation }));

      try {
        const serialized = serializeWorkflowFn(workflowName);
        const result = await simulateWorkflow(serialized);
        setState({
          status: result.success ? 'done' : 'error',
          validationResult: validation,
          response: result,
          error: result.success ? null : (result.errorMessage ?? 'Simulation failed.'),
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error during simulation.',
        }));
      }
    },
    [nodes, edges, serializeWorkflowFn]
  );

  const reset = useCallback(() => {
    setState({ status: 'idle', validationResult: null, response: null, error: null });
  }, []);

  return { ...state, run, reset };
}
