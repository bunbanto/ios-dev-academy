import { NextResponse } from 'next/server';
import { authenticateApiRequest } from '@/lib/server/firebase-auth';
import { generatePracticeTaskForLesson } from '@/lib/server/challenge-checker';
import { handleAiApiError } from '@/lib/server/api-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let locale: 'uk' | 'en' = 'uk';
  try {
    const authUser = await authenticateApiRequest(request);
    const body = (await request.json().catch(() => null)) as {
      lessonId?: unknown;
      difficulty?: unknown;
      locale?: unknown;
    } | null;

    if (body?.locale === 'en') {
      locale = 'en';
    }

    if (!body || typeof body.lessonId !== 'string' || !body.lessonId.trim()) {
      return NextResponse.json(
        {
          error:
            locale === 'en'
              ? 'Invalid request payload: lessonId is required.'
              : 'Некоректний запит: потрібен lessonId.',
          code: 'bad_request',
        },
        { status: 400 },
      );
    }

    const difficulty =
      body.difficulty === 'easy' || body.difficulty === 'hard'
        ? body.difficulty
        : 'medium';

    const generated = await generatePracticeTaskForLesson({
      uid: authUser.uid,
      isAdmin: authUser.isAdmin,
      lessonId: body.lessonId.trim(),
      difficulty,
      locale,
    });

    return NextResponse.json(generated);
  } catch (error) {
    return handleAiApiError(error, locale);
  }
}
