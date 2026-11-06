import { describe, it, expect } from 'vitest';
import { PLAYGROUND_EXAMPLES } from './playground-examples';

describe('PLAYGROUND_EXAMPLES', () => {
  it('contains valid examples with all required fields', () => {
    expect(PLAYGROUND_EXAMPLES.length).toBeGreaterThanOrEqual(5);

    for (const example of PLAYGROUND_EXAMPLES) {
      expect(example.id).toBeTruthy();
      expect(example.title).toBeTruthy();
      expect(example.description).toBeTruthy();
      expect(example.category).toBeTruthy();
      expect(example.interactiveType).toBeTruthy();
      expect(example.swiftCode).toBeTruthy();
    }
  });

  it('ensures each example swiftCode is Xcode-ready (uses ContentView and #Preview)', () => {
    for (const example of PLAYGROUND_EXAMPLES) {
      expect(example.swiftCode).toContain('struct ContentView: View');
      expect(example.swiftCode).toContain('#Preview');
      expect(example.swiftCode).toContain('import SwiftUI');
      // No unresolved placeholders or missing methods
      expect(example.swiftCode).not.toContain('simulateFaceID()');
    }
  });
});

