'use client';

import React, { useState } from 'react';
import {
  Wifi,
  Battery,
  Coffee,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ScanFace,
  Lock,
  Unlock,
  Sparkles,
  Music,
  Heart,
  Share2,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';

interface IPhoneMockupProps {
  interactiveType?: 'counter' | 'profile' | 'todo' | 'weather' | 'tipcalc' | 'biometric';
}

export default function IPhoneMockup({ interactiveType = 'counter' }: IPhoneMockupProps) {
  // Island expansion
  const [islandExpanded, setIslandExpanded] = useState(false);

  // Counter State
  const [cups, setCups] = useState(3);
  const [isHot, setIsHot] = useState(true);

  // Profile State
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(142);
  const [activeTheme, setActiveTheme] = useState<'indigo' | 'sunset' | 'dark'>('indigo');

  // Todo State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Пройти модуль Опціоналів Swift', done: true },
    { id: 2, title: 'Скласти UI на базі VStack та HStack', done: true },
    { id: 3, title: 'Підключити SwiftData для нотаток', done: false },
    { id: 4, title: 'Задеплоїти білд у TestFlight', done: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Tip Calculator State
  const [bill, setBill] = useState(65);
  const [tipPercent, setTipPercent] = useState(18);

  // Biometric State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsUnlocked(!isUnlocked);
    }, 1200);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTaskInput.trim(), done: false }]);
    setNewTaskInput('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const tipAmount = (bill * tipPercent) / 100;
  const totalBill = bill + tipAmount;

  return (
    <div className="relative mx-auto flex items-center justify-center p-4">
      {/* Outer Titanium Phone Shell */}
      <div className="relative w-[340px] sm:w-[360px] h-[700px] bg-[#1a1a1c] rounded-[55px] p-3 shadow-2xl ring-1 ring-white/20 shadow-black/80 flex flex-col justify-between">
        {/* Hardware buttons */}
        {/* Action Button & Volume Up/Down on Left */}
        <div className="absolute -left-[5px] top-[115px] w-[5px] h-[28px] bg-neutral-700 rounded-l-md shadow-sm"></div>
        <div className="absolute -left-[5px] top-[160px] w-[5px] h-[50px] bg-neutral-700 rounded-l-md shadow-sm"></div>
        <div className="absolute -left-[5px] top-[225px] w-[5px] h-[50px] bg-neutral-700 rounded-l-md shadow-sm"></div>

        {/* Power Button on Right */}
        <div className="absolute -right-[5px] top-[180px] w-[5px] h-[75px] bg-neutral-700 rounded-r-md shadow-sm"></div>

        {/* Screen Bezel & Display */}
        <div className="relative w-full h-full bg-[#000000] rounded-[46px] overflow-hidden flex flex-col justify-between border-[3px] border-[#2c2c2e]">
          {/* Top Status Bar */}
          <div className="relative z-30 pt-3 px-7 flex items-center justify-between text-white text-[12px] font-semibold tracking-tight select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">100%</span>
                <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              </div>
            </div>
          </div>

          {/* Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 transition-all duration-300">
            <button
              onClick={() => setIslandExpanded(!islandExpanded)}
              className={`bg-black text-white rounded-full flex items-center justify-between px-3 transition-all duration-300 shadow-lg ${
                islandExpanded
                  ? 'w-[280px] h-[48px] rounded-[24px] bg-[#121214] border border-white/10'
                  : 'w-[105px] h-[28px] hover:w-[125px]'
              }`}
            >
              {islandExpanded ? (
                <div className="flex items-center justify-between w-full px-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-pink-500 animate-spin" />
                    <span className="font-medium text-[11px] truncate max-w-[130px]">Swift 6.0 Podcast</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#181822] border border-blue-900/40"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </>
              )}
            </button>
          </div>

          {/* Screen Inner Content */}
          <div className="relative z-10 flex-1 pt-12 pb-6 px-4 overflow-y-auto custom-scrollbar flex flex-col">
            {/* Interactive Mode: Counter (Coffee Tracker) */}
            {interactiveType === 'counter' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-3 bg-neutral-900/80 rounded-2xl border border-white/10 backdrop-blur w-full">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                    SwiftUI Live Preview
                  </span>
                  <p className="text-xs text-neutral-300">@State & Animation Spring</p>
                </div>

                <div className="relative">
                  <div
                    className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                      isHot
                        ? 'bg-gradient-to-tr from-amber-600 to-orange-400 shadow-orange-500/30'
                        : 'bg-gradient-to-tr from-cyan-600 to-blue-400 shadow-blue-500/30'
                    }`}
                  >
                    <Coffee className="w-14 h-14 text-white transform hover:rotate-12 transition-transform" />
                  </div>
                  <span className="absolute -top-1 -right-1 bg-white text-black font-black text-xs px-2 py-0.5 rounded-full shadow">
                    {cups}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {cups} {cups === 1 ? 'Чашка кави' : cups >= 2 && cups <= 4 ? 'Чашки кави' : 'Чашок кави'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isHot ? '🔥 Гаряче американо' : '❄️ Освіжаючий айс лате'}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => setCups(Math.max(0, cups - 1))}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-white font-semibold text-sm hover:bg-neutral-700 active:scale-95 transition-all"
                  >
                    - Менше
                  </button>
                  <button
                    onClick={() => setCups(cups + 1)}
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-500/30 transition-all"
                  >
                    + Ще одну!
                  </button>
                </div>

                <div className="w-full pt-2">
                  <button
                    onClick={() => setIsHot(!isHot)}
                    className="w-full py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span>Перемкнути: {isHot ? 'Зробити з льодом' : 'Зробити гарячою'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Mode: Profile */}
            {interactiveType === 'profile' && (
              <div className="flex-1 flex flex-col justify-center space-y-5">
                <div
                  className={`p-5 rounded-3xl transition-all duration-500 shadow-xl border border-white/20 ${
                    activeTheme === 'indigo'
                      ? 'bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600'
                      : activeTheme === 'sunset'
                      ? 'bg-gradient-to-br from-orange-600 via-rose-600 to-purple-800'
                      : 'bg-gradient-to-br from-neutral-900 to-black border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-black border border-white/30 shadow-inner">
                      iOS
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">Олег Мельник</h4>
                      <p className="text-white/80 text-xs">Junior iOS Developer</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-black/30 backdrop-blur text-white text-[10px] rounded-full font-medium">
                        SwiftUI & SwiftData
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 text-center text-white bg-black/25 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <div>
                      <span className="block text-sm font-bold">14</span>
                      <span className="text-[10px] text-white/70">Уроків</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold">4</span>
                      <span className="text-[10px] text-white/70">Проєкти</span>
                    </div>
                    <div>
                      <span className="block text-sm font-bold">4.9 ★</span>
                      <span className="text-[10px] text-white/70">Рейтинг</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsLiked(!isLiked);
                        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white text-xs font-semibold transition-all active:scale-95"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-400 text-red-400' : 'text-white'}`}
                      />
                      <span>{likesCount}</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Поділитися</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-neutral-400 block font-medium">Тема картки:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTheme('indigo')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-medium border ${
                        activeTheme === 'indigo'
                          ? 'border-indigo-400 bg-indigo-500/20 text-white'
                          : 'border-white/10 text-neutral-400'
                      }`}
                    >
                      Indigo
                    </button>
                    <button
                      onClick={() => setActiveTheme('sunset')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-medium border ${
                        activeTheme === 'sunset'
                          ? 'border-orange-400 bg-orange-500/20 text-white'
                          : 'border-white/10 text-neutral-400'
                      }`}
                    >
                      Sunset
                    </button>
                    <button
                      onClick={() => setActiveTheme('dark')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-medium border ${
                        activeTheme === 'dark'
                          ? 'border-neutral-400 bg-white/10 text-white'
                          : 'border-white/10 text-neutral-400'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Mode: To-Do */}
            {interactiveType === 'todo' && (
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-base font-bold text-white">Список справ</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-ios-blue/20 text-ios-blue font-semibold">
                      {tasks.filter((t) => t.done).length}/{tasks.length} готово
                    </span>
                  </div>

                  <div className="space-y-2 mt-3 max-h-[360px] overflow-y-auto pr-1">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-all border ${
                          task.done
                            ? 'bg-neutral-900/50 border-white/5 text-neutral-500'
                            : 'bg-neutral-900 border-white/10 text-white'
                        }`}
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="flex items-center gap-2.5 text-left flex-1"
                        >
                          {task.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          )}
                          <span className={`text-xs ${task.done ? 'line-through' : 'font-medium'}`}>
                            {task.title}
                          </span>
                        </button>
                        <button
                          onClick={() => removeTask(task.id)}
                          className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddTask} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Додати нове завдання..."
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-ios-blue text-white hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Interactive Mode: Tip Calculator */}
            {interactiveType === 'tipcalc' && (
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                    Калькулятор Рахунку
                  </span>
                  <h3 className="text-3xl font-black text-white mt-1">
                    ${totalBill.toFixed(2)}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Рахунок: ${bill} + Чайові: ${tipAmount.toFixed(2)} ({tipPercent}%)
                  </p>
                </div>

                <div className="space-y-4 bg-neutral-900/90 p-4 rounded-2xl border border-white/10">
                  <div>
                    <div className="flex justify-between text-xs text-neutral-300 font-medium mb-1.5">
                      <span>Сума чеку</span>
                      <span className="text-white font-bold">${bill}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="5"
                      value={bill}
                      onChange={(e) => setBill(Number(e.target.value))}
                      className="w-full accent-ios-blue cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-neutral-300 font-medium mb-1.5">
                      <span>Відсоток чайових</span>
                      <span className="text-emerald-400 font-bold">{tipPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={tipPercent}
                      onChange={(e) => setTipPercent(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 18, 20].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setTipPercent(pct)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        tipPercent === pct
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Mode: Biometric / FaceID */}
            {interactiveType === 'biometric' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div
                    className={`w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 shadow-xl shadow-emerald-500/20'
                        : isScanning
                        ? 'bg-ios-blue/20 border-2 border-ios-blue text-ios-blue animate-pulse'
                        : 'bg-neutral-900 border border-white/10 text-neutral-400'
                    }`}
                  >
                    {isUnlocked ? (
                      <Unlock className="w-12 h-12" />
                    ) : isScanning ? (
                      <ScanFace className="w-12 h-12 animate-bounce" />
                    ) : (
                      <Lock className="w-12 h-12" />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isUnlocked ? 'Вхід Підтверджено!' : isScanning ? 'Сканування Face ID...' : 'Додаток Заблоковано'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-[200px] mx-auto">
                    {isUnlocked
                      ? 'Біометричний токен отримано через LocalAuthentication.'
                      : 'Натисніть кнопку нижче, щоб перевірити Face ID.'}
                  </p>
                </div>

                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95 shadow-lg ${
                    isUnlocked
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                      : 'bg-ios-blue text-white hover:bg-blue-600 shadow-ios-blue/30'
                  }`}
                >
                  {isScanning ? 'Обробка...' : isUnlocked ? 'Заблокувати знову' : 'Сканувати через Face ID'}
                </button>
              </div>
            )}

            {/* Interactive Mode: Weather */}
            {interactiveType === 'weather' && (
              <div className="flex-1 flex flex-col justify-center space-y-5">
                <div className="bg-gradient-to-b from-blue-600 to-sky-400 p-5 rounded-3xl text-white shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">Київ</h4>
                      <p className="text-xs text-blue-100">Переважно сонячно</p>
                    </div>
                    <span className="text-4xl">☀️</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-5xl font-light">22°</span>
                    <div className="flex gap-2 text-xs text-blue-100 mt-1">
                      <span>Мін: 14°</span>
                      <span>Макс: 24°</span>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 p-3 rounded-2xl border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Вологість</span>
                    <span className="text-white font-semibold">48%</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Швидкість вітру</span>
                    <span className="text-white font-semibold">4.2 м/с</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>УФ-індекс</span>
                    <span className="text-white font-semibold">3 (Помірний)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom iOS Home Indicator Bar */}
          <div className="relative z-30 pb-2 flex justify-center">
            <div className="w-32 h-1 bg-white/60 rounded-full hover:bg-white transition-colors cursor-pointer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

