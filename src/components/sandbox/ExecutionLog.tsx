import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

interface LogEntry {
  text: string;
  index: number;
}

interface Props {
  logs: string[];
  success?: boolean;
  errorMessage?: string | null;
}

function classifyLog(text: string): {
  icon: React.ReactNode;
  textClass: string;
} {
  if (text.startsWith('🚀') || text.startsWith('✨'))
    return { icon: <Info size={13} className="text-brand-500 flex-shrink-0 mt-0.5" />, textClass: 'text-brand-700 font-medium' };
  if (text.includes('✅') || text.includes('Task assigned'))
    return { icon: <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />, textClass: 'text-slate-700' };
  if (text.includes('⚠') || text.includes('Warning'))
    return { icon: <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />, textClass: 'text-amber-700' };
  if (text.includes('🏁'))
    return { icon: <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />, textClass: 'text-emerald-700 font-medium' };
  return { icon: <span className="w-3 h-3 rounded-full bg-slate-200 flex-shrink-0 mt-1.5 block" />, textClass: 'text-slate-600' };
}

function LogLine({ entry }: { entry: LogEntry }) {
  const { icon, textClass } = classifyLog(entry.text);
  return (
    <div
      className="log-entry flex items-start gap-2 py-1.5 border-b border-slate-50 last:border-0"
      style={{ animationDelay: `${entry.index * 60}ms` }}
    >
      {icon}
      <span className={`text-xs leading-relaxed ${textClass}`}>{entry.text}</span>
    </div>
  );
}

export function ExecutionLog({ logs, success, errorMessage }: Props) {
  if (errorMessage && logs.length === 0) {
    return (
      <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
        <XCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {success !== undefined && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-2 text-xs font-medium ${
          success
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {success
            ? <><CheckCircle2 size={13} /> Simulation completed successfully</>
            : <><XCircle size={13} /> Simulation failed</>
          }
        </div>
      )}
      <div className="bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 max-h-48 overflow-y-auto">
        {logs.map((text, i) => (
          <LogLine key={i} entry={{ text, index: i }} />
        ))}
      </div>
      {errorMessage && (
        <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg border border-red-200 mt-2">
          <XCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
