import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';

interface AiEditResponse {
    success: boolean;
    updatedProperties: Partial<CanvasElementType>;
    error?: string;
}

interface AiEditHealthCheckResponse {
    status: string;
    timestamp: string;
}

export async function aiEditElement(
    elementId: string,
    element: CanvasElementType,
    prompt: string,
    details?: string
): Promise<AiEditResponse> {
    try {
        const res = await fetch('/api/ai-edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ elementId, element, prompt, details }),
        });

        const json: AiEditResponse = await res.json();
        return json;
    } catch (error: any) {
        console.error('AI Edit failed:', error);

        const fallbackUpdate: Partial<CanvasElementType> = (() => {
            if (element.type === 'text') {
                return {
                    text: 'AI fallback text',
                    color: '#666',
                    fontSize: 20,
                    fontWeight: 'bold',
                };
            } else if (element.type === 'image' || element.type === 'video') {
                return {
                    width: element.width * 0.9,
                    height: element.height * 0.9,
                    opacity: 0.8,
                };
            }
            return {
                opacity: 0.7,
                rotation: 5,
            };
        })();

        return {
            success: false,
            updatedProperties: fallbackUpdate,
            error: error.message || 'AI service not available',
        };
    }
}

export async function checkAiEditAPI(): Promise<AiEditHealthCheckResponse | null> {
    try {
        const res = await fetch('/api/ai-edit');
        if (!res.ok) throw new Error('Server returned non-200');
        const json: AiEditHealthCheckResponse = await res.json();
        return json;
    } catch (error) {
        console.warn('AI API health check failed:', error);
        return null;
    }
}
