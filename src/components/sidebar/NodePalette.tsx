import type { DragEvent } from 'react';
import { Play, CheckSquare, ShieldCheck, Zap, Flag } from 'lucide-react';
import type { WorkflowNodeType, PaletteItem } from '../../types/workflow';

const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: 'startNode',
    label: 'Start Node',
    description: 'Entry point of the workflow',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    icon: 'start',
  },
  {
    type: 'taskNode',
    label: 'Task',
    description: 'Assign a manual task',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    icon: 'task',
  },
  {
    type: 'approvalNode',
    label: 'Approval',
    description: 'Requires sign-off',
    color: 'bg-violet-50 border-violet-200 text-violet-700',
    icon: 'approval',
  },
  {
    type: 'automatedNode',
    label: 'Automated Step',
    description: 'Trigger an automation',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    icon: 'auto',
  },
  {
    type: 'endNode',
    label: 'End Node',
    description: 'Terminates the workflow',
    color: 'bg-rose-50 border-rose-200 text-rose-700',
    icon: 'end',
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  start:    <Play size={16} fill="currentColor" />,
  task:     <CheckSquare size={16} />,
  approval: <ShieldCheck size={16} />,
  auto:     <Zap size={16} />,
  end:      <Flag size={16} />,
};

interface Props {
  onDragStart: (e: DragEvent, type: WorkflowNodeType) => void;
}

export function NodePalette({ onDragStart }: Props) {
  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Node Palette</h2>
        <p className="text-xs text-slate-400 mt-0.5">Drag nodes onto the canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
        {PALETTE_ITEMS.map((item) => (
          <div
            key={item.type}
            id={`palette-${item.type}`}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing
              transition-all duration-150 select-none hover:shadow-sm hover:-translate-y-0.5
              ${item.color}
            `}
          >
            <div className="flex-shrink-0">{ICON_MAP[item.icon]}</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight">{item.label}</p>
              <p className="text-[10px] opacity-70 leading-tight mt-0.5 truncate">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center leading-snug">
          Drag a node type onto the canvas to add it to your workflow
        </p>
      </div>
    </aside>
  );
}
