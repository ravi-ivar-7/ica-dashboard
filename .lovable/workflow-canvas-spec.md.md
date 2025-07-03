## ✅ Workflow Implementation

To implement Workflows inside the project, we want to define key reusable workflow nodes that users or automation systems can chain together to perform creative or generative tasks automatically.

---

### 🧠 Core Philosophy

Every node, interaction, and canvas element must be:

* 💡 **Real**: No placeholders, stubs, or mock logic
* 🔁 **Interactive**: Executable nodes with real input/output
* 🚀 **Production-ready**: Scalable, tested, and connected to actual AI models or APIs
* 📱 **Responsive**: Fully usable on mobile, tablet, and desktop

---

### 🧱 Modular & Scalable Code

* ✅ Do not write large logic in a single file
* ✅ Split code into logical folders
* ✅ Use subfolders wherever necessary to keep things modular, scalable, and clean
* ✅ Avoid placing logic, UI, and API in the same file — separate by responsibility
* ✅ Each node, panel, and service must be in its own isolated module
* ✅ Components should handle only UI, logic goes in service layer
* ✅ API routes must delegate to services, not contain logic directly

---

### 🔁 1. Node Implementation Standards

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

**🔁 Toggle:** Users can toggle views via UI control (⬍ icon or double-click)

---

### ⚙️ 2. Integration Rules

* 🔗 Use live API for that model (OpenAI, Stability, Google, etc.)
* 🔐 Secrets fetched securely on server only
* 🧠 Inputs: prompt, image, duration, voice, style, fps
* 🖼️ Outputs:

  * Image: PNG/JPG
  * Video: MP4/WebM
  * Audio: MP3/WAV
  * Text: Markdown, plain, JSON

---

### 🧩 3. Canvas Behavior (Drag, Zoom, Mobile)

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

---

### 🔐 4. Secret & Credential Handling

**Backend-Only Rule:**

* 🔒 All keys are server-managed
* 📦 User-submitted keys stored in encrypted vault (BYOK)

---

### 💾 5. Save, Export & Preview

| Action     | Behavior                                          |
| ---------- | ------------------------------------------------- |
| Save       | Stores node configs, links, positions, parameters |
| Preview    | Executes all connected nodes, renders output      |
| Export     | Runs export logic: format, render, compress       |
| Versioning | Stores snapshot history (JSON) with timestamps    |

---

### 🧪 6. Testing, Debugging & Error Handling

* ✅ Each node includes: `runNode(node, input)` test
* ✅ Handle errors:

  * ❌ Invalid prompt
  * ❌ Model unavailable
  * ❌ API quota exceeded
  * ❌ Missing input/connection
* ✅ Canvas debug mode:

  * Visual flow with active paths
  * Colored node status
  * Hover-over test preview

---

### 🧭 8. UX Guidelines

* ⚙️ Left Panel: Node Library → sticky + collapsible (label visible)
* 🎛️ Right Panel: Node Properties → sticky + collapsible
* 🖥️ Top Toolbar: Title + Save + Run + Preview + Export + Exit
* 📱 Mobile: Side panels collapse to swipe drawers

---

### ✅ Services Structure Instructions for Development

Organize inside `component/dashboard/workflow/services/`:

* `services/nodes/` → Node logic
* `services/auth/` → Key handling
* `services/api/workflow/` → Save/load APIs
* `services/api/export/` → Export logic

**Each function:**

* Returns dummy output (e.g., `{ url: 'https://dummy.asset' }`)
* Contains `@todo` for model integration
* Has correct input/output signatures
* Never includes hardcoded keys

---

### 📍 Location in App

* Dashboard → Sidebar → \[ Workflow ]

---

### 🧭 Workflow Navigation

1. Click "Workflow" in Sidebar → Open Workflow Home
2. Home shows:

   * 📄 Info Block
   * ➕ \[Create New Workflow] button
3. Modal:

   * Title (Text)
   * Tags (Optional)
   * Settings (Auto run toggle, public/private)
4. On submit → Go to `/workflows/editor/:id`

---

### 🧩 Workflow Editor UI Layout
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

---

### 🧱 Left Panel – Node Library

* Scrollable, accordion-style sections:

  * 🟢 Input Nodes: Upload, Text, API
  * 🧠 AI: Text/Image/Video Gen
  * 🔧 Utilities: Delay, Filter, Condition
  * 📤 Output: Save, Display, Webhook
* 🔍 Search bar

---

### 🖼️ Center – Workflow Canvas

* Drag-and-drop nodes
* Arrows between nodes
* Live execution status (idle, error, done)
* Right-click: Duplicate, Delete, Comment
* Zoom & pan with mouse/touch

---

### ⚙️ Right Panel – Node Properties

* Tabs/collapsible UI
* General → Title, ID
* Parameters → prompt, model
* Output → format, target
* Advanced → retries, timeout

---

### 🔄 Global Tabs / Settings

* Variables (global/shared)
* Triggers (e.g., on upload)
* Schedule (cron, repeat)
