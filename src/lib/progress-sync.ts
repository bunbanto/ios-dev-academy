import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { normalizeEmail, resolveUserRole } from './access';
import {
  createDefaultProgress,
  getUtcDateString,
  getUserProgress,
  writeProgressToLocalStorage,
  type UserProgress,
} from './storage';

function sanitizeIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0),
    ),
  );
}

function sanitizeQuizScores(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: Record<string, number> = {};
  for (const [key, score] of Object.entries(value as Record<string, unknown>)) {
    if (typeof key === 'string' && key.length > 0 && typeof score === 'number' && Number.isFinite(score)) {
      result[key] = score;
    }
  }
  return result;
}

export function parseCloudProgress(data: Record<string, unknown>, uid: string): UserProgress {
  return {
    ownerUid: uid,
    completedLessons: sanitizeIds(data.completedLessons),
    completedChallenges: sanitizeIds(data.completedChallenges),
    quizScores: sanitizeQuizScores(data.quizScores),
    totalXp:
      typeof data.totalXp === 'number' && Number.isFinite(data.totalXp) && data.totalXp >= 0
        ? Math.floor(data.totalXp)
        : 50,
    streakDays:
      typeof data.streakDays === 'number' && Number.isFinite(data.streakDays) && data.streakDays >= 1
        ? Math.floor(data.streakDays)
        : 1,
    lastActiveDate:
      typeof data.lastActiveDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.lastActiveDate)
        ? data.lastActiveDate
        : getUtcDateString(),
    bookmarks: sanitizeIds(data.bookmarks),
    currentModule:
      typeof data.currentModule === 'number' && Number.isFinite(data.currentModule) && data.currentModule >= 1
        ? Math.floor(data.currentModule)
        : 1,
    lastLessonId:
      typeof data.lastLessonId === 'string' && data.lastLessonId.trim()
        ? data.lastLessonId.trim()
        : undefined,
    lastPageIndex:
      typeof data.lastPageIndex === 'number' && Number.isFinite(data.lastPageIndex) && data.lastPageIndex >= 0
        ? Math.floor(data.lastPageIndex)
        : undefined,
    updatedAt:
      typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
  };
}

function hasAnyProgress(progress: UserProgress): boolean {
  return (
    progress.completedLessons.length > 0 ||
    (progress.completedChallenges?.length ?? 0) > 0 ||
    Object.keys(progress.quizScores || {}).length > 0 ||
    progress.bookmarks.length > 0 ||
    progress.totalXp > 50 ||
    Boolean(progress.lastLessonId)
  );
}

export function mergeUserProgress(
  local: UserProgress,
  cloud: UserProgress | null,
  uid: string,
): { merged: UserProgress; shouldPushToCloud: boolean } {
  const isDifferentOwner = Boolean(local.ownerUid && local.ownerUid !== uid);

  if (!cloud) {
    if (isDifferentOwner || !hasAnyProgress(local)) {
      const fresh = createDefaultProgress(uid);
      return { merged: fresh, shouldPushToCloud: true };
    }
    return {
      merged: { ...local, ownerUid: uid },
      shouldPushToCloud: true,
    };
  }

  // Never merge another user's leftover localStorage into this user's cloud profile
  if (isDifferentOwner) {
    return {
      merged: { ...cloud, ownerUid: uid },
      shouldPushToCloud: false,
    };
  }

  // Fresh browser / untouched local state -> adopt cloud progress directly
  if (!local.ownerUid && !hasAnyProgress(local)) {
    return {
      merged: { ...cloud, ownerUid: uid },
      shouldPushToCloud: false,
    };
  }

  const cloudLessonsSet = new Set(cloud.completedLessons);
  const cloudChallengesSet = new Set(cloud.completedChallenges || []);
  const cloudQuizScores = cloud.quizScores || {};

  const localOnlyLessons = local.completedLessons.filter((id) => !cloudLessonsSet.has(id));
  const localOnlyChallenges = (local.completedChallenges || []).filter(
    (id) => !cloudChallengesSet.has(id),
  );
  const localOnlyQuizzes = Object.entries(local.quizScores || {}).filter(
    ([key]) => !(key in cloudQuizScores),
  );

  const mergedLessons = Array.from(
    new Set([...cloud.completedLessons, ...local.completedLessons]),
  );
  const mergedChallenges = Array.from(
    new Set([...(cloud.completedChallenges || []), ...(local.completedChallenges || [])]),
  );
  const mergedBookmarks = Array.from(new Set([...cloud.bookmarks, ...local.bookmarks]));

  const mergedQuizScores: Record<string, number> = { ...cloudQuizScores };
  for (const [key, value] of Object.entries(local.quizScores || {})) {
    mergedQuizScores[key] =
      key in mergedQuizScores ? Math.max(mergedQuizScores[key], value) : value;
  }

  const deltaLessonXp = localOnlyLessons.length * 25;
  const deltaChallengeXp = localOnlyChallenges.reduce(
    (sum, key) => sum + (key.startsWith('generated:') ? 15 : 20),
    0,
  );
  const deltaQuizXp = localOnlyQuizzes.reduce(
    (sum, [, score]) => sum + Math.max(0, score) * 20,
    0,
  );

  const mergedXp = Math.max(
    cloud.totalXp + deltaLessonXp + deltaChallengeXp + deltaQuizXp,
    local.totalXp,
  );

  const localTime = local.updatedAt ? Date.parse(local.updatedAt) : 0;
  const cloudTime = cloud.updatedAt ? Date.parse(cloud.updatedAt) : 0;
  const localIsNewer = Number.isFinite(localTime) && Number.isFinite(cloudTime) && localTime > cloudTime;

  const latestActiveDate =
    local.lastActiveDate > cloud.lastActiveDate ? local.lastActiveDate : cloud.lastActiveDate;
  const latestStreak =
    local.lastActiveDate === cloud.lastActiveDate
      ? Math.max(local.streakDays, cloud.streakDays)
      : local.lastActiveDate > cloud.lastActiveDate
      ? local.streakDays
      : cloud.streakDays;

  const lastLessonId = localIsNewer
    ? local.lastLessonId || cloud.lastLessonId
    : cloud.lastLessonId || local.lastLessonId;
  const lastPageIndex = localIsNewer
    ? local.lastPageIndex ?? cloud.lastPageIndex
    : cloud.lastPageIndex ?? local.lastPageIndex;

  const merged: UserProgress = {
    ownerUid: uid,
    completedLessons: mergedLessons,
    completedChallenges: mergedChallenges,
    quizScores: mergedQuizScores,
    totalXp: mergedXp,
    streakDays: Math.max(1, latestStreak),
    lastActiveDate: latestActiveDate || getUtcDateString(),
    bookmarks: mergedBookmarks,
    currentModule: Math.max(cloud.currentModule || 1, local.currentModule || 1),
    ...(lastLessonId ? { lastLessonId } : {}),
    ...(typeof lastPageIndex === 'number' ? { lastPageIndex } : {}),
    updatedAt: localIsNewer ? local.updatedAt : cloud.updatedAt || new Date().toISOString(),
  };

  const shouldPushToCloud =
    localOnlyLessons.length > 0 ||
    localOnlyChallenges.length > 0 ||
    localOnlyQuizzes.length > 0 ||
    merged.bookmarks.length > cloud.bookmarks.length ||
    merged.totalXp > cloud.totalXp ||
    merged.streakDays > cloud.streakDays ||
    merged.lastActiveDate > cloud.lastActiveDate ||
    merged.currentModule > cloud.currentModule ||
    (localIsNewer &&
      (merged.lastLessonId !== cloud.lastLessonId ||
        merged.lastPageIndex !== cloud.lastPageIndex));

  return { merged, shouldPushToCloud };
}

export async function pushUserProgressToCloud(
  uid: string,
  progress: UserProgress,
): Promise<void> {
  if (!isFirebaseConfigured || !db || !auth.currentUser || auth.currentUser.uid !== uid) {
    return;
  }

  const userRef = doc(db, 'users', uid);
  const email = normalizeEmail(auth.currentUser.email);
  const role = resolveUserRole(email);

  await setDoc(
    userRef,
    {
      uid,
      ...(email ? { email } : {}),
      role,
      completedLessons: progress.completedLessons,
      completedChallenges: progress.completedChallenges || [],
      quizScores: progress.quizScores || {},
      totalXp: progress.totalXp,
      streakDays: progress.streakDays,
      lastActiveDate: progress.lastActiveDate,
      bookmarks: progress.bookmarks || [],
      currentModule: progress.currentModule || 1,
      ...(progress.lastLessonId ? { lastLessonId: progress.lastLessonId } : {}),
      ...(typeof progress.lastPageIndex === 'number'
        ? { lastPageIndex: progress.lastPageIndex }
        : {}),
      lastActiveAt: new Date().toISOString(),
      updatedAt: progress.updatedAt || new Date().toISOString(),
    },
    { merge: true },
  );
}

export function subscribeToCloudUserProgress(uid: string): () => void {
  if (typeof window === 'undefined' || !isFirebaseConfigured || !db || !auth.currentUser) {
    return () => {};
  }

  const userRef = doc(db, 'users', uid);

  const unsubscribeSnapshot = onSnapshot(
    userRef,
    (snapshot) => {
      const local = getUserProgress();
      const cloud = snapshot.exists()
        ? parseCloudProgress(snapshot.data() as Record<string, unknown>, uid)
        : null;

      const { merged, shouldPushToCloud } = mergeUserProgress(local, cloud, uid);
      writeProgressToLocalStorage(merged, { notifyCloudSync: false });

      if (shouldPushToCloud) {
        void pushUserProgressToCloud(uid, merged).catch((err) =>
          console.error('Failed to push merged progress to Firestore:', err),
        );
      }
    },
    (error) => {
      console.error('Failed to subscribe to cloud user progress:', error);
    },
  );

  const handleDirty = () => {
    const current = getUserProgress();
    const stamped: UserProgress = {
      ...current,
      ownerUid: uid,
    };
    writeProgressToLocalStorage(stamped, { notifyCloudSync: false });
    void pushUserProgressToCloud(uid, stamped).catch((err) =>
      console.error('Failed to sync local progress change to Firestore:', err),
    );
  };

  window.addEventListener('swiftlab_progress_dirty', handleDirty);

  return () => {
    unsubscribeSnapshot();
    window.removeEventListener('swiftlab_progress_dirty', handleDirty);
  };
}
