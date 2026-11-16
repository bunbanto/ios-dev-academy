import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

function savedRef(uid: string) {
  if (!db) throw new Error('Firebase is not configured.');
  return doc(db, 'users', uid, 'private', 'savedLessons');
}

export async function getSavedLessonIds(uid: string): Promise<string[]> {
  if (!auth.currentUser || auth.currentUser.uid !== uid) throw new Error('Sign in to view saved lessons.');
  const snapshot = await getDoc(savedRef(uid));
  const ids = snapshot.data()?.lessonIds;
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [];
}

export async function toggleSavedLesson(uid: string, lessonId: string): Promise<string[]> {
  if (!auth.currentUser || auth.currentUser.uid !== uid) throw new Error('Sign in to save lessons.');
  const ref = savedRef(uid);
  return runTransaction(db!, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = snapshot.data()?.lessonIds;
    const ids = Array.isArray(current) ? current.filter((id): id is string => typeof id === 'string') : [];
    const next = ids.includes(lessonId) ? ids.filter((id) => id !== lessonId) : [...ids, lessonId];
    transaction.set(ref, { lessonIds: next, updatedAt: new Date().toISOString() });
    return next;
  });
}
