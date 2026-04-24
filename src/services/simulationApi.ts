import { mockSimulate } from '../mocks/simulate';
import type { SerializedWorkflow } from '../types/workflow';
import type { SimulationResponse } from '../types/api';

/** Simulates a POST /simulate request */
export async function simulateWorkflow(
  workflow: SerializedWorkflow
): Promise<SimulationResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSimulate(workflow)), 600);
  });
}
