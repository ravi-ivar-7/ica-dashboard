## 📱 Workflow Responsive Layout Specification

---

### ✅ Mobile-First Design Principles

The entire workflow editor must be responsive and optimized for all devices.

#### 📱 On Mobile:

* **Left Sidebar**: Collapsed into a swipeable drawer with label: `🧩 Nodes [>]`
* **Right Sidebar**: Collapsed into a swipeable drawer with label: `⚙️ Properties [<]`
* **Top Toolbar**: Collapses into hamburger menu `☰` with dropdown options
* **Canvas**: Fullscreen, horizontally and vertically scrollable, zoomable via pinch/tap

#### 🖥️ On Desktop:

* **Left Sidebar**: Visible, sticky, scrollable. Holds categorized node list
* **Right Sidebar**: Visible, sticky, scrollable. Holds selected node properties
* **Top Toolbar**: Full-width, fixed, with buttons: `Save`, `Run`, `Preview`, `Export`, `Exit`
* **Canvas**: Centered view with grid snapping and zoom (Ctrl + mouse wheel)

---

### 🧩 Responsive UI Layout

| Area            | Mobile                      | Desktop                    |
| --------------- | --------------------------- | -------------------------- |
| **Canvas**      | Fullscreen, scrollable      | Centered view, zoomable    |
| **Left Panel**  | Sticky header, swipe drawer | Full panel with categories |
| **Right Panel** | Sticky header, swipe drawer | Full property editor       |
| **Top Nav**     | Hamburger menu              | Full toolbar visible       |

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

### 🎨 Adaptive Behavior

* Panels must collapse and animate smoothly
* Canvas should prevent page body scroll when interacted with on mobile
* Support one-finger drag (pan), two-finger zoom, and element drag on touch
* Ensure all buttons are large enough for touch targets (≥44px)

---

### 💡 Implementation Guidelines

* Use `window.innerWidth` or media queries to toggle layout states
* Use `useEffect` to bind touch/mouse listeners for canvas zoom/scroll
* Animate panel transitions using Tailwind or Framer Motion

---

✅ With this setup, your workflow editor will offer a seamless experience across all screen sizes and input types, from desktop browsers to mobile touch devices.
