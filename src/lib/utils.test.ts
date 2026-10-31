import { describe, expect, it } from 'vitest';
import { cn, formatTime } from './utils';

describe('formatTime', () => {
  it('formats seconds with a zero-padded remainder', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(600)).toBe('10:00');
  });
});

describe('cn', () => {
  it('combines classes and resolves conflicting Tailwind utilities', () => {
    expect(cn('p-2', false && 'hidden', 'p-4')).toBe('p-4');
  });
});
