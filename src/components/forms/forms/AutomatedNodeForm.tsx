import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AutomatedNodeData } from '../../../types/nodes';
import type { Automation } from '../../../types/api';
import { useWorkflowStore } from '../../../store/workflowStore';
import { getAutomations } from '../../../services/automationApi';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  actionId: z.string().min(1, 'Action is required'),
  actionParams: z.array(z.object({ key: z.string(), value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: AutomatedNodeData;
}

export function AutomatedNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  const { register, control, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      actionId: data.actionId,
      actionParams: data.actionParams,
    },
  });

  const { fields, replace } = useFieldArray({ control, name: 'actionParams' });

  // Load automations from mock API
  useEffect(() => {
    getAutomations().then((list) => {
      setAutomations(list);
      setLoading(false);
    });
  }, []);

  // When actionId changes, rebuild params
  const watchedActionId = watch('actionId');
  useEffect(() => {
    const automation = automations.find((a) => a.id === watchedActionId);
    if (automation) {
      const existingParams = data.actionParams;
      const newParams = automation.params.map((paramKey) => {
        const existing = existingParams.find((p) => p.key === paramKey);
        return { key: paramKey, value: existing?.value ?? '' };
      });
      replace(newParams);
    }
  }, [watchedActionId, automations]); // eslint-disable-line react-hooks/exhaustive-deps

  // Live sync to store
  useEffect(() => {
    const subscription = watch((values) => {
      updateNodeData(nodeId, {
        title: values.title ?? '',
        actionId: values.actionId ?? '',
        actionParams: (values.actionParams ?? []).map((p) => ({
          key: p?.key ?? '',
          value: p?.value ?? '',
        })),
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title *</label>
        <input
          id="automatedTitle"
          className="form-input"
          placeholder="e.g. Send Welcome Email"
          {...register('title')}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div>
        <label className="form-label">Action</label>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-2">
            <Loader2 size={14} className="animate-spin" /> Loading actions…
          </div>
        ) : (
          <div className="relative">
            <select
              id="actionId"
              className="form-select"
              {...register('actionId')}
            >
              <option value="">— Select an action —</option>
              {automations.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
        {errors.actionId && <p className="form-error">{errors.actionId.message}</p>}
      </div>

      {fields.length > 0 && (
        <div>
          <label className="form-label">Action Parameters</label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-1">
                <label className="text-xs text-slate-500 capitalize">{field.key}</label>
                <input
                  className="form-input"
                  placeholder={`Value for "${field.key}"`}
                  {...register(`actionParams.${index}.value`)}
                />
                <input type="hidden" {...register(`actionParams.${index}.key`)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
