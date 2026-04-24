import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ApprovalNodeData, ApproverRole } from '../../../types/nodes';
import { useWorkflowStore } from '../../../store/workflowStore';

const APPROVER_ROLES: ApproverRole[] = ['Manager', 'HRBP', 'Director'];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  approverRole: z.enum(['Manager', 'HRBP', 'Director']),
  autoApproveThreshold: z.number().min(0, 'Must be 0 or more'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: ApprovalNodeData;
}

export function ApprovalNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const { register, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      approverRole: data.approverRole,
      autoApproveThreshold: data.autoApproveThreshold,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      updateNodeData(nodeId, {
        title: values.title ?? '',
        approverRole: (values.approverRole as ApproverRole) ?? 'Manager',
        autoApproveThreshold: Number(values.autoApproveThreshold ?? 0),
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title *</label>
        <input
          id="approvalTitle"
          className="form-input"
          placeholder="e.g. Manager Approval"
          {...register('title')}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div>
        <label className="form-label">Approver Role</label>
        <div className="relative">
          <select
            id="approverRole"
            className="form-select"
            {...register('approverRole')}
          >
            {APPROVER_ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="form-label">Auto-Approve Threshold (days)</label>
        <input
          id="autoApproveThreshold"
          type="number"
          min={0}
          className="form-input"
          placeholder="0 = disabled"
          {...register('autoApproveThreshold', { valueAsNumber: true })}
        />
        <p className="text-xs text-slate-400 mt-1">
          If &gt; 0, auto-approve after this many days of inactivity.
        </p>
        {errors.autoApproveThreshold && (
          <p className="form-error">{errors.autoApproveThreshold.message}</p>
        )}
      </div>
    </div>
  );
}
