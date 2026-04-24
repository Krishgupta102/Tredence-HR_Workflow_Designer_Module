import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import type { TaskNodeData } from '../../../types/nodes';
import { useWorkflowStore } from '../../../store/workflowStore';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  assignee: z.string(),
  dueDate: z.string(),
  customFields: z.array(z.object({ key: z.string(), value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: TaskNodeData;
}

export function TaskNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const { register, control, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      description: data.description,
      assignee: data.assignee,
      dueDate: data.dueDate,
      customFields: data.customFields,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'customFields' });

  useEffect(() => {
    const subscription = watch((values) => {
      updateNodeData(nodeId, {
        title: values.title ?? '',
        description: values.description ?? '',
        assignee: values.assignee ?? '',
        dueDate: values.dueDate ?? '',
        customFields: (values.customFields ?? []).map((f) => ({ key: f?.key ?? '', value: f?.value ?? '' })),
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Title *</label>
        <input
          id="taskTitle"
          className="form-input"
          placeholder="e.g. Collect Documents"
          {...register('title')}
        />
        {errors.title && <p className="form-error">{errors.title.message}</p>}
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          id="taskDescription"
          className="form-input resize-none"
          rows={3}
          placeholder="What needs to be done..."
          {...register('description')}
        />
      </div>

      <div>
        <label className="form-label">Assignee</label>
        <input
          id="taskAssignee"
          className="form-input"
          placeholder="e.g. John Doe / Employee"
          {...register('assignee')}
        />
      </div>

      <div>
        <label className="form-label">Due Date</label>
        <input
          id="taskDueDate"
          type="date"
          className="form-input"
          {...register('dueDate')}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="form-label mb-0">Custom Fields</label>
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
                {...register(`customFields.${index}.key`)}
              />
              <input
                className="form-input"
                placeholder="Value"
                {...register(`customFields.${index}.value`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
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
