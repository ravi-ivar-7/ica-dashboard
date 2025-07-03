## 🧪 Workflow Node Testing & Error Handling

---

### ✅ Testing Standards for All Nodes

Each node must include a dedicated test function:

```ts
function runTest(input: NodeInput): NodeOutput
```

This test should:

* Validate correct execution of the node logic
* Return meaningful output (image, text, video, etc.)
* Gracefully handle missing/invalid input

---

### 🛠️ Example Test Code

```ts
import { runNode } from "../nodes/image-generation";

const input = {
  prompt: "A futuristic skyline at sunset",
  resolution: "1024x1024",
};

const result = await runNode(input);
expect(result).toHaveProperty("url");
```

---

### ❗Error Handling Requirements

All nodes must:

* Catch execution errors internally
* Surface a structured error to the canvas context
* Never crash the entire app

Error object shape:

```ts
{
  status: "error",
  message: "Model unavailable or invalid input",
  nodeId: "image-123"
}
```

---

### 🧠 Canvas Debug Mode

Enable a debug mode on the canvas that:

* Visually shows active connection paths
* Highlights failed nodes in red
* Shows status: "idle", "running", "done", "error"
* Allows hover-over preview for any completed node output

---

### 🧪 Test Coverage Checklist

For each node type:

* [ ] Has a `runTest()` unit test with success + failure cases
* [ ] Handles invalid/missing input gracefully
* [ ] Returns valid output with correct shape (string, URL, file, etc.)
* [ ] Surfaces structured error on failure
* [ ] Integrates with canvas state updates (nodeStatusMap, connections)
* [ ] Visually reflects status in canvas debug mode (color, badge, tooltip)
* [ ] Snapshot test included for visual consistency (image/video outputs)
* [ ] Input schema validation is enforced before node runs
* [ ] Output schema validation is applied before use

---

### 🧰 Optional: Add Snapshot Test

Optionally store historical outputs for visual/image nodes for regression:

```ts
expect(output.url).toMatchSnapshot();
```

---

✅ This ensures your workflow system is stable, debuggable, and future-proof for scale.
