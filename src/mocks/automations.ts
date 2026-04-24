import type { GetAutomationsResponse } from '../types/api';

export const MOCK_AUTOMATIONS: GetAutomationsResponse = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
  },
  {
    id: 'create_ticket',
    label: 'Create IT Ticket',
    params: ['category', 'priority'],
  },
];
