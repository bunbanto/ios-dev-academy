import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { getUserProgress, type UserProgress } from './storage';
import { isBaseModuleUnlocked } from './progression';
import type {
  Lesson,
  ManagedUserRecord,
  UserAccessControl,
  UserProfile,
  UserRole,
} from '../types';

export const ADMIN_EMAIL = 'dp180183fjs@gmail.com';

const LOCAL_USERS_REGISTRY_KEY = 'swiftlab_users_registry_v1';
const LOCAL_USER_ACCESS_KEY = 'swiftlab_user_access_v1';

export function normalizeEmail(email?: string | null): string {
  return (email || '').trim().toLowerCase();
}

export function resolveUserRole(email?: string | null): UserRole {
  return normalizeEmail(email) === ADMIN_EMAIL ? 'admin' : 'student';
}

export function isAdminUser(
  user?: { email?: string | null; role?: string | null } | null,
): boolean {
  if (!user) return false;
  return normalizeEmail(user.email) === ADMIN_EMAIL || user.role === 'admin';
}

export function getRoleLabel(role: UserRole, locale: 'uk' | 'en' = 'uk'): string {
  if (role === 'admin') {
    return locale === 'en' ? 'Administrator' : 'Адміністратор';
  }
  return locale === 'en' ? 'Student' : 'Студент';
}

function createEmptyAccessControl(email: string, uid?: string, name?: string): UserAccessControl {
  const normalized = normalizeEmail(email);
  return {
    email: normalized,
    uid,
    name,
    role: resolveUserRole(normalized),
    unlockedLessons: [],
    lockedLessons: [],
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)),
  );
}

function formatFirestoreSyncError(error: unknown, operation: 'read' | 'write'): Error {
  const code = (error as { code?: string })?.code;
  const rawMessage = (error as { message?: string })?.message || String(error);

  if (code === 'permission-denied') {
    return new Error(
      operation === 'write'
        ? 'Помилка доступу Firestore (permission-denied): зміни НЕ збережено в хмарі. Переконайтеся, що ви увійшли як dp180183fjs@gmail.com і задеплоїли актуальні правила (`firebase deploy --only firestore:rules`).'
        : 'Помилка доступу Firestore (permission-denied): не вдалося завантажити дані з хмари. Перевірте деплой правил (`firebase deploy --only firestore:rules`).',
    );
  }

  return new Error(
    operation === 'write'
      ? `Не вдалося зберегти налаштування доступу у Firestore (${code || rawMessage}). Зміни не застосовано.`
      : `Не вдалося завантажити дані користувачів із Firestore (${code || rawMessage}).`,
  );
}

function readLocalAccessMap(): Record<string, UserAccessControl> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_USER_ACCESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalAccessMap(map: Record<string, UserAccessControl>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_USER_ACCESS_KEY, JSON.stringify(map));
    if (typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new Event('swiftlab_access_change'));
    }
  } catch (error) {
    console.error('Failed to save local access map', error);
  }
}

function readLocalUsersRegistry(): Record<string, ManagedUserRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_USERS_REGISTRY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalUsersRegistry(registry: Record<string, ManagedUserRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_USERS_REGISTRY_KEY, JSON.stringify(registry));
  } catch (error) {
    console.error('Failed to save local users registry', error);
  }
}

export function getLocalUserAccessControl(
  user?: { id?: string; email?: string | null } | null,
): UserAccessControl {
  const email = normalizeEmail(user?.email);
  if (!email) {
    return createEmptyAccessControl('', user?.id);
  }
  const map = readLocalAccessMap();
  const existing = map[email];
  if (!existing) {
    return createEmptyAccessControl(email, user?.id);
  }
  return {
    ...createEmptyAccessControl(email, user?.id),
    ...existing,
    email,
    role: resolveUserRole(email),
    unlockedLessons: sanitizeStringArray(existing.unlockedLessons),
    lockedLessons: sanitizeStringArray(existing.lockedLessons),
  };
}

export async function getUserAccessControl(
  user?: { id?: string; email?: string | null } | null,
  options?: { strict?: boolean },
): Promise<UserAccessControl> {
  const email = normalizeEmail(user?.email);
  const local = getLocalUserAccessControl(user);
  if (!email) {
    return local;
  }

  if (!isFirebaseConfigured) {
    return local;
  }

  if (!db || !auth.currentUser) {
    if (options?.strict) {
      throw new Error(
        'Сесія Firebase не активна. Увійдіть повторно, щоб синхронізувати налаштування доступу з хмарою.',
      );
    }
    return local;
  }

  try {
    const accessRef = doc(db, 'userAccess', email);
    const snapshot = await getDoc(accessRef);
    const map = readLocalAccessMap();

    if (snapshot.exists()) {
      const data = snapshot.data();
      const merged: UserAccessControl = {
        email,
        uid: typeof data.uid === 'string' ? data.uid : user?.id,
        name: typeof data.name === 'string' ? data.name : local.name,
        role: resolveUserRole(email),
        unlockedLessons: sanitizeStringArray(data.unlockedLessons),
        lockedLessons: sanitizeStringArray(data.lockedLessons),
        updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
        updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : undefined,
      };
      map[email] = merged;
      writeLocalAccessMap(map);
      return merged;
    } else {
      // Document does not exist in Firestore -> clear any stale local override for this user
      const empty = createEmptyAccessControl(email, user?.id, local.name);
      if (map[email]) {
        delete map[email];
        writeLocalAccessMap(map);
      }
      return empty;
    }
  } catch (error) {
    if (options?.strict) {
      throw formatFirestoreSyncError(error, 'read');
    }
    console.error('Failed to fetch user access control from Firestore:', error);
    return local;
  }
}

export function subscribeToUserAccess(
  user: { id?: string; email?: string | null } | null,
  onUpdate: (access: UserAccessControl) => void,
  onError?: (error: Error) => void,
): () => void {
  const email = normalizeEmail(user?.email);
  onUpdate(getLocalUserAccessControl(user));

  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleLocalChange = () => {
    onUpdate(getLocalUserAccessControl(user));
  };

  window.addEventListener('storage', handleLocalChange);
  window.addEventListener('swiftlab_access_change', handleLocalChange);

  let unsubscribeFirestore: (() => void) | null = null;

  if (email && isFirebaseConfigured && db && auth.currentUser) {
    try {
      const accessRef = doc(db, 'userAccess', email);
      unsubscribeFirestore = onSnapshot(
        accessRef,
        (snapshot) => {
          const map = readLocalAccessMap();
          if (snapshot.exists()) {
            const data = snapshot.data();
            const updated: UserAccessControl = {
              email,
              uid: typeof data.uid === 'string' ? data.uid : user?.id,
              name: typeof data.name === 'string' ? data.name : undefined,
              role: resolveUserRole(email),
              unlockedLessons: sanitizeStringArray(data.unlockedLessons),
              lockedLessons: sanitizeStringArray(data.lockedLessons),
              updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
              updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : undefined,
            };
            map[email] = updated;
            try {
              localStorage.setItem(LOCAL_USER_ACCESS_KEY, JSON.stringify(map));
            } catch {}
            onUpdate(updated);
          } else {
            if (map[email]) {
              delete map[email];
              try {
                localStorage.setItem(LOCAL_USER_ACCESS_KEY, JSON.stringify(map));
              } catch {}
            }
            onUpdate(createEmptyAccessControl(email, user?.id));
          }
        },
        (error) => {
          console.error('Firestore userAccess subscription error:', error);
          if (onError) {
            onError(formatFirestoreSyncError(error, 'read'));
          }
        },
      );
    } catch (error) {
      console.error('Failed to initialize userAccess subscription:', error);
    }
  }

  return () => {
    window.removeEventListener('storage', handleLocalChange);
    window.removeEventListener('swiftlab_access_change', handleLocalChange);
    if (unsubscribeFirestore) unsubscribeFirestore();
  };
}

export async function syncUserToRegistry(
  user: UserProfile,
  progress?: UserProgress,
): Promise<void> {
  const email = normalizeEmail(user.email);
  if (!email) return;

  const currentProgress = progress || getUserProgress();
  const role = resolveUserRole(email);
  const localAccess = getLocalUserAccessControl(user);

  const registry = readLocalUsersRegistry();
  const existing = registry[email];

  const record: ManagedUserRecord = {
    id: user.id || existing?.id || email,
    uid: user.id || existing?.uid,
    email,
    name: user.name || existing?.name || email.split('@')[0],
    avatar: user.avatar || existing?.avatar,
    role,
    isVerified: user.isVerified,
    joinedAt: user.joinedAt || existing?.joinedAt || new Date().toISOString().split('T')[0],
    lastActiveAt: new Date().toISOString(),
    completedLessons: sanitizeStringArray(currentProgress.completedLessons),
    totalXp: currentProgress.totalXp ?? 50,
    unlockedLessons: localAccess.unlockedLessons,
    lockedLessons: localAccess.lockedLessons,
  };

  if (isFirebaseConfigured && db && auth.currentUser && auth.currentUser.uid === user.id) {
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(
        userRef,
        {
          uid: user.id,
          email,
          name: record.name,
          avatar: record.avatar || '',
          role,
          isVerified: Boolean(user.isVerified),
          joinedAt: record.joinedAt,
          lastActiveAt: record.lastActiveAt,
          ...(progress
            ? {
                completedLessons: record.completedLessons,
                completedChallenges: sanitizeStringArray(progress.completedChallenges),
                totalXp: record.totalXp,
              }
            : {}),
        },
        { merge: true },
      );
    } catch (error) {
      console.error('Failed to sync user profile to Firestore:', error);
    }
  }

  registry[email] = record;
  writeLocalUsersRegistry(registry);
}

export async function getAllManagedUsers(): Promise<ManagedUserRecord[]> {
  const mergedByEmail = new Map<string, ManagedUserRecord>();

  if (isFirebaseConfigured) {
    if (!db || !auth.currentUser) {
      throw new Error(
        'Сесія Firebase не активна. Увійдіть в акаунт адміністратора повторно, щоб завантажити список користувачів із Firestore.',
      );
    }

    let usersSnapshot;
    let accessSnapshot;
    try {
      [usersSnapshot, accessSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'userAccess')),
      ]);
    } catch (error) {
      throw formatFirestoreSyncError(error, 'read');
    }

    const nextAccessMap: Record<string, UserAccessControl> = {};

    usersSnapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const email = normalizeEmail(data.email);
      if (!email) return;
      mergedByEmail.set(email, {
        id: docSnap.id,
        uid: typeof data.uid === 'string' ? data.uid : docSnap.id,
        email,
        name:
          typeof data.name === 'string' && data.name.trim()
            ? data.name
            : email.split('@')[0],
        avatar:
          typeof data.avatar === 'string' && data.avatar
            ? data.avatar
            : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        role: resolveUserRole(email),
        isVerified: typeof data.isVerified === 'boolean' ? data.isVerified : false,
        joinedAt:
          typeof data.joinedAt === 'string'
            ? data.joinedAt
            : new Date().toISOString().split('T')[0],
        lastActiveAt:
          typeof data.lastActiveAt === 'string' ? data.lastActiveAt : undefined,
        completedLessons: sanitizeStringArray(data.completedLessons),
        totalXp: typeof data.totalXp === 'number' ? data.totalXp : 50,
        unlockedLessons: [],
        lockedLessons: [],
      });
    });

    accessSnapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const email = normalizeEmail(data.email || docSnap.id);
      if (!email) return;
      const existing = mergedByEmail.get(email);
      const unlockedLessons = sanitizeStringArray(data.unlockedLessons);
      const lockedLessons = sanitizeStringArray(data.lockedLessons);

      nextAccessMap[email] = {
        email,
        uid: typeof data.uid === 'string' ? data.uid : existing?.uid,
        name: typeof data.name === 'string' ? data.name : existing?.name,
        role: resolveUserRole(email),
        unlockedLessons,
        lockedLessons,
        updatedAt:
          typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
        updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : undefined,
      };

      mergedByEmail.set(email, {
        id: existing?.id || (typeof data.uid === 'string' ? data.uid : email),
        uid: existing?.uid || (typeof data.uid === 'string' ? data.uid : undefined),
        email,
        name:
          existing?.name ||
          (typeof data.name === 'string' && data.name.trim()
            ? data.name
            : email.split('@')[0]),
        avatar:
          existing?.avatar ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        role: resolveUserRole(email),
        isVerified: existing?.isVerified ?? false,
        joinedAt: existing?.joinedAt || new Date().toISOString().split('T')[0],
        lastActiveAt: existing?.lastActiveAt || data.updatedAt,
        completedLessons: existing?.completedLessons || [],
        totalXp: existing?.totalXp ?? 50,
        unlockedLessons,
        lockedLessons,
      });
    });

    writeLocalAccessMap(nextAccessMap);
  } else {
    // Local-only mode when Firebase is not configured
    const registry = readLocalUsersRegistry();
    const accessMap = readLocalAccessMap();

    Object.values(registry).forEach((item) => {
      const email = normalizeEmail(item.email);
      if (!email) return;
      const access = accessMap[email];
      mergedByEmail.set(email, {
        ...item,
        email,
        role: resolveUserRole(email),
        completedLessons: sanitizeStringArray(item.completedLessons),
        unlockedLessons: sanitizeStringArray(access?.unlockedLessons ?? item.unlockedLessons),
        lockedLessons: sanitizeStringArray(access?.lockedLessons ?? item.lockedLessons),
      });
    });

    Object.values(accessMap).forEach((access) => {
      const email = normalizeEmail(access.email);
      if (!email) return;
      const existing = mergedByEmail.get(email);
      mergedByEmail.set(email, {
        id: existing?.id || access.uid || email,
        uid: existing?.uid || access.uid,
        email,
        name: existing?.name || access.name || email.split('@')[0],
        avatar:
          existing?.avatar ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        role: resolveUserRole(email),
        isVerified: existing?.isVerified ?? false,
        joinedAt: existing?.joinedAt || access.updatedAt.split('T')[0],
        lastActiveAt: existing?.lastActiveAt || access.updatedAt,
        completedLessons: existing?.completedLessons || [],
        totalXp: existing?.totalXp ?? 50,
        unlockedLessons: sanitizeStringArray(access.unlockedLessons),
        lockedLessons: sanitizeStringArray(access.lockedLessons),
      });
    });
  }

  // Ensure the admin account is always present in the list
  if (!mergedByEmail.has(ADMIN_EMAIL)) {
    mergedByEmail.set(ADMIN_EMAIL, {
      id: ADMIN_EMAIL,
      email: ADMIN_EMAIL,
      name: 'Admin (SwiftLab)',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ADMIN_EMAIL)}`,
      role: 'admin',
      isVerified: true,
      joinedAt: new Date().toISOString().split('T')[0],
      completedLessons: [],
      totalXp: 1000,
      unlockedLessons: [],
      lockedLessons: [],
    });
  }

  const result = Array.from(mergedByEmail.values()).sort((a, b) => {
    if (a.role !== b.role) return a.role === 'admin' ? -1 : 1;
    return a.email.localeCompare(b.email);
  });

  // Update local cache only after authoritative load succeeds
  const nextRegistry: Record<string, ManagedUserRecord> = {};
  result.forEach((u) => {
    nextRegistry[u.email] = u;
  });
  writeLocalUsersRegistry(nextRegistry);

  return result;
}

export async function persistUserAccessControl(
  access: UserAccessControl,
): Promise<UserAccessControl> {
  const email = normalizeEmail(access.email);
  if (!email) throw new Error('User email is required');

  const normalizedAccess: UserAccessControl = {
    email,
    uid: access.uid,
    name: access.name,
    role: resolveUserRole(email),
    unlockedLessons: sanitizeStringArray(access.unlockedLessons),
    lockedLessons: sanitizeStringArray(access.lockedLessons),
    updatedAt: new Date().toISOString(),
    updatedBy: access.updatedBy || ADMIN_EMAIL,
  };

  // When Firebase is configured, write to Firestore FIRST and fail loudly on any error
  // so the admin is never misled into thinking an unsynced local change was applied remotely.
  if (isFirebaseConfigured) {
    if (!db || !auth.currentUser) {
      throw new Error(
        'Сесія Firebase не активна. Увійдіть в акаунт адміністратора повторно, щоб зберегти зміни у хмарі.',
      );
    }

    try {
      const accessRef = doc(db, 'userAccess', email);
      await setDoc(
        accessRef,
        {
          email,
          uid: normalizedAccess.uid || null,
          name: normalizedAccess.name || email.split('@')[0],
          role: normalizedAccess.role,
          unlockedLessons: normalizedAccess.unlockedLessons,
          lockedLessons: normalizedAccess.lockedLessons,
          updatedAt: normalizedAccess.updatedAt,
          updatedBy: normalizedAccess.updatedBy,
        },
        { merge: true },
      );
    } catch (error) {
      throw formatFirestoreSyncError(error, 'write');
    }
  }

  // Only update local storage after cloud persistence succeeds (or in local-only mode)
  const accessMap = readLocalAccessMap();
  accessMap[email] = normalizedAccess;
  writeLocalAccessMap(accessMap);

  const registry = readLocalUsersRegistry();
  const existingUser = registry[email];
  registry[email] = {
    id: existingUser?.id || access.uid || email,
    uid: existingUser?.uid || access.uid,
    email,
    name: existingUser?.name || access.name || email.split('@')[0],
    avatar:
      existingUser?.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
    role: resolveUserRole(email),
    isVerified: existingUser?.isVerified ?? false,
    joinedAt: existingUser?.joinedAt || new Date().toISOString().split('T')[0],
    lastActiveAt: existingUser?.lastActiveAt || normalizedAccess.updatedAt,
    completedLessons: existingUser?.completedLessons || [],
    totalXp: existingUser?.totalXp ?? 50,
    unlockedLessons: normalizedAccess.unlockedLessons,
    lockedLessons: normalizedAccess.lockedLessons,
  };
  writeLocalUsersRegistry(registry);

  return normalizedAccess;
}

export async function upsertManagedStudentByEmail(
  rawEmail: string,
  rawName?: string,
): Promise<ManagedUserRecord> {
  const email = normalizeEmail(rawEmail);
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }

  const currentAccess = await getUserAccessControl({ email }, { strict: true });
  const name = rawName?.trim() || currentAccess.name || email.split('@')[0];

  await persistUserAccessControl({
    ...currentAccess,
    email,
    name,
    role: resolveUserRole(email),
  });

  const registry = readLocalUsersRegistry();
  return registry[email];
}

export async function setLessonAccessForUser(
  targetUser: { email: string; uid?: string; name?: string },
  lessonId: string,
  grantAccess: boolean,
  allLessons: Lesson[],
  studentCompletedIds: string[] = [],
  adminEmail: string = ADMIN_EMAIL,
): Promise<UserAccessControl> {
  const email = normalizeEmail(targetUser.email);
  const current = await getUserAccessControl(
    { id: targetUser.uid, email },
    { strict: true },
  );
  const lesson = allLessons.find((l) => l.id === lessonId);
  const unlockedSet = new Set(current.unlockedLessons);
  const lockedSet = new Set(current.lockedLessons);

  const unlockedByDefault = lesson
    ? isBaseModuleUnlocked(lesson.module, allLessons, studentCompletedIds)
    : false;

  if (grantAccess) {
    lockedSet.delete(lessonId);
    if (!unlockedByDefault) {
      unlockedSet.add(lessonId);
    } else {
      unlockedSet.add(lessonId);
    }
  } else {
    unlockedSet.delete(lessonId);
    lockedSet.add(lessonId);
  }

  return persistUserAccessControl({
    ...current,
    email,
    uid: targetUser.uid || current.uid,
    name: targetUser.name || current.name,
    unlockedLessons: Array.from(unlockedSet),
    lockedLessons: Array.from(lockedSet),
    updatedBy: adminEmail,
  });
}

export async function setModuleAccessForUser(
  targetUser: { email: string; uid?: string; name?: string },
  moduleNumber: number,
  grantAccess: boolean,
  allLessons: Lesson[],
  adminEmail: string = ADMIN_EMAIL,
): Promise<UserAccessControl> {
  const email = normalizeEmail(targetUser.email);
  const current = await getUserAccessControl(
    { id: targetUser.uid, email },
    { strict: true },
  );
  const unlockedSet = new Set(current.unlockedLessons);
  const lockedSet = new Set(current.lockedLessons);

  const moduleLessonIds = allLessons
    .filter((l) => l.module === moduleNumber)
    .map((l) => l.id);

  for (const id of moduleLessonIds) {
    if (grantAccess) {
      lockedSet.delete(id);
      unlockedSet.add(id);
    } else {
      unlockedSet.delete(id);
      lockedSet.add(id);
    }
  }

  return persistUserAccessControl({
    ...current,
    email,
    uid: targetUser.uid || current.uid,
    name: targetUser.name || current.name,
    unlockedLessons: Array.from(unlockedSet),
    lockedLessons: Array.from(lockedSet),
    updatedBy: adminEmail,
  });
}

export async function setAllLessonsAccessForUser(
  targetUser: { email: string; uid?: string; name?: string },
  grantAccess: boolean,
  allLessons: Lesson[],
  adminEmail: string = ADMIN_EMAIL,
): Promise<UserAccessControl> {
  const email = normalizeEmail(targetUser.email);
  const current = await getUserAccessControl(
    { id: targetUser.uid, email },
    { strict: true },
  );
  const allLessonIds = allLessons.map((l) => l.id);

  return persistUserAccessControl({
    ...current,
    email,
    uid: targetUser.uid || current.uid,
    name: targetUser.name || current.name,
    unlockedLessons: grantAccess ? allLessonIds : [],
    lockedLessons: grantAccess ? [] : allLessonIds,
    updatedBy: adminEmail,
  });
}

export async function resetUserAccessOverrides(
  targetUser: { email: string; uid?: string; name?: string },
  adminEmail: string = ADMIN_EMAIL,
): Promise<UserAccessControl> {
  const email = normalizeEmail(targetUser.email);
  const current = await getUserAccessControl(
    { id: targetUser.uid, email },
    { strict: true },
  );

  return persistUserAccessControl({
    ...current,
    email,
    uid: targetUser.uid || current.uid,
    name: targetUser.name || current.name,
    unlockedLessons: [],
    lockedLessons: [],
    updatedBy: adminEmail,
  });
}
