🎯 Objective:  
Build the complete visual Workflow Editor like n8n and other automaiton, no code platform as specified in the `/src/WorkFlowModule/Reference` md files. Implement only in the `WorkFlowModule`

📁 Required Reference Files:  
- `init.md` -> Entery point
- `Overview.md` → WorkFlow Project overview
- `UI_UX.md` → Canvas behavior, zoom, pan, drag  
- `NodeTypes.md` → Full node list, parameters, and behaviors  
- `Secrets.md` → Secure secret handling (server-only)
- `ResonsiveLayout.md` -> Layout 

---

🛠️ Implementation Guidelines:

- Use real node inputs/outputs, no placeholder logic
-  Follow modular architecture
-  Canvas must support drag, zoom, connect, grid snap, mobile touch
-   Node must spoort real connection, data should flow from one node to other.
-  Nodes must support minimize/expand, config, connect, drag
-  Securely fetch keys server-side only (BYOK supported)
-  Responsive layout: drawers on mobile, sticky sidebars on desktop
-  Enable Save, Run, Undo, Redo Preview, Export, Exit with status feedback
-  Each node must include a `runTest` method per its service
- Use CineFlowModule for layout and UI inspiration
- Use Fallback data if api call fails(For now don't implement Backend  )
- Node should be working(even if mock data is used), proper connections, data flow, etc
- Don't use exteranl library/framwork unless is it necessary, reactflow and lucied-react are already used, so you can use those.


---

🚫 Do Not:
- ❌ Modify components, services, or features outside of `WorkFlowModule`  
- ❌ Use `console.log`, hardcoded keys, or mock outputs  
- ❌ Merge UI and logic — keep UI in components, logic in services  

---

✅ Deliverables:
- Fully functional drag-and-drop Workflow Editor with node fully functional, connections, dataflows, etc
- Production-grade node execution flow with live API integration  
- Secure backend handling for API credentials  
- Mobile and desktop responsive UI  
- Clean, maintainable, modular code matching folder structure  

---

🚀 Begin implementation now. Do not infer, guess, or skip logic or any implementation.