import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import type { UserProfile } from '@/types';
import { auth, db } from './firebase';

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  avatar: string;
  totalPoints: number;
  quizzesPlayed: number;
  bestScore: number;
}

export async function recordQuizAttempt(user: UserProfile, correctAnswers: number): Promise<void> {
  if (!db || !auth.currentUser || auth.currentUser.uid !== user.id) {
    throw new Error('Sign in to join the leaderboard.');
  }
  if (!Number.isInteger(correctAnswers) || correctAnswers < 0 || correctAnswers > 8) {
    throw new Error('Invalid quiz score.');
  }

  const playerRef = doc(db, 'leaderboard', user.id);
  const attemptPoints = correctAnswers * 20;

  await runTransaction(db, async (transaction) => {
    const player = await transaction.get(playerRef);
    const previous = player.data();

    transaction.set(playerRef, {
      displayName: user.name.slice(0, 60),
      avatar: user.avatar ?? '',
      totalPoints: (previous?.totalPoints ?? 0) + attemptPoints,
      quizzesPlayed: (previous?.quizzesPlayed ?? 0) + 1,
      bestScore: Math.max(previous?.bestScore ?? 0, correctAnswers),
      lastScore: correctAnswers,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function getLeaderboard(limitCount = 50): Promise<LeaderboardEntry[]> {
  if (!db) throw new Error('Leaderboard is unavailable until Firebase is configured.');

  const playersQuery = query(
    collection(db, 'leaderboard'),
    orderBy('totalPoints', 'desc'),
    limit(limitCount),
  );
  const snapshot = await getDocs(playersQuery);

  return snapshot.docs.map((player) => {
    const data = player.data();
    return {
      id: player.id,
      displayName: typeof data.displayName === 'string' ? data.displayName : 'SwiftLab learner',
      avatar: typeof data.avatar === 'string' ? data.avatar : '',
      totalPoints: typeof data.totalPoints === 'number' ? data.totalPoints : 0,
      quizzesPlayed: typeof data.quizzesPlayed === 'number' ? data.quizzesPlayed : 0,
      bestScore: typeof data.bestScore === 'number' ? data.bestScore : 0,
    };
  });
}
