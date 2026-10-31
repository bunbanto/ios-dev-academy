import { Lesson } from '@/types';

export const module6Lessons: Lesson[] = [
  {
    id: 'swiftdata-basics-model',
    module: 6,
    moduleTitle: 'Модуль 6: Збереження даних (Persistence)',
    title: 'SwiftData: базовий @Model та @Query',
    description: 'Знайомство з новим фреймворком SwiftData, створення моделей та простих запитів.',
    difficulty: 'Середній',
    estimatedMinutes: 20,
    icon: 'Database',
    content: {
      realWorldContext: 'У великих проєктах потрібно зберігати сутності (користувачі, нотатки) у локальній базі без Core Data.',
      detailedTheory: [
        {
          title: '@Model – декларативне визначення сутності',
          paragraphs: [
            '`@Model` автоматично генерує схему та зберігає об’єкти в SQLite.',
            'Використовується без Boilerplate‑коду Core Data.'
          ]
        },
        {
          title: '@Query – прості запити у SwiftUI',
          paragraphs: [
            '`@Query` підключається до `ModelContainer` і повертає оновлювану колекцію.',
            'Використовується у `List` без додаткових `fetch`‑викликів.'
          ]
        }
      ],
      theory: [],
      codeSnippet: `@Model class Note {
    @Attribute(.unique) var id: UUID = UUID()
    var title: String = ""
    var createdAt: Date = Date()
}

struct NotesListView: View {
    @Query var notes: [Note]
    var body: some View {
        List(notes) { note in Text(note.title) }
    }
}`,
      comparisonSnippet: {
        bad: {
          title: 'Core Data Boilerplate',
          code: `class Note: NSManagedObject { @NSManaged var title: String }
// fetch request, context setup, etc.`,
          explanation: 'Велика кількість коду для створення контексту та запитів.'
        },
        good: {
          title: 'SwiftData @Model',
          code: `@Model class Note { var title: String = "" }
@Query var notes: [Note]` ,
          explanation: 'Декларативно, без зайвих налаштувань.'
        }
      },
      explanation: [],
      underTheHood: {
        title: 'Як SwiftData зберігає дані',
        points: [
          'SwiftData компілює модель у схему SQLite.',
          'Контейнери автоматично синхронізують зміни.',
          'Використовується `ObservableObject` під капотом для оновлення UI.'
        ]
      },
      checkpoints: [
        {
          question: 'Який атрибут потрібен для унікального ідентифікатора?',
          options: ['@PrimaryKey', '@Unique', '@Attribute(.unique)', '@ID'],
          correctAnswer: 2,
          explanation: '`@Attribute(.unique)` оголошує унікальний стовпець у SwiftData.'
        }
      ],
      keyTakeaways: ['SwiftData спрощує локальне сховище', '@Model – декларативний', '@Query – автоматичне оновлення UI'],
      commonMistakes: ['Забути ініціалізувати властивості за замовчуванням'],
      challenge: {
        task: 'Створіть модель `Task` з полями `title`, `isDone` та відобразіть список у SwiftUI.',
        hint: 'Використайте `@Model` та `@Query var tasks: [Task]`.',
        solution: `@Model class Task { var title: String = ""; var isDone: Bool = false }
struct TasksView: View { @Query var tasks: [Task]; var body: some View { List(tasks) { Text($0.title) } } }`
      },
      xcodeLab: {
        task: 'Створіть простий SwiftUI‑проект, підключіть SwiftData, додайте `Note` модель та відобразіть нотатки у List.',
        steps: [
          'Додайте `@Model` клас Note.',
          'Ініціалізуйте `ModelContainer` у `@main` App.',
          'Використайте `@Query var notes: [Note]` у View.',
          'Додайте кнопку додати нову нотатку.'
        ],
        code: `@main
struct DemoApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .modelContainer(for: [Note.self])
        }
    }
}`,
        expectedOutput: 'Список нотаток оновлюється у реальному часі при додаванні.',
        tips: 'Не забудьте позначити властивості як `@Attribute` лише коли потрібна спеціальна поведінка.'
      }
    }
  },
  {
    id: 'userdefaults-advanced',
    module: 6,
    moduleTitle: 'Модуль 6: Збереження даних (Persistence)',
    title: 'UserDefaults + @AppStorage: розширений приклад',
    description: 'Використання UserDefaults для збереження складних типів та інтеграція з @AppStorage.',
    difficulty: 'Початковий',
    estimatedMinutes: 14,
    icon: 'Settings',
    content: {
      realWorldContext: 'Зберігання налаштувань користувача (наприклад, вибраний режим Dark/Light) між сесіями.',
      detailedTheory: [
        {
          title: 'Збереження колекцій у UserDefaults',
          paragraphs: [
            'UserDefaults підтримує типи `Array`, `Dictionary`, `Data`.',            'Для кастомних об’єктів використовуйте `JSONEncoder`/`JSONDecoder`.'
          ]
        },
        {
          title: '@AppStorage для комплексних об’єктів',
          paragraphs: [
            'Створюємо wrapper, що серіалізує/десеріалізує об’єкт у JSON і зберігає його у UserDefaults.',            'UI оновлюється автоматично.'
          ]
        }
      ],
      theory: [],
      codeSnippet: `struct Settings: Codable { var isDark: Bool; var favoriteColors: [String] }

extension Settings {
    static let key = "appSettings"
    static var stored: Settings {
        get {
            if let data = UserDefaults.standard.data(forKey: key),
               let value = try? JSONDecoder().decode(Settings.self, from: data) {
                return value
            }
            return Settings(isDark: false, favoriteColors: [])
        }
        set {
            let data = try? JSONEncoder().encode(newValue)
            UserDefaults.standard.set(data, forKey: key)
        }
    }
}

@AppStorage("appSettings", store: UserDefaults.standard) var settingsData: Data = Settings.stored

// У SwiftUI view: 
VStack {
    Toggle("Dark mode", isOn: Binding(
        get: { settings.isDark },
        set: { var s = settings; s.isDark = $0; Settings.stored = s }
    ))
}`,
      comparisonSnippet: {
        bad: {
          title: 'Прямі UserDefaults без серіалізації',
          code: `UserDefaults.standard.set([true, false], forKey: "flags")`,
          explanation: 'Не можна зберігати масив Bool без перетворення, це призведе до помилки.'
        },
        good: {
          title: 'JSON‑серіалізація',
          code: `let json = try JSONEncoder().encode(settings)
UserDefaults.standard.set(json, forKey: Settings.key)`,
          explanation: 'Безпечне збереження будь‑якої структури.'
        }
      },
      explanation: [],
      underTheHood: {
        title: 'Як @AppStorage працює',
        points: [
          '`@AppStorage` підписується на `UserDefaults.didChangeNotification`.',
          'При зміні значення View перерендерюється.',          'Дані зберігаються у файл .plist у Library/Preferences.'
        ]
      },
      checkpoints: [
        {
          question: 'Which type can be stored directly in UserDefaults?',
          options: ['UIImage', 'Data', 'CustomStruct', 'Array<Any>'],
          correctAnswer: 1,
          explanation: '`Data` є простим типом, який підтримується UserDefaults.'
        }
      ],
      keyTakeaways: ['UserDefaults – просте сховище', '@AppStorage автоматизує UI‑синхронізацію', 'Для складних типів використовуйте JSON‑кодування'],
      commonMistakes: ['Спроба зберегти несеріалізований кастомний тип'],
      challenge: {
        task: 'Зберігайте об’єкт `Settings` (із двома полями) у UserDefaults і підключіть його до UI через @AppStorage.',
        hint: 'Створіть wrapper-структуру, що код/декод знає.',
        solution: `struct Settings: Codable { var isDark: Bool; var fontSize: Double }
extension Settings { static let key = "settings" }
@AppStorage("settings") var data: Data = Data()
var settings: Settings { get { try? JSONDecoder().decode(Settings.self, from: data) ?? Settings(isDark: false, fontSize: 14) } set { data = try! JSONEncoder().encode(newValue) } }`
      },
      xcodeLab: {
        task: 'Створіть налаштування теми та розміру шрифту, які зберігаються у UserDefaults і застосовуються при старті додатку.',
        steps: [
          'Створіть `Settings` struct з `Codable`.',
          'Додайте `@AppStorage` з JSON‑кодуванням.',
          'Використайте `@Environment` для застосування шрифту.',
          'Перевірте збереження після перезапуску.'
        ],
        code: `@main
struct DemoApp: App { @AppStorage("settings") var data: Data = Data() var body: some Scene { WindowGroup { ContentView().environmentObject(SettingsManager(data: $data)) } } }`,
        expectedOutput: 'Тема та шрифт залишаються після закриття програми.',
        tips: 'Не забувайте оновлювати `UserDefaults` у `didSet`.'
      }
    }
  }
];

