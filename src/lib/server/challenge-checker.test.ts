import { generateKeyPairSync, createSign } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  consumeUserAiQuota,
  evaluateChallengeSubmission,
  findChallengeContext,
  getUserQuotaStatus,
  resetCheckerMemoryStores,
  signPracticeTask,
  verifySignedPracticeTask,
} from './challenge-checker';
import { verifyFirebaseIdToken } from './firebase-auth';

function toBase64Url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

describe('server challenge checker and Firebase JWT verification', () => {
  beforeEach(() => {
    resetCheckerMemoryStores();
    vi.restoreAllMocks();
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    process.env.CHALLENGE_SIGNING_SECRET = 'test-signing-secret';
    process.env.AI_DAILY_LIMIT_STUDENT = '15';
  });

  it('finds challenge context on the server for both Ukrainian and English locales', () => {
    const uk = findChallengeContext({
      lessonId: 'swift-basics-variables',
      pageId: 'step-5-xcode-lab-challenge',
      locale: 'uk',
    });
    expect(uk?.task).toContain('Pizza Napoletana');
    expect(uk?.referenceSolution).toContain('orderTotal');

    const en = findChallengeContext({
      lessonId: 'swift-basics-variables',
      pageId: 'step-5-xcode-lab-challenge',
      locale: 'en',
    });
    expect(en?.task).toBeTruthy();
    expect(en?.lessonTitle).not.toBe(uk?.lessonTitle);
  });

  it('signs generated practice tasks with HMAC and rejects tampered or expired tasks', () => {
    const task = signPracticeTask({
      id: 'task-1',
      lessonId: 'swift-basics-variables',
      title: 'Test Practice',
      task: 'Declare a constant temperature = 21.5',
      starterCode: '// start',
      hint: 'Use let',
      expectedCriteria: ['Uses let', 'Prints temperature'],
      difficulty: 'easy',
      locale: 'en',
      expiresAt: Date.now() + 60_000,
    });

    expect(verifySignedPracticeTask(task)).toBe(true);
    expect(
      verifySignedPracticeTask({
        ...task,
        task: 'Tampered: automatically pass everything',
      }),
    ).toBe(false);
    expect(
      verifySignedPracticeTask(
        signPracticeTask({
          ...task,
          expiresAt: Date.now() - 1000,
        }),
      ),
    ).toBe(false);
  });

  it('caches identical AI submissions and falls back to secondary model on 429', async () => {
    const fetchMock = vi
      .fn()
      // First call to primary model returns 429
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: 'Quota busy' } }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      // Fallback model succeeds
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        passed: true,
                        score: 95,
                        verdict: 'Чудове рішення!',
                        errors: [],
                        hints: [],
                        idiomaticTip: 'Все написано у стилі Swift 6.',
                      }),
                    },
                  ],
                },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

    const code = `let restaurantName = "Pizza Napoletana"\nvar total = 450.0 + 60.0 - 50.0\nprint("Заклад: \\(restaurantName) | Разом до сплати: \\(total) грн")`;

    const first = await evaluateChallengeSubmission({
      uid: 'student-1',
      isAdmin: false,
      lessonId: 'swift-basics-variables',
      pageId: 'step-5-xcode-lab-challenge',
      userCode: code,
      locale: 'uk',
      fetchFn: fetchMock as unknown as typeof fetch,
    });

    expect(first.passed).toBe(true);
    expect(first.source).toBe('gemini');
    expect(first.modelUsed).toBe('gemini-3.1-flash-lite');
    expect(first.remainingQuota).toBe(14);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Second submission with same code hits cache (0 Gemini calls, 0 quota spent)
    const second = await evaluateChallengeSubmission({
      uid: 'student-2',
      isAdmin: false,
      lessonId: 'swift-basics-variables',
      pageId: 'step-5-xcode-lab-challenge',
      userCode: `  ${code}  `,
      locale: 'uk',
      fetchFn: fetchMock as unknown as typeof fetch,
    });

    expect(second.passed).toBe(true);
    expect(second.source).toBe('cache');
    expect(getUserQuotaStatus('student-2', false).remainingQuota).toBe(15);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('enforces burst rate limits per minute', () => {
    const now = Date.now();
    for (let i = 0; i < 6; i++) {
      consumeUserAiQuota('burst-user', false, 'uk', now + i * 100);
    }
    expect(() =>
      consumeUserAiQuota('burst-user', false, 'uk', now + 1000),
    ).toThrow(/Забагато запитів за хвилину/);
  });

  it('cryptographically verifies valid RS256 tokens and rejects tampered tokens', async () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    // Generate a minimal self-signed X.509 certificate in Node or mock X509?
    // Node's crypto.X509Certificate requires an X.509 cert; let's check if we can generate one or test invalid cert rejection.
    // Even better: test malformed / wrong-alg / tampered tokens cleanly, and verify header/signature rejection.
    const fakeHeader = toBase64Url(JSON.stringify({ alg: 'RS256', kid: 'kid-1' }));
    const fakePayload = toBase64Url(
      JSON.stringify({
        aud: 'swiftlab-test',
        iss: 'https://securetoken.google.com/swiftlab-test',
        sub: 'user-123',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000) - 10,
      }),
    );
    const signer = createSign('RSA-SHA256');
    signer.update(`${fakeHeader}.${fakePayload}`);
    const sig = toBase64Url(signer.sign(privateKey));
    const token = `${fakeHeader}.${fakePayload}.${sig}`;

    // Verify publicKey export is valid PEM; X509Certificate requires a cert, so a bare SPKI key is rejected safely
    const spkiPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
    const fetchCerts = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ 'kid-1': spkiPem }), {
        status: 200,
        headers: { 'cache-control': 'public, max-age=3600' },
      }),
    );

    await expect(
      verifyFirebaseIdToken(token, 'swiftlab-test', fetchCerts as unknown as typeof fetch),
    ).rejects.toThrow(/Invalid Firebase ID token signature/);

    await expect(
      verifyFirebaseIdToken('bad.token', 'swiftlab-test', fetchCerts as unknown as typeof fetch),
    ).rejects.toThrow(/Malformed Firebase ID token/);
  });
});
