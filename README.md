# HR Workflow Designer Module

A production-quality frontend prototype for visually creating and simulating internal HR workflows — built as a case study for senior frontend engineering roles.

---

## Overview

The HR Workflow Designer is a visual, node-based workflow builder for HR administrators. It allows teams to model and test internal processes such as employee onboarding, leave approval, and document verification — all without writing a single line of configuration.

---

## Features

| Feature | Status |
|---|---|
| Drag-and-drop node canvas (React Flow) | ✅ |
| 5 custom node types (Start, Task, Approval, Automated, End) | ✅ |
| Left sidebar node palette | ✅ |
| Right-side dynamic configuration panel | ✅ |
| React Hook Form + Zod validation per node type | ✅ |
| Dynamic action param inputs (Automated Step) | ✅ |
| Zustand global state management | ✅ |
| Mock API layer (GET /automations, POST /simulate) | ✅ |
| Workflow validation (7 rules) | ✅ |
| Workflow simulation with step-by-step logs | ✅ |
| Validation badges on nodes | ✅ |
| Export workflow as JSON | ✅ |
| Import workflow from JSON | ✅ |
| Load sample workflow | ✅ |
| Reset canvas | ✅ |
| MiniMap + Controls (React Flow) | ✅ |
| Node count in header | ✅ |
| Collapsible sandbox panel | ✅ |

---

## Tech Stack

| Library | Purpose |
|---|---|
| **Vite** | Build tool |
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS v3** | Styling |
| **React Flow** | Canvas & graph rendering |
| **Zustand** | State management |
| **React Hook Form** | Form state |
| **Zod** | Schema validation |
| **Lucide React** | Icons |

---

## Running Locally

```bash
# 1. Clone / enter the project
cd tredence-project

# 2. Install dependencies (already done if you followed setup)
npm install

# 3. Start the development server
npm run dev
```

Navigate to **http://localhost:5173** in your browser.

---

## Folder Structure

```
src/
  components/
    sidebar/        # NodePalette (draggable node cards)
    canvas/         # WorkflowCanvas (React Flow wrapper)
    nodes/          # 5 custom node components
    forms/
      forms/        # Per-node-type form components
      NodeFormPanel # Dynamic form dispatcher
    sandbox/        # WorkflowSandbox + ExecutionLog
    layout/         # AppShell (top nav + layout composition)
  hooks/            # useWorkflowBuilder, useNodeSelection,
                    # useWorkflowValidation, useSimulation
  store/            # workflowStore.ts (Zustand)
  services/         # automationApi.ts, simulationApi.ts
  mocks/            # automations.ts, simulate.ts
  utils/            # graphValidation, workflowSerializer, nodeFactory
  types/            # workflow.ts, nodes.ts, api.ts
  data/             # sampleWorkflow.ts
```

---

## Architecture Decisions

### 1. Discriminated Union for Node Data
All node data types share a `type` discriminant field. This allows exhaustive type narrowing in the form dispatcher (`NodeFormPanel`) and validation logic without runtime errors.

```ts
type NodeData = StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData;
```

### 2. Zustand as Single Source of Truth
React Flow's `nodes` and `edges` live in Zustand, not local component state. This means any component in the tree can read or mutate the canvas without prop drilling or context overhead.

### 3. Live Form Sync with `watch`
Each node form uses React Hook Form's `watch()` subscription to propagate changes to the Zustand store in real-time, so the canvas updates immediately as the user types — no submit button required.

### 4. Mock API as a Service Layer
`automationApi.ts` and `simulationApi.ts` are clean async functions that happen to call mock data. Replacing them with real `fetch()` calls requires zero changes to consumers.

### 5. Validation as Pure Functions
`graphValidation.ts` is a pure function with no React dependencies. It can be unit tested in isolation and is consumed by both `useWorkflowValidation` (reactive) and `useSimulation` (imperative, pre-run).

---

## Validation Rules

1. Exactly one Start Node must exist
2. At least one End Node must exist
3. Start Node must not have incoming edges
4. End Node must not have outgoing edges
5. All nodes must be reachable from the Start Node
6. No cycles in the graph (DFS-based detection)
7. Isolated nodes (no edges) produce a warning

---

## Tradeoffs / Assumptions

- **No undo/redo**: React Flow has basic node/edge mutation, and implementing full undo would require maintaining a history stack. Deferred for scope.
- **No auto-layout**: Dagre/ELK integration was skipped to keep dependencies lean. Nodes are placed where dropped.
- **No backend**: The app is entirely client-side with an in-memory mock layer. Adding a real API is a thin wrapper change.
- **Validation on render**: Validation runs on every node/edge change via `useMemo`. For very large graphs this could be debounced, but is performant for typical HR workflow sizes.

---

## What Would Be Added With More Time

- [ ] **Undo/Redo** — history stack using Zustand middleware
- [ ] **Auto-layout** — Dagre integration with a "Layout" button  
- [ ] **Edge labels** — condition labels (e.g. "Approved", "Rejected") on edges
- [ ] **Node search/filter** — search across node titles on the canvas
- [ ] **Workflow versioning** — save multiple named versions
- [ ] **Role-based access** — different views for HR Admin vs. Manager
- [ ] **Unit tests** — Vitest + Testing Library for hooks and validation utils
- [ ] **Real backend** — Express/FastAPI backend replacing mock layer
