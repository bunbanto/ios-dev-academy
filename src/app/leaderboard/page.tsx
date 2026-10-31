'use client';

import { useEffect, useState } from 'react';
import { Award, Flame, Medal, Trophy } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleContext';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/leaderboard';

export default function LeaderboardPage() {
  const { locale } = useLocale();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let isCurrent = true;
    getLeaderboard()
      .then((results) => {
        if (!isCurrent) return;
        setEntries(results);
        setStatus('ready');
      })
      .catch(() => {
        if (isCurrent) setStatus('error');
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  const copy = locale === 'en'
    ? {
        eyebrow: 'Community challenge',
        title: 'Leaderboard',
        subtitle: 'Earn 20 points for every correct answer. Every completed round adds to your total.',
        loading: 'Loading players…',
        empty: 'No scores yet. Take a quiz and claim the first spot.',
        setup: 'The leaderboard is unavailable. Firebase and the Firestore database must be configured for this project.',
        failed: 'Could not load the leaderboard. Check the Firestore setup and try again.',
        points: 'points',
        rounds: 'rounds',
        best: 'best round',
      }
    : {
        eyebrow: 'Змагання спільноти',
        title: 'Таблиця лідерів',
        subtitle: 'Отримуйте 20 балів за кожну правильну відповідь. Кожне завершене проходження додає бали до загального результату.',
        loading: 'Завантажуємо гравців…',
        empty: 'Результатів поки немає. Пройдіть квіз і посідайте перше місце.',
        setup: 'Таблиця лідерів недоступна. Для роботи потрібно налаштувати Firebase і базу Firestore.',
        failed: 'Не вдалося завантажити рейтинг. Перевірте налаштування Firestore і спробуйте ще раз.',
        points: 'балів',
        rounds: 'раундів',
        best: 'найкращий раунд',
      };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <header className="text-center space-y-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-semibold">
          <Trophy className="w-4 h-4" /> {copy.eyebrow}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">{copy.title}</h1>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto">{copy.subtitle}</p>
      </header>

      <section className="glass-panel rounded-3xl border border-white/10 p-4 sm:p-6">
        {status === 'loading' && <p className="py-10 text-center text-sm text-neutral-400">{copy.loading}</p>}
        {status === 'error' && (
          <p className="py-10 text-center text-sm text-amber-300">
            {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? copy.failed : copy.setup}
          </p>
        )}
        {status === 'ready' && entries.length === 0 && <p className="py-10 text-center text-sm text-neutral-400">{copy.empty}</p>}
        {status === 'ready' && entries.length > 0 && (
          <ol className="space-y-2">
            {entries.map((entry, index) => (
              <li key={entry.id} className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-white/5 bg-neutral-900/70 px-3 sm:px-4 py-3">
                <span className={`w-8 text-center text-sm font-black ${index === 0 ? 'text-yellow-300' : index === 1 ? 'text-neutral-200' : index === 2 ? 'text-amber-500' : 'text-neutral-500'}`}>
                  {index < 3 ? <Medal className="w-5 h-5 mx-auto" /> : index + 1}
                </span>
                {entry.avatar ? (
                  // Avatar URLs come from the authenticated player's public leaderboard profile.
                  <img src={entry.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-ios-blue/20 text-ios-blue flex items-center justify-center font-bold">{entry.displayName.charAt(0).toUpperCase()}</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{entry.displayName}</p>
                  <p className="text-[11px] text-neutral-500">{entry.quizzesPlayed} {copy.rounds} · {copy.best}: {entry.bestScore}/8</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-300 shrink-0">
                  {index === 0 ? <Trophy className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                  {entry.totalPoints.toLocaleString(locale === 'en' ? 'en-US' : 'uk-UA')} <span className="hidden sm:inline">{copy.points}</span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
