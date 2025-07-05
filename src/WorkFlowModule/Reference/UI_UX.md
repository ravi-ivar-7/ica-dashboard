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

## ✅ Workflow Implementation

To implement Workflows inside the project, we want to define key reusable workflow nodes that users or automation systems can chain together to perform creative or generative tasks automatically.

### 🧠 Core Philosophy

Every node, interaction, and canvas element must be:

* 💡 **Real**: No placeholders, stubs, or mock logic
* 🔁 **Interactive**: Executable nodes with real input/output
* 🚀 **Production-ready**: Scalable, tested, and connected to actual AI models or APIs
* 📱 **Responsive**: Fully usable on mobile, tablet, and desktop

### 🧱 Modular & Scalable Code

* ✅ Do not write large logic in a single file
* ✅ Split code into logical folders
* ✅ Use subfolders wherever necessary to keep things modular, scalable, and clean
* ✅ Avoid placing logic, UI, and API in the same file — separate by responsibility
* ✅ Each node, panel, and service must be in its own isolated module
* ✅ Components should handle only UI, logic goes in service layer
* ✅ API routes must delegate to services, not contain logic directly

### 🔁 Node Implementation Standards

**❌ Do NOT:**

* Use fake data or placeholders
* Render nodes that are UI-only or disconnected
* Leave handlers like onRun, onConnect, onUpdate empty
* Use console.log, TODO, or hardcoded mocks in output
* Skip parameters or assume static inputs
* Build "demo-only" preview nodes
* Use test JSON not returned by actual models

**✅ DO:**

* Integrate with real AI models or APIs (e.g. SDXL, OpenAI, Veo, Whisper, Runway)
* Validate all user inputs (e.g., prompt, resolution, file)
* Use server runtime proxy to securely handle API keys
* Return real media outputs (image/video/audio/text) with correct formats

**✅ Node Views:**

* Minimized: Show only node title or name (small footprint)
* Expanded: Full content — inputs, parameters, outputs, editable and previewable
* 🔁 Toggle: Users can toggle views via UI control (⬍ icon or double-click)

### ⚙️ Integration Rules

* 🔗 Use live API for that model (OpenAI, Stability, Google, etc.)
* 🔐 Secrets fetched securely on server only
* 🧠 Inputs: prompt, image, duration, voice, style, fps
* 🖼️ Outputs:

  * Image: PNG/JPG
  * Video: MP4/WebM
  * Audio: MP3/WAV
  * Text: Markdown, plain, JSON

### 🧩 Canvas Behavior (Drag, Zoom, Mobile)

**✅ Must Support:**

* 🧭 Centered, zoomable, scrollable in both axes
* 📦 Draggable, connectable nodes
* ⚡ Real-time connection lines between inputs/outputs
* 🧲 Auto-align and snap-to-grid
* 🔍 Mobile-compatible: drag, pan, pinch-to-zoom
* 🚫 Disable body scroll while interacting with canvas on touch
* ✨ Smooth gesture-based mobile experience

**🧱 Responsive Layout:**

| Area        | Mobile                    | Desktop                    |
| ----------- | ------------------------- | -------------------------- |
| Canvas      | Fullscreen, scrollable    | Centered view, zoomable    |
| Left panel  | Sticky header: "🧩 Nodes" | Full panel with categories |
| Right panel | Sticky header: "⚙️ Props" | Full property editor       |
| Top Nav     | Hamburger menu            | Full toolbar visible       |

### 🔐 Secret & Credential Handling

**Backend-Only Rule:**

* 🔒 All keys are server-managed
* 📦 User-submitted keys stored in encrypted vault (BYOK)

### 💾 Save, Export & Preview

| Action     | Behavior                                          |
| ---------- | ------------------------------------------------- |
| Save       | Stores node configs, links, positions, parameters |
| Preview    | Executes all connected nodes, renders output      |
| Export     | Runs export logic: format, render, compress       |
| Versioning | Stores snapshot history (JSON) with timestamps    |

### 🧪 Testing, Debugging & Error Handling
* ✅ Handle errors:

  * ❌ Invalid prompt
  * ❌ Model unavailable
  * ❌ API quota exceeded
  * ❌ Missing input/connection
* ✅ Canvas debug mode:

  * Visual flow with active paths
  * Colored node status
  * Hover-over test preview

### 🧭 UX Guidelines

* ⚙️ Left Panel: Node Library → sticky + collapsible (label visible)
* 🎛️ Right Panel: Node Properties → sticky + collapsible
* 🖥️ Top Toolbar: Title + Save + Run + Preview + Export + Exit + Undo + Redo
* 📱 Mobile: Side panels collapse to swipe drawers

### 🎨 PROFESSIONAL USER EXPERIENCE

**Canvas Operations**

* ✅ Smooth drag & drop: Intuitive node placement
* ✅ Zoom & pan: Mouse wheel zoom, drag to pan
* ✅ Right click / long press on node: Show node context menu
* ✅ Grid snapping for precise alignment
* ✅ Full touch gesture support

**Mobile-First Design**

* ✅ Responsive layout
* ✅ Touch-friendly: Large targets
* ✅ Slide-out panels
* ✅ Pinch-to-zoom, drag-to-pan for canvas & nodes

**Workflow Management**

* ✅ Save/Load: Continuous localStorage and 10s interval backend sync
* ✅ Import/Export: JSON workflow files
* ✅ Real-time execution with status
* ✅ Redo-Undo via local history

### 📍 Location in App

Dashboard → Sidebar → \[ Workflow ]

### 🧭 Workflow Navigation

1. Click "Workflow" in Sidebar
2. Home shows:

   * 📄 Info Block
   * ➕ \[Create New Workflow] button
3. Modal:

   * Title (Text)
   * Tags (Optional)
   * Settings (Auto run toggle, public/private)
4. On submit → Go to `/workflows/editor/:id`

### 🧩 Workflow Editor UI Layout

```
|-----------------------------------------------------------------------------------|
|                            TOP NAV / HEADER (Sticky)                             |
|-----------------------------------------------------------------------------------|
|  ◉ Workflow Title     ▶ Run ▶ Save ▶ Preview ▶ Global Settings ▶ Exit           |
|-----------------------------------------------------------------------------------|
| 🧩 Nodes [</>]          |   Drag & Connect Workflow Nodes (Canvas)    | ⚙️ Properties [>/<] |
|-----------------------|---------------------------------------------|------------------|
| (if expanded):        |                                             | (if expanded):   |
|  - Input Nodes        |    • Node graph editor                      |  - Title         |
|  - AI Models ▼        |    • Zoom & Pan                             |  - Parameters    |
|  - Tools ▼            |    • Connect arrows between nodes           |  - Output Type   |
|  - Output Nodes ▼     |    • Context menu (Duplicate, Delete, etc.)|  - Custom Code   |
|-----------------------|---------------------------------------------|------------------|
```

### 🧱 Left Panel – Node Library
* 🔍 Search bar
* Accordion-style:
  * 🟢 Input Nodes: Upload, Text, API, Image, Video, Audio input, etc
  * 🧠 Generation Nodes: Text/Image/Video Gen
  * 🔧 Utilities: Delay, Filter, Condition
  * 📤 Output: Save, Display, Webhook, Post


### 🖼️ Center – Workflow Canvas

* Drag & drop nodes
* Arrows for connections
* Live status (idle, error, done)
* Context menu on right-click
* Zoom & pan support

### ⚙️ Right Panel – Node Properties

* Tabs / collapsible
* General: Title, ID
* Parameters: prompt, model
* Output: format, target
* Advanced: retries, timeout

### 🔄 Global Tabs / Settings

* Variables (shared)
* Triggers (on upload, etc.)
* Schedule (cron, repeat)

### ⚙️ Canvas System Prompt

Implement a scrollable, zoomable canvas:

* Pinch-to-zoom and drag
* Smooth on all screen sizes
* Grid snapping and data flow lines
* Disable body scroll during canvas interaction

### 📱 Responsive Layout Prompt

Design workflow editor for mobile:

* Collapsible side panels
* Hamburger toolbar
* Optimized touch interaction
* Prevent body scroll during gesture

## 🔒 PRODUCTION-READY QUALITY

**Error Handling**

* ✅ Graceful fallbacks
* ✅ Error boundaries
* ✅ Clear feedback
* ✅ Recovery mechanisms

**Performance**

* ✅ Optimized rendering
* ✅ Memory cleanup
* ✅ Hardware-accelerated animations
* ✅ Efficient execution engine

**Code Quality**

* ✅ TypeScript
* ✅ Modular
* ✅ Best practices
* ✅ Well documented

### Execution Engine

* Frontend: Input, utility, output nodes
* Backend: AI/API nodes via secure calls
* Fallback system for resiliency
