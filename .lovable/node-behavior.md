## ✅ Workflow Node Execution & Behavior Prompts

---

### 🔗 Node Consistency Prompt

**Prompt:**
Ensure every node in the system:

* Has a consistent structure (`id`, `type`, `inputs`, `outputs`, `position`, `metadata`)
* Can serialize/deserialize cleanly into a JSON graph
* Emits output using a standard format:

```ts
{
  output: { type: 'image' | 'video' | 'text' | 'audio', value: string },
  status: 'done' | 'error',
  metadata: {}
}
```

* Fails gracefully with error states and does not break other nodes.

---

### 🔁 Node Execution Prompt

**Prompt:**
Build a node execution engine that:

* Recursively runs nodes from upstream → downstream
* Only executes nodes whose inputs are satisfied (connected or default)
* Skips unconnected or invalid nodes and logs reason
* Stores output in centralized `WorkflowContext` with nodeId as key
* Updates canvas in real-time with run status: `running`, `done`, `error`

---

### 🧠 Node Connection Prompt

**Prompt:**
Implement a visual connection system that:

* Enforces connection rules: output type must match input type
* Supports single or multi-input ports depending on node design
* Highlights valid targets during drag
* Updates `WorkflowContext.connections[]` with:

```ts
{
  fromNodeId: string,
  fromOutput: string,
  toNodeId: string,
  toInput: string
}
```

* Displays live animated arrows between connected ports

---

### 🎛️ Node Input/Output Behavior Prompt

**Prompt:**
Define standard behavior for node inputs/outputs:

* Inputs: Can be default (user-filled) or connected (takes value from another node)
* Outputs: Must always emit value or error
* Support:

  * Required vs optional inputs
  * Input validation (e.g., resolution must be power of 2)
* UI reflects real-time values (live preview, status pill)

---

### 📊 Node Test Coverage Prompt

**Prompt:**
Write test cases for each node type:

* Load node with sample config
* Inject mock inputs
* Call `runNode(node, input)`
* Validate expected output shape and status
* Simulate error (e.g., missing API key) and verify fallback
* Ensure position, input, and output persist after reload

---

### 🧹 Node Lifecycle Prompt

**Prompt:**
Each node should follow a predictable lifecycle:

1. **Init** → Rendered on canvas, shows default state
2. **Connect** → Inputs connected, UI updates
3. **Configure** → User fills parameters
4. **Run** → Execution triggered manually or auto
5. **Emit** → Output displayed or sent to downstream nodes
6. **Destroy** → Node removed, cleans up all references

Track lifecycle events inside `WorkflowContext` for debugging and timeline.

---

### 🧽 Node Graph Consistency Prompt

**Prompt:**
On graph save/load:

* Persist full structure: `nodes[]`, `connections[]`, `settings`
* Validate that:

  * All node IDs are unique
  * Connections refer to valid nodes
  * Input/output types match
* Auto-fix common issues: orphan nodes, broken connections
* Restore scroll, zoom, and panel state with the canvas

---

### ⚠️ Error Handling & Debug Prompt

**Prompt:**
Enable full error visibility:

* Catch errors inside each node and tag the node with `status: "error"`
* Display tooltip or warning banner on the node
* In canvas debug mode:

  * Red outlines on broken nodes
  * Dotted connections for invalid flows
  * Hover shows last output, error message

---

### 🛍️ Mobile Behavior Prompt

**Prompt:**
Ensure node interactions work on mobile:

* Tap to expand/minimize
* Drag with single finger
* Connect with long-press + drag
* Zoom with two fingers
* Auto-scroll canvas when dragging near edge
* Double-tap resets node or recenters

---

### 📂 Node Modularization Prompt

**Prompt:**
All node logic must live in:

```
component/dashboard/workflow/services/nodes/{nodeType}.ts
```

* Each must export:

```ts
export function runNode(config: NodeConfig, input: NodeInput): Promise<NodeOutput>
```

* Handle secret fetching inside service
* Avoid logic inside components
