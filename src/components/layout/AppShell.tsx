import { useState, useRef } from 'react';
import { ReactFlowProvider } from 'reactflow';
import {
  RotateCcw, Download, Upload, LayoutTemplate, GitBranch
} from 'lucide-react';
import { NodePalette } from '../sidebar/NodePalette';
import { WorkflowCanvas } from '../canvas/WorkflowCanvas';
import { NodeFormPanel } from '../forms/NodeFormPanel';
import { WorkflowSandbox } from '../sandbox/WorkflowSandbox';
import { useWorkflowBuilder } from '../../hooks/useWorkflowBuilder';
import { useWorkflowStore } from '../../store/workflowStore';
import { workflowToJSON, workflowFromJSON } from '../../utils/workflowSerializer';

function AppShellInner() {
  const { onDragStart, resetCanvas, loadSample } = useWorkflowBuilder();
  const serializeWorkflow = useWorkflowStore((s) => s.serializeWorkflow);
  const setNodes = useWorkflowStore((s) => s.setNodes);
  const setEdges = useWorkflowStore((s) => s.setEdges);
  const nodes = useWorkflowStore((s) => s.nodes);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  function handleExport() {
    const workflow = serializeWorkflow('My HR Workflow');
    const json = workflowToJSON(workflow);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = ev.target?.result as string;
        const workflow = workflowFromJSON(json);
        setNodes(workflow.nodes);
        setEdges(workflow.edges);
        setImportError(null);
      } catch {
        setImportError('Invalid workflow JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Top navigation bar */}
      <header className="flex items-center gap-4 px-5 py-2.5 bg-white border-b border-slate-200 shadow-sm flex-shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <GitBranch size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">HR Workflow Designer</p>
            <p className="text-[10px] text-slate-400 leading-tight">Visual Workflow Builder</p>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-1.5">
          <button
            id="load-sample-btn"
            onClick={loadSample}
            className="btn-ghost text-xs"
            title="Load sample employee onboarding workflow"
          >
            <LayoutTemplate size={14} /> Load Sample
          </button>
          <button
            id="reset-canvas-btn"
            onClick={resetCanvas}
            className="btn-ghost text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Clear the canvas"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-1.5">
          <button
            id="export-btn"
            onClick={handleExport}
            className="btn-secondary text-xs"
            title="Export workflow as JSON"
          >
            <Download size={14} /> Export JSON
          </button>
          <button
            id="import-btn"
            onClick={handleImportClick}
            className="btn-secondary text-xs"
            title="Import workflow from JSON"
          >
            <Upload size={14} /> Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {importError && (
            <p className="text-xs text-red-500">{importError}</p>
          )}
          <div className="text-xs text-slate-400">
            <span className="font-medium text-slate-600">{nodes.length}</span> node{nodes.length !== 1 ? 's' : ''} on canvas
          </div>
        </div>
      </header>

      {/* Main content: sidebar + canvas + config panel */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette onDragStart={onDragStart} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <WorkflowCanvas />
          <WorkflowSandbox />
        </main>

        <NodeFormPanel />
      </div>
    </div>
  );
}

export function AppShell() {
  return (
    <ReactFlowProvider>
      <AppShellInner />
    </ReactFlowProvider>
  );
}
