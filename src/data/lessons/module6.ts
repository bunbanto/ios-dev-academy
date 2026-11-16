import { Lesson } from '@/types';

export const module6Lessons: Lesson[] = [
  {
    id: 'swiftdata-basics-model',
    module: 6,
    moduleTitle: 'Модуль 6: Збереження даних (Persistence)',
    title: 'SwiftData: базовий @Model, ModelContainer та @Query',
    description: 'Опануйте сучасний нативний фреймворк SwiftData від Apple: створення персистентних сутностей @Model, звʼязування з SQLite та реактивні запити @Query у SwiftUI.',
    difficulty: 'Середній',
    estimatedMinutes: 24,
    icon: 'Database',
    content: {
      realWorldContext: 'Коли користувач вимикає iPhone або закриває додаток, усе, що було збережено у звичайних змінних `@State`, миттєво зникає з оперативної памʼяті (RAM). Щоб нотатки, списки покупок чи профіль залишалися на місці навіть після перезавантаження телефону, використовується постійне сховище (Persistence). SwiftData — найновіший стандарт Apple для роботи з локальними базами даних.',
      detailedTheory: [
        {
          title: 'Що таке SwiftData і чому вона замінила Core Data?',
          paragraphs: [
            'Десятиліттями стандартом бази даних в iOS був Core Data — потужний, але вкрай складний фреймворк, створений ще за часів Objective-C. Для нього потрібно було малювати візуальні схеми `.xcdatamodeld` та писати кілометри коду налаштування.',
            'На WWDC 2023 Apple представила **SwiftData**: повністю новий фреймворк, побудований спеціально під Swift та декларативний SwiftUI на основі макросів мови. Він використовує надійний рушій SQLite під капотом, але позбавляє розробника будь-якої рутини.'
          ]
        },
        {
          title: 'Тріада SwiftData: @Model, ModelContainer та ModelContext',
          paragraphs: [
            '1. **@Model**: макрос, який перетворює звичайний клас Swift на схему реляційної бази даних.\n2. **ModelContainer**: бекенд-менеджер, який створює файл бази на диску та керує міграціями.\n3. **ModelContext**: "робочий стіл" у памʼяті, куди ви вставляєте нові обʼєкти (`insert`) або видаляєте непотрібні (`delete`).'
          ]
        },
        {
          title: 'Реактивні запити через @Query',
          paragraphs: [
            'Вам більше не потрібно писати SQL-запити! Макрос `@Query` прямо у вашому SwiftUI View автоматично підписується на зміни бази даних: щойно до бази додається новий запис, список на екрані оновлюється сам із плавною анімацією.'
          ]
        }
      ],
      theory: [
        'SwiftData замінила застарілий Core Data у 2023 році.',
        '@Model перетворює клас Swift у таблицю SQLite.',
        'ModelContainer налаштовується один раз у корені додатку App.',
        '@Query автоматично синхронізує інтерфейс із базою даних.',
        'modelContext.insert() та delete() керують записами.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Декларативна SwiftData',
          code: `@Model
class NoteItem {
    var title: String
    var createdAt: Date
    
    init(title: String, createdAt: Date = .now) {
        self.title = title
        self.createdAt = createdAt
    }
}

struct NotesScreen: View {
    @Query(sort: \\.createdAt, order: .reverse) var notes: [NoteItem]
    // UI автоматично оновлюється при змінах у базі!
}`,
          explanation: 'Лише макроси @Model та @Query: база даних створена, а список автоматично відсортовано за датою.'
        },
        bad: {
          title: 'Застарілий багатослівний Core Data',
          code: `class NoteItem: NSManagedObject {
    @NSManaged var title: String?
    @NSManaged var createdAt: Date?
}
// 50 рядків коду для NSPersistentContainer,
// NSFetchRequest, контекстів та ручних збережень context.save()`,
          explanation: 'Складний імперативний код, схильний до помилок типів та падінь у рантаймі.'
        }
      },
      codeSnippet: `import SwiftUI
import SwiftData

// 1. Оголошення моделі бази даних
@Model
final class ShoppingTask {
    @Attribute(.unique) var id: UUID
    var title: String
    var isCompleted: Bool
    var createdAt: Date
    
    init(title: String, isCompleted: Bool = false) {
        self.id = UUID()
        self.title = title
        self.isCompleted = isCompleted
        self.createdAt = .now
    }
}

// 2. Головний екран списку завдань
struct ShoppingTasksView: View {
    @Environment(\\.modelContext) private var modelContext
    @Query(sort: \\.createdAt, order: .reverse) private var tasks: [ShoppingTask]
    
    @State private var newTaskTitle = ""
    
    var body: some View {
        NavigationStack {
            List {
                Section {
                    HStack {
                        TextField("Нова покупка...", text: $newTaskTitle)
                        Button("Додати") {
                            addNewTask()
                        }
                        .disabled(newTaskTitle.trimmingCharacters(in: .whitespaces).isEmpty)
                    }
                }
                
                Section("Список покупок") {
                    ForEach(tasks) { task in
                        HStack {
                            Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(task.isCompleted ? .green : .secondary)
                                .onTapGesture {
                                    task.isCompleted.toggle()
                                }
                            
                            Text(task.title)
                                .strikethrough(task.isCompleted)
                        }
                    }
                    .onDelete(perform: deleteTask)
                }
            }
            .navigationTitle("SwiftData Покупки")
        }
    }
    
    private func addNewTask() {
        let task = ShoppingTask(title: newTaskTitle)
        modelContext.insert(task) // Додаємо в базу
        newTaskTitle = ""
    }
    
    private func deleteTask(at offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(tasks[index]) // Видаляємо з бази
        }
    }
}`,
      explanation: [
        '`@Model` робить клас персистентним: будь-які зміни полів автоматично зберігаються на диск.',
        '`@Attribute(.unique)` гарантує, що поле `id` буде первинним унікальним ключем у базі SQLite.',
        '`modelContext.insert(task)` зберігає новий обʼєкт, а `@Query` негайно оновлює список на екрані.'
      ],
      underTheHood: {
        title: 'Як SwiftData працює на рівні SQLite',
        points: [
          'SwiftData використовує вбудовану в iOS реляційну базу даних SQLite, створюючи файл `.store` у захищеній пісочниці додатку (Application Support).',
          'Під капотом макрос `@Model` реалізує протокол `PersistentModel` і замінює властивості класу на спеціальні геттери й сеттери, які автоматично відстежують зміни (dirty checking).',
          'Коли ви змінюєте `task.isCompleted.toggle()`, SwiftData автоматично формує та виконує SQL-команду `UPDATE` у фоновому потоці.'
        ]
      },
      checkpoints: [
        {
          question: 'Яким ключовим словом має бути оголошена модель SwiftData: struct чи class?',
          options: [
            'Обовʼязково class, тому що SwiftData вимагає семантики посилань для відстеження змін',
            'Обовʼязково struct',
            'Можна використовувати enum',
            'Будь-яким із перелічених'
          ],
          correctAnswer: 0,
          explanation: 'Моделі SwiftData з макросом @Model зобовʼязані бути класами (class), щоб система могла ідентифікувати та оновлювати конкретний екземпляр у памʼяті.'
        }
      ],
      keyTakeaways: [
        'SwiftData — сучасний стандарт локального збереження даних в iOS.',
        'Моделі описуються як `@Model class MyEntity`.',
        'ModelContainer налаштовується у файлі App через `.modelContainer(for: ...)`',
        '@Query автоматично завантажує дані та оновлює SwiftUI View при змінах.'
      ],
      commonMistakes: [
        'Спроба оголосити `@Model struct` замість `@Model class`.',
        'Забування додати `.modelContainer(for: [MyModel.self])` у кореневому файлі `App.swift`.'
      ],
      challenge: {
        task: 'Створіть модель `Bookmark` для SwiftData з полями `url: String`, `title: String` та датою додавання `createdAt: Date`. Забезпечте ініціалізатор за замовчуванням.',
        hint: 'Використовуйте @Model final class Bookmark { ... } з init(url:title:createdAt:)',
        solution: `@Model
final class Bookmark {
    var url: String
    var title: String
    var createdAt: Date
    
    init(url: String, title: String, createdAt: Date = .now) {
        self.url = url
        self.title = title
        self.createdAt = createdAt
    }
}`
      }
    },
    pages: [
      {
        id: 'swiftdata-intuition-sqlite',
        title: 'Інтуїція: Памʼять RAM проти Диска та еволюція від Core Data до SwiftData',
        stepLabel: '1. Інтуїція & Локальні бази',
        description: 'Зрозумійте різницю між тимчасовим станом у памʼяті та персистентним збереженням на диску смартфона.',
        content: {
          realWorldContext: 'Коли ви робите знімок на камеру чи пишете нотатку в Apple Notes, ви очікуєте, що інформація не зникне, якщо розрядиться акумулятор. Це завдання персистентності — запису байтів у постійну енергонезалежну памʼять пристрою.',
          detailedTheory: [
            {
              title: 'Метафора: Дошка з крейдою проти камʼяної стели',
              paragraphs: [
                '• **Оперативна памʼять (RAM)** — це шкільна дошка, написана крейдою. Ви можете писати туди блискавично швидко, прати й оновлювати цифри тисячі разів на секунду. Але щойно ви вимикаєте світло (користувач закриває додаток) — хтось проводить вологою губкою, і дошка стає абсолютно чистою. Це змінні `@State`.\n• **Постійне сховище (Диск / База даних)** — це висікання напису на міцному камені. Це займає трохи більше часу, але напис залишиться на століття. Це **SwiftData**.'
              ]
            },
            {
              title: 'Чому SwiftData — це прорив?',
              paragraphs: [
                'Раніше розробники мусили вивчати спеціальну мову предикатів `NSPredicate(format: "age > %d", 18)`. Якщо в рядку була одруківка, додаток падав у момент запуску!\n\nSwiftData повністю інтегрована в мову: ви фільтруєте дані за допомогою звичайних замикань Swift: `#Predicate<User> { $0.age > 18 }`. Компілятор перевіряє типи ще на етапі написання коду!'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Що відбувається зі звичайними змінними @State після повного закриття додатку користувачем?',
              options: [
                'Вони повністю стираються з оперативної памʼяті RAM',
                'Вони автоматично записуються в базу даних Apple',
                'Вони відправляються на сервер поштою',
                'Вони залишаються збереженими назавжди'
              ],
              correctAnswer: 0,
              explanation: 'Оперативна памʼять очищується при завершенні процесу додатку; для збереження даних потрібна персистентність (SwiftData або UserDefaults).'
            },
            {
              question: 'Яку головну перевагу надає використання SwiftData замість старого Core Data?',
              options: [
                'Повна типобезпека через макроси мови Swift, мінімум шаблонного коду та природна інтеграція зі SwiftUI',
                'SwiftData може працювати без електрики',
                'Core Data не підтримує мову Swift',
                'SwiftData дозволяє зберігати тільки картинки'
              ],
              correctAnswer: 0,
              explanation: 'SwiftData розроблена з нуля для Swift, замінюючи складні конфігураційні файли декларативними макросами @Model та @Query.'
            }
          ]
        }
      },
      {
        id: 'swiftdata-syntax-model-container',
        title: 'Анатомія сутності: Макрос @Model, унікальні атрибути та ModelContainer',
        stepLabel: '2. Анатомія @Model',
        description: 'Як декларувати класи моделей, позначати первинні ключі та підключати сховище у корені App.',
        content: {
          realWorldContext: 'Створення нової таблиці в базі даних зі SwiftData займає рівно 5 рядків коду — без жодних SQL-команд CREATE TABLE.',
          detailedTheory: [
            {
              title: 'Оголошення класу @Model',
              paragraphs: [
                'Ви просто додаєте макрос `@Model` перед словом `class`:\n```swift\n@Model\nfinal class Note {\n    var title: String\n    var content: String\n    var isPinned: Bool\n    \n    init(title: String, content: String, isPinned: Bool = false) {\n        self.title = title\n        self.content = content\n        self.isPinned = isPinned\n    }\n}\n```\nSwiftData автоматично перетворить кожне поле на відповідну колонку в таблиці SQLite.'
              ]
            },
            {
              title: 'Спеціальні атрибути: @Attribute та @Relationship',
              paragraphs: [
                '• `@Attribute(.unique)`: позначає поле як унікальне. Якщо спробувати вставити обʼєкт з уже наявним `id`, база не створить дублікат, а оновить наявний рядок (Upsert).\n• `@Relationship(deleteRule: .cascade)`: визначає звʼязок між таблицями (наприклад, якщо видалити автора — автоматично видаляться всі його статті).'
              ]
            },
            {
              title: 'Налаштування в файлі App.swift',
              paragraphs: [
                'Щоб SwiftUI знав, де шукати базу даних, у головному файлі додатку до вікна додається модифікатор:\n`.modelContainer(for: [Note.self, User.self])`.'
              ]
            }
          ],
          codeSnippet: `import SwiftUI
import SwiftData

// Головний вхідний файл програми
@main
struct DiaryApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        // Ініціалізація бази даних для моделі Note
        .modelContainer(for: [Note.self])
    }
}`,
          explanation: [
            '`.modelContainer(for: [Note.self])` створює на диску файл бази SQLite та автоматично впроваджує `modelContext` у середовище `@Environment` для всіх дочірніх екранів.'
          ]
        }
      },
      {
        id: 'swiftdata-crud-query',
        title: 'Операції CRUD: Створення, читання через @Query, оновлення та видалення',
        stepLabel: '3. CRUD & @Query',
        description: 'Як додавати нові записи через modelContext, сортувати вибірки @Query та видаляти непотрібне.',
        content: {
          realWorldContext: 'CRUD — це 4 фундаментальні операції будь-якої бази: Create (створити), Read (прочитати), Update (оновити), Delete (видалити). У SwiftData всі чотири робляться природними діями з обʼєктами.',
          detailedTheory: [
            {
              title: '1. Create (Створення)',
              paragraphs: [
                'Створюємо звичайний екземпляр класу і викликаємо `modelContext.insert(myObject)`. Обʼєкт тепер відстежується базою даних.'
              ]
            },
            {
              title: '2. Read (Читання через @Query)',
              paragraphs: [
                '`@Query` дозволяє задавати сортування та фільтрацію прямо в оголошенні:\n`@Query(sort: \\.title, order: .forward) var notes: [Note]`.\nВам не потрібно викликати жодних методів `loadNotes()` — масив завжди актуальний!'
              ]
            },
            {
              title: '3. Update (Оновлення)',
              paragraphs: [
                'Ви просто змінюєте поле екземпляра: `note.title = "Нова назва"`. SwiftData автоматично помітить зміну і збереже її на диск у найближчий зручний момент.'
              ]
            },
            {
              title: '4. Delete (Видалення)',
              paragraphs: [
                'Викликаємо `modelContext.delete(note)`. Обʼєкт негайно зникає з інтерфейсу та стирається з бази.'
              ]
            }
          ],
          codeSnippet: `import SwiftUI
import SwiftData

struct FastNoteRow: View {
    // Пряма прив'язка до об'єкта моделі
    @Bindable var note: Note
    let onDelete: () -> Void
    
    var body: some View {
        HStack {
            TextField("Назва нотатки", text: $note.title)
            
            Button(action: { note.isPinned.toggle() }) {
                Image(systemName: note.isPinned ? "pin.fill" : "pin")
                    .foregroundStyle(note.isPinned ? .orange : .secondary)
            }
            .buttonStyle(.plain)
        }
    }
}`,
          explanation: [
            '`@Bindable var note: Note` дозволяє редагувати поля моделі безпосередньо через `TextField`: кожна набрана літера автоматично синхронізується з базою даних!'
          ]
        }
      },
      {
        id: 'swiftdata-errors-debugging-quiz',
        title: 'Типові помилки SwiftData в Xcode & Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо фатальні помилки відсутності ModelContainer, проблеми міграцій та перевіряємо засвоєння матеріалу.',
        content: {
          realWorldContext: 'Найпоширеніший краш під час першого знайомства зі SwiftData — це виклик @Query на екрані, де забули підключити контейнер бази даних.',
          detailedTheory: [
            {
              title: 'Топ помилок зі SwiftData',
              paragraphs: [
                '1. **Fatal error: No ModelContainer found in environment**:\nВи використали `@Query` або `@Environment(\\.modelContext)`, але забули додати `.modelContainer(for: ...)` у превʼю `#Preview` або у кореневому вікні `App`.\n*Виправлення*: завжди додавайте `.modelContainer(for: MyModel.self)` у вікні додатку або в макеті `#Preview`.\n\n2. **Cannot use \'struct\' with @Model**:\nСпроба написати `@Model struct Item`. Макрос `@Model` призначений виключно для класів (`class`).\n\n3. **Помилка схеми при зміні полів (Crash on launch)**:\nВи додали нове неопціональне поле без початкового значення у вже існуючу модель, а на телефоні залишилася стара база.\n*Виправлення*: завжди надавайте полям значення за замовчуванням (`var count: Int = 0`) або робіть їх опціональними (`var note: String?`).'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Що станеться при запуску View з @Query, якщо в ієрархії відсутній .modelContainer?',
              options: [
                'Додаток миттєво впаде з Fatal Error: No ModelContainer found in environment',
                'Список просто буде порожнім',
                'SwiftData автоматично збереже все в iCloud',
                'Xcode покаже попередження, але продовжить роботу'
              ],
              correctAnswer: 0,
              explanation: '@Query вимагає обовʼязкової наявності активного ModelContainer у середовищі SwiftUI.'
            },
            {
              question: 'Чому всім новим властивостям у моделі @Model рекомендується задавати значення за замовчуванням?',
              options: [
                'Щоб уникнути збоїв автоматичної міграції, коли в уже збережених рядках бази зʼявляється нова колонка',
                'Тому що Swift забороняє змінні без значень',
                'Це зменшує розмір шрифту',
                'Для прискорення роботи Wi-Fi'
              ],
              correctAnswer: 0,
              explanation: 'Значення за замовчуванням дозволяють SwiftData безпечно зчитувати старі записи бази, заповнюючи нові поля автоматично.'
            },
            {
              question: 'Як видалити обʼєкт із бази даних SwiftData?',
              options: [
                'modelContext.delete(item)',
                'item.erase()',
                'DELETE FROM table WHERE id = ...',
                'item = nil'
              ],
              correctAnswer: 0,
              explanation: 'Метод delete() контексту modelContext позначає і видаляє обʼєкт із персистентного сховища.'
            }
          ]
        }
      },
      {
        id: 'swiftdata-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінний щоденник тренувань на базі SwiftData з фільтрацією та сортуванням.',
        content: {
          realWorldContext: 'Створіть у Playground модель фітнес-запису `WorkoutSession` з тривалістю, типом активності та нотатками, яка зберігається на диск пристрою.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: ЖУРНАЛ ТРЕНУВАНЬ SWIFTDATA
// ==========================================

import SwiftUI
import SwiftData

// 1. Модель сутності тренування
@Model
final class WorkoutSession {
    var activityType: String
    var durationMinutes: Int
    var caloriesBurned: Int
    var date: Date
    
    init(activityType: String, durationMinutes: Int, caloriesBurned: Int, date: Date = .now) {
        self.activityType = activityType
        self.durationMinutes = durationMinutes
        self.caloriesBurned = caloriesBurned
        self.date = date
    }
}

// 2. Інтерфейс списку тренувань
struct WorkoutTrackerView: View {
    @Environment(\\.modelContext) private var context
    
    // Сортування: найновіші тренування зверху
    @Query(sort: \\.date, order: .reverse) private var workouts: [WorkoutSession]
    
    var body: some View {
        NavigationStack {
            List {
                Section("Статистика") {
                    let totalCalories = workouts.reduce(0) { $0 + $1.caloriesBurned }
                    Text("Загалом спалено: \\(totalCalories) ккал")
                        .font(.headline)
                        .foregroundStyle(.orange)
                }
                
                Section("Історія тренувань") {
                    ForEach(workouts) { item in
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(item.activityType)
                                    .font(.headline)
                                Text("\\(item.durationMinutes) хв • \\(item.date.formatted(date: .abbreviated, time: .omitted))")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            
                            Spacer()
                            
                            Text("🔥 \\(item.caloriesBurned) ккал")
                                .fontWeight(.semibold)
                        }
                    }
                    .onDelete { indexSet in
                        for index in indexSet {
                            context.delete(workouts[index])
                        }
                    }
                }
            }
            .navigationTitle("Мої тренування")
            .toolbar {
                Button(action: addSampleWorkout) {
                    Label("Додати", systemImage: "plus")
                }
            }
        }
    }
    
    private func addSampleWorkout() {
        let sample = WorkoutSession(activityType: "Біг на свіжому повітрі", durationMinutes: 35, caloriesBurned: 320)
        context.insert(sample)
    }
}

// Прев'ю з тимчасовим in-memory контейнером
#Preview {
    WorkoutTrackerView()
        .modelContainer(for: [WorkoutSession.self], inMemory: true)
}`,
          explanation: [
            '`inMemory: true` у `#Preview` створює тимчасову базу в памʼяті без збереження на диск, що ідеально для тестів та дизайну в Canvas.',
            '`workouts.reduce(0) { $0 + $1.caloriesBurned }` демонструє обчислення сумарних показників прямо над реактивним масивом `@Query`.',
            'Метод `context.delete` безпечно видаляє обрані тренування зі сховища.'
          ],
          challenge: {
            task: 'Створіть модель `Bookmark` для SwiftData з полями `url: String`, `title: String` та датою додавання `createdAt: Date`. Забезпечте ініціалізатор за замовчуванням.',
            hint: 'Використовуйте @Model final class Bookmark { ... } з init(url:title:createdAt:)',
            solution: `@Model
final class Bookmark {
    var url: String
    var title: String
    var createdAt: Date
    
    init(url: String, title: String, createdAt: Date = .now) {
        self.url = url
        self.title = title
        self.createdAt = createdAt
    }
}`
          }
        }
      }
    ]
  },
  {
    id: 'userdefaults-advanced',
    module: 6,
    moduleTitle: 'Модуль 6: Збереження даних (Persistence)',
    title: 'UserDefaults та @AppStorage: Збереження налаштувань',
    description: 'Дізнайтеся, коли для збереження достатньо простого UserDefaults, як працює магічний @AppStorage у SwiftUI та як зберігати структури Codable.',
    difficulty: 'Початковий',
    estimatedMinutes: 20,
    icon: 'Settings',
    content: {
      realWorldContext: 'Не для всіх даних потрібна важка база даних SQLite. Чи ввімкнув користувач "Темну тему"? Який звук сповіщення обрав? Чи пройшов екран ознайомлення Onboarding? Для таких дрібних прапорців та налаштувань Apple створила надшвидке та просте сховище — `UserDefaults` та обгортку `@AppStorage`.',
      detailedTheory: [
        {
          title: 'Що таке UserDefaults?',
          paragraphs: [
            '`UserDefaults` — це просте ключ-значення сховище (Key-Value Store), що зберігається на диску пристрою у вигляді файлу `.plist` (Property List) у папці `Library/Preferences` вашого додатку.',
            'Він підтримує збереження базових типів: `Bool`, `Int`, `Float`, `Double`, `String`, `Date`, `Data` та стандартних масивів і словників.'
          ]
        },
        {
          title: 'Магія @AppStorage у SwiftUI',
          paragraphs: [
            'Раніше в UIKit потрібно було вручну читати значення `UserDefaults.standard.bool(forKey:)`, а при зміні вручну викликати збереження.',
            'У SwiftUI зʼявився проперті-врапер `@AppStorage("isDarkMode") var isDarkMode = false`. Він поводиться як звичайний `@State`, але автоматично зберігає нове значення в `UserDefaults` і миттєво оновлює всі View при зміні!'
          ]
        },
        {
          title: 'Що КАТЕГОРИЧНО НЕ МОЖНА зберігати в UserDefaults?',
          paragraphs: [
            '1. **Паролі, токени та конфіденційні дані**: файл plist зберігається у відкритому незашифрованому вигляді (для паролів використовується виключно **Keychain**)!\n2. **Великі файли та фотографії**: завантаження мегабайтів у UserDefaults сповільнює запуск додатку, оскільки весь plist завантажується в памʼять цілком під час старту програми.'
          ]
        }
      ],
      theory: [
        'UserDefaults — легке сховище key-value для налаштувань.',
        '@AppStorage автоматично синхронізує змінні з UserDefaults.',
        'Для паролів використовують Keychain, а не UserDefaults.',
        'Складні структури пакують у Data через JSONEncoder.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Декларативний @AppStorage у SwiftUI',
          code: `struct SettingsView: View {
    @AppStorage("notifications_enabled") private var notificationsEnabled = true
    @AppStorage("username") private var username = "Гість"
    
    var body: some View {
        Form {
            Toggle("Сповіщення", isOn: $notificationsEnabled)
            TextField("Ім'я", text: $username)
        }
    }
}`,
          explanation: 'Лише одна змінна: будь-яке перемикання тоглу автоматично персиститься на диск без жодного рядка збереження.'
        },
        bad: {
          title: 'Ручне читання та запис із захардкодженними ключами',
          code: `var isEnabled = UserDefaults.standard.bool(forKey: "notif_flag")

func userToggledSwitch(value: Bool) {
    UserDefaults.standard.set(value, forKey: "notif_flagg") // Одруківка в ключі!
    // Забули оновити інтерфейс!
}`,
          explanation: 'Одруківка в рядку ключа призводить до втрати збереженого стану та розсинхронізації UI.'
        }
      },
      codeSnippet: `import SwiftUI

// 1. Модель комплексних налаштувань користувача
struct AppCustomization: Codable {
    var themeColorHex: String
    var fontSize: Double
    var hapticsEnabled: Bool
}

// 2. Збереження складної структури в UserDefaults через Data
class SettingsStorageManager {
    static let shared = SettingsStorageManager()
    private let key = "user_customization_key"
    
    func saveCustomization(_ settings: AppCustomization) {
        if let encoded = try? JSONEncoder().encode(settings) {
            UserDefaults.standard.set(encoded, forKey: key)
        }
    }
    
    func loadCustomization() -> AppCustomization {
        guard let data = UserDefaults.standard.data(forKey: key),
              let settings = try? JSONDecoder().decode(AppCustomization.self, from: data) else {
            // Дефолтні налаштування
            return AppCustomization(themeColorHex: "#007AFF", fontSize: 16.0, hapticsEnabled: true)
        }
        return settings
    }
}`,
      explanation: [
        'Оскільки `UserDefaults` не підтримує кастомні структури напряму, ми перетворюємо `AppCustomization` на бінарний обʼєкт `Data` за допомогою `JSONEncoder`.',
        '`loadCustomization()` безпечно повертає дефолтне значення, якщо додаток запущено вперше.'
      ],
      underTheHood: {
        title: 'Як влаштований файл plist у пісочниці iOS',
        points: [
          'Операційна система створює файл `com.yourcompany.appname.plist` у папці налаштувань додатку.',
          'Під час запуску програми iOS завантажує весь вміст цього файлу в оперативну памʼять. Саме тому збереження сюди важких картинок чи баз даних різко уповільнює старт додатку (Cold Start).',
          'Система записує зміни на диск асинхронно з оптимізацією батареї.'
        ]
      },
      checkpoints: [
        {
          question: 'Чому не можна зберігати паролі користувачів та банківські токени в UserDefaults?',
          options: [
            'Файл UserDefaults зберігається у відкритому незашифрованому вигляді в файловій системі',
            'UserDefaults підтримує тільки числа',
            'Паролі автоматично стираються раз на тиждень',
            'Apple блокує додатки з паролями в базі'
          ],
          correctAnswer: 0,
          explanation: 'UserDefaults не шифрує дані; для збереження чутливих даних (паролі, токени) призначений Apple Keychain.'
        }
      ],
      keyTakeaways: [
        'UserDefaults — для дрібних налаштувань, прапорців та тем.',
        '@AppStorage — простий спосіб привʼязати стан SwiftUI до UserDefaults.',
        'Для конфіденційних даних використовуйте тільки Keychain.',
        'Для важких списків використовуйте SwiftData, а не UserDefaults.'
      ],
      commonMistakes: [
        'Збереження фотографій або великих масивів JSON прямо в UserDefaults.',
        'Збереження паролів у незашифрований UserDefaults.'
      ],
      challenge: {
        task: 'Створіть перемикач темної теми в SwiftUI, використовуючи `@AppStorage("isDarkMode")` з початковим значенням `false`.',
        hint: 'Оголосіть @AppStorage("isDarkMode") private var isDarkMode = false і додайте Toggle("Темна тема", isOn: $isDarkMode)',
        solution: `struct ThemeSettingsToggle: View {
    @AppStorage("isDarkMode") private var isDarkMode: Bool = false
    
    var body: some View {
        Toggle("Темна тема", isOn: $isDarkMode)
            .padding()
    }
}`
      }
    },
    pages: [
      {
        id: 'userdefaults-intuition-sticker',
        title: 'Інтуїція: Що таке UserDefaults та наліпка на холодильнику',
        stepLabel: '1. Інтуїція & Налаштування',
        description: 'Коли достатньо простого блокнота ключ-значення, а коли потрібна повноцінна база даних.',
        content: {
          realWorldContext: 'Коли ви запускаєте YouTube, він памʼятає, що ви вимкнули автопрогравання наступного відео. Коли відкриваєте Telegram — він памʼятає обраний розмір шрифту. Для таких простих параметрів не потрібна реляційна база — потрібен легкий словник.',
          detailedTheory: [
            {
              title: 'Метафора: Наліпка-стікер на холодильнику',
              paragraphs: [
                'Уявіть дверцята холодильника, на яких ви магнітом прикріпили жовтий стікер:\n• `sound_volume = 80`\n• `has_completed_tutorial = true`\n• `user_language = "uk"`\n\nВам не потрібна картотека на 10 полиць, щоб зберегти ці 3 записи. Ви просто кидаєте погляд на стікер і миттєво знаєте відповідь.\n\n`UserDefaults` — це саме такий стікер для вашого додатку. Це проста табличка, де кожному текстовому **ключу (Key)** відповідає одне просте **значення (Value)**.'
              ]
            },
            {
              title: 'Межі застосування: Що можна, а що ні',
              paragraphs: [
                '• **Ідеально для UserDefaults**: налаштування звуку, вибір мови, ID обраної теми, прапорець "Чи показувати вітальне вікно", останній вибраний фільтр.\n• **Категорично заборонено**: фотографії, кеш відео, повідомлення чатів, токени авторизації, номери банківських карток.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Які дані ідеально підходять для збереження в UserDefaults?',
              options: [
                'Прапорці налаштувань, вибір теми оформлення та розмір шрифту',
                'Відеофайли високої якості 4K',
                'База даних на 50 000 клієнтів',
                'Паролі від банківських карток'
              ],
              correctAnswer: 0,
              explanation: 'UserDefaults призначений для легких налаштувань та конфігураційних прапорців невеликого розміру.'
            },
            {
              question: 'Де фізично зберігається файл UserDefaults на iPhone?',
              options: [
                'У пісочниці додатку у файлі формату .plist (Property List)',
                'На серверах Google',
                'У памʼяті SIM-карти',
                'У фотогалереї'
              ],
              correctAnswer: 0,
              explanation: 'UserDefaults зберігається у вигляді Property List (.plist) файлу в каталозі Library/Preferences пісочниці додатку.'
            }
          ]
        }
      },
      {
        id: 'userdefaults-syntax-appstorage',
        title: 'Анатомія @AppStorage: Реактивні налаштування у SwiftUI',
        stepLabel: '2. Анатомія @AppStorage',
        description: 'Як працює властивість @AppStorage, автозбереження без написання коду та синхронізація інтерфейсу.',
        content: {
          realWorldContext: 'Раніше розробники писали окремі методи читання та запису в UserDefaults при кожному натисканні тумблера. У SwiftUI це скоротилося до одного рядка завдяки @AppStorage.',
          detailedTheory: [
            {
              title: 'Синтаксис @AppStorage',
              paragraphs: [
                'Ви оголошуєте змінну так само, як `@State`, але додаєте назву ключа в лапках:\n`@AppStorage("haptic_feedback_enabled") private var hapticEnabled = true`.\n\n• Якщо в `UserDefaults` уже є збережене значення — змінна візьме його.\n• Якщо додаток запущено вперше — візьметься початкове дефолтне значення (`true`).\n• Щойно користувач перемкне `Toggle` — нове значення негайно збережеться на диск!'
              ]
            },
            {
              title: 'Двостороння привʼязка ($)',
              paragraphs: [
                'Оскільки `@AppStorage` підтримує протокол `DynamicProperty`, ви можете передавати його з префіксом долара `$hapticEnabled` у будь-які елементи введення: `Toggle`, `TextField`, `Picker`, `Slider`.'
              ]
            }
          ],
          codeSnippet: `import SwiftUI

struct SettingsScreenDemo: View {
    // Автоматичне читання та запис у UserDefaults
    @AppStorage("selected_app_theme") private var selectedTheme: String = "Системна"
    @AppStorage("daily_reminders") private var dailyReminders: Bool = true
    @AppStorage("volume_level") private var volumeLevel: Double = 0.8
    
    let themeOptions = ["Світла", "Темна", "Системна"]
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Зовнішній вигляд") {
                    Picker("Тема оформлення", selection: $selectedTheme) {
                        ForEach(themeOptions, id: \\.self) { theme in
                            Text(theme)
                        }
                    }
                    .pickerStyle(.menu)
                }
                
                Section("Сповіщення") {
                    Toggle("Щоденні нагадування", isOn: $dailyReminders)
                    
                    if dailyReminders {
                        VStack(alignment: .leading) {
                            Text("Гучність сигналу: \\(Int(volumeLevel * 100))%")
                            Slider(value: $volumeLevel, in: 0.0...1.0)
                        }
                    }
                }
            }
            .navigationTitle("Параметри")
        }
    }
}`,
          explanation: [
            'Усі три параметри зберігаються в базі `UserDefaults` автоматично.',
            'При перезапуску додатка тумблери та повзунки залишаться рівно в тому стані, у якому їх залишив користувач.'
          ]
        }
      },
      {
        id: 'userdefaults-codable-structures',
        title: 'Збереження структур Codable через Data та заборона Keychain',
        stepLabel: '3. Codable в UserDefaults',
        description: 'Як зберегти власну структуру даних у UserDefaults та чому паролі зберігають тільки в Keychain.',
        content: {
          realWorldContext: 'Що робити, якщо вам потрібно зберегти профіль користувача з кількома полями (імʼя, email, дата реєстрації)? UserDefaults не приймає кастомні структури напряму. Рішення — серіалізація в бінарний тип Data.',
          detailedTheory: [
            {
              title: 'Збереження обʼєктів через JSONEncoder',
              paragraphs: [
                '1. Ваша структура повинна відповідати протоколу `Codable`.\n2. За допомогою `try? JSONEncoder().encode(myObject)` ви перетворюєте обʼєкт на бінарний пакет `Data`.\n3. Отриманий `Data` легко зберігається в UserDefaults: `UserDefaults.standard.set(data, forKey: "profile")`.\n4. Для читання використовується `JSONDecoder().decode(MyObject.self, from: data)`.'
              ]
            },
            {
              title: 'Чому Keychain — це не UserDefaults?',
              paragraphs: [
                'Якщо користувач підключить iPhone до компʼютера, хакерські утиліти можуть прочитати вміст незашифрованого файлу `.plist`.\n\nТому для секретних даних (паролі, Face ID токени, приватні ключі) використовується **Apple Keychain** — апаратне сховище з криптографічним шифруванням на рівні чипа Secure Enclave.'
              ]
            }
          ],
          codeSnippet: `import Foundation

struct UserPreferences: Codable {
    var preferredCurrency: String
    var favoriteCategories: [String]
}

class PreferencesManager {
    static let shared = PreferencesManager()
    private let storageKey = "user_preferences_blob"
    
    func save(preferences: UserPreferences) {
        if let data = try? JSONEncoder().encode(preferences) {
            UserDefaults.standard.set(data, forKey: storageKey)
        }
    }
    
    func load() -> UserPreferences {
        guard let data = UserDefaults.standard.data(forKey: storageKey),
              let decoded = try? JSONDecoder().decode(UserPreferences.self, from: data) else {
            return UserPreferences(preferredCurrency: "UAH", favoriteCategories: ["IT", "Спорт"])
        }
        return decoded
    }
}`,
          explanation: [
            '`PreferencesManager` забезпечує безпечну упаковку в `Data` та розпаковку через `JSONDecoder`.',
            'При відсутності даних метод `load()` повертає стандартні безпечні налаштування.'
          ]
        }
      },
      {
        id: 'userdefaults-errors-debugging-quiz',
        title: 'Типові помилки UserDefaults в Xcode & Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо спроби збереження непідтримуваних типів, одруківки в ключах та перевіряємо розуміння.',
        content: {
          realWorldContext: 'Найпоширеніша помилка новачків — спроба покласти UIImage або кастомну структуру безпосередньо у `UserDefaults.standard.set()`. Додаток миттєво падає з винятком NSInvalidArgumentException.',
          detailedTheory: [
            {
              title: 'Популярні підводні камені',
              paragraphs: [
                '1. **Attempt to insert non-property list object**:\nВи спробували зберегти структуру без серіалізації в `Data` або обʼєкт несумісного типу.\n*Виправлення*: перетворіть структуру на `Data` за допомогою `JSONEncoder`.\n\n2. **Одруківки в рядках ключів**:\nЯкщо в одному файлі ви написали `"user_name"`, а в іншому `"username"`, дані ніколи не прочитаються.\n*Виправлення*: використовуйте строгі константи `enum Keys { static let username = "username" }` або `@AppStorage`.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Що станеться, якщо спробувати зберегти кастомну структуру безпосередньо у UserDefaults.standard.set(myStruct, forKey: "key")?',
              options: [
                'Додаток впаде з помилкою NSInvalidArgumentException (Attempt to set a non-property list object)',
                'Структура автоматично перетвориться на число',
                'Помилки не буде, все збережеться ідеально',
                'iPhone вимкнеться'
              ],
              correctAnswer: 0,
              explanation: 'UserDefaults підтримує лише стандартні типи Property List; кастомні обʼєкти потрібно попередньо серіалізувати в Data через Codable.'
            },
            {
              question: 'Яку проблему вирішує використання @AppStorage замість ручного виклику UserDefaults.standard?',
              options: [
                'Автоматично звʼязує стан з інтерфейсом SwiftUI і перемальовує екран при зміні значення',
                'Збільшує швидкість процесора вдвічі',
                'Дозволяє зберігати терабайти фільмів',
                'Видаляє рекламу з додатку'
              ],
              correctAnswer: 0,
              explanation: '@AppStorage поєднує поведінку @State із персистентністю, забезпечуючи автоматичне оновлення інтерфейсу.'
            },
            {
              question: 'Де слід зберігати пароль користувача для входу в додаток?',
              options: [
                'У зашифрованому Apple Keychain',
                'У відкритому UserDefaults',
                'У текстовому файлі на робочому столі',
                'У назві кнопки SwiftUI'
              ],
              correctAnswer: 0,
              explanation: 'Keychain — єдине санкціоноване Apple безпечне апаратне сховище для паролів і конфіденційних токенів.'
            }
          ]
        }
      },
      {
        id: 'userdefaults-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінний екран налаштувань читалки книг зі зміною розміру шрифту, теми та збереженням у @AppStorage.',
        content: {
          realWorldContext: 'Створіть у Playground екран читання електронної книги `ReaderView`, який дозволяє користувачеві налаштувати розмір шрифту (14-28pt), колір паперу (білий, сепія, нічний) та зберігає ці параметри між сесіями.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: ЧИТАЛКА КНИГ З @APPSTORAGE
// ==========================================

import SwiftUI

struct BookReaderSettingsView: View {
    // Налаштування у UserDefaults
    @AppStorage("reader_font_size") private var fontSize: Double = 18.0
    @AppStorage("reader_theme") private var readerTheme: String = "Сепія"
    @AppStorage("keep_screen_awake") private var keepScreenAwake: Bool = true
    
    let availableThemes = ["Світла", "Сепія", "Темна"]
    
    // Обчислювальні кольори для теми
    var backgroundColor: Color {
        switch readerTheme {
        case "Світла": return Color.white
        case "Сепія": return Color(red: 0.96, green: 0.94, blue: 0.88)
        case "Темна": return Color(red: 0.12, green: 0.12, blue: 0.14)
        default: return Color.white
        }
    }
    
    var textColor: Color {
        readerTheme == "Темна" ? Color.white : Color.black
    }
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Попередній перегляд сторінки книги
                ScrollView {
                    Text("«Вчитися ніколи не пізно. Кожен крок у вивченні Swift наближає вас до створення власних додатків, якими користуватимуться мільйони людей по всьому світу.»")
                        .font(.system(size: fontSize, design: .serif))
                        .foregroundStyle(textColor)
                        .lineSpacing(6)
                        .padding(24)
                }
                .background(backgroundColor)
                
                Divider()
                
                // Панель керування налаштуваннями
                VStack(spacing: 16) {
                    // Вибір кольору паперу
                    Picker("Тема паперу", selection: $readerTheme) {
                        ForEach(availableThemes, id: \\.self) { theme in
                            Text(theme)
                        }
                    }
                    .pickerStyle(.segmented)
                    
                    // Розмір шрифту
                    HStack {
                        Image(systemName: "textformat.size.smaller")
                        Slider(value: $fontSize, in: 14.0...28.0, step: 1.0)
                        Image(systemName: "textformat.size.larger")
                        Text("\\(Int(fontSize)) pt")
                            .font(.caption)
                            .monospacedDigit()
                    }
                    
                    Toggle("Забороняти засинання екрана", isOn: $keepScreenAwake)
                        .font(.footnote)
                }
                .padding()
                .background(Color(.secondarySystemBackground))
            }
            .navigationTitle("Читалка")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    BookReaderSettingsView()
}`,
          explanation: [
            '`@AppStorage("reader_font_size")` звʼязує положення повзунка слайдера безпосередньо з диском: розмір шрифту збережеться автоматично.',
            '`@AppStorage("reader_theme")` синхронізує сегментний перемикач і миттєво змінює фон та колір тексту.',
            'При перезавантаженні сторінки або закритті додатка всі параметри відновлюються автоматично.'
          ],
          challenge: {
            task: 'Створіть перемикач темної теми в SwiftUI, використовуючи `@AppStorage("isDarkMode")` з початковим значенням `false`.',
            hint: 'Оголосіть @AppStorage("isDarkMode") private var isDarkMode = false і додайте Toggle("Темна тема", isOn: $isDarkMode)',
            solution: `struct ThemeSettingsToggle: View {
    @AppStorage("isDarkMode") private var isDarkMode: Bool = false
    
    var body: some View {
        Toggle("Темна тема", isOn: $isDarkMode)
            .padding()
    }
}`
          }
        }
      }
    ]
  }
];
