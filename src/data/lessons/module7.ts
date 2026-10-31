import { Lesson } from '@/types';

export const module7Lessons: Lesson[] = [
  {
    id: 'swiftdata-relationships',
    module: 7,
    moduleTitle: 'Модуль 7: Просунуте збереження та тестування',
    title: 'SwiftData: Зв’язки 1‑до‑багатьох та 1‑до‑1',
    description: 'Вивчіть як створювати та використовувати зв’язки у SwiftData, працювати з Cascade Delete і Fetch‑властивостями.',
    difficulty: 'Просунутий',
    estimatedMinutes: 22,
    icon: 'Link',
    content: {
      realWorldContext: 'У нотатному застосунку користувач має багато нотаток, які належать до одного проєкту. Потрібно зберігати ці зв’язки без зайвого коду.',
      detailedTheory: [
        {
          title: 'One‑to‑Many зв’язок',
          paragraphs: [
            '`@Relationship` описує зв’язок між моделями SwiftData; завантаження та оновлення залежить від контексту й запиту.',
            'Використовується `var notes: [Note] = []` з атрибутом `.cascade` або `.nullify`.'
          ]
        },
        {
          title: 'One‑to‑One зв’язок',
          paragraphs: [
            '`inverse` описує зворотний бік зв’язку між `User` і `Profile`.',
            'Якщо потрібна унікальність, її слід забезпечити окремими обмеженнями моделі або перевіркою даних.'
          ]
        }
      ],
      theory: [],
      codeSnippet: `@Model class Project {
    @Attribute(.unique) var id: UUID = UUID()
    var name: String = ""
    @Relationship(deleteRule: .cascade, inverse: \\Note.project) var notes: [Note] = []
}

@Model class Note {
    var title: String = ""
    var content: String = ""
    @Relationship(inverse: \\Project.notes) var project: Project?
}

// У SwiftUI view
@Query var projects: [Project]

List(projects) { project in
    Section(header: Text(project.name)) {
        ForEach(project.notes) { note in Text(note.title) }
    }
}`,
      comparisonSnippet: {
        bad: {
          title: 'Core Data ручний зв’язок',
          code: `class Project: NSManagedObject { @NSManaged var notes: NSSet }
class Note: NSManagedObject { @NSManaged var project: Project? }
// Потрібно вручну синхронізувати обидва боки, створювати NSSet, ...`,
          explanation: 'Багато Boilerplate‑коду, легка можливість помилок.'
        },
        good: {
          title: 'SwiftData декларативний зв’язок',
          code: `@Model class Project { @Relationship(deleteRule: .cascade, inverse: \\Note.project) var notes: [Note] = [] }
@Model class Note { @Relationship(inverse: \\Project.notes) var project: Project? }`,
          explanation: 'SwiftData генерує потрібні inverse‑відношення автоматично.'
        }
      },
      explanation: [],
      underTheHood: {
        title: 'Як SwiftData працює зі зв’язками',
        points: [
          '`@Relationship` описує зв’язок між моделями SwiftData та його правила видалення.',
          'Коли батько видаляється, правила cascade/nullify визначають поведінку дочірніх записів.',
          'Використовується lazy‑loading для великої колекції, щоб не завантажувати зайві дані.'
        ]
      },
      checkpoints: [
        {
          question: 'Яка стратегія видалення потрібна, щоб при видаленні Project автоматично видалились всі його Note?',
          options: ['nullify', 'cascade', 'restrict', 'noAction'],
          correctAnswer: 1,
          explanation: '`cascade` забезпечує видалення всіх дочірніх записів при видаленні батька.'
        }
      ],
      keyTakeaways: ['SwiftData спрощує декларацію зв’язків', '@Relationship підтримує cascade та nullify', 'Inverse‑відношення генерується автоматично'],
      commonMistakes: ['Не вказати inverse‑відношення, що призводить до розмитаких даних'],
      challenge: {
        task: 'Створіть модель `Author` з багатьма `Article` та реалізуйте Cascade Delete, щоб при видаленні автора видалились його статті.',
        hint: 'Використайте `@Relationship(deleteRule: .cascade)` у `Author`.',
        solution: `@Model class Author { @Attribute(.unique) var id: UUID = UUID(); var name: String = ""; @Relationship(deleteRule: .cascade, inverse: \\Article.author) var articles: [Article] = [] }
@Model class Article { var title: String = ""; @Relationship(inverse: \\Author.articles) var author: Author? }`
      },
      xcodeLab: {
        task: 'Створіть SwiftUI‑стек з Project → Notes, додайте кнопку видалити Project і переконайтеся, що нотатки видаляються автоматично.',
        steps: [
          'Додайте `@Model` класи Project і Note та опишіть зв’язок через `@Relationship(deleteRule: .cascade, inverse: \\Note.project)`.',
          'Ініціалізуйте `ModelContainer` у @main App.',
          'Використайте `@Query` та `@Environment(\\.modelContext)` у View.',
          'Додайте кнопку, яка викликає `modelContext.delete(project)`.',
          'Перевірте, що список Note оновлюється.'
        ],
        code: `@main
struct DemoApp: App {
    var body: some Scene {
        WindowGroup {
            ProjectsView()
                .modelContainer(for: [Project.self, Note.self])
        }
    }
}

struct ProjectsView: View {
    @Query private var projects: [Project]
    @Environment(\\.modelContext) private var modelContext

    var body: some View {
        List(projects) { project in
            HStack {
                Text(project.name)
                Spacer()
                Button("Видалити", role: .destructive) {
                    modelContext.delete(project)
                }
            }
        }
    }
}`,
        expectedOutput: 'Після видалення проєкту його пов’язані нотатки видаляються правилом cascade.',
        tips: 'Переконайтеся, що `@Relationship(deleteRule: .cascade)` встановлено саме в батьківській моделі.'
      }
    }
  },
  {
    id: 'swiftui-testing-xctest',
    module: 7,
    moduleTitle: 'Модуль 7: Просунуте збереження та тестування',
    title: 'Тестування SwiftUI UI за допомогою XCTest',
    description: 'Навчіться писати UI‑тести для SwiftUI, застосовувати ViewInspector та перевіряти стан ViewModel.',
    difficulty: 'Середній',
    estimatedMinutes: 18,
    icon: 'TestTube',
    content: {
      realWorldContext: 'Для великих додатків важливо автоматизовано перевіряти, що UI реагує на зміну стану (наприклад, перемикач теми).',
      detailedTheory: [
        {
          title: 'XCTest Basics for SwiftUI',
          paragraphs: [
            'Тести зазвичай розміщують у test target і запускають через Xcode або `xcodebuild test`.',
            '`XCUIApplication` призначений для UI-тестів. `ViewInspector` — стороння бібліотека для інспектування SwiftUI View у тестах.'
          ]
        },
        {
          title: 'ViewInspector – інспекція вьюшок',
          paragraphs: [
            '`ViewInspector` дозволяє досліджувати структуру View у тестах.',
            'Наприклад, можна знайти кнопку за підписом і викликати її дію, щоб перевірити зміну стану.'
          ]
        }
      ],
      theory: [],
      codeSnippet: `import SwiftUI
import ViewInspector

struct CounterView: View {
    @State private var count = 0
    var body: some View {
        VStack {
            Text("Count: \(count)")
            Button("Increment") { count += 1 }
        }
    }
}

extension CounterView: Inspectable {}

// Test case
class CounterViewTests: XCTestCase {
    func testIncrement() throws {
        let view = CounterView()
        let inspected = try view.inspect()
        try inspected.find(button: "Increment").tap()
        let text = try inspected.find(text: "Count: 1").string()
        XCTAssertEqual(text, "Count: 1")
    }
}`,
      comparisonSnippet: {
        bad: {
          title: 'Тест без ViewInspector',
          code: `func testUI() { let app = XCUIApplication(); app.launch(); app.buttons["Increment"].tap(); XCTAssert(app.staticTexts["Count: 1"].exists) }`,
          explanation: 'UI‑тест потребує реального запуску симулятора, повільний і крихкий.'
        },
        good: {
          title: 'Unit‑тест з ViewInspector',
          code: `func testIncrement() throws { let view = CounterView(); let inspected = try view.inspect(); try inspected.find(button: "Increment").tap(); XCTAssertEqual(try inspected.find(text: "Count: 1").string(), "Count: 1") }`,
          explanation: 'Швидкий, без запуску симулятора, легко інтегрується в CI.'
        }
      },
      explanation: [],
      underTheHood: {
        title: 'Як працює ViewInspector',
        points: [
          '`inspect()` генерує Mirror‑подібну структуру, яка дозволяє доступ до внутрішніх View.',
          'Використовує протоколи `Inspectable` для розширення ваших Views.',
          'Не впливає на продуктивність у релізній збірці.'
        ]
      },
      checkpoints: [
        {
          question: 'Яка бібліотека потрібна для юніт‑тестування SwiftUI‑вьюшок без запуску симулятора?',
          options: ['SnapshotTesting', 'ViewInspector', 'Quick', 'Nimble'],
          correctAnswer: 1,
          explanation: '`ViewInspector` надає можливість інспектувати SwiftUI‑вьюшки в тестах.'
        }
      ],
      keyTakeaways: ['ViewInspector спрощує unit‑тести SwiftUI', 'UI‑тести через XCUIApplication більш витратні', 'Тести повинні бути швидкими та детермінованими'],
      commonMistakes: ['Забувати додати `extension MyView: Inspectable`'],
      challenge: {
        task: 'Напишіть тест, який перевіряє, що кнопка "Toggle" в `ToggleView` змінює текст між "ON" та "OFF".',
        hint: 'Використайте `try view.inspect().find(button: "Toggle").tap()` і перевірте текст.',
        solution: `func testToggle() throws { let view = ToggleView(); var inspected = try view.inspect(); try inspected.find(button: "Toggle").tap(); XCTAssertEqual(try inspected.find(text: "ON").string(), "ON"); try inspected.find(button: "Toggle").tap(); XCTAssertEqual(try inspected.find(text: "OFF").string(), "OFF") }`
      },
      xcodeLab: {
        task: 'Створіть SwiftUI‑view з лічильником, додайте XCTest‑тест, який інспектує та натискає кнопку, перевіряючи зміну лічильника.',
        steps: [
          'Створіть `CounterView` як у код‑сніпеті.',
          'Додайте `extension CounterView: Inspectable`.',
          'Створіть тестовий клас у `Tests` таргеті.',
          'Запустіть `xcodebuild test` і переконайтесь, що тест проходить.'
        ],
        code: `// CounterView.swift (as above)
// CounterViewTests.swift (as above)`,
        expectedOutput: 'Тест успішно проходить, підтверджуючи роботу кнопки.',
        tips: 'Додайте `@testable import YourApp` у тестовий файл для доступу до View.'
      }
    }
  }
];

