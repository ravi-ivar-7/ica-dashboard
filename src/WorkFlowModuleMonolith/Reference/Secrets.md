## ✅ How to Handle Secrets in Nodes (Best Practices)

---

### 🔐 1. Never Store Secrets in the Node Directly

**❌ DO NOT:**

* Store API keys or tokens inside node configs or frontend props

**✅ Instead,** use secure references or api call with proper auth:

---

### 🔁 2. Use a Secure Backend Runtime Proxy

Nodes requiring secrets (e.g., Text-to-Image, Video Gen) **must call** a secure backend endpoint.

**🔐 Secrets are never exposed to the frontend.**

---

### 🧠 3. Include authProvider in Node Metadata

Every node should specify its authentication provider so the backend can pick the correct key automatically.

```json
{
  "type": "image-generation",
  "requiresAuth": true,
  "authProvider": "openai"
}
```

---

### 🔐 4. Support Bring Your Own Key (BYOK)

If users provide their own API keys (e.g., OpenAI, Stability):

* Store securely in a DB, encrypted per user
* Decrypt and use on backend only — never send to client

**Storing the key:**

```ts
saveEncryptedKey(userId, "openai", userProvidedKey);
```

**Using the key at runtime:**

```ts
const key = decryptKey(userId, "openai");
runNodeWithKey(node, key);
```

---

✅ These patterns ensure that sensitive credentials are **never exposed**, **easily managed**, and **securely used** during workflow execution.
