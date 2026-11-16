import { Lesson } from '@/types';
import { module1LessonsEn } from './module1';
import { module2LessonsEn } from './module2';
import { module3LessonsEn } from './module3';
import { module4LessonsEn } from './module4';
import { module5LessonsEn } from './module5';
import { module6LessonsEn } from './module6';
import { module7LessonsEn } from './module7';

export const LESSONS_EN: Lesson[] = [
  ...module1LessonsEn,
  ...module2LessonsEn,
  ...module3LessonsEn,
  ...module4LessonsEn,
  ...module5LessonsEn,
  ...module6LessonsEn,
  ...module7LessonsEn,
];

export const LESSONS_EN_MAP: Record<string, Lesson> = LESSONS_EN.reduce((acc, lesson) => {
  acc[lesson.id] = lesson;
  return acc;
}, {} as Record<string, Lesson>);

export {
  module1LessonsEn,
  module2LessonsEn,
  module3LessonsEn,
  module4LessonsEn,
  module5LessonsEn,
  module6LessonsEn,
  module7LessonsEn,
};
