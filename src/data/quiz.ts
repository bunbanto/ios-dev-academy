import { QuizQuestion } from '@/types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'Swift Basics',
    question: 'Що станеться при спробі скомпілювати цей код?',
    codeSnippet: `let maxUsers = 100
maxUsers = 150`,
    options: [
      'Код скомпілюється і значення стане 150',
      'Помилка компілятора: Cannot assign to value: "maxUsers" is a "let" constant',
      'Значення зміниться лише під час виконання (Runtime warning)',
      'Код викличе Fatal Error'
    ],
    correctAnswer: 1,
    explanation: 'Ключове слово `let` створює незмінну константу. Будь-яка спроба змінити її значення призведе до помилки на етапі компіляції.',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    category: 'Optionals',
    question: 'Яке значення буде надруковано в результаті виконання коду?',
    codeSnippet: `var city: String? = nil
let resolvedCity = city ?? "Київ"
print(resolvedCity)`,
    options: [
      'nil',
      'Optional("Київ")',
      'Київ',
      'Помилка виконання (Fatal Error)'
    ],
    correctAnswer: 2,
    explanation: 'Оператор Nil Coalescing `??` повертає розгорнуте значення опціоналу, якщо воно існує, або значення праворуч ("Київ"), якщо опціонал дорівнює nil.',
    difficulty: 'easy'
  },
  {
    id: 'q3',
    category: 'Memory & Architecture',
    question: 'Яка головна відмінність між Struct та Class у Swift?',
    options: [
      'Struct підтримує наслідування, а Class — ні',
      'Struct є Value Type (копіюється), а Class — Reference Type (передається за посиланням)',
      'Struct зберігається тільки в Heap памʼяті',
      'Class не може мати методів та ініціалізаторів'
    ],
    correctAnswer: 1,
    explanation: 'Структури у Swift є Value Types (типами значень) і копіюються при присвоєнні. Класи є Reference Types і передаються за посиланням на спільну область памʼяті в Heap.',
    difficulty: 'medium'
  },
  {
    id: 'q4',
    category: 'SwiftUI',
    question: 'Який property wrapper використовується у SwiftUI для локального приватного стану конкретного View?',
    options: [
      '@Binding',
      '@EnvironmentObject',
      '@State',
      '@ObservedObject'
    ],
    correctAnswer: 2,
    explanation: '`@State` використовується для управління приватним локальним станом View. Коли значення змінюється, SwiftUI автоматично перераховує `body`.',
    difficulty: 'easy'
  },
  {
    id: 'q5',
    category: 'SwiftUI',
    question: 'Як передати стан з батьківського компонента в дочірній для двостороннього звʼязку?',
    codeSnippet: `// Батьківське View:
@State private var isEnabled: Bool = false

// Як передати це у CustomToggle(isOn: ...)?`,
    options: [
      'CustomToggle(isOn: isEnabled)',
      'CustomToggle(isOn: $isEnabled)',
      'CustomToggle(isOn: &isEnabled)',
      'CustomToggle(isOn: @isEnabled)'
    ],
    correctAnswer: 1,
    explanation: 'Символ `$` перед `@State` змінною створює проектовану властивість (Projected Value), яка повертає `Binding<Bool>`.',
    difficulty: 'medium'
  },
  {
    id: 'q6',
    category: 'Memory Management',
    question: 'Як уникнути Retain Cycle (циклічного сильного посилання) всередині замикань (closures)?',
    options: [
      'Використовувати [weak self] або [unowned self] у списку захоплення (capture list)',
      'Завжди викликати deinit вручну',
      'Замінити всі класи на глобальні змінні',
      'Використовувати try await перед замиканням'
    ],
    correctAnswer: 0,
    explanation: 'Використання `[weak self]` у списку захоплення замикання робить посилання на екземпляр слабким, дозволяючи системному лічильнику посилань ARC звільнити памʼять обʼєкта.',
    difficulty: 'medium'
  },
  {
    id: 'q7',
    category: 'Concurrency',
    question: 'Який атрибут гарантує, що код функції або класу буде виконуватися суворо на головному потоці (Main Thread) для оновлення UI?',
    options: [
      '@MainActor',
      '@ThreadSafe',
      '@UIThread',
      '@Synchronized'
    ],
    correctAnswer: 0,
    explanation: '`@MainActor` — це глобальний актор у Swift Concurrency, який гарантує виконання блоку коду або методів класу на головному потоці.',
    difficulty: 'medium'
  },
  {
    id: 'q8',
    category: 'SwiftData',
    question: 'Який макрос у iOS 17+ використовується для декларативного отримання та фільтрації сутностей бази даних у SwiftUI?',
    options: [
      '@FetchRequest',
      '@Query',
      '@PersistentState',
      '@ModelStorage'
    ],
    correctAnswer: 1,
    explanation: 'У SwiftData для отримання даних використовується макрос `@Query`. Він замінив старий `@FetchRequest` з CoreData.',
    difficulty: 'hard'
  }
];
