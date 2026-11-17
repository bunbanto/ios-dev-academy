import { NextResponse } from 'next/server';
import { ServerAuthError } from './firebase-auth';
import { RateLimitExceededError } from './challenge-checker';
import { GeminiApiError, GeminiNotConfiguredError } from './gemini';

export function handleAiApiError(
  error: unknown,
  locale: 'uk' | 'en' = 'uk',
): NextResponse {
  if (error instanceof ServerAuthError) {
    return NextResponse.json(
      { error: error.message, code: 'auth_error' },
      { status: error.status },
    );
  }

  if (error instanceof RateLimitExceededError) {
    return NextResponse.json(
      {
        error: error.message,
        code: 'rate_limit',
        remainingQuota: error.remainingQuota,
        dailyLimit: error.dailyLimit,
      },
      { status: 429 },
    );
  }

  if (error instanceof GeminiNotConfiguredError) {
    return NextResponse.json(
      {
        error:
          locale === 'en'
            ? 'AI checker is not configured yet: add GEMINI_API_KEY to your server environment variables.'
            : 'AI-перевірку ще не налаштовано: додайте змінну GEMINI_API_KEY на сервері.',
        code: 'gemini_not_configured',
      },
      { status: 503 },
    );
  }

  if (error instanceof GeminiApiError) {
    const isUpstreamRateLimit = error.status === 429;
    return NextResponse.json(
      {
        error: isUpstreamRateLimit
          ? locale === 'en'
            ? 'Gemini Free Tier is temporarily busy. Please try again in 20–30 seconds.'
            : 'Безкоштовна квота Gemini тимчасово перевантажена. Спробуйте ще раз через 20–30 секунд.'
          : error.message,
        code: isUpstreamRateLimit ? 'upstream_rate_limit' : 'gemini_api_error',
      },
      { status: error.status >= 400 && error.status < 600 ? error.status : 502 },
    );
  }

  console.error('Unexpected AI API route error:', error);
  return NextResponse.json(
    {
      error:
        locale === 'en'
          ? 'Unexpected server error while checking code.'
          : 'Несподівана помилка сервера під час перевірки коду.',
      code: 'internal_error',
    },
    { status: 500 },
  );
}
