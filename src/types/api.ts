// ─── Automation API ───────────────────────────────────────────────────────────
export interface Automation {
  id: string;
  label: string;
  params: string[];
}

export type GetAutomationsResponse = Automation[];

// ─── Simulation API ───────────────────────────────────────────────────────────
export interface SimulationRequest {
  workflowId: string;
  workflowName: string;
  nodes: unknown[];
  edges: unknown[];
}

export interface SimulationResponse {
  success: boolean;
  logs: string[];
  errorMessage?: string;
}
