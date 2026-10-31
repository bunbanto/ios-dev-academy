import { Lesson } from '@/types';

export const module5Lessons: Lesson[] = [
  {
    id: 'swift-concurrency-fundamentals',
    module: 5,
    moduleTitle: 'Модуль 5: Асинхронність та Робота з Мережею',
    title: 'Swift Concurrency: async/await, Task, TaskGroup',
    description: 'Ознайомтеся з новою моделью конкурентності в Swift та застосуванням у мережевих запитах.',
    difficulty: 'Середній',
    estimatedMinutes: 18,
    icon: 'Clock',
    content: {
      realWorldContext: 'У великому додатку необхідно отримувати дані з бекенду без блокування UI, тому використовується async/await.',
      detailedTheory: [
        {
          title: 'async / await',
          paragraphs: [
            'Функція `async` може призупинити поточну задачу в точці `await`, не блокуючи потік, на якому вона виконується.',
            '`await` розкладає проміс/ф’ючер, повертаючи результат без вкладених колбеків.'
          ],
          callout: { type: 'tip', text: '`await` сам по собі не блокує потік. Важкі синхронні обчислення можуть блокувати виконавець; ізоляцію UI-стану задавайте явно, наприклад через `@MainActor`.' }
        },
        {
          title: 'Task & TaskGroup',
          paragraphs: [
            '`Task` створює асинхронну задачу; її виконавець і actor isolation визначають, де саме виконується робота.',
            '`TaskGroup` дозволяє одночасно виконувати кілька підзадач і збирати їх результати.'
          ]
        }
      ],
      theory: [],
      codeSnippet: `func fetchPosts() async throws -> [Post] {
    let (data, _) = try await URLSession.shared.data(from: URL(string: "https://example.com/posts")!)
    return try JSONDecoder().decode([Post].self, from: data)
}

Task {
    do {
        let posts = try await fetchPosts()
        // update UI
    } catch {
        // handle error
    }
}`,
      comparisonSnippet: {
        bad: {
          title: 'Callback hell',
          code: `URLSession.shared.dataTask(with: url) { data, _, error in
    guard let data else {
        print(error ?? URLError(.badServerResponse))
        return
    }

    do {
        let posts = try JSONDecoder().decode([Post].self, from: data)
        DispatchQueue.main.async {
            self.posts = posts
        }
    } catch {
        print(error)
    }
}.resume()`,
          explanation: 'У callback-підході потрібно вручну організувати передачу результату, обробку помилок і оновлення UI на головному акторі.'
        },
        good: {
          title: 'Async/Await',
          code: `Task {
    do {
        let posts = try await fetchPosts()
        // Оновлюйте UI з контексту, ізольованого на @MainActor
    } catch {
        // handle error
    }
}`,
          explanation: 'Лінійний код, простіша обробка помилок.'
        }
      },
      explanation: [],
      underTheHood: {
        title: 'Як працює async/await під капотом',
        points: [
          'Swift компілює async‑функцію у state‑машину.',
          '`await` – точка призупинки, після якої планувальник зберігає контекст.',
          '`TaskGroup` дає змогу структурувати дочірні задачі та зібрати їхні результати; деталі планування є внутрішньою реалізацією Swift.'
        ]
      },
      checkpoints: [
        {
          question: 'Яка функція відкриває нову асинхронну задачу в Swift?',
          options: ['dispatch_async', 'Task', 'OperationQueue', 'NSThread'],
          correctAnswer: 1,
          explanation: '`Task { … }` – сучасний спосіб запуску асинхронної роботи.'
        }
      ],
      keyTakeaways: [
        'async/await спрощує асинхронний код',
        'TaskGroup дозволяє паралельні запити',
        'Обробка помилок у try/catch читаєміша'
      ],
      commonMistakes: ['Забути `await` і отримати необроблений результат'],
      challenge: {
        task: 'Створіть функцію, яка одночасно отримує користувача та його пости за допомогою TaskGroup.',
        hint: 'Використайте `withThrowingTaskGroup` або `async let`.',
        solution: `func fetchUserAndPosts() async throws -> (User, [Post]) {
    try await withThrowingTaskGroup(of: Any.self) { group in
        var user: User?
        var posts: [Post] = []
        group.addTask { user = try await fetchUser() }
        group.addTask { posts = try await fetchPosts() }
        for try await _ in group { /* waiting */ }
        return (user!, posts)
    }
}`
      },
      xcodeLab: {
        task: 'Створіть SwiftUI‑view з кнопкою "Load Posts", яка показує індикатор під час запиту.',
        steps: [
          'Оголосіть @State `isLoading` і `posts`.',
          'У `Button` запустіть `Task { let result = try await fetchPosts() ... }`.',
          'Показуйте `ProgressView` коли `isLoading` true.'
        ],
        code: `struct PostsView: View {
    @State private var posts: [Post] = []
    @State private var isLoading = false
    var body: some View {
        VStack {
            if isLoading { ProgressView() }
            List(posts) { post in Text(post.title) }
            Button("Load Posts") {
                isLoading = true
                Task {
                    do {
                        posts = try await fetchPosts()
                    } catch { /* handle */ }
                    isLoading = false
                }
            }
        }
    }
}`,
        expectedOutput: 'Список постів оновлюється після успішного запиту; індикатор показується лише під час завантаження.',
        tips: 'Зміни UI-стану виконуйте в контексті `@MainActor`; не покладайтеся на неявне переміщення коду на головний потік.'
      }
    }
  },
  {
    id: 'swift-codable-json',
    module: 5,
    moduleTitle: 'Модуль 5: Асинхронність та Робота з Мережею',
    title: 'Парсинг JSON через Codable',
    description: 'Навчіться декодувати складні JSON‑структури, працювати з CodingKeys та датами.',
    difficulty: 'Середній',
    estimatedMinutes: 16,
    icon: 'Code',
    content: {
      realWorldContext: 'Більшість бекенд‑API повертає JSON; його треба перетворити у Swift‑моделі для UI.',
      detailedTheory: [
        {
          title: 'Базове використання Codable',
          paragraphs: [
            '`Codable` – протоколи `Encodable` і `Decodable`, які дозволяють автоматично кодувати/декодувати структури.',
            'Для простих моделей Swift може автоматично генерувати код.'
          ]
        },
        {
          title: 'Custom CodingKeys та DateFormatter',
          paragraphs: [
            '`CodingKeys` дозволяє встановити відповідність між полями JSON та властивостями структури.',
            'Для дат часто потрібен `DateFormatter` або `ISO8601DateFormatter`.'
          ]
        }
      ],
      theory: [],
      codeSnippet: `struct Post: Codable {
    let id: Int
    let title: String
    let createdAt: Date
    enum CodingKeys: String, CodingKey {
        case id, title
        case createdAt = "created_at"
    }
}

let decoder = JSONDecoder()
decoder.dateDecodingStrategy = .iso8601
let post = try decoder.decode(Post.self, from: jsonData)`,
      comparisonSnippet: {
        bad: {
          title: 'Ручний парсинг',
          code: `if let dict = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
    let id = dict["id"] as? Int ?? 0
    let title = dict["title"] as? String ?? ""
    // ...
}`,
          explanation: 'Готовий парсинг вимагає багато boilerplate та схильний до помилок.'
        },
        good: {
          title: 'Codable',
          code: `let post = try JSONDecoder().decode(Post.self, from: data)`,
          explanation: 'Автоматичний, типобезпечний та менше коду.'
        }
      },
      explanation: [],
      underTheHood: {
        title: 'Як працює Decodable',
        points: [
          'Swift генерує init(from decoder: Decoder) під час компіляції.',
          'Decoder читає ключі, конвертує типи та заповнює структуру.'
        ]
      },
      checkpoints: [
        {
          question: 'Який протокол потрібен для автоматичного декодування?',
          options: ['Encodable', 'Decodable', 'Codable', 'Hashable'],
          correctAnswer: 2,
          explanation: '`Codable` = `Encodable` + `Decodable`.'
        }
      ],
      keyTakeaways: ['Codable спрощує роботу з JSON', 'Custom CodingKeys дозволяють змінювати назви полів', 'DateDecodingStrategy допомагає з датами'],
      commonMistakes: ['Ігнорування optional‑полів у JSON'],
      challenge: {
        task: 'Декодуйте масив постів з вкладеним автором та датою створення.',
        hint: 'Створіть структури `Post` та `Author` з відповідними CodingKeys.',
        solution: `struct Author: Codable { let name: String }
struct Post: Codable {
    let id: Int
    let title: String
    let author: Author
    let createdAt: Date
    enum CodingKeys: String, CodingKey { case id, title, author, createdAt = "created_at" }
}
let posts = try JSONDecoder().decode([Post].self, from: data)`
      },
      xcodeLab: {
        task: 'Створіть SwiftUI‑view, який завантажує список постів та відображає їх назви.',
        steps: [
          'Оголосіть @State `posts: [Post] = []`.',
          'У `onAppear` запустіть `Task { posts = try await fetchPosts() }`.',
          'Виведіть `List(posts) { Text($0.title) }`.'
        ],
        code: `struct PostsListView: View {
    @State private var posts: [Post] = []
    var body: some View {
        List(posts) { post in Text(post.title) }
            .task {
                do { posts = try await fetchPosts() } catch { }
            }
    }
}`,
        expectedOutput: 'Список постів з назвою кожного елементу.',
        tips: 'Переконайтесь, що `Post` відповідає `Identifiable` або використайте `id:\\.self`.'
      }
    }
  },
  {
    id: 'swift-error-handling',
    module: 5,
    moduleTitle: 'Модуль 5: Асинхронність та Робота з Мережею',
    title: 'Обробка помилок у Swift',
    description: 'Дізнайтеся про тип `Error`, створення власних енемів та використання `do‑catch`.',
    difficulty: 'Початковий',
    estimatedMinutes: 14,
    icon: 'AlertTriangle',
    content: {
      realWorldContext: 'При запиті до API часто трапляються помилки (недіапазонний код, відсутність інтернету), їх треба коректно обробляти.',
      detailedTheory: [
        {
          title: 'Тип Error',
          paragraphs: [
            '`Error` – протокол, який представляє помилку. Структури та enum можуть його реалізовувати.',
            'Конформність до `LocalizedError` дозволяє задавати зрозумілі повідомлення.'
          ]
        },
        {
          title: 'do‑catch',
          paragraphs: [
            '`do { try … } catch { … }` – блок для виконання коду, який може кинути помилку.',
            '`catch let error as MyError` дозволяє обробляти специфічні типи.'
          ]
        }
      ],
      theory: [],
      codeSnippet: `enum NetworkError: Error, LocalizedError {
    case invalidURL
    case noData
    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid URL"
        case .noData: return "No data received"
        }
    }
}

func loadData() throws -> Data {
    guard let url = URL(string: "https://example.com") else { throw NetworkError.invalidURL }
    let (data, _) = try Data(contentsOf: url)
    return data
}

do {
    let data = try loadData()
    // use data
} catch {
    print(error.localizedDescription)
}`,
      comparisonSnippet: {
        bad: {
          title: 'Просто return nil',
          code: `func loadData() -> Data? { return nil }`,
          explanation: 'Втрачає інформацію про причину помилки.'
        },
        good: {
          title: 'Використання Error',
          code: `func loadData() throws -> Data { … }`,
          explanation: 'Повна інформація про тип помилки.'
        }
      },
      explanation: [],
      underTheHood: {
        title: 'Як Swift кине помилку',
        points: [
          'При `throw` створюється об’єкт, який передається через стек викликів.',
          'catch перехоплює тип, який відповідає киданій помилці.'
        ]
      },
      checkpoints: [
        {
          question: 'Який ключовий оператор використовується для кидання помилки?',
          options: ['throw', 'catch', 'error', 'raise'],
          correctAnswer: 0,
          explanation: '`throw` кине помилку, яку можна спіймати у `catch`.'
        }
      ],
      keyTakeaways: ['Error – базовий протокол для помилок', 'do‑catch – стандартний спосіб обробки', 'Створюйте власні типи помилок для деталізації'],
      commonMistakes: ['Ігнорувати `try` і не обробляти помилку'],
      challenge: {
        task: 'Створіть функцію, яка завантажує JSON та кине кастомну помилку при відсутності даних.',
        hint: 'Використайте `guard let data = … else { throw MyError.noData }`.',
        solution: `enum MyError: Error { case noData }
func fetchJSON() throws -> Data {
    guard let data = try? Data(contentsOf: URL(string: "https://example.com")!) else { throw MyError.noData }
    return data
}`
      },
      xcodeLab: {
        task: 'Реалізуйте SwiftUI‑view з полем вводу URL та кнопкою "Download", яка показує помилку у `Alert` при неуспішному запиті.',
        steps: [
          'Оголосіть @State `urlString` та `showError`.',
          'У `Button` спробуйте `try await fetchData()` у `do‑catch`.',
          'При помилці встановіть `showError = true` і відобразіть `Alert`.'
        ],
        code: `struct DownloadView: View {
    @State private var urlString = ""
    @State private var showError = false
    @State private var errorMessage = ""
    var body: some View {
        VStack {
            TextField("URL", text: $urlString)
            Button("Download") {
                Task {
                    do {
                        let _ = try await fetchData(from: urlString)
                    } catch {
                        errorMessage = error.localizedDescription
                        showError = true
                    }
                }
            }
        }
        .alert(isPresented: $showError) {
            Alert(title: Text("Error"), message: Text(errorMessage), dismissButton: .default(Text("OK")))
        }
    }
}`,
        expectedOutput: 'Alert показується при будь‑якій помилці завантаження.',
        tips: 'Переконайтесь, що `fetchData` оголошена як `async throws`.'
      }
    }
  }
];

