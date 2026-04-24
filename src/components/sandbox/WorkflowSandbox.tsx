import { useState } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';
import { useWorkflowValidation } from '../../hooks/useWorkflowValidation';
import { ExecutionLog } from './ExecutionLog';

export function WorkflowSandbox() {
  const [collapsed, setCollapsed] = useState(false);
  const [workflowName, setWorkflowName] = useState('Employee Onboarding');
  const { validationResult } = useWorkflowValidation();
  const { status, response, error, validationResult: simValidation, run, reset } = useSimulation();

  const isRunning = status === 'validating' || status === 'running';
  const errorCount = validationResult.issues.filter((i) => i.severity === 'error').length;
  const warnCount  = validationResult.issues.filter((i) => i.severity === 'warning').length;

  return (
    <div className="border-t border-slate-200 bg-white flex flex-col transition-all duration-200" style={{ minHeight: collapsed ? 44 : 220, maxHeight: collapsed ? 44 : 320 }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-100 flex-shrink-0">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="btn-ghost p-1"
          title={collapsed ? 'Expand sandbox' : 'Collapse sandbox'}
        >
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Workflow Sandbox</span>

        {/* Validation status pills */}
        <div className="flex items-center gap-2 ml-1">
          {validationResult.valid ? (
            <span className="flex items-center gap-1 badge bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={11} /> Valid
            </span>
          ) : (
            <span className="flex items-center gap-1 badge bg-red-50 text-red-600">
              <AlertCircle size={11} /> {errorCount} error{errorCount !== 1 ? 's' : ''}
            </span>
          )}
          {warnCount > 0 && (
            <span className="flex items-center gap-1 badge bg-amber-50 text-amber-600">
              <AlertCircle size={11} /> {warnCount} warning{warnCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Workflow name input */}
          <input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 w-48 bg-slate-50"
            placeholder="Workflow name…"
          />

          {status !== 'idle' && (
            <button onClick={reset} className="btn-ghost text-xs">
              <RotateCcw size={13} /> Clear
            </button>
          )}

          <button
            id="simulate-btn"
            onClick={() => run(workflowName)}
            disabled={isRunning}
            className="btn-primary text-xs py-1.5"
          >
            {isRunning ? (
              <><Loader2 size={13} className="animate-spin" /> {status === 'validating' ? 'Validating…' : 'Simulating…'}</>
            ) : (
              <><Play size={13} fill="white" /> Simulate Workflow</>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {status === 'idle' && (
            <div>
              {/* Validation issues summary */}
              {validationResult.issues.length > 0 ? (
                <div className="space-y-1">
                  {validationResult.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`flex items-start gap-2 text-xs p-2 rounded-lg ${
                        issue.severity === 'error'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {issue.severity === 'error'
                        ? <XCircle size={12} className="flex-shrink-0 mt-0.5" />
                        : <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />}
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Workflow is valid and ready to simulate.
                </div>
              )}
            </div>
          )}

          {(status === 'done' || status === 'error') && (
            <ExecutionLog
              logs={response?.logs ?? (simValidation?.issues.map((i) => `[${i.severity.toUpperCase()}] ${i.message}`) ?? [])}
              success={status === 'done'}
              errorMessage={error}
            />
          )}
        </div>
      )}
    </div>
  );
}
