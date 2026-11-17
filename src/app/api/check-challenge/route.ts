import { NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/server/firebase-auth';
import {
  evaluateChallengeSubmission,
  getUserQuotaStatus,
} from '@/lib/server/challenge-checker';
import { isGeminiConfigured } from '@/lib/server/gemini';
import { handleAiApiError } from '@/lib/server/api-error';
import type { GeneratedPracticeTask } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authUser = await authenticateApiRequest(request);
    const quota = getUserQuotaStatus(authUser.uid, authUser.isAdmin);
    return NextResponse.json({
      configured: isGeminiConfigured(),
      isAdmin: authUser.isAdmin,
      ...quota,
    });
  } catch (error) {
    return handleAiApiError(error, 'uk');
  }
}

export async function POST(request: Request) {
  let locale: 'uk' | 'en' = 'uk';
  try {
    const authUser = await authenticateApiRequest(request);
    const body = (await request.json().catch(() => null)) as {
      lessonId?: unknown;
      pageId?: unknown;
      userCode?: unknown;
      locale?: unknown;
      generatedTask?: unknown;
    } | null;

    if (body?.locale === 'en') {
      locale = 'en';
    }

    if (
      !body ||
      typeof body.lessonId !== 'string' ||
      !body.lessonId.trim() ||
      typeof body.userCode !== 'string'
    ) {
      return NextResponse.json(
        {
          error:
            locale === 'en'
              ? 'Invalid request payload: lessonId and userCode are required.'
              : 'Некоректний запит: потрібні lessonId та userCode.',
          code: 'bad_request',
        },
        { status: 400 },
      );
    }

    const result = await evaluateChallengeSubmission({
      uid: authUser.uid,
      isAdmin: authUser.isAdmin,
      lessonId: body.lessonId.trim(),
      pageId: typeof body.pageId === 'string' ? body.pageId.trim() : undefined,
      userCode: body.userCode,
      locale,
      generatedTask: body.generatedTask as GeneratedPracticeTask | undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleAiApiError(error, locale);
  }
}
