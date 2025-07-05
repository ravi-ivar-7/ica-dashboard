# Core Architecture

## Event-Driven Pipeline System

These platforms follow an event-driven architecture where data flows through a series of connected nodes in a directed acyclic graph (DAG). Each workflow is essentially a pipeline that processes data step by step.

## Node-Based Visual Programming

The fundamental building block is the "node" - a self-contained unit that performs a specific function. Users drag and drop nodes onto a canvas and connect them to create workflows.

## Node Structure and Types

### Node Categories:

* **Trigger Nodes**: Start workflows (webhooks, schedules, file watchers, API polling)
* **Action Nodes**: Perform operations (API calls, data transformation, file operations)
* **Logic Nodes**: Control flow (conditions, loops, switches, filters)
* **Data Nodes**: Handle data manipulation (merge, split, aggregate, format)

### Node Internal Structure:

* **Input/Output Schema**: Defines expected data format
* **Configuration Panel**: User-configurable parameters
* **Execution Logic**: The actual operation performed
* **Error Handling**: How failures are managed
* **Authentication**: OAuth, API keys, connection credentials

## ✅ Workflow Node Execution & Behavior Prompts

### 🔁 Node Execution

**Prompt:**
Build a node execution engine that:

* Recursively runs nodes from upstream → downstream
* Only executes nodes whose inputs are satisfied (connected or default)
* Skips unconnected or invalid nodes and logs reason
* Updates canvas in real-time with run status: `running`, `done`, `error`

### 🧠 Node Connection Prompt

**Prompt:**
Implement a visual connection system that:

* Enforces connection rules: output type must match input type
* Supports single or multi-input ports depending on node design
* Highlights valid targets during drag
* Displays live animated arrows between connected ports

### 🎛️ Node Input/Output Behavior Prompt

**Prompt:**
Define standard behavior for node inputs/outputs:

* Inputs: Can be default (user-filled) or connected (takes value from another node)
* Outputs: Must always emit value or error
* Support:

  * Required vs optional inputs
  * Input validation
* UI reflects real-time values (live preview, status pill)

### 📊 Node Test Coverage Prompt

**Prompt:**
Write test cases for each node type:

* Load node with sample config
* Inject mock inputs
* Validate expected output shape and status
* Simulate error (e.g., missing API key) and verify fallback
* Ensure position, input, and output persist after reload

### 🧽 Node Graph Consistency Prompt

**Prompt:**
On graph save/load:

* Persist full structure
* Validate that:

  * All node IDs are unique
  * Connections refer to valid nodes
  * Input/output types match
* Auto-fix common issues: orphan nodes, broken connections
* Restore scroll, zoom, and panel state with the canvas

### ⚠️ Error Handling & Debug Prompt

**Prompt:**
Enable full error visibility:

* Catch errors inside each node and tag the node with `status: "error"`
* Display tooltip or warning banner on the node
* In canvas debug mode:

  * Red outlines on broken nodes
  * Dotted connections for invalid flows
  * Hover shows last output, error message

### 🛍️ Mobile Behavior Prompt

**Prompt:**
Ensure node interactions work on mobile:

* Tap to expand/minimize
* Drag with single finger
* Connect with long-press + drag
* Zoom with two fingers

### 📂 Node Modularization Prompt

**Prompt:**

* All nodes must be defined independently, must be live and modularised in:
  `/WorkFlowModule/Nodes/{NodeName}/.ts`
* Handle secret fetching inside service
* Avoid logic inside components

### Important Implementations

* Connections should be from output to input and must persist visually
* One output can connect to multiple inputs
* Bézier curve preview while dragging
* Proper event propagation and prevention
* Type-based color coding
* Real-time data flow representation
* Enhanced visual depth

### 🧱 Node UI Structure

#### Header Section

* **Left**: Minimize button, Close/Delete button
* **Right**: Node icon/logo, Truncated node name
* **Status**: Dot indicator - Green (Success), Yellow (Running), Red (Error), Gray (Idle)
* **Settings**: Gear icon for configuration if available

#### Description Section

* Max 2-3 lines with ellipsis (`...`) if truncated
* Expand/Collapse toggle for full view
* Quick action icons: Copy ID, Duplicate node

#### Main Area

##### Left Panel: Input Fields

* **Required Inputs** (top, always visible)

  * Red asterisk `*` indicates required
  * Field name + type badge (e.g., text, number)
  * Left-edge dot for connections
  * Validation status icon (✓ connected, ⚠ missing, ✗ invalid)

* **Optional Inputs** (collapsible section at bottom)

  * Accordion-style group
  * Field count badge (e.g., +3 more)
  * Same structure as required fields

##### Right Panel: Outputs

* **Output Bundles**

  * Grouped (e.g., "Media", "Metadata")
  * Collapsible headers with item count
  * Connection dots on right edge

* **Each Output Field**

  * Field name + type badge
  * Truncated value preview
  * Size indicator if large data
  * Shows number of connected nodes

#### Connection Interface

* **Input Dots** (left side):

  * Color-coded by type
  * Highlight on hover
  * Show count if multiple allowed

* **Output Dots** (right side):

  * Color-coded
  * Connection lines to targets
  * Indicate branching if multiple

#### Visual & Interactive Enhancements

* **Field Hierarchy**: Indented with expand/collapse
* **Type Indicators**:

  * Blue: text, Green: file, Purple: array, etc.
  * Emoji icons: 📄 doc, 🎥 video, 📊 data
  * Required asterisk in red
* **States**:

  * Hover: highlight
  * Drag: move indicators
  * Async: loading spinners
  * Errors: red borders

#### Footer

* Last run timestamp
* Run count
* Settings (gear), Help (?), Debug view (eye)

#### Responsive Behavior

* Collapsed view shows essentials only
* Expanded shows all
* Auto-resizing height
* Scrollable overflow

#### Connection Flow UX

* Highlight compatible points
* Drag preview with direction
* Type validation on-the-fly
* Disable incompatible links

## 🚀 HOW TO CONNECT NODES

### Step-by-Step

1. Click and hold on output connector (right side of node)
2. Drag to show connection line
3. Release on valid input connector (left side of another node)
4. Connection is established and persistent

### Features

* One output → multiple inputs
* Visual feedback during drag
* Type-based color validation
* Double-click or long-touch to delete connection

### 🔒 Security & API Integration

* Server-side secret storage (BYOK support)
* Secure RESTful API integration with retries
* Token-based authentication
* Full input sanitization and validation

### 🧪 Testing & Quality

* Test framework for all nodes
* Simulated failures and recovery
* Graph-wide validation
* Performance and runtime tracking

## ✅ Considerations

### 1. Production-Ready Architecture

* Modular, maintainable
* Robust error handling
* Optimized for large workflows
* Strict TypeScript usage

### 2. Advanced Canvas System

* GPU-accelerated rendering
* Grid snapping
* Real-time Bézier connection drawing
* Mobile-friendly touch interactions

### 3. Node System

* 20+ API-integrated node types
* Dynamic validated parameters
* Built-in test coverage
* Extensible node framework

### 4. Mobile Design

* Responsive layout
* Gestures: pinch zoom, drag, tap
* Slide-out panels
* Compact toolbars

### 5. Enterprise Security

* Secrets handling
* Secure authentication
* Input validation
* BYOK support
