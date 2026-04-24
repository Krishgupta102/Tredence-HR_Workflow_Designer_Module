import { MOCK_AUTOMATIONS } from '../mocks/automations';
import type { GetAutomationsResponse } from '../types/api';

/** Simulates a GET /automations request with a small artificial delay */
export async function getAutomations(): Promise<GetAutomationsResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_AUTOMATIONS), 200);
  });
}

/** Find a single automation by id */
export async function getAutomationById(id: string) {
  const all = await getAutomations();
  return all.find((a) => a.id === id) ?? null;
}
