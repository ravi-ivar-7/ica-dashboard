import {
    TextInputType,
    TextInputOutputs,
    TextInputExecutionContext
} from './Types';

const VARIABLE_PATTERN = /\{\{([^{}]+)\}\}/g;

export async function executeTextInput(
    node: TextInputType,
    context: TextInputExecutionContext
): Promise<TextInputOutputs> {
    const { config } = node;
    const { content, processing } = config;
    const { user, executionId } = context;
    
    let text = content.default;
    const unresolvedVars: string[] = [];
    const resolvedVariables: Record<string, string> = {};
    const resolvedAt = new Date().toISOString();

    const variableMatches = [...text.matchAll(VARIABLE_PATTERN)];
    const uniqueVariables = [...new Set(variableMatches.map(match => match[1].trim()))];

    for (const variable of uniqueVariables) {
        try {
            const [prefix, ...rest] = variable.split('.');
            const varName = rest.join('.');
            
            let value: string | undefined;

            if (prefix === 'workflow') {
                value = content.variables.prefixes.workflow[varName]?.value;
                
                if (value === undefined && varName === 'username') {
                    value = user.username;
                }
                else if (value === undefined && varName === 'name') {
                    value = user.name;
                }
                else if (value === undefined && varName === 'username') {
                    value = user.username;
                }
                else if (value === undefined && varName === 'timestamp') {
                    value =  new Date().toISOString()
                }
                else if (value === undefined && varName === 'date') {
                    value = new Date().toISOString().split('T')[0];
                }
            }
            
            else if (prefix === 'env' && content.variables.prefixes.env) {
                value = content.variables.prefixes.env[varName]?.value;
            }
            else if (content.variables.customVariables?.[variable]) {
                value = content.variables.customVariables[variable].value;
            }

            // Handle unresolved variables
            if (value === undefined) {
                unresolvedVars.push(variable);
            } else {
                resolvedVariables[variable] = value;
                text = text.replace(
                    new RegExp(`\\{\\{${variable}\\}\\}`, 'g'),
                    value
                );
            }
        } catch (error) {
            unresolvedVars.push(variable);
        }
    }

    text = processTextContent(
        text,
        processing.schema.inputType.default,
        processing.schema.normalize.default
    );

    return {
        text,
        variables: Object.keys(resolvedVariables).length > 0 ? resolvedVariables : undefined,
        metadata: {
            resolvedAt,
            unresolvedVars,
            executionId
        }
    };
}

function processTextContent(
    text: string,
    inputType: 'plain' | 'markdown' | 'json' | 'html',
    normalize: boolean
): string {
    let processed = text;

    if (normalize) {
        processed = processed
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/\s+/g, ' ')    // Collapse multiple whitespace
            .trim();                 // Trim whitespace
    }

    // Type-specific validation
    switch (inputType) {
        case 'json':
            try {
                JSON.parse(processed);
            } catch {
                throw new Error('Invalid JSON content');
            }
            break;
        case 'html':
            if (!/<[a-z][\s\S]*>/i.test(processed)) {
                throw new Error('Content does not appear to be valid HTML');
            }
            break;
        case 'markdown':
            // Ensure trailing newlines
            if (!processed.endsWith('\n\n')) {
                processed += '\n\n';
            }
            break;
        case 'plain':
        default:
            // No special processing needed
    }

    return processed;
}