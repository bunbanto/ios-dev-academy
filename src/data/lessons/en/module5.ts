import { Lesson } from '@/types';

export const module5LessonsEn: Lesson[] = [
  {
    id: 'swift-concurrency-fundamentals',
    module: 5,
    moduleTitle: 'Module 5: Asynchronous Swift & Networking',
    title: 'Swift Concurrency: async/await, Task, and @MainActor',
    description: 'Master modern asynchronous Swift: linear async/await syntax, non-blocking Task execution, thread safety with @MainActor, and parallel requests with async let.',
    difficulty: 'Intermediate',
    estimatedMinutes: 26,
    icon: 'Zap',
    content: {
      realWorldContext: 'Fetching data from a remote server takes between 100 milliseconds and several seconds. If you ran a network request on the main thread, the entire iPhone screen would freeze, touch gestures would become unresponsive, and iOS would kill the app with a watchdog termination crash. Modern Swift Concurrency guarantees that your UI remains buttery smooth at 120 FPS while background tasks fetch data asynchronously.',
      detailedTheory: [
        {
          title: 'What is async/await?',
          paragraphs: [
            'Before Swift 5.5, asynchronous code relied heavily on completion handler closures. This resulted in nested indentation known as "Callback Hell" or the "Pyramid of Doom", where error handling was cumbersome and forgetting to call a completion handler left the app hanging forever.',
            '`async/await` allows writing asynchronous code sequentially as if it were regular synchronous code. The `async` keyword marks a function that can suspend execution. The `await` keyword designates a suspension point where the current thread is freed up while waiting for a background operation to complete.',
          ]
        },
        {
          title: 'The Task Container and Concurrency',
          paragraphs: [
            'Synchronous contexts (like SwiftUI button actions or `onAppear`) cannot call `async` functions directly.',
            'A `Task { ... }` block creates an asynchronous execution context, bridging synchronous code to the asynchronous world and scheduling work onto the cooperative background thread pool.',
          ]
        },
        {
          title: 'The @MainActor Guardian',
          paragraphs: [
            'All UI updates in iOS MUST execute on the Main Thread. In UIKit, developers manually called `DispatchQueue.main.async { ... }`.',
            'Swift Concurrency introduces `@MainActor`, a compiler-enforced singleton actor that guarantees properties and methods bound to it are executed strictly on the main thread, completely eliminating data races.',
          ]
        }
      ],
      theory: [
        'async marks a function that can yield its thread while waiting.',
        'await designates a cooperative suspension point.',
        'Task bridges synchronous SwiftUI actions to asynchronous work.',
        '@MainActor ensures UI state updates run safely on the main thread.',
        'async let executes multiple independent requests in parallel.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Modern async/await (Linear, Safe)',
          code: `func loadUserProfile() async throws -> UserProfile {
    let (data, _) = try await URLSession.shared.data(from: profileURL)
    let profile = try JSONDecoder().decode(UserProfile.self, from: data)
    return profile
}`,
          explanation: 'Reads linearly top-to-bottom. Compiler enforces error handling, memory safety, and thread safety.',
        },
        bad: {
          title: 'Legacy Callback Hell (Pyramid of Closures)',
          code: `// Legacy completion handlers
func loadUserProfile(completion: @escaping (Result<UserProfile, Error>) -> Void) {
    URLSession.shared.dataTask(with: profileURL) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }
        guard let data = data else {
            // Easy to forget completion() call here, leaving UI frozen!
            return
        }
        do {
            let profile = try JSONDecoder().decode(UserProfile.self, from: data)
            DispatchQueue.main.async {
                completion(.success(profile))
            }
        } catch {
            completion(.failure(error))
        }
    }.resume()
}`,
          explanation: 'Nested closures with manual thread hopping; easy to leak memory or forget to trigger callbacks.',
        }
      },
      codeSnippet: `// 1. Asynchronous Service
struct NewsFeedService {
    func fetchTopHeadlines() async throws -> [String] {
        // Simulating network latency
        try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second
        return [
            "Apple announces M4 Ultra chip",
            "Swift 6 introduces complete data race safety",
            "SwiftUI adoption surges across Fortune 500 apps"
        ]
    }
}

// 2. SwiftUI ViewModel isolated to MainActor
@MainActor
final class NewsFeedViewModel: ObservableObject {
    @Published var headlines: [String] = []
    @Published var isLoading = false
    
    private let service = NewsFeedService()
    
    func loadData() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            headlines = try await service.fetchTopHeadlines()
        } catch {
            print("Failed to load headlines: \\(error)")
        }
    }
}`,
      explanation: [
        'fetchTopHeadlines is marked async throws, allowing cooperative thread yielding during Task.sleep or network calls.',
        '@MainActor on NewsFeedViewModel guarantees all updates to @Published properties happen on the main thread.',
        'defer { isLoading = false } ensures the loading spinner is dismissed regardless of whether fetch succeeds or fails.',
      ],
      underTheHood: {
        title: 'Swift Cooperative Thread Pool',
        points: [
          'Unlike legacy GCD which spawned hundreds of threads and caused thread explosion and heavy context switching, Swift Concurrency uses a fixed-size Cooperative Thread Pool matching CPU core count.',
          'When a task reaches `await`, it suspends and relinquishes its thread to other waiting work, resuming later on any available thread.',
        ]
      },
      checkpoints: [
        {
          question: 'What happens when an async function encounters an await keyword?',
          options: [
            'It marks a suspension point where the thread is freed to do other work until the operation finishes',
            'The entire operating system freezes',
            'The device restarts',
            'The function terminates immediately and returns nil'
          ],
          correctAnswer: 0,
          explanation: 'await marks a suspension point: the function pauses execution, freeing the underlying thread for other tasks until resumed.',
        }
      ],
      keyTakeaways: [
        'async/await transforms asynchronous code into clean, readable linear control flow.',
        'Always annotate SwiftUI ViewModels with @MainActor to protect UI updates.',
        'Use Task { ... } to call async code from synchronous buttons or onAppear closures.',
        'Use async let to fetch multiple resources concurrently.',
      ],
      commonMistakes: [
        'Updating @Published UI state from a background thread without @MainActor.',
        'Calling Task.sleep without nanoseconds conversion (1 second = 1_000_000_000 ns).',
      ],
      challenge: {
        task: 'Write an `async` function `fetchStockPrice(symbol: String) async -> Double` that sleeps for 500ms using `Task.sleep` and returns 185.50.',
        hint: 'Use try? await Task.sleep(nanoseconds: 500_000_000)',
        solution: `func fetchStockPrice(symbol: String) async -> Double {
    try? await Task.sleep(nanoseconds: 500_000_000)
    return 185.50
}`
      }
    },
    pages: [
      {
        id: 'concurrency-intuition-threads',
        title: 'Intuition: What is Asynchrony and Why Smartphone Screens Freeze',
        stepLabel: '1. Intuition & Main Thread',
        description: 'Understand thread blocking vs. cooperative concurrency using the restaurant waiter analogy.',
        content: {
          realWorldContext: 'Your smartphone screen redraws 60 to 120 times every second. If your code takes more than 16 milliseconds to complete on the Main Thread, frames are dropped and the user experiences severe lag and unresponsiveness.',
          detailedTheory: [
            {
              title: 'Analogy: The Restaurant Waiter',
              paragraphs: [
                'Imagine a restaurant with a single waiter. A guest orders a pizza. The waiter walks into the kitchen and stands motionless in front of the oven for 15 minutes waiting for the pizza to bake.',
                'During those 15 minutes, no other guest can order, ask for the bill, or get a glass of water. The whole dining room is frozen! That is **Synchronous Blocking** on the Main Thread.',
                'A smart waiter places the pizza order in the kitchen and immediately returns to the dining room to serve other guests. When the chef dings the bell ("Order ready!"), the waiter picks up the pizza. That is **Asynchronous Concurrency**.',
              ],
              callout: {
                type: 'warning',
                title: 'The Golden Rule of iOS',
                text: 'Never, EVER block the Main Thread! Heavy work (networking, image decoding, database queries) belongs on background worker threads.',
              }
            }
          ],
          codeSnippet: `// ❌ Fatal mistake: Blocking the main thread
// Thread.sleep(forTimeInterval: 5) // Freezes the entire phone for 5 seconds!

// ✅ Modern async: Non-blocking cooperative pause
await Task.sleep(nanoseconds: 5_000_000_000) // UI stays completely smooth at 120 FPS`,
          checkpoints: [
            {
              question: 'Why does running a network download directly on the Main Thread freeze the app?',
              options: [
                'Because the main thread is responsible for rendering 60/120 FPS UI frames and responding to touch gestures',
                'Because iOS limits Wi-Fi speeds on the main thread',
                'Because the CPU overheats',
                'Because main thread cannot access memory'
              ],
              correctAnswer: 0,
              explanation: 'The main thread renders the UI and responds to touches; blocking it prevents screen redraws and touch events.',
            }
          ]
        }
      },
      {
        id: 'concurrency-syntax-async-await',
        title: 'Syntax Anatomy: async, await, and the Task Block',
        stepLabel: '2. async, await & Task',
        description: 'Learn how to write asynchronous functions, use suspension points, and launch Task blocks in SwiftUI.',
        content: {
          realWorldContext: 'When a user taps a "Refresh" button in a weather app, the button action closure is synchronous. You launch a Task block to execute the asynchronous fetch.',
          detailedTheory: [
            {
              title: 'The async throws Syntax',
              paragraphs: [
                'An asynchronous function that can also fail is declared as `func fetchData() async throws -> Data`.',
                'When invoking it, you pair `try` with `await`: `let data = try await fetchData()`.',
              ]
            },
            {
              title: 'What is a Task { ... } Block?',
              paragraphs: [
                'A `Task` is an independent unit of asynchronous work.',
                'It inherits actor context, priority, and cancellation tokens from its surrounding environment, allowing you to trigger async code safely from SwiftUI views.',
              ]
            }
          ],
          codeSnippet: `struct WeatherView: View {
    @State private var temperature = "--"
    
    var body: some View {
        VStack {
            Text(temperature).font(.largeTitle)
            
            Button("Check Weather") {
                // Launching async task from synchronous button action
                Task {
                    do {
                        let temp = try await fetchCurrentTemp()
                        temperature = "\\(temp)°F"
                    } catch {
                        temperature = "Error"
                    }
                }
            }
        }
    }
    
    func fetchCurrentTemp() async throws -> Int {
        try await Task.sleep(nanoseconds: 1_000_000_000)
        return 72
    }
}`,
          checkpoints: [
            {
              question: 'How do you call an async function from a regular synchronous SwiftUI Button action?',
              options: [
                'Wrap the call inside a Task { ... } block',
                'Use DispatchQueue.global().sync',
                'Add the async keyword to the button title',
                'It is impossible in SwiftUI'
              ],
              correctAnswer: 0,
              explanation: 'A Task block creates an asynchronous execution context from synchronous code.',
            }
          ]
        }
      },
      {
        id: 'concurrency-mainactor-isolation',
        title: 'UI Safety: @MainActor and Parallel Requests with async let',
        stepLabel: '3. @MainActor & async let',
        description: 'Enforce compile-time main thread isolation and fetch multiple resources concurrently.',
        content: {
          realWorldContext: 'When opening a profile screen, you often need to fetch the user profile and their recent posts simultaneously. Running them sequentially takes 2x the time; running them in parallel takes half the time.',
          detailedTheory: [
            {
              title: 'The @MainActor Attribute',
              paragraphs: [
                'Annotating a class with `@MainActor` ensures that all its methods and properties are accessed exclusively on the main thread.',
                'Swift 6 compiler checks verify this at compile time, guaranteeing zero thread race conditions.',
              ]
            },
            {
              title: 'Concurrent Execution with async let',
              paragraphs: [
                'If two network requests do not depend on each other, do not await them one by one sequentially.',
                'Use `async let`: both network calls start immediately in parallel on the network card, and you await both results together!'
              ]
            }
          ],
          codeSnippet: `func fetchDashboardData() async throws -> (UserProfile, [Notification]) {
    // Both requests run concurrently in parallel!
    async let profileRequest = fetchProfile()
    async let notificationsRequest = fetchNotifications()
    
    // Await both results together
    let (profile, notifications) = try await (profileRequest, notificationsRequest)
    return (profile, notifications)
}`,
          checkpoints: [
            {
              question: 'What is the advantage of using async let instead of two sequential await statements?',
              options: [
                'Both tasks execute concurrently in parallel, reducing total wait time',
                'It consumes zero network bandwidth',
                'It prevents all network errors',
                'It requires no try keyword'
              ],
              correctAnswer: 0,
              explanation: 'async let kicks off background tasks concurrently without blocking, awaiting them together when needed.',
            }
          ]
        }
      },
      {
        id: 'concurrency-compiler-errors-quiz',
        title: 'Common Concurrency Errors in Xcode & Knowledge Check',
        stepLabel: '4. Diagnostics & Quiz',
        description: 'Understand Swift 6 concurrency errors, Sendable protocols, and actor isolation.',
        content: {
          realWorldContext: 'With Swift 6 strict concurrency checks, Xcode proactively prevents data races before your app ever reaches the App Store.',
          detailedTheory: [
            {
              title: 'Top Concurrency Compiler Errors',
              paragraphs: [
                '1. **\'async\' call in a function that does not support concurrency**:\nYou wrote `await myFunc()` inside a regular synchronous function without wrapping it in `Task { ... }`.\n*Fix*: Wrap the call in `Task { await myFunc() }` or mark the parent function `async`.',
                '2. **Mutation of captured var in concurrently-executing code**:\nYou tried to modify a local variable across different concurrent tasks.\n*Fix*: Use value types or actors to synchronize mutations.',
                '3. **Main actor-isolated property cannot be mutated from background thread**:\nYou attempted to update a `@Published` variable from an unisolated background task.\n*Fix*: Annotate the enclosing class or method with `@MainActor`.',
              ]
            }
          ],
          codeSnippet: `// ❌ Error: Missing async or Task context
// func regularFunction() {
//     await loadData() // Error!
// }

// ✅ Fix:
func regularFunction() {
    Task {
        await loadData()
    }
}`,
          checkpoints: [
            {
              question: 'What is the purpose of the @MainActor annotation?',
              options: [
                'Ensures all methods and properties of the type execute strictly on the Main Thread for UI safety',
                'Makes the app run with higher graphical resolution',
                'Deletes unused background threads',
                'Enables game controller support'
              ],
              correctAnswer: 0,
              explanation: '@MainActor binds execution to the main thread, protecting UI state from background thread race conditions.',
            }
          ]
        }
      },
      {
        id: 'concurrency-playground-lab',
        title: 'Xcode Playground Lab: NewsFeedScreen with async/await',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a production-grade asynchronous news feed with loading state, error handling, and MainActor isolation.',
        content: {
          realWorldContext: 'Build the asynchronous feed pattern found in news apps like Apple News, The Verge, or BBC.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Create an `Article` model and an asynchronous `NewsFeedViewModel` that simulates network fetching and updates an `@Published` articles array.',
              ]
            }
          ],
          codeSnippet: `struct NewsArticle: Identifiable {
    let id = UUID()
    let title: String
    let readTimeMinutes: Int
}

@MainActor
final class NewsFeedViewModel: ObservableObject {
    @Published var articles: [NewsArticle] = []
    @Published var isLoading = false
    
    func refreshFeed() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            try await Task.sleep(nanoseconds: 800_000_000)
            self.articles = [
                NewsArticle(title: "Apple debuts M4 Ultra processor", readTimeMinutes: 3),
                NewsArticle(title: "Swift 6 achieves complete data race safety", readTimeMinutes: 5),
                NewsArticle(title: "SwiftUI adopted for flagship enterprise apps", readTimeMinutes: 4)
            ]
        } catch {
            print("Failed to fetch articles")
        }
    }
}

struct NewsFeedView: View {
    @StateObject private var viewModel = NewsFeedViewModel()
    
    var body: some View {
        NavigationStack {
            List(viewModel.articles) { article in
                VStack(alignment: .leading) {
                    Text(article.title).font(.headline)
                    Text("\\(article.readTimeMinutes) min read")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Latest News")
            .overlay {
                if viewModel.isLoading {
                    ProgressView("Loading headlines...")
                }
            }
            .task {
                await viewModel.refreshFeed()
            }
        }
    }
}`,
          checkpoints: [
            {
              question: 'What is the advantage of the .task { ... } modifier over .onAppear { Task { ... } } in SwiftUI?',
              options: [
                '.task automatically cancels the asynchronous task if the view is dismissed before completion',
                '.task executes 5x faster',
                '.task bypasses network security checks',
                '.task only runs in debug mode'
              ],
              correctAnswer: 0,
              explanation: 'The SwiftUI .task modifier ties task lifecycle to view lifecycle, automatically canceling in-flight work when the view disappears.',
            }
          ],
          challenge: {
            task: 'Write an asynchronous function `fetchUser(id: Int) async throws -> String` that sleeps for 200ms and returns "User \\(id)".',
            hint: 'Use try await Task.sleep(nanoseconds: 200_000_000)',
            solution: `func fetchUser(id: Int) async throws -> String {
    try await Task.sleep(nanoseconds: 200_000_000)
    return "User \\(id)"
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-codable-json',
    module: 5,
    moduleTitle: 'Module 5: Asynchronous Swift & Networking',
    title: 'Parsing JSON with Codable and Working with APIs',
    description: 'Master data serialization in modern iOS: the Codable protocol, mapping snake_case with CodingKeys, handling nested objects, and parsing ISO8601 dates.',
    difficulty: 'Intermediate',
    estimatedMinutes: 24,
    icon: 'Code',
    content: {
      realWorldContext: 'Almost every iOS app communicates with a backend REST API that sends responses formatted as JSON (JavaScript Object Notation). In older Objective-C days, parsing JSON was painful and unsafe. With Swift\'s Codable, converting raw JSON data into strongly-typed Swift structs takes just one line of code.',
      detailedTheory: [
        {
          title: 'What is Codable?',
          paragraphs: [
            '`Codable` is a type alias for two protocols: `Encodable` (converting Swift structs into JSON/Property Lists) and `Decodable` (converting JSON into Swift structs).',
            'When all stored properties inside a struct already conform to `Codable` (like `String`, `Int`, `Double`, `Bool`, `Array`), the Swift compiler automatically writes the serialization logic for you!'
          ]
        },
        {
          title: 'Custom Field Mapping: CodingKeys',
          paragraphs: [
            'Backend APIs typically use `snake_case` (e.g., `first_name`, `created_at`), while Swift uses idiomatic `camelCase` (`firstName`, `createdAt`).',
            'You can bridge this discrepancy effortlessly using an internal enum named `CodingKeys: String, CodingKey`, or by enabling `decoder.keyDecodingStrategy = .convertFromSnakeCase`.',
          ]
        },
        {
          title: 'Handling Dates & Nested Structures',
          paragraphs: [
            'Real-world JSON responses contain nested dictionaries and ISO8601 timestamps.',
            '`JSONDecoder` provides built-in date decoding strategies like `.iso8601`, ensuring seamless parsing without manual string date formatters.',
          ]
        }
      ],
      theory: [
        'Codable combines Encodable and Decodable.',
        'JSONDecoder maps raw Data into strongly-typed Swift models.',
        'CodingKeys maps mismatched JSON keys to Swift property names.',
        'convertFromSnakeCase automates camelCase conversion.',
        'dateDecodingStrategy = .iso8601 parses timestamps safely.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Declarative Codable Parsing (Type-Safe)',
          code: `struct User: Codable {
    let id: Int
    let username: String
    let email: String
}

let decoder = JSONDecoder()
let user = try decoder.decode(User.self, from: jsonData)`,
          explanation: 'Completely type-safe. If a field type mismatches, a clear DecodingError is thrown.',
        },
        bad: {
          title: 'Legacy Untyped JSONSerialization Dictionaries',
          code: `// Dangerous, fragile manual dictionary casting
if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
   let id = json["id"] as? Int,
   let name = json["username"] as? String {
    // 50 lines of boilerplate dictionary unwrapping...
}`,
          explanation: 'Untyped [String: Any] dictionaries lack compiler safety and crash easily upon minor API format changes.',
        }
      },
      codeSnippet: `// 1. Model with CodingKeys mapping
struct Course: Codable, Identifiable {
    let id: Int
    let title: String
    let enrolledStudentsCount: Int
    let priceUSD: Double
    let isPublished: Bool
    
    enum CodingKeys: String, CodingKey {
        case id
        case title
        case enrolledStudentsCount = "enrolled_students_count"
        case priceUSD = "price_usd"
        case isPublished = "is_published"
    }
}

// 2. Decoding JSON
let sampleJSON = """
{
    "id": 101,
    "title": "Mastering SwiftUI & Concurrency",
    "enrolled_students_count": 1420,
    "price_usd": 49.99,
    "is_published": true
}
""".data(using: .utf8)!

do {
    let course = try JSONDecoder().decode(Course.self, from: sampleJSON)
    print("Loaded course: \\(course.title), Price: $\\(course.priceUSD)")
} catch {
    print("Decoding error: \\(error)")
}`,
      explanation: [
        'CodingKeys maps snake_case JSON keys to idiomatic Swift camelCase property names.',
        'JSONDecoder().decode(Course.self, from: sampleJSON) safely unpacks the byte stream into Course.',
        'If any required field is missing or has a type mismatch, decoding throws an actionable DecodingError.',
      ],
      underTheHood: {
        title: 'Compiler-Synthesized Decodable Implementation',
        points: [
          'Under the hood, the compiler synthesizes `init(from decoder: Decoder) throws`.',
          'It extracts a keyed container via `decoder.container(keyedBy: CodingKeys.self)` and decodes each property by key.',
          'Custom initializers can be written by hand when transforming complex legacy API structures.',
        ]
      },
      checkpoints: [
        {
          question: 'What protocol does a struct need to adopt to support decoding from JSON?',
          options: [
            'Decodable (or Codable)',
            'Serializable',
            'JsonConvertible',
            'Parser'
          ],
          correctAnswer: 0,
          explanation: 'Decodable allows decoding from representations like JSON; Codable combines Decodable and Encodable.',
        }
      ],
      keyTakeaways: [
        'Codable provides automatic, type-safe JSON serialization.',
        'Use CodingKeys enum for custom key mappings.',
        'Use convertFromSnakeCase when the entire API follows snake_case naming.',
        'Catch DecodingError to pinpoint the exact key or type that failed.',
      ],
      commonMistakes: [
        'Declaring a non-optional property (`let bio: String`) when the backend might return null.',
        'Forgetting to list all stored properties in CodingKeys if a custom enum is provided.',
      ],
      challenge: {
        task: 'Define a struct `Product: Codable` with fields `id: Int`, `name: String`, `price: Double`, and `inStock: Bool`, where `inStock` maps to the JSON key "in_stock".',
        hint: 'Use enum CodingKeys: String, CodingKey',
        solution: `struct Product: Codable {
    let id: Int
    let name: String
    let price: Double
    let inStock: Bool
    
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case price
        case inStock = "in_stock"
    }
}`
      }
    },
    pages: [
      {
        id: 'codable-intuition-translation',
        title: 'Intuition: What is JSON and Why We Need Codable',
        stepLabel: '1. Intuition & IKEA Box',
        description: 'Understand data serialization through the flat-pack IKEA furniture metaphor.',
        content: {
          realWorldContext: 'When data travels over the Internet between a cloud server and your iPhone, it cannot travel as a living Swift object in RAM. It must be flattened into plain text (JSON).',
          detailedTheory: [
            {
              title: 'Analogy: Flat-Pack IKEA Furniture',
              paragraphs: [
                'Imagine you buy a wooden bookshelf. The factory disassembles the bookshelf into flat wooden planks and screws packed into a cardboard box. That flat pack is **JSON (Encoding)**.',
                'The cardboard box travels across the ocean on a delivery truck (the Internet).',
                'When it arrives at your house, you open the instruction manual and assemble the flat planks back into a solid 3D bookshelf. That is **Codable (Decoding)**.',
              ]
            }
          ],
          codeSnippet: `// 3D Swift Object
struct Book {
    let title: String
    let pages: Int
}

// Flattened into 1D JSON text:
// {"title": "The Swift Programming Language", "pages": 500}`,
          checkpoints: [
            {
              question: 'Why must Swift objects be converted to JSON when communicating over the network?',
              options: [
                'Because networks transmit serialized byte streams/text, not live RAM memory pointers',
                'Because iOS cannot send binary data',
                'Because servers only understand HTML',
                'To make files larger'
              ],
              correctAnswer: 0,
              explanation: 'Network sockets transmit serialized text/bytes; JSON is a universal text format readable across all platforms.',
            }
          ]
        }
      },
      {
        id: 'codable-syntax-codingkeys',
        title: 'Codable Anatomy: CodingKeys and convertFromSnakeCase',
        stepLabel: '2. CodingKeys & snake_case',
        description: 'Map snake_case keys to Swift camelCase properties automatically or with custom CodingKeys.',
        content: {
          realWorldContext: 'Nearly all public REST APIs (GitHub, Spotify, Stripe) format their JSON keys in snake_case (e.g. user_id, created_at).',
          detailedTheory: [
            {
              title: 'The CodingKeys Enum',
              paragraphs: [
                'If you only have one or two mismatched keys, define `enum CodingKeys: String, CodingKey`.',
                'Every stored property must be listed in CodingKeys. If the Swift name matches the JSON key, simply write `case title`. If they differ, specify the string raw value: `case createdAt = "created_at"`.',
              ]
            },
            {
              title: 'The convertFromSnakeCase Strategy',
              paragraphs: [
                'If all keys across your backend follow snake_case, you do not need to write CodingKeys at all!',
                'Simply set `decoder.keyDecodingStrategy = .convertFromSnakeCase`, and Swift will automatically map `avatar_url` in JSON to `avatarUrl` in Swift!'
              ]
            }
          ],
          codeSnippet: `struct GitHubUser: Codable {
    let login: String
    let avatarUrl: String // Maps from avatar_url automatically!
    let publicRepos: Int  // Maps from public_repos automatically!
}

let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .convertFromSnakeCase
let user = try decoder.decode(GitHubUser.self, from: jsonData)`,
          checkpoints: [
            {
              question: 'What does decoder.keyDecodingStrategy = .convertFromSnakeCase do?',
              options: [
                'Automatically transforms snake_case JSON keys (first_name) into camelCase Swift properties (firstName)',
                'Converts all text to uppercase',
                'Translates English to Spanish',
                'Deletes underscore characters from values'
              ],
              correctAnswer: 0,
              explanation: 'It automatically translates snake_case JSON keys into camelCase Swift property names during decoding.',
            }
          ]
        }
      },
      {
        id: 'codable-nested-dates-strategies',
        title: 'Advanced Scenarios: Nested Objects, Arrays, and ISO8601 Dates',
        stepLabel: '3. Nested Models & Dates',
        description: 'Decode complex nested JSON payloads and parse timestamps cleanly.',
        content: {
          realWorldContext: 'In real apps, a user profile contains nested addresses, payment methods, and account creation dates.',
          detailedTheory: [
            {
              title: 'Nested Models (Object Composition)',
              paragraphs: [
                'If a JSON response contains child objects, simply define child Swift structs conforming to `Codable`.',
                'Swift will automatically decode the entire hierarchy recursively.',
              ]
            },
            {
              title: 'Date Decoding Strategies',
              paragraphs: [
                'By default, `JSONDecoder` expects dates as floating point numbers (seconds since 2001).',
                'Real-world backends send ISO8601 timestamps like `"2025-05-18T14:30:00Z"`. Setting `decoder.dateDecodingStrategy = .iso8601` parses them into `Date` objects automatically.',
              ]
            }
          ],
          codeSnippet: `struct GeoLocation: Codable {
    let lat: Double
    let lng: Double
}

struct Company: Codable {
    let name: String
    let location: GeoLocation // Nested child struct!
    let foundedDate: Date     // Decoded via .iso8601
}

let decoder = JSONDecoder()
decoder.dateDecodingStrategy = .iso8601`,
          checkpoints: [
            {
              question: 'How do you decode an ISO8601 string like "2025-10-12T10:00:00Z" into a Swift Date?',
              options: [
                'Set decoder.dateDecodingStrategy = .iso8601',
                'Convert the date string to an integer first',
                'Dates cannot be decoded with Codable',
                'Store all dates as plain String variables forever'
              ],
              correctAnswer: 0,
              explanation: 'Setting .dateDecodingStrategy = .iso8601 instructs the decoder to parse standard ISO8601 timestamp strings into Date objects.',
            }
          ]
        }
      },
      {
        id: 'codable-errors-debugging-quiz',
        title: 'Common Parsing Errors & Debugging DecodingError',
        stepLabel: '4. DecodingError & Quiz',
        description: 'Read and resolve the 4 fundamental cases of DecodingError in Xcode.',
        content: {
          realWorldContext: 'When JSON parsing fails, catching specific DecodingError cases immediately tells you which field broke and why.',
          detailedTheory: [
            {
              title: 'The 4 Cases of DecodingError',
              paragraphs: [
                '1. **typeMismatch**: Server sent `"42"` as a String, but Swift expected an `Int`.\n*Fix*: Update the property type or write custom decoding.',
                '2. **valueNotFound**: Server sent `null`, but the Swift property was declared as non-optional (`let name: String` instead of `String?`).\n*Fix*: Mark the property as `Optional` (`?`).',
                '3. **keyNotFound**: The key is missing from the JSON payload.\n*Fix*: Check for typos in CodingKeys or make the property optional.',
                '4. **dataCorrupted**: The JSON string is malformed (unclosed bracket, missing quote).',
              ]
            }
          ],
          codeSnippet: `do {
    let user = try JSONDecoder().decode(User.self, from: data)
} catch DecodingError.keyNotFound(let key, let context) {
    print("Missing key: \\(key.stringValue), path: \\(context.codingPath)")
} catch DecodingError.typeMismatch(let type, let context) {
    print("Type mismatch for \\(type), path: \\(context.codingPath)")
} catch DecodingError.valueNotFound(let type, let context) {
    print("Value null for non-optional type \\(type)")
} catch {
    print("General decoding error: \\(error)")
}`,
          checkpoints: [
            {
              question: 'What error occurs if the backend returns null for a property declared as "let email: String"?',
              options: [
                'DecodingError.valueNotFound',
                'Segmentation Fault 11',
                'The app will fill in an empty string automatically',
                'URLSession timeout'
              ],
              correctAnswer: 0,
              explanation: 'If a JSON value is null but the Swift property is non-optional, DecodingError.valueNotFound is thrown.',
            }
          ]
        }
      },
      {
        id: 'codable-playground-lab',
        title: 'Xcode Playground Lab: CourseCatalog API Parser',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a full JSON parser for a real-world multi-course catalog with nested instructor data.',
        content: {
          realWorldContext: 'In this lab, you will parse the complete API response for an online educational platform.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Build a parser for a `CourseCatalog` response that contains an array of `Course` items, each with a nested `Instructor` model.',
              ]
            }
          ],
          codeSnippet: `struct Instructor: Codable {
    let name: String
    let bio: String
}

struct Course: Codable, Identifiable {
    let id: Int
    let title: String
    let rating: Double
    let instructor: Instructor
}

struct CatalogResponse: Codable {
    let courses: [Course]
}

let json = """
{
    "courses": [
        {
            "id": 1,
            "title": "SwiftUI Masterclass",
            "rating": 4.9,
            "instructor": {
                "name": "Sarah Connor",
                "bio": "Lead iOS Architect"
            }
        }
    ]
}
""".data(using: .utf8)!

let catalog = try JSONDecoder().decode(CatalogResponse.self, from: json)
print("Loaded \\(catalog.courses.count) courses. Instructor: \\(catalog.courses[0].instructor.name)")`,
          checkpoints: [
            {
              question: 'Why did we create a CatalogResponse wrapper struct?',
              options: [
                'Because the root JSON object is a dictionary with a "courses" array key, not a top-level array',
                'Because Swift requires all structs to have the word Response in their name',
                'To make the network faster',
                'Because iOS cannot decode arrays'
              ],
              correctAnswer: 0,
              explanation: 'The top-level JSON structure is an object {"courses": [...]}, so the root model must match.',
            }
          ],
          challenge: {
            task: 'Define an `Account` struct with `id: String`, `balance: Double`, and an optional `nickname: String?` that conforms to `Codable`.',
            hint: 'Use let nickname: String?',
            solution: `struct Account: Codable {
    let id: String
    let balance: Double
    let nickname: String?
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-error-handling',
    module: 5,
    moduleTitle: 'Module 5: Asynchronous Swift & Networking',
    title: 'Error Handling in Swift: do-catch, throw, and Result',
    description: 'Build resilient iOS apps: the throws keyword, do-catch statements, the trio of try / try? / try!, custom LocalizedError enums, and the Result type.',
    difficulty: 'Intermediate',
    estimatedMinutes: 22,
    icon: 'AlertTriangle',
    content: {
      realWorldContext: 'In mobile apps, errors are not exceptional anomalies — they are daily realities. A user drives into an underground tunnel (network drops), a credit card is declined, or disk space runs out. Swift error handling forces you to anticipate, handle, and present user-friendly error messages rather than crashing.',
      detailedTheory: [
        {
          title: 'Swift Error Handling Philosophy',
          paragraphs: [
            'In C++ or Java, exceptions unwound the call stack and incurred severe runtime penalties.',
            'In Swift, throwing an error is as fast and lightweight as returning a value from a function. The compiler statically enforces that any function capable of failing is marked with `throws`.',
          ]
        },
        {
          title: 'The do-catch Block & The try Operators',
          paragraphs: [
            '1. `try`: Used inside `do-catch`. If an error occurs, execution jumps immediately to the matching `catch` block.',
            '2. `try?`: Converts the return value into an `Optional`. If an error is thrown, it gracefully returns `nil` instead of bubbling up.',
            '3. `try!`: Forces execution, asserting that an error can NEVER happen. If an error is thrown, the app crashes instantly with a fatal error. Never use in production!'
          ]
        },
        {
          title: 'Custom Errors with LocalizedError',
          paragraphs: [
            'By adopting `LocalizedError` on a custom `enum`, you provide human-readable `errorDescription` strings that can be presented directly to users in alerts.',
          ]
        }
      ],
      theory: [
        'throws marks a function capable of failing.',
        'throw raises an error.',
        'do-catch handles errors cleanly.',
        'try? converts errors into nil.',
        'LocalizedError provides localized user-facing descriptions.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Typed Error Handling with Informative Descriptions',
          code: `enum BankError: LocalizedError {
    case insufficientFunds(missingAmount: Double)
    
    var errorDescription: String? {
        switch self {
        case .insufficientFunds(let amount):
            return "Transaction declined. You need $\\(amount) more."
        }
    }
}

func withdraw(amount: Double) throws {
    guard balance >= amount else {
        throw BankError.insufficientFunds(missingAmount: amount - balance)
    }
    balance -= amount
}`,
          explanation: 'Clear, typed errors inform the user exactly what went wrong and how to fix it.',
        },
        bad: {
          title: 'Returning Silent nil or false',
          code: `func withdraw(amount: Double) -> Bool {
    guard balance >= amount else { return false }
    balance -= amount
    return true
} // Caller has NO IDEA why it failed: Overdraft? Card locked? Server error?`,
          explanation: 'Returning boolean flags or nil strips all diagnostic context from the failure.',
        }
      },
      codeSnippet: `// 1. Defining a Domain Error
enum TransferError: LocalizedError {
    case invalidIBAN
    case insufficientBalance(required: Double)
    case dailyLimitExceeded
    
    var errorDescription: String? {
        switch self {
        case .invalidIBAN:
            return "The recipient account number is invalid."
        case .insufficientBalance(let req):
            return "Insufficient balance. Required: $\\(req)"
        case .dailyLimitExceeded:
            return "Daily transfer limit exceeded. Max $5,000/day."
        }
    }
}

// 2. Throwing function
func processTransfer(to iban: String, amount: Double) throws {
    guard iban.count >= 15 else { throw TransferError.invalidIBAN }
    guard amount <= 5000 else { throw TransferError.dailyLimitExceeded }
    print("Transferred $\\(amount) successfully!")
}

// 3. Handling with do-catch
do {
    try processTransfer(to: "US12345678901234", amount: 6000)
} catch let error as TransferError {
    print("Transfer failed: \\(error.localizedDescription)")
} catch {
    print("Unexpected error: \\(error)")
}`,
      explanation: [
        'TransferError conforms to LocalizedError, overriding errorDescription for user-facing UI alerts.',
        'processTransfer checks guard conditions and throws specific error cases.',
        'do-catch pattern matches specific error types, allowing tailored error dialogs.',
      ],
      underTheHood: {
        title: 'How Swift Implements throws Under the Hood',
        points: [
          'Under the hood, Swift does not perform expensive OS stack unwinding.',
          'A throwing function is compiled as if it returns an invisible secondary register containing an error pointer. If an error is thrown, the pointer is set and the function returns immediately.',
        ]
      },
      checkpoints: [
        {
          question: 'What does the try? operator do when a function throws an error?',
          options: [
            'Discards the error and returns nil',
            'Crashes the app immediately',
            'Prints the error to the console and retries 3 times',
            'Converts the error into an empty string'
          ],
          correctAnswer: 0,
          explanation: 'try? converts the result of a throwing function into an Optional, returning nil if an error is thrown.',
        }
      ],
      keyTakeaways: [
        'Use throws instead of returning silent nil or boolean flags.',
        'Conform custom error enums to LocalizedError for friendly descriptions.',
        'Use try? when you only care whether the operation succeeded or failed.',
        'Avoid try! in production code.',
      ],
      commonMistakes: [
        'Using try! on network or file operations, leading to catastrophic production crashes.',
        'Catching generic Error without downcasting to specific domain error cases.',
      ],
      challenge: {
        task: 'Define an `enum LoginError: LocalizedError` with case `emptyUsername`. Write a function `validate(username: String) throws` that throws it if username is empty.',
        hint: 'Use guard !username.isEmpty else { throw LoginError.emptyUsername }',
        solution: `enum LoginError: LocalizedError {
    case emptyUsername
    
    var errorDescription: String? {
        switch self {
        case .emptyUsername: return "Username cannot be empty"
        }
    }
}

func validate(username: String) throws {
    guard !username.isEmpty else {
        throw LoginError.emptyUsername
    }
}`
      }
    },
    pages: [
      {
        id: 'errors-intuition-safety',
        title: 'Intuition: What is an Error and How to Build Resilient Apps',
        stepLabel: '1. Intuition & Safety Belts',
        description: 'Understand defensive error handling using the car seatbelt analogy.',
        content: {
          realWorldContext: 'You wear a seatbelt not because you plan to crash, but because unpredictable road conditions exist. In software, network drops and missing files are unpredictable conditions.',
          detailedTheory: [
            {
              title: 'Analogy: Seatbelts and Airbags',
              paragraphs: [
                'In programming, an unhandled error is like driving without a seatbelt: a sudden bump crashes through the windshield (the app terminates abruptly).',
                'A `do-catch` block is the seatbelt and airbag: when an error occurs, it catches you safely, displays an alert ("Please check your internet connection"), and allows the user to tap "Retry".',
              ]
            }
          ],
          codeSnippet: `// A safe app catches errors and informs the user
do {
    let data = try loadUserData()
    showProfile(data)
} catch {
    showRetryAlert(message: error.localizedDescription)
}`,
          checkpoints: [
            {
              question: 'Why is it better to throw errors than return nil or false?',
              options: [
                'Throws provides exact details about WHY the failure occurred',
                'Throws makes the code 10x faster',
                'Because Swift forbids returning false',
                'Because nil takes more memory'
              ],
              correctAnswer: 0,
              explanation: 'Throwing typed errors provides rich contextual information about the failure reason.',
            }
          ]
        }
      },
      {
        id: 'errors-syntax-do-catch-try',
        title: 'Syntax Anatomy: throws, throw, do-catch, and the try Trio',
        stepLabel: '2. try, try?, and try!',
        description: 'Master the differences between regular try, optional try?, and forced try!.',
        content: {
          realWorldContext: 'Knowing when to use `try` vs `try?` vs `try!` is a classic iOS technical interview topic.',
          detailedTheory: [
            {
              title: 'The Trio of try Operators',
              paragraphs: [
                '• `try`: Used inside a `do-catch` block. You intend to handle errors explicitly.',
                '• `try?`: Converts the result into an `Optional`. If an error is thrown, it evaluates to `nil`. Perfect for optional cache lookups.',
                '• `try!`: Force unwrap. Asserts that an error will NEVER occur. If it does, app crashes instantly. Only acceptable in unit tests!'
              ]
            }
          ],
          codeSnippet: `// 1. try with do-catch
do {
    let text = try String(contentsOfFile: "doc.txt")
} catch {
    print("Failed to read file: \\(error)")
}

// 2. try? returns String?
let optionalText = try? String(contentsOfFile: "doc.txt")

// 3. ⚠️ try! - Fatal crash if file is missing!
// let guaranteedText = try! String(contentsOfFile: "doc.txt")`,
          checkpoints: [
            {
              question: 'When is it appropriate to use try! in production iOS code?',
              options: [
                'Almost never; only when failure is an unrecoverable programmer error (like loading bundled static assets)',
                'For all network requests',
                'For database writes',
                'Whenever you want code to run faster'
              ],
              correctAnswer: 0,
              explanation: 'try! should be avoided in production unless failure represents an impossible fatal asset configuration bug.',
            }
          ]
        }
      },
      {
        id: 'errors-custom-localized',
        title: 'Custom Error Types: Enums, LocalizedError, and the Result Type',
        stepLabel: '3. LocalizedError & Result',
        description: 'Build user-friendly error enums and understand the Result<Success, Failure> enum.',
        content: {
          realWorldContext: 'When an error occurs, you want your alert banner to display "Card declined: Insufficient funds" instead of "Error Code 402". LocalizedError makes this effortless.',
          detailedTheory: [
            {
              title: 'The LocalizedError Protocol',
              paragraphs: [
                'Conforming your error `enum` to `LocalizedError` allows you to override `var errorDescription: String?`.',
                'When you call `error.localizedDescription`, Swift returns your custom string!'
              ]
            },
            {
              title: 'The Result<Success, Failure> Type',
              paragraphs: [
                'Swift provides a built-in generic enum `Result<Success, Failure: Error>` with two cases: `.success(Value)` and `.failure(Error)`.',
                'It is widely used in completion handlers and state management.',
              ]
            }
          ],
          codeSnippet: `enum AuthError: LocalizedError {
    case invalidCredentials
    case accountLocked(minutesRemaining: Int)
    
    var errorDescription: String? {
        switch self {
        case .invalidCredentials:
            return "Incorrect password. Please try again."
        case .accountLocked(let mins):
            return "Account locked. Try again in \\(mins) minutes."
        }
    }
}

let error: Error = AuthError.accountLocked(minutesRemaining: 15)
print(error.localizedDescription) // "Account locked. Try again in 15 minutes."`,
          checkpoints: [
            {
              question: 'What property does LocalizedError provide for human-readable alert messages?',
              options: [
                'var errorDescription: String? { get }',
                'var alertTitle: String',
                'func printError()',
                'var code: Int'
              ],
              correctAnswer: 0,
              explanation: 'errorDescription provides the user-facing localized error message returned by .localizedDescription.',
            }
          ]
        }
      },
      {
        id: 'errors-compiler-warnings-quiz',
        title: 'Common Error Handling Traps & Knowledge Check',
        stepLabel: '4. Diagnostics & Quiz',
        description: 'Avoid silent errors and master Xcode compiler error diagnostics.',
        content: {
          realWorldContext: 'Forgetting `try` before a throwing function is flagged immediately by the Swift compiler.',
          detailedTheory: [
            {
              title: 'Top Error Handling Pitfalls',
              paragraphs: [
                '1. **Errors thrown from here are not handled**:\nYou called a throwing function without `try` or outside of a `do-catch` / `throws` function.\n*Fix*: Wrap in `do { try ... } catch { ... }` or mark the current function with `throws`.',
                '2. **Overusing try? to swallow errors**:\nWriting `if let data = try? fetchData()` hides why the download failed (No internet? Timeout? 401 Unauthorized?).\n*Fix*: Use do-catch to log and diagnose errors during development.',
              ]
            }
          ],
          codeSnippet: `// ❌ Compiler Error: Missing try
// let data = fetchData()

// ✅ Correct:
do {
    let data = try fetchData()
} catch {
    print(error)
}`,
          checkpoints: [
            {
              question: 'What happens if you call a throwing function without the try keyword in Swift?',
              options: [
                'The compiler flags an error: "Call can throw, but it is not marked with try"',
                'Swift assumes try? automatically',
                'The app compiles with a warning',
                'The function executes in the background'
              ],
              correctAnswer: 0,
              explanation: 'Swift strictly requires explicit try annotations whenever invoking throwing functions.',
            }
          ]
        }
      },
      {
        id: 'errors-playground-lab',
        title: 'Xcode Playground Lab: BankTransferManager Challenge',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a production-grade banking transfer manager with comprehensive error handling and user alerts.',
        content: {
          realWorldContext: 'In financial apps, every edge case (insufficient funds, invalid account format, network timeout) must be captured and reported accurately.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Create a `BankTransferManager` class with balance tracking and a throwing `transfer` method.',
              ]
            }
          ],
          codeSnippet: `enum PaymentError: LocalizedError {
    case emptyRecipient
    case amountTooLow
    case insufficientFunds(available: Double)
    
    var errorDescription: String? {
        switch self {
        case .emptyRecipient:
            return "Please enter a valid recipient account."
        case .amountTooLow:
            return "Minimum transfer amount is $1.00."
        case .insufficientFunds(let available):
            return "Insufficient funds. Your balance is $\\(available)."
        }
    }
}

class BankAccountManager {
    var balance: Double = 150.0
    
    func transfer(amount: Double, recipient: String) throws {
        guard !recipient.isEmpty else { throw PaymentError.emptyRecipient }
        guard amount >= 1.0 else { throw PaymentError.amountTooLow }
        guard balance >= amount else { throw PaymentError.insufficientFunds(available: balance) }
        
        balance -= amount
        print("Transferred $\\(amount) to \\(recipient). Remaining: $\\(balance)")
    }
}

let manager = BankAccountManager()
do {
    try manager.transfer(amount: 200.0, recipient: "Sarah")
} catch {
    print("Alert: \\(error.localizedDescription)")
}`,
          checkpoints: [
            {
              question: 'Which catch block executed when transferring $200 with a $150 balance?',
              options: [
                'The catch block received PaymentError.insufficientFunds(available: 150.0)',
                'PaymentError.emptyRecipient',
                'No error occurred',
                'Fatal crash'
              ],
              correctAnswer: 0,
              explanation: 'The guard condition balance >= amount failed, throwing PaymentError.insufficientFunds.',
            }
          ],
          challenge: {
            task: 'Write a throwing function `divide(_ a: Double, by b: Double) throws -> Double` that throws a custom `enum MathError: Error { case divisionByZero }` when b is 0.',
            hint: 'Use guard b != 0 else { throw MathError.divisionByZero }',
            solution: `enum MathError: Error {
    case divisionByZero
}

func divide(_ a: Double, by b: Double) throws -> Double {
    guard b != 0 else { throw MathError.divisionByZero }
    return a / b
}`
          }
        }
      }
    ]
  }
];
