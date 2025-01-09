import { rateLimit } from './rate-limit';
import { toast } from '@/components/ui/use-toast';

const API_URL = process.env.NEXT_PUBLIC_OPENROUTER_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}

export async function generateResponse(
  prompt: string,
  signal?: AbortSignal
): Promise<string> {
  if (!API_URL || !API_KEY) {
    throw new Error('API configuration missing');
  }

  const rateLimitResult = await rateLimit.check();
  if (!rateLimitResult.success) {
    throw new Error(`Rate limit exceeded. Try again in ${rateLimitResult.timeRemaining}ms`);
  }

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

      const headers: HeadersInit = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      };

      if (SITE_URL) {
        headers['HTTP-Referer'] = SITE_URL;
      }

      if (SITE_NAME) {
        headers['X-Title'] = SITE_NAME;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'gryphe/mythomax-l2-13b:free',
          messages: [{ role: 'user', content: prompt }],
          stream: false
        }),
        signal: signal || controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = (await response.json()) as OpenRouterResponse;
      return data.choices[0].message.content;
    } catch (error) {
      attempt++;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  throw new Error('Maximum retries exceeded');
}
