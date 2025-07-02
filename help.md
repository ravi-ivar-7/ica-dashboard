# 🧠 Interaction Rules Summary (Mobile + Touch Support)

| ✅ Condition           | 🤌 Gesture               | 🎯 Action               | 📌 Notes                                             |
|------------------------|--------------------------|--------------------------|------------------------------------------------------|
| Element is selected     | 1 finger drag            | Move selected element     | Track `touchmove` and update `x`, `y`                |
| Element is selected     | 2 finger pinch           | Zoom selected element     | Adjust element's scale       |
| No element selected     | 2 finger drag            | Pan canvas                | Update canvas offset               |
| No element selected     | 2 finger pinch           | Zoom canvas               | Adjust canvas zoom/scale                             |
| No element + touch grip | 1 finger drag on corner  | Resize canvas             | Handle bottom-right grip touch logic                 |
| Any state               | Tap on element           | Select element            | Use `touchstart` for mobile tap support              |
| Any state               | Tap outside element      | Deselect all elements     | On `touchend`, check if tap was outside any element  |
| Element is selected       | 2 finger pinch or edge/corner drag | Resize image            | Allow edge/corner handles + pinch-to-resize gesture         |

---

## 🚫 Disable Browser Zoom & Scroll (Canvas Only)

🔒 Core Rules  
Do not modify layout or UI outside canvas.  
Do not remove existing logic—only extend for touch.  
**Canvas Scope Only**: Do **not** apply global restrictions — only inside the canvas container.  
Keep all changes modular and scoped to canvas or selected elements only.

---

## 👁️ Add Visual Feedback (During Interaction)

### 📦 Bounding Box / Outline  
When an element is selected, show a border or bounding box around it.

### 📏 Drag/Resize Feedback  
Show live tooltip/overlay showing:  
- `x`, `y` (position)  
- `width`, `height` (size)  
Update values in real time while dragging/resizing.  
Hide this feedback after interaction ends.

### ⬜ Canvas Resize Grip  
Add a bottom-right corner grip icon or zone.  
Allow touch-drag on this grip (when no element is selected) to resize the canvas.

---

## 🔒 Core Rules

- Do not modify layout or UI outside the canvas area.  
- Do not remove or rewrite existing logic — extend it for touch support only.  
- Do not introduce global CSS or JS hacks.  
- All enhancements must be:  
  - modular  
  - scoped to the canvas and selected elements  
  - isolated from unrelated systems  
- Give complete code, no placholder
---

## 🚫 Disable Browser Zoom & Scroll (Canvas Only)  
Canvas Scope Only: Do not apply global restrictions—only inside canvas area.




✅ Mobile Interaction Behavior Summary (Points Only)

When an element is selected (below effect for element sould no affect canva size, postion etc.3) : 
 
Moving Handles: if elments is selected: draging using 1 fingure to moves it. (no effect on canva)
🔲 Resize Handles: Use corner and edge handles to resize in any direction with touch. (no effect on canva)

📏 Position & Size Bar: Shows live x, y, width, height during drag/resize, appears at top of screen.

When no element is selected (or user taps outside):
🤚 1-Finger Drag: Pans the entire canvas.

⬜ Bottom-Right Canvas Grip/ or 2 fingue zoom: Enables canvas resize via drag gesture.

Assumption:
💻 The code for drag, resize, zoom, and canvas interactions already works well on desktop.

🧩 Your Instruction:
➡️ Now add full mobile touch support —

Implement everything above with actual working code.

Do not use placeholders or stubs — provide real, production-ready code.