export interface TheorySection {
  title: string;
  paragraphs: string[];
  callout?: {
    type: 'tip' | 'warning' | 'info';
    title?: string;
    text: string;
  };
}

export interface CodeComparison {
  bad: {
    title: string;
    code: string;
    explanation: string;
  };
  good: {
    title: string;
    code: string;
    explanation: string;
  };
}

export interface DeepDive {
  title: string;
  points: string[];
  note?: string;
}

export interface LessonCheckpoint {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface XcodeLab {
  task: string;
  steps: string[];
  code: string;
  expectedOutput?: string;
  tips?: string;
}

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
    realWorldContext: string;
    detailedTheory: TheorySection[];
    theory: string[];
    codeSnippet: string;
    comparisonSnippet: CodeComparison;
    explanation: string[];
    underTheHood?: DeepDive;
    checkpoints?: LessonCheckpoint[];
    keyTakeaways: string[];
    commonMistakes?: string[];
    challenge?: {
      task: string;
      hint: string;
      solution: string;
    };
    xcodeLab?: XcodeLab;
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'email';
  isVerified: boolean;
  verifiedAt?: string;
  joinedAt: string;
  role: string;
  bio?: string;
  githubUrl?: string;
  goal?: string;
  verificationCode?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface CertificateData {
  certificateId: string;
  recipientName: string;
  issueDate: string;
  courseTitle: string;
  verificationCode: string;
  skills: string[];
}


