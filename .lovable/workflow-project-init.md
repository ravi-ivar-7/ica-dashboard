## 🧱 Project Initialization Prompt

**Prompt:**

Create a modular **React + Tailwind** project structured around a visual AI workflow editor. Include:

* A top navbar
* A left sidebar for node categories
* A right sidebar for node properties
* A large central canvas that supports:

  * Dragging
  * Zooming
  * Connecting nodes

Each node should be:

* **Minimized** (title only)
* **Expanded** (full config)

**Structure folders as follows:**

* `components/dashboard/workflow/`: All visual UI blocks like NodeCard, Sidebar, Canvas
* `pages/dashboard/workflow/`: Pages and route for the editor
* `components/dashboard/workflow/services/nodes/`: Logic for running individual node types
* `services/api/workflow/`: Backend API interfaces (with @todo placeholders)
* `components/dashboard/workflow/contexts/`: Shared context for canvas state

Use clean, production-ready code. Ensure everything is responsive and mobile-first.
Do **not** use dummy nodes — all nodes should accept real props and emit outputs.

Set up routing to:

* `/dashboard/workflow/editor/:id`
* `/dashboard/workflow` with a button to create new workflow

---

## 🧩 Node UI & Behavior Prompt

**Prompt:**

Build a drag-and-drop **visual node system** inside the workflow canvas.

**Each node supports two views:**

* **Minimized** – Shows only the node title and icon
* **Expanded** – Shows inputs, outputs, and parameters (e.g., prompt, resolution, model)

**Node Types Include:**

* Input
* AI Models
* Utility
* Output

Each node is a React component with props:

* `title`, `type`, `inputs`, `outputs`, `onRun`, `onUpdate`

Connectors must visually link compatible inputs/outputs between nodes.
Nodes are draggable and must emit their position/state updates using **absolute positioning** inside the canvas.

---

## ⚙️ Canvas System Prompt

**Prompt:**

Implement a central canvas that is:

* Scrollable
* Zoomable (Ctrl+mouse)
* Supports pan (mouse drag or touch)
* Supports **mobile touch gestures** (drag, pinch-to-zoom)
* Smooth interaction on all screen sizes

Canvas should:

* Be centered by default
* Enable **grid snapping** for node placement
* Show **visual arrows** between nodes for data flow
* Disable body scrolling during canvas touch interaction to prevent conflicts

Canvas state must be managed using a `WorkflowContext`, including:

* Zoom
* Selected node
* Connections
* Node data

Ensure full responsiveness for mobile:

* Canvas scrolls horizontally and vertically
* Side panels collapse
* Mobile gestures must provide smooth experience with no jitter or unexpected scroll

---

## 📱 Responsive Layout Prompt

**Prompt:**

Design the entire workflow editor to be **mobile-responsive**.

**On mobile:**

* Left/right panels collapse into swipeable drawers
* Top toolbar collapses into hamburger menu
* Canvas interaction is optimized for touch (pan, drag, zoom)
* Smooth transitions, no body scroll interference while interacting with canvas

**On desktop:**

* Panels remain sticky and visible
* Toolbar spans full width
* Canvas adapts to screen size (scrollable + zoomable)

---

## 🧱 Shared Layout Instruction (Reuse from CineFlow)
### 💡 Use the same layout, responsiveness, and UI structure as the existing CineFlow editor.
**This includes:**

- Top navbar with Save / Run / Export

- Left panel (Nodes) and right panel (Properties) — both collapsible

- Center canvas — zoomable, pannable, touch-friendly, and scrollable

- Fully responsive behavior for mobile (sticky headers, swipe panels)

- Node card visuals and drag system same as CineFlow

- Maintain modular folder structure and design style

### 🎯 Only replace CineFlow-specific logic and components with Workflow-specific nodes, inputs, and execution logic. Visual and layout systems stay unchanged.

---

## 🔐 API Handling + Proxy Prompt

**Prompt:**

Scaffold secure API integration for models like OpenAI, SDXL, or Veo.

**Rules:**

* **Nodes must NOT contain secrets**
* On execution, nodes must call: `/api/workflow/run-node`
* Payload: `{ nodeId, input, userId }`
* Backend should use `getKeyForNode(nodeType, userId)` to inject secrets

Use: `component/dashboard/workflow/services/nodes/{nodeType}.ts` for actual logic
Return **clean dummy outputs** (e.g. `{ url, type }`) for now

---

## 📂 Save / Preview / Export Prompt

**Prompt:**

Add toolbar buttons:

* Save: Store node graph structure, positions, parameters
* Run / Preview: Execute all nodes and return mock output
* Export: Trigger export node for final rendering
* Exit: Leave editor

Use module: `component/dashboard/workflow/services/workflow/`
All operations must be **state-driven** with status indicators:

* `"running"`, `"error"`, `"done"`

---

## 🧪 Node Testing Prompt

**Prompt:**

For every node type, include a test function in `components/dashboard/workflow/services/nodes/`:

```ts
runTest(input: NodeInput): NodeOutput
```

This validates that:

* Each node processes real data
* Returns expected output
* Handles errors (invalid input, missing connection, failed model) gracefully
* Sends error feedback to the canvas UI

---

## ✅ Final Prompt (Wrap Everything)

**Prompt:**

Wrap this into a **cohesive, scalable codebase**:

* Modular folders
* State managed via context
* Working drag-and-drop canvas
* Secure API proxies for AI
* Save/load/export functionality
* Fully responsive layout

> Do **not** use placeholders or fake logic.
> Use `@todo` only where models will be plugged in and return fallback data.

Workflow must be accessible at:

* `/dashboard/workflows`
* `/dashboard/workflows/editor/:id` for editing