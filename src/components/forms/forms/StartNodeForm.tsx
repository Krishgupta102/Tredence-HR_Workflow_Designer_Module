import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import type { StartNodeData } from '../../../types/nodes';
import { useWorkflowStore } from '../../../store/workflowStore';

const schema = z.object({
  startTitle: z.string().min(1, 'Start title is required'),
  metadata: z.array(z.object({ key: z.string(), value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: StartNodeData;
}

export function StartNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const { register, control, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { startTitle: data.startTitle, metadata: data.metadata },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'metadata' });

  // Live sync to store on every change
  useEffect(() => {
    const subscription = watch((values) => {
      updateNodeData(nodeId, {
        startTitle: values.startTitle ?? '',
        metadata: (values.metadata ?? []).map((m) => ({ key: m?.key ?? '', value: m?.value ?? '' })),
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Start Title *</label>
        <input
          id="startTitle"
          className="form-input"
          placeholder="e.g. Employee Onboarding"
          {...register('startTitle')}
        />
        {errors.startTitle && <p className="form-error">{errors.startTitle.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="form-label mb-0">Metadata (optional)</label>
          <button
            type="button"
            onClick={() => append({ key: '', value: '' })}
            className="btn-ghost text-xs py-1 px-2"
          >
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                className="form-input"
                placeholder="Key"
                {...register(`metadata.${index}.key`)}
              />
              <input
                className="form-input"
                placeholder="Value"
                {...register(`metadata.${index}.value`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
