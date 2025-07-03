🎯 Objective:  
Build the complete visual Workflow Editor as specified in the `.lovable/*.md` documentation files. Implement only the `workflow` feature.

📁 Required Reference Files (already in .lovable folder):  
- `workflow-enter.md` -> Entery point
- `workflow-project-init.md` → Folder structure & routing  
- `workflow-canvas-spec.md` → Canvas behavior, zoom, pan, drag  
- `workflow-responsive-layout.md` → Mobile-first rules  
- `workflow-nodes.md` → Full node list, parameters, and behaviors  
- `workflow-secrets.md` → Secure secret handling (server-only)  
- `workflow-execution.md` → Save, Run, Export, Preview handling  
- `workflow-testing.md` → Test methods and error handling per node  

---

🛠️ Implementation Guidelines:

- ✅ Use real node inputs/outputs, no placeholder logic
- ✅ Follow modular architecture
- ✅ Canvas must support drag, zoom, connect, grid snap, mobile touch
- ✅ Nodes must support minimize/expand, config, connect, drag
- ✅ Securely fetch keys server-side only (BYOK supported)
- ✅ Responsive layout: drawers on mobile, sticky sidebars on desktop
- ✅ Enable Save, Run, Preview, Export, Exit with status feedback
- ✅ Each node must include a `runTest` method per its service
- ✅ Use `WorkflowContext` for all shared canvas/node state
- ✅ Use only defined routes: `/workflows`, `/workflow/editor/:id`

---

🚫 Do Not:
- ❌ Modify components, services, or features outside of `workflow`  
- ❌ Use `console.log`, hardcoded keys, or mock outputs  
- ❌ Merge UI and logic — keep UI in components, logic in services  
- ❌ Skip any `.lovable/*.md` instructions

---

✅ Deliverables:
- Fully functional drag-and-drop Workflow Editor  
- Production-grade node execution flow with live API integration  
- Secure backend handling for API credentials  
- Mobile and desktop responsive UI  
- Clean, maintainable, modular code matching folder structure  

---

🚀 Begin implementation now. All instructions are defined inside `.lovable/` directory. Do not infer, guess, or invent logic beyond what's specified.
