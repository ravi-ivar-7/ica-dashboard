
## 📊 **COMPREHENSIVE NODE SYSTEM**

### **20+ Professional Node Types**
- **Input Nodes**: Text, Image, Video, Audio, HTTPS Request
- **Generation Nodes**: Text/Image/Video/Audio Generation,TTS
- **Utilities**: Delay, Condition, Loop, Merge
- **Styles and Edits Nodes** : 
- **Output Nodes**: Save File, Webhook, Export

### **Flexible Input Methods**
- ✅ **Manual input**: Direct parameter entry in properties panel
- ✅ **Node connections**: Data flows from connected nodes automatically
- ✅ **API integration**: HTTPS Request node for external data
- ✅ **Intelligent fallbacks**: Continues execution with default values

---

## 🧩 List of Important Workflow Nodes

---

### 1. 📥 Input Nodes

#### 1.1 Text Input Node

**Purpose:** Accept user or system-provided text for further processing

* **Use Cases:** Prompts, descriptions, scripts

#### 1.2 Image Input Node

**Purpose:** Ingest images into the workflow

* **Sources:** Upload, URL, cloud import
* **Formats:** JPG, PNG, WebP

#### 1.3 Video Input Node

**Purpose:** Import video clips for analysis or editing

* **Sources:** Upload, YouTube link, cloud services
* **Formats:** MP4, MOV, WebM

#### 1.4 Audio Input Node

**Purpose:** Accept audio files or streams for transcription or enhancement

* **Formats:** MP3, WAV, AAC

#### 1.5 HTTPS Request Node

**Purpose:** Fetch external data (e.g., JSON, assets, text) via APIs

* **Options:** Headers, query params, authentication methods

---

#### 1.6 File Upload Node

**Purpose:** Upload raw files into the workflow

* **Supported Formats:** `.txt`, `.csv`, `.json`, `.zip`

---

#### 1.7 Form Input Node

**Purpose:** Capture structured user input via forms

* **Fields:** Text, dropdown, checkbox, file
* **Use Cases:** Collect prompts, metadata, preferences

---

#### 1.8 Webhook Inbound Node

**Purpose:** Trigger workflows via external systems

* **Protocols:** HTTP, Webhook URL
* **Use Cases:** Receive events from apps like Zapier, CRMs


---

### 2. 🎓 Training Nodes

#### 2.1 Training Node

**Purpose:** Fine-tune models (LoRA, DreamBooth)

* **Inputs:** Dataset, model, settings (epochs, lr, batch)
* **Outputs:** LoRA weights or fine-tuned model

---

### 3. ⚙️ Generation Nodes

#### 3.1 Image Generation Node

**Purpose:** Generate images from prompts/Images, etc

* **Subtypes:** Text-to-Image, Image-to-Image
* **Options:** Model, resolution, seed, format

#### 3.2 Image Generation with LoRA

**Purpose:** Stylized image generation with LoRA

* **Inputs:** Prompt, LoRA, resolution

#### 3.3 Video Generation Node

**Purpose:** Generate videos from text/image

* **Subtypes:** Text-to-Video, Animate image, Extend video
* **Models:** Veo, Kling, Sora

#### 3.4 Stylized Video Generation Node

**Purpose:** Apply custom style to videos

* **Inputs:** Prompt, style, resolution, duration

#### 3.5 Voiceover Generation Node

**Purpose:** AI voiceovers from script/Text/Voice

* **Features:** Select voice, sync with scenes, upload custom

#### 3.6 Multi-language Voiceover Node

**Purpose:** Voiceovers in multiple languages

* **Use Case:** Global audience, subtitles

#### 3.7 Music Node

**Purpose:** Add or sync music to scenes

#### 3.8 Text Summarization Node

**Purpose:** Summarize long content

* **Use Case:** Tags, voiceovers, descriptions

#### 3.9 Prompt Helper Node

**Purpose:** Convert basic prompt into cinematic detail

* **Example:** "City at night" → "A neon-lit futuristic skyline..."

#### 3.10 Speech-to-Text Node

**Purpose:** Convert spoken content in video to text

* **Use Cases:** Captions, subtitles, search

---

### 4. 🧰 Editor Nodes

#### 4.1 Edit Node

**Purpose:** Non-linear edits

* **Features:** Trim, split, speed, crop

#### 4.2 Style/Filter Node

**Purpose:** Apply LUTs, visual styles

* **Types:** Presets and manual controls

#### 4.3 Transition Node

**Purpose:** Scene transitions (fade, zoom)

#### 4.4 Auto-Cut Node

**Purpose:** Auto-cut clips to music beats

#### 4.5 Text & Overlay Node

**Purpose:** Add branding, animated text

* **Features:** Fonts, color, animation

#### 4.6 Template Node

**Purpose:** Use pre-defined timelines (reels, trailers)

#### 4.7 Brand Kit Node

**Purpose:** Apply consistent branding

---

### 5. 🧰 Utility Nodes

#### 5.1 Scene Detection Node

**Purpose:** Auto-detect video scenes

#### 5.2 NSFW/Content Safety Node

**Purpose:** Flag unsafe content

#### 5.3 Metadata Tagging Node

**Purpose:** Auto-tag assets with metadata

#### 5.4 Condition Node

**Purpose:** Branch logic dynamically

#### 5.5 Loop Node

**Purpose:** Repeat actions over batch inputs

#### 5.6 Automation Trigger Node

**Purpose:** Trigger actions automatically based on workflow events

* **Use Cases:** Start workflows on file upload, completion, or custom events

#### 5.7 Merge Node

**Purpose:** Combine multiple inputs (media/text) into a single output

* **Use Cases:** Merge audio layers, blend image variants

#### 5.8 Delay Node

**Purpose:** Introduce a wait before the next step

* **Settings:** Delay duration (in ms or sec)

#### 5.9 Timer Node

**Purpose:** Schedule steps to run at specific times

* **Use Cases:** Daily posts, weekly reports, timed triggers

---

### 5. ☁️ Output Nodes

#### 5.1 Export Node

**Purpose:** Final render

* **Options:** Resolution, format, quality

#### 5.2 Cloud Sync Node

**Purpose:** Sync to Google Drive, Dropbox, IPFS

#### 5.3 Social Push Node

**Purpose:** Auto-publish to social media

* **Platforms:** YouTube, Instagram, TikTok

#### 5.4 Webhook / API Trigger Node

**Purpose:** Trigger external actions via API


* **Examples:** Notify, upload, connect with Zapier

#### 5.5 Email Notification Node

**Purpose:** Send email alerts with links or summaries

* **Use Cases:** Workflow status, result delivery, approvals

