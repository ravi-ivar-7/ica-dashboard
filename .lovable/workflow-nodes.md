## 🧩 List of Important Workflow Nodes

---

### 1. 🎓 Training Nodes

#### 1.1 Training Node

**Purpose:** Fine-tune models (e.g., LoRA, DreamBooth) for custom image/video generation.

* **Inputs:**

  * Dataset: images, videos, or captions
  * Model: base model to fine-tune (e.g., SDXL, Veo)
  * Settings: epochs, learning rate, batch size
* **Outputs:**

  * Fine-tuned model or LoRA weights
  * Style identifier usable in generation nodes

---

### 2. 📥 Media Input Nodes

#### 2.1 Media Input Node

**Purpose:** Load external media into the workflow

* **Types:**

  * Upload from device
  * Import from OpenModel/Studio Assets
  * Import from cloud (Google Drive, Dropbox)
* **Parameters:** file type, size, compression

---

### 3. 🖼️ Image Related Nodes

#### 3.1 Image Generation Node

**Purpose:** Generate images using AI models from text or image prompts

* **Subtypes:**

  * Text-to-Image → "A sunset over mountains" → full HD image
  * Image-to-Image → Style transfer, upscaling, variations
* **Options:**

  * Model Selector (e.g., SDXL, Kandinsky, Playground v2)
  * Prompt / Negative Prompt
  * Size & Resolution (e.g., 512×512, 1024×1024)
  * Seed / Sampler / Steps
  * Output Format: PNG / JPG

#### 3.2 Image Generation Node with Custom Style (LoRA)

**Purpose:** Use fine-tuned LoRA models to generate personalized/stylized images

* **Inputs:**

  * LoRA reference
  * Prompt
  * Resolution
* **Output:** Stylized PNG/JPG image

---

### 4. 🎬 Video Related Nodes

#### 4.1 AI Video Generation Node

**Purpose:** Generate videos from text or image prompts

* **Subtypes:**

  * Text-to-Video → "A robot walking through a forest" → animated scene
  * Image-to-Video (Animate stills)
  * Video Extension / Continuation
* **Options:**

  * Model: Veo, Kling, Sora, Seedance
  * Prompt
  * Duration, FPS
  * Resolution: 720p / 1080p
  * Output Format: MP4 / WebM

#### 4.2 Video Generation Node with Custom Style

**Purpose:** Create stylized videos using trained models or templates

* **Inputs:**

  * Custom style (e.g., anime, cinematic)
  * Prompt
  * Duration, resolution
* **Output:** Styled video clip (MP4/WebM)

---

### 5. 🎧 Voice Related Nodes

#### 5.1 Music Node

**Purpose:** Add or synchronize music to scenes

* **Subtypes:**

  * Add music track
  * Sync music to video scenes

#### 5.2 Voiceover Generation Node

**Purpose:** Generate narrations from scripts using AI voices

* **Features:**

  * Input script
  * Select voice preset
  * Sync to scenes or captions
  * Bonus: Upload custom voice file or auto-generate

#### 5.3 Multi-language Voiceover Node

**Purpose:** Generate voiceovers in multiple languages from one script

* **Use Cases:**

  * International audience reach
  * Subtitle + voice cloning

---

### 6. 📝 Text Based Nodes

#### 6.1 Speech-to-Text Node

**Purpose:** Convert spoken content in video to text

* **Use Cases:**

  * Auto-captions
  * Subtitle creation
  * Content indexing/search

#### 6.2 Text Summarization Node

**Purpose:** Summarize long scripts or transcripts

* **Use Cases:**

  * Title/tag generation
  * Shorter voiceover versions
  * Description creation

#### 6.3 Prompt Helper Node

**Purpose:** Convert basic prompt into cinematic detail

* **Example:** → "City at night" → "A neon-lit futuristic skyline with flying cars and ambient fog"

---

### 7. 🎨 Style & Edit Nodes

#### 7.1 Edit Node

**Purpose:** Make nonlinear edits to video/audio

* **Features:** Trim, cut, split, speed adjustment, crop, aspect ratio

#### 7.2 Style/Filter Node

**Purpose:** Add LUTs or visual styles

* **Types:**

  * Preset filters: cinematic, retro, cyberpunk
  * Manual: contrast, brightness, hue

#### 7.3 Transition Node

**Purpose:** Add visual transitions between scenes

* **Types:** Fade, Slide, Zoom, Cut
* **Settings:** Duration, direction

#### 7.4 Auto-Cut Node

**Purpose:** Automatically cut clips to music beats or transitions

* **Ideal For:** Reels, music videos, high-energy edits

#### 7.5 Text & Overlay Node

**Purpose:** Add animated text, branding, and overlays to video

* **Features:**

  * Animation: fade, slide
  * Fonts, sizes, colors
  * Start/End timeline positions

#### 7.6 Template Node

**Purpose:** Auto-fill timeline using predefined structures

* **Templates:** Trailer, Product Launch, Instagram Reel / YouTube Short

#### 7.7 Brand Kit Node

**Purpose:** Apply consistent logos, fonts, and colors

* **Use Cases:** Brand videos, agencies, repeat creators

---

### 8. 📊 Analysis & Intelligence Nodes

#### 8.1 Scene Detection Node

**Purpose:** Detect and split videos by scenes using audio/visual cues

* **Use Case:** Editing long content automatically

#### 8.2 NSFW/Content Safety Node

**Purpose:** Detect & flag unsafe/undesirable content

* **Integrates With:** Moderation systems, consent layers

#### 8.3 Metadata Tagging Node

**Purpose:** Tag clips or assets with searchable metadata

* **Use Cases:**

  * Auto-organize assets
  * Improve AI generation context (e.g., "scene: forest")
  * Search/filter clips in dashboard

---

### 9. ☁️ Export & Integration Nodes

#### 9.1 Cloud Sync Node

**Purpose:** Sync projects to external storage

* **Targets:** Google Drive, Dropbox, IPFS
* **Use Case:** Team collaboration, backup, decentralized hosting

#### 9.2 Social Push Node

**Purpose:** Auto-publish content

* **Platforms:** YouTube, Instagram, TikTok
* **Options:** Auto-caption, schedule, set thumbnail

#### 9.3 Webhook / API Trigger Node

**Purpose:** Connect with external systems (Zapier, n8n, APIs)

* **Example:** On render complete → trigger download/upload

#### 9.4 Export Node

**Purpose:** Final rendering of project

* **Settings:**

  * Resolution: 720p / 1080p / 4K
  * Format: MP4 / WebM
  * Presets: High, Medium, Low quality

---

### 10. 🔁 Logic & Automation Nodes

#### 10.1 Condition Node

**Purpose:** Branch logic dynamically

* **Example:** → If vertical video → use Reels template, else → use YouTube

#### 10.2 Loop Node

**Purpose:** Apply actions to many clips or inputs

* **Use Cases:** Batch editing, repeated operations

#### 10.3 Automation Trigger Node

**Purpose:** Trigger actions based on workflow events

* **Examples:**

  * On upload → auto-generate thumbnail
  * On project start → apply intro
  * On render complete → auto-publish
