export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';
export const DEFAULT_GEMINI_FALLBACK_MODEL = 'gemini-3.1-flash-lite';

export class GeminiNotConfiguredError extends Error {
  constructor() {
    super('GEMINI_API_KEY is not configured on the server.');
    this.name = 'GeminiNotConfiguredError';
  }
}

export class GeminiApiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = 'GeminiApiError';
    this.status = status;
  }
}

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && key !== 'your-gemini-api-key-here');
}

export function getConfiguredGeminiModels(): string[] {
  const primary = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const fallback = process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_GEMINI_FALLBACK_MODEL;
  return Array.from(new Set([primary, fallback].filter(Boolean)));
}

interface GeminiGenerateJsonParams {
  systemInstruction: string;
  userPrompt: string;
  responseJsonSchema: Record<string, unknown>;
  temperature?: number;
  maxOutputTokens?: number;
  fetchFn?: typeof fetch;
}

interface GeminiRestResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

function stripJsonCodeFences(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

export async function generateGeminiStructuredJson<T>(
  params: GeminiGenerateJsonParams,
): Promise<{ data: T; modelUsed: string }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    throw new GeminiNotConfiguredError();
  }

  const fetchFn = params.fetchFn || fetch;
  const models = getConfiguredGeminiModels();
  let lastError: GeminiApiError | null = null;

  for (const model of models) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model,
      )}:generateContent`;

      const response = await fetchFn(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: params.systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: params.userPrompt }],
            },
          ],
          generationConfig: {
            temperature: params.temperature ?? 0.15,
            maxOutputTokens: params.maxOutputTokens ?? 750,
            responseMimeType: 'application/json',
            responseJsonSchema: params.responseJsonSchema,
          },
        }),
      });

      const body = (await response.json().catch(() => ({}))) as GeminiRestResponse;

      if (!response.ok) {
        const message = body?.error?.message || `Gemini API returned HTTP ${response.status}`;
        lastError = new GeminiApiError(message, response.status);

        // Retry with fallback model if primary hit rate limit, temporary overload, or unavailable model
        if (response.status === 429 || response.status === 404 || response.status === 503) {
          continue;
        }
        throw lastError;
      }

      const rawText = body.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim();

      if (!rawText) {
        lastError = new GeminiApiError('Gemini returned an empty response.', 502);
        continue;
      }

      const parsed = JSON.parse(stripJsonCodeFences(rawText)) as T;
      return { data: parsed, modelUsed: model };
    } catch (error) {
      if (error instanceof GeminiApiError) {
        lastError = error;
        if (error.status !== 429 && error.status !== 404 && error.status !== 503) {
          throw error;
        }
      } else if ((error as Error)?.name === 'AbortError') {
        lastError = new GeminiApiError('Gemini API request timed out.', 504);
      } else {
        lastError = new GeminiApiError(
          (error as Error)?.message || 'Failed to communicate with Gemini API.',
          502,
        );
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new GeminiApiError('All configured Gemini models failed.', 502);
}
