import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as firestore from 'firebase/firestore';
import * as firebaseModule from './firebase';
import {
  ADMIN_EMAIL,
  getAllManagedUsers,
  getLocalUserAccessControl,
  getRoleLabel,
  isAdminUser,
  persistUserAccessControl,
  resolveUserRole,
  setAllLessonsAccessForUser,
  setLessonAccessForUser,
  setModuleAccessForUser,
  resetUserAccessOverrides,
} from './access';
import { isLessonUnlocked, isModuleUnlocked } from './progression';
import { LESSONS } from '../data/lessons/index';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual<typeof import('firebase/firestore')>('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
  };
});

const values = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => values.set(key, value),
  removeItem: (key: string) => values.delete(key),
};

beforeEach(() => {
  values.clear();
  vi.restoreAllMocks();
  vi.stubGlobal('window', {
    dispatchEvent: vi.fn(),
  });
  vi.stubGlobal('localStorage', localStorageMock);
});

describe('user roles and task access control', () => {
  it('classifies dp180183fjs@gmail.com as admin and all other emails as student', () => {
    expect(resolveUserRole('dp180183fjs@gmail.com')).toBe('admin');
    expect(resolveUserRole('DP180183FJS@GMAIL.COM  ')).toBe('admin');
    expect(resolveUserRole('student@example.com')).toBe('student');
    expect(resolveUserRole('')).toBe('student');

    expect(isAdminUser({ email: ADMIN_EMAIL })).toBe(true);
    expect(isAdminUser({ email: 'other@gmail.com', role: 'student' })).toBe(false);
    expect(getRoleLabel('admin', 'uk')).toBe('Адміністратор');
    expect(getRoleLabel('student', 'uk')).toBe('Студент');
  });

  it('grants admin full access to all modules and lessons regardless of progress', () => {
    const module7Lesson = LESSONS.find((l) => l.module === 7)!;
    expect(isLessonUnlocked(module7Lesson, LESSONS, [], { isAdmin: false })).toBe(false);
    expect(isLessonUnlocked(module7Lesson, LESSONS, [], { isAdmin: true })).toBe(true);
    expect(isModuleUnlocked(7, LESSONS, [], { isAdmin: true })).toBe(true);
  });

  it('allows admin to open and close specific tasks or modules for any student', async () => {
    const student = { email: 'student1@gmail.com', name: 'Student One' };
    const module1Lesson = LESSONS.find((l) => l.module === 1)!;
    const module5Lesson = LESSONS.find((l) => l.module === 5)!;

    // Default: module 1 is open, module 5 is locked
    expect(isLessonUnlocked(module1Lesson, LESSONS, [])).toBe(true);
    expect(isLessonUnlocked(module5Lesson, LESSONS, [])).toBe(false);

    // Admin closes a module 1 task for the student
    let access = await setLessonAccessForUser(student, module1Lesson.id, false, LESSONS, []);
    expect(
      isLessonUnlocked(module1Lesson, LESSONS, [], {
        unlockedLessons: access.unlockedLessons,
        lockedLessons: access.lockedLessons,
      }),
    ).toBe(false);

    // Admin opens a module 5 task for the student
    access = await setLessonAccessForUser(student, module5Lesson.id, true, LESSONS, []);
    expect(
      isLessonUnlocked(module5Lesson, LESSONS, [], {
        unlockedLessons: access.unlockedLessons,
        lockedLessons: access.lockedLessons,
      }),
    ).toBe(true);
    expect(
      isModuleUnlocked(5, LESSONS, [], {
        unlockedLessons: access.unlockedLessons,
        lockedLessons: access.lockedLessons,
      }),
    ).toBe(true);

    // Admin opens entire module 6
    access = await setModuleAccessForUser(student, 6, true, LESSONS);
    const module6Lessons = LESSONS.filter((l) => l.module === 6);
    expect(
      module6Lessons.every((l) =>
        isLessonUnlocked(l, LESSONS, [], {
          unlockedLessons: access.unlockedLessons,
          lockedLessons: access.lockedLessons,
        }),
      ),
    ).toBe(true);

    // Admin closes all tasks for the student
    access = await setAllLessonsAccessForUser(student, false, LESSONS);
    expect(
      LESSONS.every(
        (l) =>
          !isLessonUnlocked(l, LESSONS, [], {
            unlockedLessons: access.unlockedLessons,
            lockedLessons: access.lockedLessons,
          }),
      ),
    ).toBe(true);

    // Admin resets student to default progression
    access = await resetUserAccessOverrides(student);
    expect(access.unlockedLessons).toEqual([]);
    expect(access.lockedLessons).toEqual([]);
  });

  it('throws an error and does not save misleading local state when Firestore write fails', async () => {
    vi.spyOn(firebaseModule, 'isFirebaseConfigured', 'get').mockReturnValue(true);
    vi.spyOn(firebaseModule, 'db', 'get').mockReturnValue({} as any);
    vi.spyOn(firebaseModule.auth, 'currentUser', 'get').mockReturnValue({
      uid: 'admin-uid',
      email: ADMIN_EMAIL,
    } as any);
    vi.mocked(firestore.setDoc).mockRejectedValueOnce({ code: 'permission-denied' });

    await expect(
      persistUserAccessControl({
        email: 'student2@gmail.com',
        role: 'student',
        unlockedLessons: ['m5-l1'],
        lockedLessons: [],
        updatedAt: new Date().toISOString(),
      }),
    ).rejects.toThrow(/permission-denied/);

    // Verify local storage was NOT updated with the failed write
    expect(getLocalUserAccessControl({ email: 'student2@gmail.com' }).unlockedLessons).toEqual([]);
  });

  it('throws an error instead of returning an incomplete local user list when Firestore read fails', async () => {
    vi.spyOn(firebaseModule, 'isFirebaseConfigured', 'get').mockReturnValue(true);
    vi.spyOn(firebaseModule, 'db', 'get').mockReturnValue({} as any);
    vi.spyOn(firebaseModule.auth, 'currentUser', 'get').mockReturnValue({
      uid: 'admin-uid',
      email: ADMIN_EMAIL,
    } as any);
    vi.mocked(firestore.getDocs).mockRejectedValueOnce({ code: 'permission-denied' });

    await expect(getAllManagedUsers()).rejects.toThrow(/permission-denied/);
  });
});
