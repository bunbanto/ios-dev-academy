import type { Locale } from './LocaleContext';
import translations from '@/data/en-translations.json';

const english = translations as Record<string, string>;
const sourceCodeFields = new Set(['code', 'codeSnippet', 'syntax', 'example', 'solution', 'swiftCode']);

function localizeSwiftCode(code: string): string {
  return code
    .replace(/(")((?:\\.|[^"\\])*)(")/g, (match, _open: string, text: string) => {
      const translated = english[text];
      return translated ? `"${translated}"` : match;
    })
    .replace(/\/\/([^\n\r]*)/g, (match, comment: string) => {
      const leadingSpace = comment.match(/^\s*/)?.[0] ?? '';
      const translated = english[comment.trim()];
      return translated ? `//${leadingSpace}${translated}` : match;
    });
}

export function localizeContent<T>(value: T, locale: Locale, parentKey = ''): T {
  if (locale === 'uk') return value;
  if (typeof value === 'string') {
    if (sourceCodeFields.has(parentKey)) return localizeSwiftCode(value) as T;
    return (english[value] ?? value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => localizeContent(item, locale, parentKey)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localizeContent(item, locale, key)]),
    ) as T;
  }
  return value;
}
