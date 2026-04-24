import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { EndNodeData } from '../../../types/nodes';
import { useWorkflowStore } from '../../../store/workflowStore';

const schema = z.object({
  endMessage: z.string().min(1, 'End message is required'),
  summaryFlag: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  nodeId: string;
  data: EndNodeData;
}

export function EndNodeForm({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const { register, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      endMessage: data.endMessage,
      summaryFlag: data.summaryFlag,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      updateNodeData(nodeId, {
        endMessage: values.endMessage ?? '',
        summaryFlag: values.summaryFlag ?? false,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">End Message *</label>
        <input
          id="endMessage"
          className="form-input"
          placeholder="e.g. Workflow Complete 🎉"
          {...register('endMessage')}
        />
        {errors.endMessage && <p className="form-error">{errors.endMessage.message}</p>}
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div>
          <p className="text-sm font-medium text-slate-700">Enable Summary Report</p>
          <p className="text-xs text-slate-400 mt-0.5">Generate a summary at workflow completion</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id="summaryFlag"
            type="checkbox"
            className="sr-only peer"
            {...register('summaryFlag')}
          />
          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
        </label>
      </div>
    </div>
  );
}
