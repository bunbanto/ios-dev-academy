import { Lesson } from '@/types';

export const module6LessonsEn: Lesson[] = [
  {
    id: 'swiftdata-basics-model',
    module: 6,
    moduleTitle: 'Module 6: Data Persistence & SwiftData',
    title: 'SwiftData Fundamentals: @Model, ModelContainer, and @Query',
    description: 'Master Apple\'s next-generation persistence framework: declarative @Model classes, the ModelContainer storage engine, ModelContext CRUD operations, and reactive @Query fetching.',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    icon: 'Database',
    content: {
      realWorldContext: 'Whenever a user logs a workout in Apple Fitness, saves a note in Apple Notes, or bookmarks a podcast, that data must persist even if the user force-quits the app or reboots their phone. In 2023, Apple introduced SwiftData — a completely Swift-native replacement for legacy Core Data that integrates seamlessly with Swift concurrency and SwiftUI views.',
      detailedTheory: [
        {
          title: 'The Modern Persistence Framework',
          paragraphs: [
            'For nearly two decades, Core Data was Apple\'s primary database framework. While powerful, it required verbose XML model editors (`.xcdatamodeld`), manual objective-C bridging, and hundreds of lines of boilerplate code.',
            'SwiftData replaces all of that with pure Swift macros. By simply adding the `@Model` macro to any Swift class, SwiftData automatically generates the database schema, migration mappings, and SQLite tables behind the scenes!'
          ]
        },
        {
          title: 'The Trinity of SwiftData Architecture',
          paragraphs: [
            '1. `@Model`: The macro applied to your Swift data classes, turning them into persisted database entities.',
            '2. `ModelContainer`: The database engine that manages the persistence store on the device disk (SQLite database).',
            '3. `ModelContext`: The working scratchpad used to insert, fetch, update, and delete objects in memory before saving them to disk.',
          ]
        },
        {
          title: 'The Reactive @Query Macro',
          paragraphs: [
            'In SwiftUI, you query the database using the `@Query` property wrapper.',
            'Whenever an object in the database is inserted, modified, or deleted, `@Query` automatically detects the change and triggers a smooth animated re-render of your SwiftUI view!'
          ]
        }
      ],
      theory: [
        '@Model transforms any Swift class into a persistent database entity.',
        'ModelContainer manages the physical SQLite file on disk.',
        'ModelContext handles CRUD (Create, Read, Update, Delete) operations in memory.',
        '@Query provides reactive, auto-updating database queries directly inside SwiftUI views.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Modern SwiftData (Pure Swift Macros)',
          code: `@Model
final class Expense {
    var title: String
    var amount: Double
    var date: Date
    
    init(title: String, amount: Double, date: Date = .now) {
        self.title = title
        self.amount = amount
        self.date = date
    }
}

// In SwiftUI View:
@Query(sort: \\Expense.date, order: .reverse) private var expenses: [Expense]`,
          explanation: 'No XML model files, no manual downcasting. Pure Swift class with automatic change tracking.',
        },
        bad: {
          title: 'Legacy Core Data (XML Model + NSManagedObject)',
          code: `// Complex Core Data boilerplate
class ExpenseEntity: NSManagedObject {
    @NSManaged public var title: String?
    @NSManaged public var amount: Double
    // Required separate .xcdatamodeld XML configuration files,
    // NSFetchRequest controllers, and fragile manual context merging.
}`,
          explanation: 'Core Data required manual schema files, optional-ridden properties, and fragile NSManagedObjectContext operations.',
        }
      },
      codeSnippet: `import SwiftUI
import SwiftData

// 1. Defining the Persistent Model
@Model
final class WorkoutItem {
    var title: String
    var durationMinutes: Int
    var caloriesBurned: Int
    var completedAt: Date
    
    init(title: String, durationMinutes: Int, caloriesBurned: Int) {
        self.title = title
        self.durationMinutes = durationMinutes
        self.caloriesBurned = caloriesBurned
        self.completedAt = .now
    }
}

// 2. SwiftUI View with @Query and ModelContext
struct WorkoutTrackerView: View {
    @Environment(\\.modelContext) private var modelContext
    @Query(sort: \\WorkoutItem.completedAt, order: .reverse) private var workouts: [WorkoutItem]
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(workouts) { workout in
                    HStack {
                        VStack(alignment: .leading) {
                            Text(workout.title).font(.headline)
                            Text("\\(workout.durationMinutes) min • \\(workout.caloriesBurned) kcal")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .onDelete(perform: deleteWorkouts)
            }
            .navigationTitle("Workout Log")
            .toolbar {
                Button("Add Run") {
                    addSampleWorkout()
                }
            }
        }
    }
    
    private func addSampleWorkout() {
        let newWorkout = WorkoutItem(title: "Morning 5K Run", durationMinutes: 28, caloriesBurned: 320)
        modelContext.insert(newWorkout)
    }
    
    private func deleteWorkouts(at offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(workouts[index])
        }
    }
}`,
      explanation: [
        '@Model macro synthesizes persistence capabilities into the WorkoutItem class.',
        '@Query automatically fetches workouts and redraws the List whenever items are added or deleted.',
        'modelContext.insert() and modelContext.delete() perform CRUD operations without writing raw SQL.',
      ],
      underTheHood: {
        title: 'How SwiftData Persists Data Under the Hood',
        points: [
          'Behind the scenes, SwiftData creates an SQLite database in your app\'s Application Support directory (`default.store`).',
          'The `@Model` macro generates a backing schema and attaches an internal `BackingData` store that tracks dirty (modified) properties to issue efficient SQL transactions.',
        ]
      },
      checkpoints: [
        {
          question: 'What macro converts a regular Swift class into a persistent database model in SwiftData?',
          options: [
            '@Model',
            '@Entity',
            '@Database',
            '@Persisted'
          ],
          correctAnswer: 0,
          explanation: 'The @Model macro transforms a Swift class into a persistent SwiftData schema entity.',
        }
      ],
      keyTakeaways: [
        'SwiftData replaces Core Data with pure Swift macros.',
        'Use @Model on classes representing persistent entities.',
        'Inject modelContainer at the root of your App struct.',
        'Use @Query to automatically fetch and listen to database changes in SwiftUI.',
      ],
      commonMistakes: [
        'Applying @Model to a struct instead of a class (SwiftData requires classes for identity and reference tracking).',
        'Forgetting to attach .modelContainer(for: MyModel.self) to the WindowGroup in your App file.',
      ],
      challenge: {
        task: 'Define an `@Model` class named `Goal` with properties `title: String` and `targetDays: Int`. Include a standard initializer.',
        hint: 'Use @Model final class Goal { var title: String; var targetDays: Int; init(...) }',
        solution: `@Model
final class Goal {
    var title: String
    var targetDays: Int
    
    init(title: String, targetDays: Int) {
        self.title = title
        self.targetDays = targetDays
    }
}`
      }
    },
    pages: [
      {
        id: 'swiftdata-intuition-sqlite',
        title: 'Intuition: What is a Database and the Stone Engraving Analogy',
        stepLabel: '1. Intuition & Persistence',
        description: 'Understand the difference between transient RAM and persistent storage on disk.',
        content: {
          realWorldContext: 'RAM (Random Access Memory) is fast but volatile: when an app closes or battery dies, everything in RAM evaporates instantly. Disk storage (Flash memory) is permanent.',
          detailedTheory: [
            {
              title: 'Analogy: Blackboard vs. Stone Engraving',
              paragraphs: [
                'Think of variables in regular Swift code as writing with chalk on a classroom blackboard (RAM). At the end of the school day (app quit), the janitor wipes the blackboard clean. Tomorrow morning, it is blank.',
                'A database like SwiftData is carving your words with a chisel into a stone tablet (Flash SSD). Even if the power is cut for a month, when you turn the phone back on, the stone carving is identical.',
              ]
            }
          ],
          codeSnippet: `// In-memory variable (lost on app quit)
var temporaryScore = 100

// SwiftData @Model instance (persisted forever on SSD disk)
@Model
final class HighScore {
    var score: Int
    init(score: Int) { self.score = score }
}`,
          checkpoints: [
            {
              question: 'Why does regular in-memory variable data disappear when an app is force-quit by the user?',
              options: [
                'Because RAM is volatile memory that is cleared when an application process terminates',
                'Because iOS automatically deletes all code files',
                'Because Swift variables have a 5-minute timeout',
                'Because of Apple App Store policy'
              ],
              correctAnswer: 0,
              explanation: 'RAM memory is volatile; when an app process closes, its RAM allocation is returned to the operating system.',
            }
          ]
        }
      },
      {
        id: 'swiftdata-syntax-model-container',
        title: 'SwiftData Anatomy: @Model, ModelContainer, and App Setup',
        stepLabel: '2. Setup & ModelContainer',
        description: 'Configure your App entry point with .modelContainer and master the @Model macro.',
        content: {
          realWorldContext: 'Setting up SwiftData in a new iOS project takes exactly two lines in your App struct.',
          detailedTheory: [
            {
              title: 'Configuring the ModelContainer',
              paragraphs: [
                'In your main `@main struct MyApp: App` file, you attach the `.modelContainer(for: ...)` modifier to your `WindowGroup`.',
                'This creates the physical SQLite file in the app sandbox and injects the `modelContext` into the SwiftUI environment.',
              ]
            }
          ],
          codeSnippet: `import SwiftUI
import SwiftData

@main
struct FitnessApp: App {
    var body: some Scene {
        WindowGroup {
            WorkoutTrackerView()
        }
        // One line initializes the entire SQLite database store!
        .modelContainer(for: WorkoutItem.self)
    }
}`,
          checkpoints: [
            {
              question: 'Where should .modelContainer(for:) typically be declared in a SwiftUI application?',
              options: [
                'On the WindowGroup inside the main App struct',
                'Inside every Text view',
                'In the Xcode build settings',
                'In the assets catalog'
              ],
              correctAnswer: 0,
              explanation: 'Attaching .modelContainer to WindowGroup sets up database storage for the entire app view hierarchy.',
            }
          ]
        }
      },
      {
        id: 'swiftdata-crud-query',
        title: 'CRUD Operations and the @Query Macro',
        stepLabel: '3. CRUD & @Query',
        description: 'Perform Create, Read, Update, and Delete operations and sort results with @Query.',
        content: {
          realWorldContext: 'Managing a to-do list requires adding tasks (Create), showing them (Read), marking complete (Update), and deleting (Delete).',
          detailedTheory: [
            {
              title: 'The 4 CRUD Operations in SwiftData',
              paragraphs: [
                '• **Create**: `modelContext.insert(myObject)`',
                '• **Read**: `@Query(sort: \\Item.date, order: .reverse) var items: [Item]`',
                '• **Update**: Simply modify any property on a model instance (`item.title = "Updated"`). SwiftData tracks changes and saves them automatically!',
                '• **Delete**: `modelContext.delete(myObject)`'
              ]
            }
          ],
          codeSnippet: `// Updating is as simple as modifying a property!
func toggleComplete(for item: TodoItem) {
    item.isCompleted.toggle()
    // No SQL UPDATE queries needed; SwiftData tracks and auto-saves!
}`,
          checkpoints: [
            {
              question: 'How do you update an existing SwiftData object in memory?',
              options: [
                'Directly mutate its property (e.g. item.title = "New"); SwiftData auto-detects and saves changes',
                'Call modelContext.updateSQL()',
                'Delete the object and re-insert it',
                'Restart the simulator'
              ],
              correctAnswer: 0,
              explanation: 'SwiftData automatically tracks mutations to @Model instances and commits updates to disk.',
            }
          ]
        }
      },
      {
        id: 'swiftdata-errors-debugging-quiz',
        title: 'Common SwiftData Errors in Xcode & Knowledge Check',
        stepLabel: '4. Diagnostics & Quiz',
        description: 'Troubleshoot missing model containers and schema migration crashes.',
        content: {
          realWorldContext: 'The most infamous SwiftData crash during development is: "Cannot find container in environment".',
          detailedTheory: [
            {
              title: 'Top SwiftData Pitfalls',
              paragraphs: [
                '1. **Cannot find container in environment**:\nYou used `@Query` or `@Environment(\\.modelContext)` in a view, but forgot to attach `.modelContainer(for: ...)` on `WindowGroup` or in your `#Preview`.\n*Fix*: Add `.modelContainer(for: MyModel.self)`.',
                '2. **Schema Migration Crashes**:\nIf you add or rename properties on an `@Model` class during development, the old SQLite schema may conflict with the new class structure.\n*Fix*: Delete the app from the iOS Simulator to recreate a fresh database schema.',
              ]
            }
          ],
          codeSnippet: `#Preview {
    WorkoutTrackerView()
        // Required for Xcode Previews to work with SwiftData!
        .modelContainer(for: WorkoutItem.self, inMemory: true)
}`,
          checkpoints: [
            {
              question: 'What is the purpose of inMemory: true when configuring ModelContainer for Xcode Previews?',
              options: [
                'It keeps sample preview data in volatile RAM without polluting or altering physical disk storage',
                'It makes Xcode compile faster',
                'It disables dark mode in previews',
                'It saves preview data to iCloud'
              ],
              correctAnswer: 0,
              explanation: 'inMemory: true creates a transient sandbox store ideal for unit tests and Xcode Canvas previews.',
            }
          ]
        }
      },
      {
        id: 'swiftdata-playground-lab',
        title: 'Xcode Playground Lab: HabitTracker Persistence App',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a habit tracker model with streak tracking and complete CRUD operations in SwiftData.',
        content: {
          realWorldContext: 'Build the habit persistence layer seen in popular apps like Streaks, Fabulous, and Apple Health.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Define a `Habit` model with `title: String`, `streakCount: Int`, and `isCompletedToday: Bool`. Build a view with add, complete, and delete actions.',
              ]
            }
          ],
          codeSnippet: `@Model
final class Habit {
    var title: String
    var streakCount: Int
    var isCompletedToday: Bool
    
    init(title: String, streakCount: Int = 0) {
        self.title = title
        self.streakCount = streakCount
        self.isCompletedToday = false
    }
    
    func completeForToday() {
        if !isCompletedToday {
            streakCount += 1
            isCompletedToday = true
        }
    }
}

struct HabitRowView: View {
    let habit: Habit
    
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(habit.title).font(.headline)
                Text("🔥 \\(habit.streakCount) day streak").font(.caption)
            }
            Spacer()
            Button(habit.isCompletedToday ? "Done" : "Mark Done") {
                habit.completeForToday()
            }
            .buttonStyle(.bordered)
        }
    }
}`,
          checkpoints: [
            {
              question: 'Why must Habit be declared as a class rather than a struct in SwiftData?',
              options: [
                'SwiftData requires classes so it can track object identity, dirty properties, and relationships via references',
                'Because structs cannot have initializers',
                'Because classes are faster in CPU',
                'Because Apple deprecated structs in iOS 17'
              ],
              correctAnswer: 0,
              explanation: 'SwiftData relies on reference identity and property observing hooks available only in classes.',
            }
          ],
          challenge: {
            task: 'Define an `@Model` class named `Bookmark` with `title: String`, `urlString: String`, and `createdAt: Date`.',
            hint: 'Use @Model final class Bookmark { ... }',
            solution: `@Model
final class Bookmark {
    var title: String
    var urlString: String
    var createdAt: Date
    
    init(title: String, urlString: String, createdAt: Date = .now) {
        self.title = title
        self.urlString = urlString
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
    moduleTitle: 'Module 6: Data Persistence & SwiftData',
    title: 'UserDefaults and @AppStorage: Lightweight Preferences',
    description: 'Learn when and how to store lightweight user preferences: property list storage, the @AppStorage SwiftUI wrapper, and critical security boundaries (never store passwords in UserDefaults!).',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'Sliders',
    content: {
      realWorldContext: 'Not every piece of data belongs in a database. When a user switches from Light Mode to Dark Mode, enables Sound Effects, or checks "Do not show onboarding again", saving these tiny settings in a database is overkill. Apple provides UserDefaults — an ultra-lightweight key-value property list storage engine designed specifically for user preferences.',
      detailedTheory: [
        {
          title: 'What is UserDefaults?',
          paragraphs: [
            '`UserDefaults` is a key-value store backed by a `.plist` (Property List) XML/binary file in your app sandbox.',
            'It is designed strictly for small primitive values: Booleans, Integers, Floats, Strings, Dates, and small Data blobs. The entire file is loaded into memory when your app launches.',
          ]
        },
        {
          title: 'The SwiftUI @AppStorage Property Wrapper',
          paragraphs: [
            'In modern SwiftUI, you rarely write `UserDefaults.standard.set(...)` by hand.',
            'Instead, you use `@AppStorage("key") var isDarkMode = false`. When the variable changes, SwiftUI automatically updates the UserDefaults plist file on disk AND re-renders any view reading that key!'
          ]
        },
        {
          title: 'Security Boundary: UserDefaults vs. Keychain',
          paragraphs: [
            'UserDefaults is stored in plain, unencrypted text in the app sandbox. Anyone with physical or backup access can read it.',
            'NEVER store passwords, API secret keys, auth tokens, or credit card numbers in UserDefaults! Sensitive security credentials must always be stored in the encrypted Apple Keychain.',
          ]
        }
      ],
      theory: [
        'UserDefaults is a lightweight key-value store for preferences.',
        '@AppStorage binds SwiftUI state directly to UserDefaults.',
        'Never store more than a few kilobytes of data in UserDefaults.',
        'NEVER store passwords or tokens in UserDefaults — use Keychain!'
      ],
      comparisonSnippet: {
        good: {
          title: 'Declarative @AppStorage in SwiftUI',
          code: `struct SettingsView: View {
    @AppStorage("notificationsEnabled") private var notificationsEnabled = true
    @AppStorage("fontSize") private var fontSize = 16
    
    var body: some View {
        Toggle("Enable Notifications", isOn: $notificationsEnabled)
    }
}`,
          explanation: 'Automatically synchronizes with disk and triggers reactive view updates on mutation.',
        },
        bad: {
          title: 'Storing Sensitive Auth Tokens in UserDefaults',
          code: `// ❌ CRITICAL SECURITY VULNERABILITY!
UserDefaults.standard.set("jwt-secret-auth-token-12345", forKey: "userToken")
// Plist is UNENCRYPTED on disk! Easily extracted by attackers!`,
          explanation: 'UserDefaults is unencrypted plaintext. Auth tokens must be stored in Apple Keychain.',
        }
      },
      codeSnippet: `// Storing and Reading Preferences in SwiftUI
struct ReaderPreferencesView: View {
    @AppStorage("isDarkMode") private var isDarkMode = false
    @AppStorage("readingSpeed") private var readingSpeed = 1.0
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    
    var body: some View {
        Form {
            Section("Display") {
                Toggle("Dark Mode", isOn: $isDarkMode)
            }
            
            Section("Audio Reader") {
                Slider(value: $readingSpeed, in: 0.5...2.0, step: 0.25) {
                    Text("Reading Speed")
                }
                Text("Speed: \\(readingSpeed, specifier: "%.2f")x")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            
            Section {
                Button("Reset Onboarding") {
                    hasCompletedOnboarding = false
                }
            }
        }
        .preferredColorScheme(isDarkMode ? .dark : .light)
    }
}`,
      explanation: [
        '@AppStorage automatically reads stored preferences on view load.',
        'Mutating isDarkMode via Toggle automatically writes the new boolean value to the app plist.',
        '.preferredColorScheme reacts immediately to the updated setting.',
      ],
      underTheHood: {
        title: 'UserDefaults Under the Hood',
        points: [
          'UserDefaults writes to a file named `com.yourcompany.app.plist` inside `Library/Preferences/`.',
          'Writes are throttled and periodically flushed to disk by the operating system daemon (`cfprefsd`) to maximize SSD lifespan.',
        ]
      },
      checkpoints: [
        {
          question: 'What type of data should NEVER be stored in UserDefaults?',
          options: [
            'Passwords, auth tokens, and sensitive personal data',
            'Theme selection (Dark/Light mode)',
            'Sound effects toggle (true/false)',
            'Last opened tab index'
          ],
          correctAnswer: 0,
          explanation: 'UserDefaults is stored in unencrypted plaintext on disk; sensitive credentials belong in the Apple Keychain.',
        }
      ],
      keyTakeaways: [
        'UserDefaults is for small user preferences and flags.',
        'Use @AppStorage for clean, declarative SwiftUI binding.',
        'Keep total data size under a few hundred kilobytes.',
        'Use Apple Keychain for tokens, passwords, and secrets.',
      ],
      commonMistakes: [
        'Using UserDefaults as a database for hundreds of images or cache records.',
        'Storing JWT tokens or credit card information in UserDefaults.',
      ],
      challenge: {
        task: 'Create a SwiftUI view `SoundSettingsView` with `@AppStorage("soundEnabled")` defaulting to true and a Toggle control.',
        hint: 'Use @AppStorage("soundEnabled") private var soundEnabled = true',
        solution: `struct SoundSettingsView: View {
    @AppStorage("soundEnabled") private var soundEnabled = true
    
    var body: some View {
        Toggle("Sound Effects", isOn: $soundEnabled)
            .padding()
    }
}`
      }
    },
    pages: [
      {
        id: 'userdefaults-intuition-sticker',
        title: 'Intuition: The Fridge Magnet Sticky Note Analogy',
        stepLabel: '1. Intuition & Preferences',
        description: 'Understand UserDefaults through the refrigerator sticky note metaphor.',
        content: {
          realWorldContext: 'You do not buy a heavy steel filing cabinet to write down a reminder to buy milk. You stick a paper Post-it note to your refrigerator with a magnet.',
          detailedTheory: [
            {
              title: 'Analogy: Refrigerator Sticky Notes',
              paragraphs: [
                'UserDefaults is a collection of sticky notes stuck to your refrigerator door.',
                'Each sticky note has a label on top (the Key: `"soundVolume"`) and a short value written on it (the Value: `0.8`).',
                'It is fast to glance at when you walk into the kitchen, but you would never try to write a 500-page encyclopedia on sticky notes!'
              ]
            }
          ],
          codeSnippet: `// Quick key-value write
UserDefaults.standard.set(true, forKey: "hasSeenTutorial")

// Quick key-value read
let hasSeen = UserDefaults.standard.bool(forKey: "hasSeenTutorial")`,
          checkpoints: [
            {
              question: 'Why should large datasets (like 5,000 photos) not be stored in UserDefaults?',
              options: [
                'Because the entire UserDefaults plist file is loaded into RAM on app launch, consuming excessive memory and slowing down startup',
                'Because iOS limits UserDefaults to exactly 10 items',
                'Because UserDefaults files delete themselves every night',
                'Because plists only support numbers'
              ],
              correctAnswer: 0,
              explanation: 'UserDefaults loads the entire plist into memory at launch; large payloads degrade app startup speed and RAM usage.',
            }
          ]
        }
      },
      {
        id: 'userdefaults-syntax-appstorage',
        title: 'SwiftUI Anatomy: The @AppStorage Property Wrapper',
        stepLabel: '2. @AppStorage in SwiftUI',
        description: 'Bind SwiftUI views directly to persistent disk preferences with @AppStorage.',
        content: {
          realWorldContext: 'In SwiftUI, @AppStorage completely replaces boilerplate UserDefaults reading and writing code.',
          detailedTheory: [
            {
              title: 'How @AppStorage Works',
              paragraphs: [
                'When you declare `@AppStorage("volume") var volume: Double = 0.5`, SwiftUI registers an observer on that UserDefaults key.',
                'If any part of the app modifies the value, all views referencing that key are automatically re-rendered.',
              ]
            }
          ],
          codeSnippet: `struct VolumeSliderView: View {
    @AppStorage("audioVolume") private var audioVolume = 0.8
    
    var body: some View {
        VStack {
            Text("Volume: \\(Int(audioVolume * 100))%")
            Slider(value: $audioVolume, in: 0.0...1.0)
        }
        .padding()
    }
}`,
          checkpoints: [
            {
              question: 'What happens when you bind a Slider to an @AppStorage property?',
              options: [
                'Sliding the handle updates the value in memory and saves it to disk in UserDefaults automatically',
                'The app crashes',
                'The slider resets to 0',
                'Changes are only saved when the phone restarts'
              ],
              correctAnswer: 0,
              explanation: '@AppStorage provides a two-way binding that automatically persists updates to UserDefaults.',
            }
          ]
        }
      },
      {
        id: 'userdefaults-codable-structures',
        title: 'Storing Complex Objects in UserDefaults via Codable',
        stepLabel: '3. Codable & UserDefaults',
        description: 'Encode small custom structs into JSON Data for storage in UserDefaults.',
        content: {
          realWorldContext: 'Sometimes you want to store a small settings struct like UserFilterPreferences in UserDefaults without creating a full database.',
          detailedTheory: [
            {
              title: 'Encoding Structs as Data',
              paragraphs: [
                'UserDefaults cannot store custom Swift structs directly, but it CAN store raw `Data`.',
                'By encoding your `Codable` struct into JSON `Data` via `JSONEncoder`, you can store it in UserDefaults, and decode it with `JSONDecoder`.',
              ]
            }
          ],
          codeSnippet: `struct FilterSettings: Codable {
    var showOnlyFavorites: Bool
    var minPrice: Double
}

// 1. Saving
if let encoded = try? JSONEncoder().encode(FilterSettings(showOnlyFavorites: true, minPrice: 10.0)) {
    UserDefaults.standard.set(encoded, forKey: "user_filters")
}

// 2. Loading
if let data = UserDefaults.standard.data(forKey: "user_filters"),
   let settings = try? JSONDecoder().decode(FilterSettings.self, from: data) {
    print("Filters loaded: Favorites=\\(settings.showOnlyFavorites)")
}`,
          checkpoints: [
            {
              question: 'How can a custom Swift struct be saved into UserDefaults?',
              options: [
                'Encode it into JSON Data using Codable and store the Data blob',
                'Make the struct inherit from UIView',
                'Convert every field into a global variable',
                'UserDefaults automatically saves all custom structs'
              ],
              correctAnswer: 0,
              explanation: 'Encoding a Codable struct into Data allows storing structured configurations inside a single UserDefaults key.',
            }
          ]
        }
      },
      {
        id: 'userdefaults-errors-debugging-quiz',
        title: 'Common UserDefaults Pitfalls & Knowledge Check',
        stepLabel: '4. Pitfalls & Quiz',
        description: 'Avoid key typo bugs, synchronize misconceptions, and security vulnerabilities.',
        content: {
          realWorldContext: 'One typo in a string key like `"notificationEnabled"` vs `"notificationsEnabled"` silently breaks settings persistence.',
          detailedTheory: [
            {
              title: 'Top UserDefaults Pitfalls',
              paragraphs: [
                '1. **String Key Typos**:\nPassing hardcoded string literals across different files causes silent bugs.\n*Fix*: Create an `enum Keys { static let sound = "sound" }` or use `@AppStorage` consistently.',
                '2. **Calling UserDefaults.standard.synchronize()**:\nIn older iOS versions, developers manually called `synchronize()`. Apple has deprecated this; iOS automatically manages flushing efficiently.',
                '3. **Storing Sensitive Passwords**:\nAlways use the Apple Keychain for tokens and passwords!'
              ]
            }
          ],
          codeSnippet: `// Type-safe Keys Pattern
enum AppSettingsKey {
    static let isHapticEnabled = "is_haptic_enabled"
    static let preferredLocale = "preferred_locale"
}

@AppStorage(AppSettingsKey.isHapticEnabled) var isHaptics = true`,
          checkpoints: [
            {
              question: 'Where should sensitive user passwords and JWT tokens be stored on iOS?',
              options: [
                'In the Apple Keychain (encrypted hardware-protected storage)',
                'In UserDefaults',
                'In a public text file on the desktop',
                'In the clipboard'
              ],
              correctAnswer: 0,
              explanation: 'The Apple Keychain is the secure, hardware-encrypted storage facility designed for credentials and keys.',
            }
          ]
        }
      },
      {
        id: 'userdefaults-playground-lab',
        title: 'Xcode Playground Lab: BookReaderSettingsView Challenge',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a production-grade reading settings screen with theme selection, font scaling, and AppStorage.',
        content: {
          realWorldContext: 'Build the reading preferences sheet found in Apple Books, Kindle, and Medium.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Build a `BookReaderSettingsView` with font size adjustment, theme selector (White, Sepia, Night), and auto-scroll toggle.',
              ]
            }
          ],
          codeSnippet: `struct BookReaderSettingsView: View {
    @AppStorage("readerFontSize") private var fontSize: Double = 18.0
    @AppStorage("readerTheme") private var readerTheme: String = "Sepia"
    @AppStorage("autoScrollEnabled") private var isAutoScroll: Bool = false
    
    let themes = ["White", "Sepia", "Night"]
    
    var body: some View {
        Form {
            Section("Typography") {
                Stepper("Font Size: \\(Int(fontSize)) pt", value: $fontSize, in: 12...32)
            }
            
            Section("Color Theme") {
                Picker("Theme", selection: $readerTheme) {
                    ForEach(themes, id: \\.self) { theme in
                        Text(theme)
                    }
                }
                .pickerStyle(.segmented)
            }
            
            Section("Reading Experience") {
                Toggle("Auto-scroll", isOn: $isAutoScroll)
            }
        }
    }
}`,
          checkpoints: [
            {
              question: 'What happens to the reader settings when the user closes the app and reopens it tomorrow?',
              options: [
                'All font size, theme, and auto-scroll settings are automatically restored from UserDefaults',
                'The settings revert to factory defaults',
                'The user must sign in again',
                'The device asks for confirmation'
              ],
              correctAnswer: 0,
              explanation: '@AppStorage permanently persists values to UserDefaults across app launches.',
            }
          ],
          challenge: {
            task: 'Create a view `ThemeToggleView` with `@AppStorage("isDarkMode")` that toggles between light and dark color scheme.',
            hint: 'Use @AppStorage("isDarkMode") and .preferredColorScheme(isDark ? .dark : .light)',
            solution: `struct ThemeToggleView: View {
    @AppStorage("isDarkMode") private var isDark = false
    
    var body: some View {
        Toggle("Dark Mode", isOn: $isDark)
            .preferredColorScheme(isDark ? .dark : .light)
            .padding()
    }
}`
          }
        }
      }
    ]
  }
];
