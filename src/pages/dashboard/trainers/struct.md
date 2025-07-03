/trainers
├── lora/              # Lightweight LoRA fine-tuning
│   ├── index.ts       # Entrypoint or interface
│   ├── config.ts      # LoRA-specific config
│   └── utils.ts       # Utility functions for LoRA
│
├── dreambooth/        # Dreambooth fine-tuning (SD)
│   ├── index.ts
│   └── schema.ts
│
├── qlora/             # Quantized LoRA (QLoRA)
│   └── ...
│
├── sdxl/              # For SDXL training / fine-tuning
│   └── ...
│
├── shared/            # Common utilities across all trainers
│   ├── validateInputs.ts
│   ├── generateDataset.ts
│   └── ...
