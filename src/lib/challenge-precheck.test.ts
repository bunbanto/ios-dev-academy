import { describe, expect, it } from 'vitest';
import {
  buildDefaultStarterCode,
  hasSwiftSyntaxTokens,
  MAX_CHALLENGE_CODE_LENGTH,
  normalizeSwiftCode,
  runLocalChallengePrecheck,
} from './challenge-precheck';

describe('challenge pre-check', () => {
  it('normalizes Swift line endings and whitespace', () => {
    expect(normalizeSwiftCode('  let a = 1  \r\n\r\n  print(a)  ')).toBe(
      'let a = 1\nprint(a)',
    );
  });

  it('detects Swift syntax tokens vs plain prose', () => {
    expect(hasSwiftSyntaxTokens('let x = 5')).toBe(true);
    expect(hasSwiftSyntaxTokens('print("Hello")')).toBe(true);
    expect(hasSwiftSyntaxTokens('@State var count = 0')).toBe(true);
    expect(hasSwiftSyntaxTokens('// just a comment\nhello world')).toBe(false);
  });

  it('rejects empty, oversized, unchanged starter, and non-code input locally', () => {
    expect(runLocalChallengePrecheck({ userCode: '   ' })?.passed).toBe(false);

    const oversized = 'let x = 1\n'.repeat(Math.ceil(MAX_CHALLENGE_CODE_LENGTH / 9));
    expect(runLocalChallengePrecheck({ userCode: oversized })?.passed).toBe(false);

    const starter = buildDefaultStarterCode('uk');
    expect(
      runLocalChallengePrecheck({ userCode: starter, starterCode: starter })?.passed,
    ).toBe(false);

    expect(
      runLocalChallengePrecheck({ userCode: 'я не знаю як це зробити' })?.passed,
    ).toBe(false);
  });

  it('grants an instant cached pass when normalized code matches reference solution', () => {
    const solution = 'let price = 100\nprint(price)';
    const result = runLocalChallengePrecheck({
      userCode: '  let price = 100  \n\n  print(price)\n',
      referenceSolution: solution,
      locale: 'uk',
    });

    expect(result).toMatchObject({
      passed: true,
      score: 100,
      source: 'cache',
    });
  });

  it('returns null when valid custom code requires AI review', () => {
    const result = runLocalChallengePrecheck({
      userCode: 'let total = 450.0 + 60.0 - 50.0\nprint(total)',
      starterCode: buildDefaultStarterCode('uk'),
      referenceSolution: 'let x = 1',
    });

    expect(result).toBeNull();
  });
});
