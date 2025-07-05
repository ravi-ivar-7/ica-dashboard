// ./Types.ts

export type PrefixVariableSchema = {
    key: string;
    value?: string;
    description?: string;
    isSecure?: boolean;
};

export type CustomVariableSchema = {
    key: string;
    value: string;
    description?: string;
};

// Configuration Schema Types
export type TextInputContentConfig = {
    type: 'textarea';
    default: string;  
    placeholder: string;
    description: string;
    variables: {
        syntax: 'doubleCurlyBraces';
        prefixes: {
            workflow: Record<string, PrefixVariableSchema>;
            env?: Record<string, PrefixVariableSchema>;
        };
        customVariables?: Record<string, CustomVariableSchema>;
    };
};

export type InputTypeOption = {
    value: 'plain' | 'markdown' | 'json' | 'html';
    label: string;
};

export type ProcessingConfig = {
    type: 'object';
    default: Record<string, unknown>; 
    schema: {
        inputType: {
            type: 'select';
            options: InputTypeOption[];
            default: 'plain' | 'markdown' | 'json' | 'html';
        };
        normalize: {
            type: 'boolean';
            default: boolean;
            description: string;
        };
    };
};

// Main Node Type
export type TextInputType = {
    id: 'text-input';
    type: 'text-input';
    name: string;
    category: 'input';
    icon: string;
    version: string;
    description: string;
    keywords: string[];
    inputs: [];
    outputs: [
        {
            name: 'text';
            type: 'text';
            description: string;
        },
        {
            name: 'variables';
            type: 'object';
            description: string;
            sensitive?: boolean;
        },
        {
            name: 'metadata';
            type: 'object';
            description: string;
            schema: {
                resolvedAt: { type: 'string'; format: 'date-time' };
                unresolvedVars: { type: 'array'; items: { type: 'string' } };
                executionId: { type: 'string' };
            };
        }
    ];
    config: {
        content: TextInputContentConfig;
        processing: ProcessingConfig;
    };
};

// Execution Types
export type TextInputOutputs = {
    text: string;
    variables?: Record<string, unknown>;
    metadata?: {
        resolvedAt: string;
        unresolvedVars: string[];
        executionId: string;
    };
};

export type TextInputExecutionContext = {
    executionId: string;
    workflowId: string;
    user: {
        id: string;
        name:string;
        username?: string; 
        email?: string;
    };
};