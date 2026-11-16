import { Lesson } from '@/types';

export const module7Lessons: Lesson[] = [
  {
    id: 'swiftdata-relationships',
    module: 7,
    moduleTitle: 'Модуль 7: Просунуте збереження та тестування',
    title: 'SwiftData: Звʼязки між моделями 1-до-багатьох та 1-до-1',
    description: 'Опануйте реляційні звʼязки у SwiftData: макрос @Relationship, зворотні посилання inverse, каскадне видалення Cascade Delete та звʼязки між сутностями.',
    difficulty: 'Просунутий',
    estimatedMinutes: 24,
    icon: 'Link',
    content: {
      realWorldContext: 'У реальних додатках дані рідко існують ізольовано: проєкт містить десятки завдань, користувач має один профіль та сотні фотографій, а замовлення складається з багатьох товарів. У SwiftData звʼязки між сутностями описуються елегантно та природно через звичайні масиви моделей Swift.',
      detailedTheory: [
        {
          title: 'Типи реляційних звʼязків у базах даних',
          paragraphs: [
            '1. **Один-до-багатьох (One-to-Many / 1:N)**: один проєкт містить масив нотаток (`var notes: [Note] = []`), а кожна нотатка посилається на один конкретний проєкт (`var project: Project?`). Це найпоширеніший тип звʼязку в мобільних додатках.\n2. **Один-до-одного (One-to-One / 1:1)**: один користувач має рівно один розширений профіль налаштувань (`var profile: UserProfile?`).\n3. **Багато-до-багатьох (Many-to-Many / M:N)**: один студент відвідує багато курсів, а один курс слухають багато студентів.'
          ]
        },
        {
          title: 'Макрос @Relationship та зворотні посилання (inverse)',
          paragraphs: [
            'Щоб SwiftData розуміла, як повʼязані дві таблиці в SQLite, використовують макрос `@Relationship` з параметром `inverse` (зворотне посилання):\n`@Relationship(deleteRule: .cascade, inverse: \\Note.project) var notes: [Note] = []`.\n\nЗавдяки `inverse` SwiftData знає: щойно ви додаєте нотатку до масиву `project.notes.append(newNote)`, поле `newNote.project` автоматично заповниться посиланням на цей проєкт!'
          ]
        },
        {
          title: 'Правила видалення: Cascade проти Nullify',
          paragraphs: [
            'Що має статися з нотатками, якщо користувач видаляє весь проєкт?\n• `.cascade`: видалення батька автоматично видаляє всі дочірні записи (щоб не засмічувати памʼять "сирітськими" записами).\n• `.nullify`: нотатки залишаються жити в базі, але їхнє поле `project` стає `nil`.\n• `.deny`: операція видалення проєкту заблокується, поки користувач вручну не видалить або не перенесе всі його нотатки.'
          ]
        }
      ],
      theory: [
        'Звʼязки описуються через звичайні властивості класів @Model.',
        '@Relationship задає правила поведінки звʼязку.',
        'Параметр inverse забезпечує автоматичну двосторонню синхронізацію.',
        'deleteRule: .cascade видаляє дочірні елементи разом із батьківським.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Декларативні звʼязки у SwiftData',
          code: `@Model
class Project {
    var title: String
    @Relationship(deleteRule: .cascade, inverse: \\TaskItem.project)
    var tasks: [TaskItem] = []
    
    init(title: String) { self.title = title }
}

@Model
class TaskItem {
    var name: String
    var project: Project?
    
    init(name: String) { self.name = name }
}`,
          explanation: 'Чистий Swift-код: звʼязок повністю типізований, автоматично підтримує каскадне видалення та оновлення inverse.'
        },
        bad: {
          title: 'Ручне відстеження зовнішніх ключів (Foreign Keys)',
          code: `class Project {
    var id: String
}
class TaskItem {
    var projectId: String // Збереження сирого рядка замість зв'язку
}
// Розробник змушений вручну шукати та видаляти всі таски при видаленні проекту!`,
          explanation: 'Високий ризик залишити в базі сміття (orphan records) та потреба писати ручні SQL-запити для пошуку.'
        }
      },
      codeSnippet: `import SwiftUI
import SwiftData

// 1. Модель категорії (Батько)
@Model
final class ExpenseCategory {
    @Attribute(.unique) var id: UUID
    var name: String
    var icon: String
    
    // Каскадне видалення: видалення категорії видаляє всі її витрати
    @Relationship(deleteRule: .cascade, inverse: \\ExpenseItem.category)
    var expenses: [ExpenseItem] = []
    
    init(name: String, icon: String) {
        self.id = UUID()
        self.name = name
        self.icon = icon
    }
}

// 2. Модель витрати (Дитина)
@Model
final class ExpenseItem {
    var title: String
    var amount: Double
    var date: Date
    var category: ExpenseCategory?
    
    init(title: String, amount: Double, date: Date = .now) {
        self.title = title
        self.amount = amount
        self.date = date
    }
}

// 3. Відображення секцій у SwiftUI
struct CategoryExpensesView: View {
    @Query(sort: \\.name) private var categories: [ExpenseCategory]
    @Environment(\\.modelContext) private var context
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(categories) { category in
                    Section(header: Label(category.name, systemImage: category.icon)) {
                        ForEach(category.expenses) { expense in
                            HStack {
                                Text(expense.title)
                                Spacer()
                                Text("$\\(expense.amount, specifier: "%.2f")")
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
                .onDelete { indexSet in
                    // При видаленні категорії каскадно видаляться всі її expense-елементи!
                    for index in indexSet {
                        context.delete(categories[index])
                    }
                }
            }
            .navigationTitle("Витрати по категоріях")
        }
    }
}`,
      explanation: [
        '`@Relationship(deleteRule: .cascade, inverse: \\ExpenseItem.category)` гарантує, що при видаленні категорії всі її витрати видаляться автоматично.',
        '`category.expenses` повертає актуальний масив повʼязаних записів без потреби писати ручні fetch-запити.'
      ],
      underTheHood: {
        title: 'Як SwiftData оптимізує памʼять при завантаженні звʼязків (Faulting)',
        points: [
          'Якщо у проєкті є 10 000 завдань, SwiftData не завантажує всі 10 000 обʼєктів в оперативну памʼять одразу.',
          'Замість цього використовується механізм **Faulting (відкладене завантаження)**: обʼєкти створюються як легкі "заглушки" (Faults).',
          'Справжні дані зчитуються з диска лише тоді, коли ви вперше звертаєтеся до конкретної властивості `expense.title`. Це береже памʼять пристрою.'
        ]
      },
      checkpoints: [
        {
          question: 'Яке правило deleteRule гарантує, що при видаленні батьківської моделі автоматично видаляться всі повʼязані дочірні обʼєкти?',
          options: [
            '.cascade',
            '.nullify',
            '.deny',
            '.noAction'
          ],
          correctAnswer: 0,
          explanation: 'Правило .cascade каскадно поширює видалення на всі повʼязані дочірні сутності.'
        }
      ],
      keyTakeaways: [
        'Звʼязки у SwiftData описуються природними масивами та опціональними посиланнями.',
        'Параметр `inverse` забезпечує автоматичну двосторонню синхронізацію.',
        'Правило `deleteRule: .cascade` запобігає виникненню сирітських записів у базі.',
        'SwiftData використовує Faulting для оптимізації споживання RAM.'
      ],
      commonMistakes: [
        'Забування вказати параметр `inverse`, що може призвести до неузгодженості звʼязків.',
        'Використання `.cascade` там, де дочірні записи мають продовжувати існувати самостійно (в таких випадках потрібен `.nullify`).'
      ],
      challenge: {
        task: 'Створіть модель `Author` зі звʼязком «один до багатьох» із `Article` та реалізуйте Cascade Delete, щоб видалення автора також видаляло всі його статті.',
        hint: 'Використайте @Relationship(deleteRule: .cascade, inverse: \\Article.author) var articles: [Article] = [] у класі Author',
        solution: `@Model
final class Author {
    @Attribute(.unique) var id: UUID
    var name: String
    @Relationship(deleteRule: .cascade, inverse: \\Article.author)
    var articles: [Article] = []
    
    init(name: String) {
        self.id = UUID()
        self.name = name
    }
}

@Model
final class Article {
    var title: String
    var author: Author?
    
    init(title: String) {
        self.title = title
    }
}`
      }
    },
    pages: [
      {
        id: 'relationships-intuition-cards',
        title: 'Інтуїція: Як будуються звʼязки між даними у реальних додатках',
        stepLabel: '1. Інтуїція & Реляції',
        description: 'Зрозумійте звʼязки 1-до-багатьох та 1-до-1 на простих життєвих аналогіях.',
        content: {
          realWorldContext: 'Уявіть додаток Todoist або Trello. У вас є "Дошки" (Boards), а всередині кожної дошки — десятки "Завдань" (Cards). Якби кожне завдання зберігало повну копію назви дошки, кольору та її власника, база даних роздулася б, а зміна назви дошки вимагала б переписування тисяч записів.',
          detailedTheory: [
            {
              title: 'Метафора: Папка з файлами',
              paragraphs: [
                'Уявіть фізичну пластикову папку з документами:\n• **Папка (Project)** — це батьківська сутність.\n• **Аркуші паперу всередині (Notes)** — це дочірні елементи.\n\nАркуш паперу лежить у папці. Папка містить стопку аркушів (звʼязок 1:N).\n\nЯкщо ви перекладете аркуш в іншу папку — він більше не належить старій. Звʼязок змінився в обох сутностях одночасно. У SwiftData це відбувається автоматично завдяки механізму **двосторонніх звʼязків (Inverse Relationships)**.'
              ]
            },
            {
              title: 'Звʼязок 1-до-1 (One-to-One)',
              paragraphs: [
                'У кожного користувача в додатку є рівно один паспорт або один розширений профіль медичної карти. Модель користувача має поле `var medicalRecord: MedicalRecord?`, а медична карта посилається на користувача: `var user: User?`.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Який тип звʼязку існує між категорією товару та товарами всередині неї?',
              options: [
                'Один-до-багатьох (One-to-Many / 1:N)',
                'Один-до-одного (1:1)',
                'Багато-до-одного без зворотного звʼязку',
                'Звʼязок неможливий у базах даних'
              ],
              correctAnswer: 0,
              explanation: 'Одна категорія містить багато товарів, тому це класичний звʼязок один-до-багатьох (1:N).'
            },
            {
              question: 'Чому вигідно використовувати звʼязки замість дублювання назви категорії у кожному товарі?',
              options: [
                'При зміні назви категорії вона оновиться для всіх товарів автоматично, без дублювання даних у базі',
                'Це прискорює Bluetooth зʼєднання',
                'SwiftData забороняє повторювати текст',
                'Це зменшує яскравість екрана'
              ],
              correctAnswer: 0,
              explanation: 'Нормалізація даних та реляційні звʼязки забезпечують єдине джерело істини: назва змінюється в одному місці, а всі повʼязані товари бачать оновлення.'
            }
          ]
        }
      },
      {
        id: 'relationships-syntax-inverse',
        title: 'Анатомія синтаксису: @Relationship, KeyPath та зворотний звʼязок inverse',
        stepLabel: '2. Анатомія @Relationship',
        description: 'Як правильно вказувати шлях inverse, щоб уникнути розсинхронізації даних у SQLite.',
        content: {
          realWorldContext: 'Якщо створити звʼязок без параметра inverse, компілятор SwiftData може не зрозуміти, яка саме властивість у дочірньому класі є зворотним боком цього відношення.',
          detailedTheory: [
            {
              title: 'Синтаксис KeyPath у параметрі inverse',
              paragraphs: [
                'Параметр `inverse` приймає так званий **KeyPath (шлях до властивості)**, який починається зі зворотного слешу `\\`:\n`inverse: \\TaskItem.project`.\n\nЦе вказує SwiftData: "Коли ти дивишся на список `tasks`, знай, що у класі `TaskItem` поле `project` веде назад до цього обʼєкта".'
              ]
            },
            {
              title: 'Двостороння магія',
              paragraphs: [
                'Завдяки цьому правилу вам достатньо виконати лише одну дію:\n`myProject.tasks.append(newTask)`.\nSwiftData автоматично встановить `newTask.project = myProject` без додаткових дій з вашого боку!'
              ]
            }
          ],
          codeSnippet: `import SwiftData
import Foundation

@Model
final class Album {
    var title: String
    var releaseYear: Int
    
    // Вказуємо зворотний зв'язок до пісні
    @Relationship(deleteRule: .cascade, inverse: \\Track.album)
    var tracks: [Track] = []
    
    init(title: String, releaseYear: Int) {
        self.title = title
        self.releaseYear = releaseYear
    }
}

@Model
final class Track {
    var trackName: String
    var durationSeconds: Int
    var album: Album? // Зворотне посилання на альбом
    
    init(trackName: String, durationSeconds: Int) {
        self.trackName = trackName
        self.durationSeconds = durationSeconds
    }
}`,
          explanation: [
            '`inverse: \\Track.album` створює цілісну реляційну пару між класами `Album` та `Track`.',
            '`var album: Album?` обовʼязково має бути опціональним, оскільки до додавання в альбом трек може бути створений самостійно.'
          ]
        }
      },
      {
        id: 'relationships-delete-rules',
        title: 'Каскадне видалення: Правила Cascade, Nullify та Deny',
        stepLabel: '3. Правила видалення',
        description: 'Як контролювати долю дочірніх записів при видаленні батьківської сутності.',
        content: {
          realWorldContext: 'Що має статися, коли користувач видаляє альбом у музичному додатку? Чи треба видалити всі його пісні з памʼяті? А що станеться, коли видаляється плейлист? Пісні мають залишитися, а звʼязок просто обнулитися. Це регулюється Delete Rules.',
          detailedTheory: [
            {
              title: 'Порівняння правил видалення (Delete Rules)',
              paragraphs: [
                '1. **.cascade (Каскадне видалення)**: якщо видаляється батько, автоматично стираються всі дочірні елементи. (Видалили замовлення -> видалилися всі позиції товарів у чеку).\n2. **.nullify (Обнулення посилання)**: батьківський обʼєкт видаляється, але дочірні записи залишаються в базі, а їхнє посилання на батька стає `nil`. (Видалили відділ у компанії -> співробітники не звільняються, а їхнє поле `department` тимчасово стає `nil`).\n3. **.deny (Заборона видалення)**: спроба видалити батьківський обʼєкт спричиняє помилку, доки в ньому залишається хоча б один дочірній елемент. (Неможливо видалити банківський рахунок, поки на ньому є активні транзакції).'
              ]
            }
          ],
          comparisonSnippet: {
            good: {
              title: 'Правильний Cascade для залежних сутностей',
              code: `@Relationship(deleteRule: .cascade, inverse: \\Comment.post)
var comments: [Comment] = []`,
              explanation: 'Коментарі не мають сенсу без свого поста. При видаленні поста всі його коментарі автоматично очищаються з бази даних.'
            },
            bad: {
              title: 'Помилковий Cascade для незалежних сутностей',
              code: `@Relationship(deleteRule: .cascade, inverse: \\Song.playlist)
var songs: [Song] = []`,
              explanation: 'Якщо видалити плейлист із правилом cascade, з памʼяті користувача видаляться всі його пісні! Тут потрібен .nullify.'
            }
          },
          keyTakeaways: [
            'Delete Rule визначає долю дочірніх обʼєктів при видаленні батька.',
            'Використовуйте `.cascade` лише для строго залежних сутностей (Композиція).',
            'Використовуйте `.nullify` для незалежних сутностей (Агрегація).'
          ]
        }
      },
      {
        id: 'relationships-errors-quiz',
        title: 'Типові помилки зі звʼязками у SwiftData & Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо проблеми циклічних залежностей, сирітські записи та перевіряємо засвоєння.',
        content: {
          realWorldContext: 'Помилки у звʼязках баз даних можуть спричинити "мертві" записи (Orphan Records), які займають місце на диску, але не відображаються в жодному інтерфейсі.',
          detailedTheory: [
            {
              title: 'Популярні помилки звʼязків',
              paragraphs: [
                '1. **Циклічний cascade (Випадкове видалення всієї бази)**:\nЯкщо клас A каскадно видаляє B, а клас B каскадно видаляє A, видалення одного елемента призведе до ланцюгової реакції та знищення всіх записів.\n*Виправлення*: каскадне видалення має бути строго односпрямованим: від батька до дітей.\n\n2. **Забутий inverse**:\nЯкщо обидві моделі мають звʼязок без явного вказання `inverse`, SwiftData може створити дві різні незалежні таблиці звʼязків у SQLite замість одного двостороннього відношення.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Яке правило видалення слід застосувати для звʼязку між Користувачем та його Аватаром, якщо аватар потрібен лише цьому користувачеві?',
              options: [
                '.cascade (видалення користувача має видалити і його аватар)',
                '.deny',
                '.nullify',
                '.noAction'
              ],
              correctAnswer: 0,
              explanation: 'Аватар є повністю залежною сутністю від користувача, тому при видаленні користувача слід каскадно видаляти і його фотографію.'
            },
            {
              question: 'Що означає оператор \\Article.author у SwiftData?',
              options: [
                'KeyPath (шлях до властивості author у моделі Article)',
                'Ділення числа Article на author',
                'Коментар компілятора',
                'Регулярний вираз'
              ],
              correctAnswer: 0,
              explanation: 'Зворотний слеш вказує на KeyPath — типізований шлях до поля у структурі чи класі Swift.'
            },
            {
              question: 'Що робить механізм Faulting у SwiftData при роботі з великими звʼязками?',
              options: [
                'Відкладає завантаження важких властивостей із диска до моменту першого фактичного звернення до них у коді',
                'Викидає фатальну помилку',
                'Шифрує базу паролем',
                'Автоматично видаляє пошкоджені записи'
              ],
              correctAnswer: 0,
              explanation: 'Faulting захищає памʼять пристрою, завантажуючи повʼязані обʼєкти ліниво лише тоді, коли до них реально звертається інтерфейс.'
            }
          ]
        }
      },
      {
        id: 'relationships-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінний менеджер проєктів та списку завдань з каскадним видаленням та підрахунком прогресу.',
        content: {
          realWorldContext: 'Створіть у Playground систему керування проєктами `ProjectPlanner`, де кожен проєкт містить довільну кількість завдань із галочкою виконання, а прогрес проєкту рахується автоматично на основі повʼязаних сутностей.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: МЕНЕДЖЕР ПРОЄКТІВ ЗІ SWIFTDATA
// ==========================================

import SwiftUI
import SwiftData

// 1. Модель проєкту
@Model
final class DevelopmentProject {
    var title: String
    var accentColorHex: String
    
    // Каскадне видалення: видалення проєкту стирає всі його підзавдання
    @Relationship(deleteRule: .cascade, inverse: \\ProjectTask.project)
    var tasks: [ProjectTask] = []
    
    // Обчислювальний прогрес виконання проєкту
    var completionPercentage: Double {
        guard !tasks.isEmpty else { return 0.0 }
        let completedCount = tasks.filter { $0.isDone }.count
        return (Double(completedCount) / Double(tasks.count)) * 100.0
    }
    
    init(title: String, accentColorHex: String = "#007AFF") {
        self.title = title
        self.accentColorHex = accentColorHex
    }
}

// 2. Модель підзавдання
@Model
final class ProjectTask {
    var name: String
    var isDone: Bool
    var project: DevelopmentProject?
    
    init(name: String, isDone: Bool = false) {
        self.name = name
        self.isDone = isDone
    }
}

// 3. Інтерфейс списку проєктів
struct ProjectListView: View {
    @Query private var projects: [DevelopmentProject]
    @Environment(\\.modelContext) private var modelContext
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(projects) { project in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(project.title)
                                .font(.headline)
                            Spacer()
                            Text("\\(Int(project.completionPercentage))%")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.blue)
                        }
                        
                        ProgressView(value: project.completionPercentage, total: 100.0)
                        
                        Text("Всього завдань: \\(project.tasks.count)")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 4)
                }
                .onDelete { offsets in
                    for index in offsets {
                        modelContext.delete(projects[index])
                    }
                }
            }
            .navigationTitle("Мої проєкти")
            .toolbar {
                Button("Тестовий проєкт", action: createSampleProject)
            }
        }
    }
    
    private func createSampleProject() {
        let newProject = DevelopmentProject(title: "Мобільний банкінг v2.0")
        let task1 = ProjectTask(name: "Дизайн темної теми в Figma", isDone: true)
        let task2 = ProjectTask(name: "Інтеграція Face ID", isDone: false)
        let task3 = ProjectTask(name: "Unit-тести платіжного шлюзу", isDone: false)
        
        // Додаємо завдання у масив зв'язку
        newProject.tasks.append(contentsOf: [task1, task2, task3])
        
        modelContext.insert(newProject)
    }
}

#Preview {
    ProjectListView()
        .modelContainer(for: [DevelopmentProject.self, ProjectTask.self], inMemory: true)
}`,
          explanation: [
            '`newProject.tasks.append(contentsOf: ...)` автоматично налаштовує двосторонній звʼязок для всіх трьох завдань.',
            'При видаленні проєкту свайпом вліво видаляються і проєкт, і всі три його дочірні завдання, запобігаючи витоку памʼяті в SQLite.',
            '`project.completionPercentage` динамічно вираховує прогрес виконання на льоту.'
          ],
          challenge: {
            task: 'Створіть модель `Author` зі звʼязком «один до багатьох» із `Article` та реалізуйте Cascade Delete, щоб видалення автора також видаляло всі його статті.',
            hint: 'Використайте @Relationship(deleteRule: .cascade, inverse: \\Article.author) var articles: [Article] = [] у класі Author',
            solution: `@Model
final class Author {
    @Attribute(.unique) var id: UUID
    var name: String
    @Relationship(deleteRule: .cascade, inverse: \\Article.author)
    var articles: [Article] = []
    
    init(name: String) {
        self.id = UUID()
        self.name = name
    }
}

@Model
final class Article {
    var title: String
    var author: Author?
    
    init(title: String) {
        self.title = title
    }
}`
          }
        }
      }
    ]
  },
  {
    id: 'swiftui-testing-xctest',
    module: 7,
    moduleTitle: 'Модуль 7: Просунуте збереження та тестування',
    title: 'Тестування SwiftUI та XCTest: Unit-тести та перевірка стану',
    description: 'Навчіться писати надійні автоматичні Unit-тести для бізнес-логіки та ViewModel у Swift за допомогою нативного фреймворку Apple XCTest.',
    difficulty: 'Середній',
    estimatedMinutes: 22,
    icon: 'TestTube',
    content: {
      realWorldContext: 'Коли ваш додаток налічує 50 екранів, будь-яка незначна зміна в коді оплати може непомітно зламати екран авторизації чи кошик покупок. Вручну перевіряти всі екрани перед кожним релізом — це години нудної рутини. Автоматичні Unit-тести перевіряють усю логіку за 2 секунди при кожній збірці коду.',
      detailedTheory: [
        {
          title: 'Піраміда тестування у світі iOS',
          paragraphs: [
            '1. **Unit-тести (Модульні тести)**: фундамент піраміди. Перевіряють окремі функції, розрахунки цін, валідацію форм та стан ViewModel в ізоляції. Вони блискавичні (мілісекунди) та найбільш надійні.\n2. **UI-тести (XCUIApplication)**: автоматично запускають симулятор, клікають по кнопках пальцем і перевіряють наявність тексту на екрані. Вони повільніші (хвилини), але тестують додаток як жива людина.'
          ]
        },
        {
          title: 'Анатомія тестового класу XCTestCase',
          paragraphs: [
            'Тести створюються в окремому таргеті проєкту (наприклад, `MyAppTests`). Кожен тестовий файл успадковується від класу `XCTestCase`:\n• `setUpWithError()`: виконується перед кожним тестом (ініціалізація чистих обʼєктів).\n• `tearDownWithError()`: виконується після кожного тесту (очищення памʼяті).\n• Будь-який метод, назва якого починається зі слова `test...`, автоматично розпізнається Xcode як тестовий кейс!'
          ]
        },
        {
          title: 'Сімейство тверджень XCTAssert',
          paragraphs: [
            '• `XCTAssertEqual(a, b)`: перевіряє рівність двох значень.\n• `XCTAssertTrue(condition)` / `XCTAssertFalse(condition)`: перевіряє булевий стан.\n• `XCTAssertNil(value)` / `XCTAssertNotNil(value)`: перевіряє наявність nil.\n• `XCTAssertThrowsError(try ...)`: перевіряє, що функція дійсно кидає очікувану помилку.'
          ]
        }
      ],
      theory: [
        'XCTest — нативний стандарт тестування Apple.',
        'Назви тестових функцій обовʼязково починаються з префікса test.',
        '@testable import надає доступ до внутрішніх класів модуля.',
        'XCTAssertEqual перевіряє правильність результату.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Автоматизований Unit-тест на XCTest',
          code: `final class CartTests: XCTestCase {
    func testApplyDiscount() {
        var cart = ShoppingCart()
        cart.add(itemPrice: 100.0)
        
        cart.applyPromoCode("PROMO10") // Знижка 10%
        
        XCTAssertEqual(cart.total, 90.0, "Сума зі знижкою 10% має бути $90")
    }
}`,
          explanation: 'Виконується за 0.005 секунди. Якщо хтось випадково зламає формулу знижки, тест одразу загориться червоним у CI/CD.'
        },
        bad: {
          title: 'Ручне тестування очима через print()',
          code: `let cart = ShoppingCart()
cart.add(itemPrice: 100.0)
cart.applyPromoCode("PROMO10")
print(cart.total) // Розробник дивиться в консоль очима щоразу`,
          explanation: 'Вимагає постійної людської уваги, легко пропустити баг, не автоматизується перед відправкою в App Store.'
        }
      },
      codeSnippet: `import XCTest
@testable import MyAwesomeApp

// Модель для тестування
class BankAccountViewModel: ObservableObject {
    @Published var balance: Double = 0.0
    
    func deposit(amount: Double) -> Bool {
        guard amount > 0 else { return false }
        balance += amount
        return true
    }
    
    func withdraw(amount: Double) -> Bool {
        guard amount > 0 && amount <= balance else { return false }
        balance -= amount
        return true
    }
}

// Тестовий набір XCTestCase
final class BankAccountTests: XCTestCase {
    var viewModel: BankAccountViewModel!
    
    // Виконується ПЕРЕД кожним окремим тестом
    override func setUpWithError() throws {
        try super.setUpWithError()
        viewModel = BankAccountViewModel()
    }
    
    // Виконується ПІСЛЯ кожного окремого тесту
    override func tearDownWithError() throws {
        viewModel = nil
        try super.tearDownWithError()
    }
    
    func testInitialBalanceIsZero() {
        XCTAssertEqual(viewModel.balance, 0.0, "Початковий баланс має дорівнювати нулю")
    }
    
    func testDepositIncreasesBalance() {
        let success = viewModel.deposit(amount: 150.0)
        
        XCTAssertTrue(success)
        XCTAssertEqual(viewModel.balance, 150.0)
    }
    
    func testWithdrawFailsWhenInsufficientFunds() {
        viewModel.balance = 50.0
        let success = viewModel.withdraw(amount: 100.0)
        
        XCTAssertFalse(success, "Зняття має зазнати невдачі, якщо коштів бракує")
        XCTAssertEqual(viewModel.balance, 50.0, "Баланс не повинен змінитися")
    }
}`,
      explanation: [
        '`@testable import MyAwesomeApp` надає тестам доступ до всіх внутрішніх (internal) класів та функцій вашого додатку.',
        '`setUpWithError()` та `tearDownWithError()` забезпечують повну ізоляцію: кожен тест починається з нового свіжого обʼєкта.',
        'Повідомлення всередині `XCTAssert...` чітко пояснюють у звіті, що саме зламалося.'
      ],
      underTheHood: {
        title: 'Як Xcode запускає тести та звітує про помилки',
        points: [
          'Xcode збирає спеціальний тестовий бандл (`.xctest`) і завантажує його за допомогою dynamic loader.',
          'Тестовий раннер XCTest знаходить усі методи з префіксом `test` через рантайм-рефлексію Objective-C/Swift.',
          'Кожен асерт перевіряє умову, і при невдачі генерує `XCTIssue` з точним номером рядка файлу, який підсвічується червоним хрестиком у редакторі коду.'
        ]
      },
      checkpoints: [
        {
          question: 'З якого префікса обовʼязково має починатися назва функції, щоб XCTest сприйняв її як тестовий метод?',
          options: [
            'test (наприклад, func testCalculation())',
            'check',
            'verify',
            'assert'
          ],
          correctAnswer: 0,
          explanation: 'Раннер XCTest автоматично запускає лише ті методи, які починаються зі слова test у нижньому регістрі.'
        }
      ],
      keyTakeaways: [
        'Unit-тести гарантують надійність бізнес-логіки та безпеку рефакторингу.',
        'Використовуйте `@testable import` для доступу до внутрішніх класів проєкту.',
        '`setUpWithError` та `tearDownWithError` гарантують чистий стан перед кожним тестом.',
        'Твердження XCTAssertEqual та XCTAssertTrue формують ядро перевірок.'
      ],
      commonMistakes: [
        'Написання назви методу без префікса `test` (Xcode просто проігнорує такий метод).',
        'Взаємозалежність між тестами (коли тест B залежить від результатів виконання тесту A).'
      ],
      challenge: {
        task: 'Напишіть тест `testStringTrimming()`, який перевіряє, що функція обрізання пробілів у рядку `"   Привіт   ".trimmingCharacters(in: .whitespaces)` повертає рядок `"Привіт"`.',
        hint: 'Використайте XCTAssertEqual(rawText.trimmingCharacters(in: .whitespaces), "Привіт")',
        solution: `func testStringTrimming() {
    let rawText = "   Привіт   "
    let trimmed = rawText.trimmingCharacters(in: .whitespaces)
    XCTAssertEqual(trimmed, "Привіт", "Пробіли на початку та в кінці рядка мають бути видалені")
}`
      }
    },
    pages: [
      {
        id: 'testing-intuition-safety-net',
        title: 'Інтуїція: Чому професіонали пишуть тести та що таке страхувальна сітка',
        stepLabel: '1. Інтуїція & Тести',
        description: 'Як автоматичні тести рятують від нічних дзвінків розлючених клієнтів і чому тестувати вручну — надто дорого.',
        content: {
          realWorldContext: 'Ви додали нову маленьку фічу — зміну валюти з долара на євро. А наступного ранку виявилося, що через спільну формулу зламався розрахунок податків для користувачів з України, і додаток видає нуль. Unit-тести запобігають таким несподіваним поломкам (регресіям).',
          detailedTheory: [
            {
              title: 'Метафора: Страхувальна сітка гімнаста під куполом цирку',
              paragraphs: [
                'Коли гімнаст тренує новий складний потрійний стрибок, під ним натягують пружну міцну сітку. Якщо він оступиться чи зробить помилку — він не розібʼється на смерть, а просто впаде на сітку, підніметься і виправить рух.\n\n**Unit-тести** — це страхувальна сітка для розробника. Ви можете сміливо переписувати код (робити рефакторинг), видаляти старі файли та оптимізувати алгоритми. Якщо ви десь помилитеся — натискання комбінації клавіш `Cmd + U` в Xcode за 2 секунди покаже червоний маркер: "Увага, рядок 42 зламано!".'
              ]
            },
            {
              title: 'Піраміда тестування',
              paragraphs: [
                '• **70% Unit-тести**: швидкі, точкові тести чистих функцій та ViewModel.\n• **20% Integration-тести**: перевірка роботи бази даних з мережевим шаром.\n• **10% UI-тести**: повільні візуальні тести інтерфейсу користувача.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Яку комбінацію гарячих клавіш використовують у Xcode для запуску всіх тестів проєкту?',
              options: [
                'Command + U (⌘U)',
                'Command + R',
                'Command + B',
                'Command + Shift + K'
              ],
              correctAnswer: 0,
              explanation: 'Cmd + U — стандартна системна комбінація Xcode для запуску Test Suite.'
            },
            {
              question: 'Що таке "регресія" (Regression) у програмуванні?',
              options: [
                'Помилка, коли нова зміна в коді випадково ламає вже раніше працюючий функціонал',
                'Збільшення швидкості процесора',
                'Оновлення версії iOS',
                'Перехід на іншу мову програмування'
              ],
              correctAnswer: 0,
              explanation: 'Регресійний баг — це поломка наявної робочої фічі внаслідок додавання нового коду.'
            }
          ]
        }
      },
      {
        id: 'testing-syntax-xctest-asserts',
        title: 'Анатомія XCTest: Структура тест-кейсу та сімейство тверджень XCTAssert',
        stepLabel: '2. Анатомія XCTest',
        description: 'Як влаштований клас XCTestCase, правила setUp/tearDown та ключові перевірки.',
        content: {
          realWorldContext: 'Кожен тест повинен бути незалежним від інших. Якщо один тест створює файл, він зобовʼязаний його видалити після себе, щоб наступний тест починався з абсолютно чистого аркуша.',
          detailedTheory: [
            {
              title: 'Методи життєвого циклу тесту',
              paragraphs: [
                '• `setUpWithError()`: викликається прямо перед стартом кожної тестової функції. Тут створюються екземпляри класів, відкриваються тимчасові бази в памʼяті.\n• `tearDownWithError()`: викликається одразу після завершення тесту. Тут обʼєкти обнуляються (`sut = nil`), щоб звільнити памʼять і уникнути взаємного впливу тестів.'
              ]
            },
            {
              title: 'Акронім SUT (System Under Test)',
              paragraphs: [
                'У професійному тестуванні головний обʼєкт, який зараз тестується, прийнято називати змінною `sut` (System Under Test):\n`var sut: CurrencyConverter!`.\nЦе робить код тестів стандартним і зрозумілим для будь-якого розробника в команді.'
              ]
            }
          ],
          codeSnippet: `import XCTest

struct PasswordValidator {
    func isValid(password: String) -> Bool {
        return password.count >= 8 && password.contains { $0.isNumber }
    }
}

final class PasswordValidatorTests: XCTestCase {
    var sut: PasswordValidator!
    
    override func setUpWithError() throws {
        try super.setUpWithError()
        sut = PasswordValidator() // Створюємо новий чистий екземпляр
    }
    
    override func tearDownWithError() throws {
        sut = nil // Очищуємо пам'ять
        try super.tearDownWithError()
    }
    
    func testValidPasswordPasses() {
        let result = sut.isValid(password: "StrongPass2026")
        XCTAssertTrue(result, "Пароль із 8+ символами та цифрою повинен бути валідним")
    }
    
    func testTooShortPasswordFails() {
        let result = sut.isValid(password: "Short1")
        XCTAssertFalse(result, "Пароль коротший за 8 символів має відхилятися")
    }
    
    func testPasswordWithoutDigitsFails() {
        let result = sut.isValid(password: "NoDigitsHere")
        XCTAssertFalse(result, "Пароль без цифр має відхилятися")
    }
}`,
          explanation: [
            'Усі три тести незалежні та виконуються ізольовано.',
            'При виникненні помилки Xcode чітко покаже рядок та коментар, який пояснює бізнес-правило.'
          ]
        }
      },
      {
        id: 'testing-viewmodel-mvvm',
        title: 'Тестування ViewModel: Бізнес-логіка, стан завантаження та Mocking',
        stepLabel: '3. Тестування ViewModel',
        description: 'Як перевіряти стан екрана в архітектурі MVVM без запуску самого графічного інтерфейсу.',
        content: {
          realWorldContext: 'Справжнє мистецтво iOS-інженера — писати архітектуру так, щоб усю логіку кнопки "Купити" або "Авторизуватися" можна було перевірити миттєвим Unit-тестом без ручного тапання в симуляторі.',
          detailedTheory: [
            {
              title: 'Тестування патерну AAA (Arrange - Act - Assert)',
              paragraphs: [
                'Кожен якісний тест структурується за правилом 3A:\n1. **Arrange (Підготовка)**: налаштовуємо початковий стан (створюємо модель, задаємо баланс $100).\n2. **Act (Дія)**: викликаємо метод, який тестуємо (`viewModel.withdraw(amount: 40)`).\n3. **Assert (Перевірка)**: переконуємося, що баланс став рівно $60 (`XCTAssertEqual(viewModel.balance, 60.0)`).'
              ]
            },
            {
              title: 'Що таке Mock (Імітація)?',
              paragraphs: [
                'Під час тестів заборонено робити справжні мережеві запити до сервера (інтернет може зникнути, або тестовий запит спише реальні гроші з кредитки!).\n\nЗамість цього використовують протоколи для створення фіктивних сервісів (**Mock Services**), які миттєво повертають заздалегідь підготовлений результат.'
              ]
            }
          ],
          codeSnippet: `import XCTest

// Протокол сервісу для можливості мокування
protocol AuthServiceProtocol {
    func performLogin(email: String) -> Bool
}

// Фіктивний тестовий сервіс
class MockAuthService: AuthServiceProtocol {
    var shouldSucceed: Bool = true
    
    func performLogin(email: String) -> Bool {
        return shouldSucceed
    }
}

// ViewModel
class LoginViewModel: ObservableObject {
    @Published var isLoggedIn: Bool = false
    @Published var errorMessage: String? = nil
    
    private let authService: AuthServiceProtocol
    
    init(authService: AuthServiceProtocol) {
        self.authService = authService
    }
    
    func submit(email: String) {
        if authService.performLogin(email: email) {
            self.isLoggedIn = true
            self.errorMessage = nil
        } else {
            self.isLoggedIn = false
            self.errorMessage = "Помилка авторизації"
        }
    }
}

// Тести ViewModel
final class LoginViewModelTests: XCTestCase {
    func testSuccessfulLoginUpdatesState() {
        // Arrange
        let mockService = MockAuthService()
        mockService.shouldSucceed = true
        let viewModel = LoginViewModel(authService: mockService)
        
        // Act
        viewModel.submit(email: "student@ios.ua")
        
        // Assert
        XCTAssertTrue(viewModel.isLoggedIn)
        XCTAssertNil(viewModel.errorMessage)
    }
}`,
          explanation: [
            '`LoginViewModel` приймає протокол `AuthServiceProtocol`, що дозволяє підставити `MockAuthService` у тестах замість справжнього мережевого сервера.',
            'Тест проходить за 0.001 секунди в повній ізоляції від інтернету.'
          ]
        }
      },
      {
        id: 'testing-errors-pitfalls-quiz',
        title: 'Типові помилки тестування в Xcode & Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо нестабільні тести (Flaky Tests), витоки памʼяті в тестах та перевіряємо навички.',
        content: {
          realWorldContext: 'Найгірше, що може статися з тест-сьютом — це так звані "Flaky Tests" (мерехтливі тести), які то проходять, то падають без жодної зміни коду.',
          detailedTheory: [
            {
              title: 'Головні підводні камені тестування',
              paragraphs: [
                '1. **Використання асинхронного сну Task.sleep без очікування (Flaky Test)**:\nЯкщо тест перевіряє асинхронний код, не намагайтеся просто поставити sleep. Використовуйте `XCTestExpectation` або сучасні `async/await` тести прямо в методі `func testAsync() async throws`.\n\n2. **Забутий @testable import**:\nЯкщо написати просто `import MyApp`, тести не бачитимуть ваші внутрішні класи. Обовʼязково пишіть `@testable import MyApp`.\n\n3. **Глобальний стан (Singletons) між тестами**:\nЯкщо тест змінює `UserDefaults.standard` або `MySingleton.shared` і не прибирає за собою, наступні тести впадуть через забруднений стан.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Що означає аннотація @testable import MyApp у верхній частині тестового файлу?',
              options: [
                'Вона відкриває доступ для тестів до всіх internal властивостей та методів модулю додатку',
                'Вона автоматично створює базу даних',
                'Вона блокує помилки компілятора',
                'Вона шифрує код тесту'
              ],
              correctAnswer: 0,
              explanation: '@testable знімає обмеження доступу internal, дозволяючи тестам безпосередньо звертатися до внутрішніх моделей і функцій додатку.'
            },
            {
              question: 'Яку структуру опису тесту прийнято вважати золотим стандартом?',
              options: [
                'AAA: Arrange (Підготовка) -> Act (Дія) -> Assert (Перевірка)',
                'XYZ: XCTest -> Yield -> Zero',
                'MVC: Model -> View -> Controller',
                'SQL: Select -> Query -> Load'
              ],
              correctAnswer: 0,
              explanation: 'Патерн AAA (Arrange-Act-Assert) структурує будь-який тест на три чіткі зрозумілі фази.'
            },
            {
              question: 'Чому не можна виконувати реальні HTTP-запити до продакшн-сервера під час Unit-тестів?',
              options: [
                'Тести стають повільними, залежними від наявності Wi-Fi і можуть змінити реальні дані клієнтів',
                'Apple забороняє інтернет у коді',
                'Тести не підтримують протокол TCP',
                'Це спалює акумулятор за 1 секунду'
              ],
              correctAnswer: 0,
              explanation: 'Unit-тести мають бути повністю ізольованими, детермінованими та незалежними від зовнішньої мережі.'
            }
          ]
        }
      },
      {
        id: 'testing-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінний набір Unit-тестів для кошика покупок онлайн-магазину з розрахунком знижок.',
        content: {
          realWorldContext: 'Створіть у Playground модель кошика `ShoppingCartViewModel` та напишіть для неї повноцінний тестовий набір `ShoppingCartTests`, який перевіряє додавання товарів, правильність нарахування ПДВ та застосування купонів.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: НАПИСАННЯ UNIT-ТЕСТІВ
// ==========================================

import Foundation
import XCTest

// 1. Модель бізнес-логіки
struct CartItem {
    let id: String
    let name: String
    let price: Double
}

class ShoppingCartViewModel {
    private(set) var items: [CartItem] = []
    private(set) var discountPercentage: Double = 0.0
    
    var subtotal: Double {
        items.reduce(0) { $0 + $1.price }
    }
    
    var finalTotal: Double {
        let discountMultiplier = 1.0 - (discountPercentage / 100.0)
        return subtotal * discountMultiplier
    }
    
    func addItem(_ item: CartItem) {
        items.append(item)
    }
    
    func removeItem(id: String) {
        items.removeAll { $0.id == id }
    }
    
    func applyPromo(code: String) -> Bool {
        if code.uppercased() == "SWIFT20" {
            discountPercentage = 20.0
            return true
        }
        return false
    }
    
    func clearCart() {
        items.removeAll()
        discountPercentage = 0.0
    }
}

// 2. Тестовий клас
final class ShoppingCartTests: XCTestCase {
    var cart: ShoppingCartViewModel!
    
    override func setUp() {
        super.setUp()
        cart = ShoppingCartViewModel()
    }
    
    override func tearDown() {
        cart = nil
        super.tearDown()
    }
    
    func testAddItemIncreasesSubtotal() {
        let item = CartItem(id: "1", name: "Навушники", price: 150.0)
        cart.addItem(item)
        
        XCTAssertEqual(cart.items.count, 1)
        XCTAssertEqual(cart.subtotal, 150.0)
        XCTAssertEqual(cart.finalTotal, 150.0)
    }
    
    func testValidPromoAppliesDiscount() {
        cart.addItem(CartItem(id: "1", name: "Клавіатура", price: 100.0))
        let applied = cart.applyPromo(code: "SWIFT20")
        
        XCTAssertTrue(applied)
        XCTAssertEqual(cart.discountPercentage, 20.0)
        XCTAssertEqual(cart.finalTotal, 80.0, "Ціна зі знижкою 20% має бути $80.0")
    }
    
    func testInvalidPromoIsRejected() {
        let applied = cart.applyPromo(code: "WRONG_CODE")
        
        XCTAssertFalse(applied)
        XCTAssertEqual(cart.discountPercentage, 0.0)
    }
    
    func testRemoveItemRemovesCorrectElement() {
        let item1 = CartItem(id: "A1", name: "Мишка", price: 50.0)
        let item2 = CartItem(id: "A2", name: "Килимок", price: 20.0)
        
        cart.addItem(item1)
        cart.addItem(item2)
        cart.removeItem(id: "A1")
        
        XCTAssertEqual(cart.items.count, 1)
        XCTAssertEqual(cart.items.first?.id, "A2")
        XCTAssertEqual(cart.subtotal, 20.0)
    }
}

// Запуск тестів у Playground середовищі
ShoppingCartTests.defaultTestSuite.run()`,
          explanation: [
            '`ShoppingCartTests.defaultTestSuite.run()` дозволяє запустити тести прямо всередині Xcode Playground без окремого таргету!',
            'Усі чотири методи тестують ключові сценарії використання кошика, гарантуючи 100% покриття бізнес-логіки.',
            'Якщо хтось змінить розрахунок знижки або видалення елементів, тести миттєво вкажуть на помилку.'
          ],
          challenge: {
            task: 'Напишіть тест `testStringTrimming()`, який перевіряє, що функція обрізання пробілів у рядку `"   Привіт   ".trimmingCharacters(in: .whitespaces)` повертає рядок `"Привіт"`.',
            hint: 'Використайте XCTAssertEqual(rawText.trimmingCharacters(in: .whitespaces), "Привіт")',
            solution: `func testStringTrimming() {
    let rawText = "   Привіт   "
    let trimmed = rawText.trimmingCharacters(in: .whitespaces)
    XCTAssertEqual(trimmed, "Привіт", "Пробіли на початку та в кінці рядка мають бути видалені")
}`
          }
        }
      }
    ]
  }
];
