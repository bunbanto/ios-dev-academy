export interface Lesson {
  id: string;
  module: number;
  moduleTitle: string;
  title: string;
  description: string;
  difficulty: 'Початковий' | 'Середній' | 'Просунутий';
  estimatedMinutes: number;
  icon: string;
  content: {
    theory: string[];
    codeSnippet: string;
    explanation: string[];
    keyTakeaways: string[];
    commonMistakes?: string[];
    challenge?: {
      task: string;
      hint: string;
      solution: string;
    };
  };
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CheatsheetItem {
  id: string;
  category: 'Swift Basics' | 'SwiftUI Layout' | 'State & Data' | 'Async & Network' | 'SwiftData';
  title: string;
  syntax: string;
  description: string;
  example: string;
}

export interface ProjectGuide {
  id: string;
  title: string;
  subtitle: string;
  level: 'Junior' | 'Middle';
  duration: string;
  technologies: string[];
  description: string;
  steps: {
    title: string;
    description: string;
    code: string;
    tips?: string;
  }[];
  githubPlaceholder?: string;
}

export interface PlaygroundExample {
  id: string;
  title: string;
  description: string;
  category: string;
  swiftCode: string;
  interactiveType: 'counter' | 'profile' | 'todo' | 'weather' | 'tipcalc' | 'biometric';
}
