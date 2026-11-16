import { Lesson } from '@/types';

export const module7LessonsEn: Lesson[] = [
  {
    id: 'swiftdata-relationships',
    module: 7,
    moduleTitle: 'Module 7: Advanced Architecture & Testing',
    title: 'SwiftData Relationships: 1:N, 1:1, and Delete Rules',
    description: 'Master relational data modeling in SwiftData: One-to-Many relationships, the @Relationship macro, inverse relationships, and delete rules like .cascade and .nullify.',
    difficulty: 'Advanced',
    estimatedMinutes: 28,
    icon: 'GitFork',
    content: {
      realWorldContext: 'In real apps, data rarely exists in isolation. In a project management app (Asana, Jira), a Project contains dozens of Tasks. In Apple Music, an Artist owns multiple Albums. SwiftData models these connections with type-safe relationships and enforces automatic integrity when parent records are deleted.',
      detailedTheory: [
        {
          title: 'Relational Data Modeling in SwiftData',
          paragraphs: [
            'In SwiftData, establishing a relationship between two `@Model` classes is as simple as adding a reference or array property.',
            'For a One-to-Many relationship, a `Project` class declares `var tasks: [TaskItem] = []`, while `TaskItem` declares `var project: Project?`.',
          ]
        },
        {
          title: 'The @Relationship Macro and Inverse Keypaths',
          paragraphs: [
            'To keep both sides of a relationship in sync, you use `@Relationship(inverse: \\TaskItem.project)`.',
            'When you add a task to `project.tasks.append(newTask)`, SwiftData automatically sets `newTask.project = project` behind the scenes!'
          ]
        },
        {
          title: 'Delete Rules (.cascade vs. .nullify)',
          paragraphs: [
            'What should happen to tasks when their parent Project is deleted? SwiftData provides configurable Delete Rules:',
            '1. `.cascade`: Deleting the Project automatically deletes all associated Tasks (avoids orphaned records).',
            '2. `.nullify`: Deleting the Project sets the `project` property on all child Tasks to `nil` (keeps tasks alive).',
            '3. `.deny`: Prevents deleting the Project as long as it contains tasks.',
          ]
        }
      ],
      theory: [
        'Relationships are declared as standard model properties or arrays.',
        '@Relationship(inverse:) links both ends of a bidirectional relationship.',
        '.cascade automatically deletes children when the parent is deleted.',
        '.nullify sets child references to nil upon parent deletion.',
        'Delete rules prevent orphaned records and database corruption.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Clean Cascading Relationship',
          code: `@Model
final class Folder {
    var name: String
    
    // Automatically deletes all contained documents when folder is deleted
    @Relationship(deleteRule: .cascade, inverse: \\Document.folder)
    var documents: [Document] = []
    
    init(name: String) { self.name = name }
}

@Model
final class Document {
    var title: String
    var folder: Folder?
    init(title: String) { self.title = title }
}`,
          explanation: 'Deleting a Folder automatically cleans up all associated Document records, preventing orphaned database clutter.',
        },
        bad: {
          title: 'No Delete Rules (Orphaned Zombie Records)',
          code: `@Model
final class Folder {
    var name: String
    var documents: [Document] = [] // No delete rule specified!
}

// When Folder is deleted, Documents remain forever in SQLite
// with invalid dangling parent pointers!`,
          explanation: 'Without relationship rules, deleted parents leave orphaned records that consume storage and trigger crashes.',
        }
      },
      codeSnippet: `import SwiftUI
import SwiftData

// 1. Parent Model
@Model
final class Project {
    var name: String
    var createdAt: Date
    
    @Relationship(deleteRule: .cascade, inverse: \\ProjectTask.project)
    var tasks: [ProjectTask] = []
    
    init(name: String) {
        self.name = name
        self.createdAt = .now
    }
}

// 2. Child Model
@Model
final class ProjectTask {
    var title: String
    var isDone: Bool
    var project: Project?
    
    init(title: String) {
        self.title = title
        self.isDone = false
    }
}

// 3. Adding child task to project
func addTask(to project: Project, title: String, context: ModelContext) {
    let task = ProjectTask(title: title)
    project.tasks.append(task) // SwiftData automatically populates task.project!
}`,
      explanation: [
        'The inverse keypath \\ProjectTask.project links both models bidirectionally.',
        'deleteRule: .cascade guarantees that removing a Project deletes all its tasks.',
        'Appending to project.tasks synchronizes both sides of the relationship automatically.',
      ],
      underTheHood: {
        title: 'SQLite Foreign Keys and Graph Consistency',
        points: [
          'Under the hood, SwiftData creates SQLite tables with Foreign Key constraints.',
          'When you mutate an array relationship, SwiftData updates the internal Object Graph, ensuring changes are reflected across all active queries immediately.',
        ]
      },
      checkpoints: [
        {
          question: 'What delete rule should you use if child records must be deleted whenever their parent is deleted?',
          options: [
            '.cascade',
            '.nullify',
            '.deny',
            '.noAction'
          ],
          correctAnswer: 0,
          explanation: '.cascade triggers cascading deletion: removing the parent automatically purges all connected children.',
        }
      ],
      keyTakeaways: [
        'Model relationships using standard Swift properties and arrays.',
        'Always specify the inverse relationship to keep both sides synchronized.',
        'Choose .cascade for owned children (like items in an order).',
        'Choose .nullify for optional references (like an assigned employee).',
      ],
      commonMistakes: [
        'Forgetting the inverse parameter, causing one-way relationships that desynchronize.',
        'Accidentally using .cascade when records should be preserved (.nullify).',
      ],
      challenge: {
        task: 'Define an `@Model` class `Author` with a cascading One-to-Many relationship to `[Book]`.',
        hint: 'Use @Relationship(deleteRule: .cascade, inverse: \\Book.author) var books: [Book] = []',
        solution: `@Model
final class Author {
    var name: String
    
    @Relationship(deleteRule: .cascade, inverse: \\Book.author)
    var books: [Book] = []
    
    init(name: String) {
        self.name = name
    }
}

@Model
final class Book {
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
        title: 'Intuition: The Folders and Documents Analogy',
        stepLabel: '1. Intuition & Relationships',
        description: 'Understand database relationships and cascading deletes through the physical office folders metaphor.',
        content: {
          realWorldContext: 'In an office filing cabinet, you have physical manila folders. Inside each folder are paper documents. If you throw the entire manila folder into the paper shredder, all the documents inside are shredded with it.',
          detailedTheory: [
            {
              title: 'Analogy: Office Manila Folders',
              paragraphs: [
                'Think of a `Folder` as a parent record, and `Documents` as child records.',
                'A **Cascading Delete** (`.cascade`) is tossing the whole folder into the shredder: the folder and all its contents are destroyed together.',
                'A **Nullify Delete** (`.nullify`) is taking all the papers out of the folder and putting them on your desk as loose papers before tossing only the empty manila folder.',
              ]
            }
          ],
          codeSnippet: `// Relationship Types:
// 1:1  - User has ONE Profile
// 1:N  - Project has MANY Tasks
// N:M  - Student attends MANY Courses; Course has MANY Students`,
          checkpoints: [
            {
              question: 'In an e-commerce app, what happens to OrderItems if an Order is deleted with .cascade?',
              options: [
                'All items belonging to that order are automatically deleted from the database',
                'The items remain in the database with order = nil',
                'The database crashes',
                'Only the last item is deleted'
              ],
              correctAnswer: 0,
              explanation: '.cascade deletes all child OrderItem records attached to the parent Order.',
            }
          ]
        }
      },
      {
        id: 'relationships-syntax-inverse',
        title: 'Relationship Anatomy: Bidirectional Links and @Relationship',
        stepLabel: '2. Syntax & Inverse',
        description: 'Configure bidirectional relationships using the inverse parameter to ensure graph consistency.',
        content: {
          realWorldContext: 'If you add a song to an album, you expect the song to know which album it belongs to without writing double updates.',
          detailedTheory: [
            {
              title: 'Why Inverse Matters',
              paragraphs: [
                'Without an inverse link, SwiftData treats the relationship as a one-way unidirectional pointer.',
                'Specifying `inverse: \\Child.parent` tells SwiftData: "These two properties represent the two ends of the same relationship bridge. Updating one side must immediately update the other side."'
              ]
            }
          ],
          codeSnippet: `@Model
final class Album {
    var title: String
    
    // Bidirectional link to Song.album
    @Relationship(inverse: \\Song.album)
    var songs: [Song] = []
    
    init(title: String) { self.title = title }
}

@Model
final class Song {
    var title: String
    var album: Album?
    
    init(title: String) { self.title = title }
}`,
          checkpoints: [
            {
              question: 'What is the purpose of specifying the inverse parameter in @Relationship?',
              options: [
                'It keeps both sides of the relationship synchronized automatically',
                'It reverses the sorting order in queries',
                'It encrypts the database',
                'It turns the class into a struct'
              ],
              correctAnswer: 0,
              explanation: 'The inverse keypath tells SwiftData which property on the destination model points back to this model.',
            }
          ]
        }
      },
      {
        id: 'relationships-delete-rules',
        title: 'Deep Dive into Delete Rules: .cascade, .nullify, and .deny',
        stepLabel: '3. Delete Rules Deep Dive',
        description: 'Choose the correct delete rule to protect data integrity and avoid orphaned records.',
        content: {
          realWorldContext: 'Choosing the wrong delete rule can either corrupt your database with orphaned records or accidentally delete important user history.',
          detailedTheory: [
            {
              title: 'The 4 Delete Rules Explained',
              paragraphs: [
                '• `.cascade`: Destroys all related destination objects. Perfect for private child entities (Order -> OrderItems, Recipe -> Ingredients).',
                '• `.nullify`: Default rule. Sets the inverse relationship on destination objects to `nil`. Perfect for optional links (Department -> Manager).',
                '• `.deny`: Blocks deletion of the parent if ANY related child exists. For example, you cannot delete a Customer if they have unpaid invoices!',
                '• `.noAction`: Does nothing. Destination objects are left untouched, which can lead to dangling pointers unless handled manually.',
              ]
            }
          ],
          codeSnippet: `@Model
final class Team {
    var name: String
    
    // Deleting a Team does NOT delete the employees; it sets their team to nil!
    @Relationship(deleteRule: .nullify, inverse: \\Employee.team)
    var members: [Employee] = []
    
    init(name: String) { self.name = name }
}`,
          checkpoints: [
            {
              question: 'When an organization Team is deleted, which rule ensures Employees are NOT deleted, but their team is set to nil?',
              options: [
                '.nullify',
                '.cascade',
                '.deny',
                '.noAction'
              ],
              correctAnswer: 0,
              explanation: '.nullify clears the parent reference on child records without deleting them.',
            }
          ]
        }
      },
      {
        id: 'relationships-errors-quiz',
        title: 'Common Relationship Traps & Knowledge Check',
        stepLabel: '4. Pitfalls & Quiz',
        description: 'Diagnose relationship retain cycles and schema migration issues.',
        content: {
          realWorldContext: 'In complex relational models, circular references and schema updates must be configured with care.',
          detailedTheory: [
            {
              title: 'Top Relationship Pitfalls',
              paragraphs: [
                '1. **Missing Initializer Defaults**:\nAlways give relationship array properties a default empty array: `var tasks: [Task] = []`.',
                '2. **Cascading Cycles**:\nNever set `.cascade` on both ends of a relationship! Deleting A would delete B, which would attempt to delete A, leading to infinite deletion loops.',
                '3. **Registering All Models in Container**:\nWhen creating the container in your App file, list all related models: `.modelContainer(for: [Project.self, ProjectTask.self])`.',
              ]
            }
          ],
          codeSnippet: `@main
struct ProjectManagerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        // Register BOTH related models in the container!
        .modelContainer(for: [Project.self, ProjectTask.self])
    }
}`,
          checkpoints: [
            {
              question: 'What happens if you set deleteRule: .cascade on BOTH sides of a bidirectional relationship?',
              options: [
                'It creates an invalid recursive deletion loop; SwiftData flags a fatal error',
                'It doubles database performance',
                'It automatically archives records to iCloud',
                'It is recommended practice'
              ],
              correctAnswer: 0,
              explanation: 'Circular cascade delete rules create infinite deletion loops and corrupt graph consistency.',
            }
          ]
        }
      },
      {
        id: 'relationships-playground-lab',
        title: 'Xcode Playground Lab: ProjectPlanner Architecture',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a production-grade relational project management app with projects, tasks, and priority tags.',
        content: {
          realWorldContext: 'In this lab, you will build the relational persistence core of a project management tool like Trello, Linear, or Things.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Create a `Project` model with name and status, containing a cascading relationship to `ProjectTask`. Verify that deleting a project purges its tasks.',
              ]
            }
          ],
          codeSnippet: `@Model
final class Project {
    var title: String
    var isArchived: Bool
    
    @Relationship(deleteRule: .cascade, inverse: \\ProjectTask.project)
    var tasks: [ProjectTask] = []
    
    init(title: String) {
        self.title = title
        self.isArchived = false
    }
}

@Model
final class ProjectTask {
    var name: String
    var isCompleted: Bool
    var project: Project?
    
    init(name: String) {
        self.name = name
        self.isCompleted = false
    }
}

// Verification
func testCascadingDelete(context: ModelContext) {
    let project = Project(title: "Launch iOS App")
    let task1 = ProjectTask(name: "Write Unit Tests")
    let task2 = ProjectTask(name: "Create App Store Screenshots")
    
    context.insert(project)
    project.tasks.append(task1)
    project.tasks.append(task2)
    
    // Deleting the project automatically cascades to both tasks!
    context.delete(project)
}`,
          checkpoints: [
            {
              question: 'Why did project.tasks.append(task1) automatically link task1.project?',
              options: [
                'Because the @Relationship(inverse:) macro established a synchronized bidirectional relationship',
                'Because SwiftData uses AI',
                'Because tasks have the same name',
                'It does not; you must write task1.project = project manually'
              ],
              correctAnswer: 0,
              explanation: 'SwiftData automatically maintains inverse relationship pointers whenever a member is added to a relationship array.',
            }
          ],
          challenge: {
            task: 'Define a 1:1 relationship between `@Model class User` and `@Model class UserProfile` with cascading delete.',
            hint: 'Use @Relationship(deleteRule: .cascade, inverse: \\UserProfile.user) var profile: UserProfile?',
            solution: `@Model
final class User {
    var username: String
    
    @Relationship(deleteRule: .cascade, inverse: \\UserProfile.user)
    var profile: UserProfile?
    
    init(username: String) {
        self.username = username
    }
}

@Model
final class UserProfile {
    var bio: String
    var user: User?
    
    init(bio: String) {
        self.bio = bio
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
    moduleTitle: 'Module 7: Advanced Architecture & Testing',
    title: 'Testing iOS Apps with XCTest: Unit Tests and AAA Pattern',
    description: 'Master automated testing in iOS: the XCTest framework, the Arrange-Act-Assert (AAA) pattern, testing ViewModels in MVVM, and mocking asynchronous services.',
    difficulty: 'Intermediate',
    estimatedMinutes: 26,
    icon: 'CheckCircle',
    content: {
      realWorldContext: 'In professional iOS development at companies like Apple, Uber, and Airbnb, writing code without automated unit tests is unacceptable. A single unnoticed bug in a checkout calculation can cost millions in revenue or trigger 1-star App Store reviews. Automated unit tests run on CI/CD pipelines within seconds, guaranteeing that new features do not break existing business logic.',
      detailedTheory: [
        {
          title: 'The XCTest Framework & Test Lifecycle',
          paragraphs: [
            'Apple provides the `XCTest` framework built directly into Xcode.',
            'A test suite inherits from `XCTestCase`. Any method starting with the word `test` (e.g., `func test_cart_calculatesSubtotal()`) is automatically discovered and executed by Xcode\'s test runner.',
            'Each test case provides `setUpWithError()` (runs before each test to prepare fresh state) and `tearDownWithError()` (runs after each test to clean up resources).',
          ]
        },
        {
          title: 'The AAA Pattern (Arrange - Act - Assert)',
          paragraphs: [
            'Every clean unit test follows the universal **AAA Pattern**:',
            '1. **Arrange**: Set up the test conditions (create the ViewModel, prepare test data).',
            '2. **Act**: Execute the specific behavior or method under test (e.g. `cart.addItem(...)`).',
            '3. **Assert**: Verify that the actual outcome matches the expected outcome using assertions like `XCTAssertEqual`, `XCTAssertTrue`, or `XCTAssertNil`.',
          ]
        },
        {
          title: 'Testing MVVM ViewModels',
          paragraphs: [
            'SwiftUI views are declarative structs that are hard to test in isolation without running the full simulator.',
            'By adopting the **MVVM (Model-View-ViewModel)** pattern, you isolate all business logic, validation, and calculations into independent ViewModel classes that can be unit-tested in milliseconds without launching the simulator UI!'
          ]
        }
      ],
      theory: [
        'XCTest is Apple\'s built-in framework for automated testing.',
        'Test methods must begin with the prefix `test`.',
        'Follow the Arrange-Act-Assert (AAA) pattern strictly.',
        'Isolate business logic into ViewModels for fast, headless unit testing.',
        'Use XCTAssert assertions to verify expected invariants.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Clean Unit Test Following AAA Pattern',
          code: `final class ShoppingCartTests: XCTestCase {
    func test_addItem_incrementsCartCount() {
        // 1. Arrange
        let cart = ShoppingCartViewModel()
        let item = Product(id: "1", title: "AirPods", price: 249.0)
        
        // 2. Act
        cart.add(item)
        
        // 3. Assert
        XCTAssertEqual(cart.itemsCount, 1)
        XCTAssertEqual(cart.subtotal, 249.0)
    }
}`,
          explanation: 'Clear separation of Arrange, Act, and Assert steps. Executes in less than 2 milliseconds.',
        },
        bad: {
          title: 'Manual Clicking in the Simulator (No Tests)',
          code: `// Manually launching the app in Simulator,
// tapping 5 buttons, adding items to cart,
// and checking if the label looks right.
// Takes 30 seconds every time! Unreliable and unrepeatable!`,
          explanation: 'Manual testing is slow, error-prone, and cannot be run automatically on CI/CD servers.',
        }
      },
      codeSnippet: `import XCTest
@testable import MyFintechApp

// 1. Production ViewModel under test
final class WalletViewModel {
    private(set) var balance: Double = 0.0
    
    func deposit(amount: Double) -> Bool {
        guard amount > 0 else { return false }
        balance += amount
        return true
    }
    
    func withdraw(amount: Double) -> Bool {
        guard amount > 0, balance >= amount else { return false }
        balance -= amount
        return true
    }
}

// 2. XCTestCase Suite
final class WalletViewModelTests: XCTestCase {
    var sut: WalletViewModel! // System Under Test
    
    override func setUp() {
        super.setUp()
        sut = WalletViewModel() // Fresh instance for every test
    }
    
    override func tearDown() {
        sut = nil // Clean up to avoid memory retention
        super.tearDown()
    }
    
    func test_deposit_validAmount_increasesBalance() {
        // Arrange
        let depositAmount = 100.0
        
        // Act
        let success = sut.deposit(amount: depositAmount)
        
        // Assert
        XCTAssertTrue(success)
        XCTAssertEqual(sut.balance, 100.0)
    }
    
    func test_withdraw_insufficientFunds_failsAndKeepsBalance() {
        // Arrange
        sut.deposit(amount: 50.0)
        
        // Act
        let success = sut.withdraw(amount: 100.0)
        
        // Assert
        XCTAssertFalse(success)
        XCTAssertEqual(sut.balance, 50.0)
    }
}`,
      explanation: [
        '@testable import MyFintechApp gives the test target access to internal classes and methods.',
        'sut stands for "System Under Test" (standard testing naming convention).',
        'setUp() and tearDown() guarantee test isolation: each test starts with a clean slate.',
      ],
      underTheHood: {
        title: 'How Xcode Runs Tests Under the Hood',
        points: [
          'When you press `Cmd + U`, Xcode builds both the app target and the test bundle (`.xctest`).',
          'It injects the test bundle into the app process and uses Objective-C/Swift runtime reflection to discover all methods beginning with `test...`.',
          'Each test runs in complete isolation; failures record file and line number metadata directly into Xcode\'s issue navigator.',
        ]
      },
      checkpoints: [
        {
          question: 'What prefix must a method name have in XCTest to be discovered as a unit test?',
          options: [
            'test (e.g. test_something())',
            'spec',
            'check',
            'verify'
          ],
          correctAnswer: 0,
          explanation: 'XCTest automatically scans for all methods starting with the prefix "test".',
        }
      ],
      keyTakeaways: [
        'Automated tests protect your app against regression bugs.',
        'Structure tests with Arrange, Act, and Assert (AAA).',
        'Use setUp() and tearDown() to guarantee isolated test runs.',
        'Use @testable import to test internal application modules.',
      ],
      commonMistakes: [
        'Sharing state between tests, causing one test to fail depending on execution order.',
        'Writing tests that test UIKit views instead of testing decoupled ViewModel logic.',
      ],
      challenge: {
        task: 'Write a unit test method `test_discount_calculatesProperly` that arranges a price of 100.0 with 20% discount and asserts the final price is 80.0.',
        hint: 'Use XCTAssertEqual(finalPrice, 80.0)',
        solution: `func test_discount_calculatesProperly() {
    // Arrange
    let originalPrice = 100.0
    let discount = 0.20
    
    // Act
    let finalPrice = originalPrice * (1.0 - discount)
    
    // Assert
    XCTAssertEqual(finalPrice, 80.0)
}`
      }
    },
    pages: [
      {
        id: 'testing-intuition-safety-net',
        title: 'Intuition: The Crash Test Dummy and Trapeze Safety Net',
        stepLabel: '1. Intuition & Safety Net',
        description: 'Understand the value of unit testing through physical engineering metaphors.',
        content: {
          realWorldContext: 'Before an automaker sells a new car, they do not put their CEO in the driver seat and crash into a concrete wall to see if the airbags work. They use crash test dummies and repeatable laboratory sensors thousands of times.',
          detailedTheory: [
            {
              title: 'Analogy: Circus Trapeze Safety Net',
              paragraphs: [
                'Writing code without unit tests is performing a high-wire trapeze act without a safety net: one slip and the performance ends in disaster.',
                'A comprehensive unit test suite is a dense safety net beneath your codebase. You can refactor old code, upgrade to Swift 6, or rewrite an algorithm with complete confidence: if anything breaks, the net catches it instantly before users ever notice!'
              ]
            }
          ],
          codeSnippet: `// A fast test takes 0.001 seconds to run:
func test_addition() {
    XCTAssertEqual(2 + 2, 4)
}`,
          checkpoints: [
            {
              question: 'Why are automated unit tests preferable to manual testing in the simulator?',
              options: [
                'They run in milliseconds, can run automatically on CI/CD pipelines, and provide repeatable regression protection',
                'They are required by Apple for App Store submission',
                'They make the app icon look better',
                'They use less battery'
              ],
              correctAnswer: 0,
              explanation: 'Automated tests execute in milliseconds, are repeatable, and can run on every git push via CI/CD.',
            }
          ]
        }
      },
      {
        id: 'testing-syntax-xctest-asserts',
        title: 'XCTest Anatomy: The Essential XCTAssert Functions',
        stepLabel: '2. XCTest & Assertions',
        description: 'Master the core assertion methods: XCTAssertEqual, XCTAssertTrue, XCTAssertNil, and XCTAssertThrowsError.',
        content: {
          realWorldContext: 'Xcode provides over 20 different assertion functions. Mastering the top 5 gives you everything you need for 99% of unit tests.',
          detailedTheory: [
            {
              title: 'The Top 5 XCTest Assertions',
              paragraphs: [
                '1. `XCTAssertEqual(actual, expected)`: Asserts two values are equal.',
                '2. `XCTAssertTrue(boolean)`: Asserts a condition is true.',
                '3. `XCTAssertFalse(boolean)`: Asserts a condition is false.',
                '4. `XCTAssertNil(optional)`: Asserts that an optional value is nil.',
                '5. `XCTAssertNotNil(optional)`: Asserts that an optional value contains a value.',
                '6. `XCTAssertThrowsError(expression)`: Asserts that a throwing function throws an error.',
              ]
            }
          ],
          codeSnippet: `func test_stringHelpers() {
    let email = "test@domain.com"
    XCTAssertTrue(email.contains("@"))
    XCTAssertFalse(email.isEmpty)
    XCTAssertEqual(email.lowercased(), "test@domain.com")
}`,
          checkpoints: [
            {
              question: 'Which assertion verifies that a function properly throws an error?',
              options: [
                'XCTAssertThrowsError(...)',
                'XCTAssertError(...)',
                'XCTAssertCrash(...)',
                'XCTAssertFail(...)'
              ],
              correctAnswer: 0,
              explanation: 'XCTAssertThrowsError verifies that evaluating the given expression throws an error.',
            }
          ]
        }
      },
      {
        id: 'testing-viewmodel-mvvm',
        title: 'Testing MVVM Architecture: Decoupling UI from Business Logic',
        stepLabel: '3. MVVM & Testing',
        description: 'Design testable ViewModels with clean dependency injection.',
        content: {
          realWorldContext: 'If your business calculations are trapped inside `struct MyView: View`, you cannot easily test them. Moving logic to a ViewModel makes testing trivial.',
          detailedTheory: [
            {
              title: 'The MVVM Testing Pattern',
              paragraphs: [
                '• **Model**: Pure data structs (`struct Product`).',
                '• **View**: SwiftUI declarative UI layout.',
                '• **ViewModel**: Class holding UI state, validation, and calculations.',
                'Because the ViewModel has NO dependency on UIKit or SwiftUI render trees, you instantiate it directly in your test suite and test state transitions in microseconds!'
              ]
            }
          ],
          codeSnippet: `final class CounterViewModel: ObservableObject {
    @Published var count: Int = 0
    
    func increment() {
        count += 1
    }
    
    func reset() {
        count = 0
    }
}

// In test suite:
func test_counter_increments() {
    let vm = CounterViewModel()
    vm.increment()
    XCTAssertEqual(vm.count, 1)
}`,
          checkpoints: [
            {
              question: 'Why does the MVVM pattern make iOS code easier to test?',
              options: [
                'It isolates business logic into pure Swift classes that can be tested headlessly without UI rendering',
                'It makes Swift code compile directly to C',
                'It automatically writes unit tests for you',
                'It removes the need for Xcode'
              ],
              correctAnswer: 0,
              explanation: 'Decoupling business logic from SwiftUI views into ViewModels allows fast, isolated unit testing.',
            }
          ]
        }
      },
      {
        id: 'testing-errors-pitfalls-quiz',
        title: 'Common Testing Pitfalls & Knowledge Check',
        stepLabel: '4. Pitfalls & Quiz',
        description: 'Avoid brittle tests, shared state leaks, and async test timeouts.',
        content: {
          realWorldContext: 'A test suite that fails randomly on CI/CD (a "flaky test") destroys developer productivity. Learning test hygiene prevents flaky tests.',
          detailedTheory: [
            {
              title: 'Top Unit Testing Traps',
              paragraphs: [
                '1. **Shared State Between Tests**:\nUsing static variables or global singletons causes test #2 to fail if test #1 modified the state.\n*Fix*: Always re-initialize instances inside `setUp()` and nullify in `tearDown()`.',
                '2. **Testing Implementation Details Instead of Behavior**:\nTest WHAT the code outputs, not the internal private variable steps it took to get there.',
                '3. **Slow Tests with Thread.sleep**:\nNever use `sleep()` in tests. Use `XCTestExpectation` or async `await` for fast asynchronous testing.',
              ]
            }
          ],
          codeSnippet: `// Asynchronous Testing in Swift
func test_asyncNetworkCall() async throws {
    let service = MockUserService()
    let user = try await service.fetchUser(id: 42)
    XCTAssertEqual(user.name, "Sarah")
}`,
          checkpoints: [
            {
              question: 'What is a "flaky test"?',
              options: [
                'A test that passes sometimes and fails other times without code changes (often due to race conditions or shared state)',
                'A test that runs in less than 1 millisecond',
                'A test written in Python',
                'A test with no assertions'
              ],
              correctAnswer: 0,
              explanation: 'Flaky tests exhibit non-deterministic behavior, usually caused by network dependencies, timing bugs, or shared mutable state.',
            }
          ]
        }
      },
      {
        id: 'testing-playground-lab',
        title: 'Xcode Playground Lab: ShoppingCartViewModel Test Suite',
        stepLabel: '5. Hands-on Lab',
        description: 'Write a comprehensive unit test suite verifying tax calculation, promo code application, and empty cart handling.',
        content: {
          realWorldContext: 'Build the automated test suite for an e-commerce checkout calculation engine.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Build a `CheckoutEngine` that computes tax (8%) and applies discounts. Write unit tests verifying that discount coupons and subtotal calculations work flawlessly.',
              ]
            }
          ],
          codeSnippet: `struct CartItem {
    let title: String
    let price: Double
}

class CheckoutEngine {
    private(set) var items: [CartItem] = []
    var promoCode: String?
    
    var subtotal: Double {
        return items.reduce(0) { $0 + $1.price }
    }
    
    var discountAmount: Double {
        if promoCode == "SAVE10" {
            return subtotal * 0.10 // 10% discount
        }
        return 0.0
    }
    
    var tax: Double {
        return (subtotal - discountAmount) * 0.08 // 8% sales tax
    }
    
    var total: Double {
        return (subtotal - discountAmount) + tax
    }
    
    func add(item: CartItem) {
        items.append(item)
    }
}

// Complete Test Suite
final class CheckoutEngineTests: XCTestCase {
    var sut: CheckoutEngine!
    
    override func setUp() {
        super.setUp()
        sut = CheckoutEngine()
    }
    
    override func tearDown() {
        sut = nil
        super.tearDown()
    }
    
    func test_emptyCart_hasZeroTotal() {
        XCTAssertEqual(sut.total, 0.0)
    }
    
    func test_promoCode_appliesTenPercentDiscount() {
        // Arrange
        sut.add(item: CartItem(title: "Shoes", price: 100.0))
        
        // Act
        sut.promoCode = "SAVE10"
        
        // Assert: $100 - $10 + $7.20 tax = $97.20
        XCTAssertEqual(sut.discountAmount, 10.0)
        XCTAssertEqual(sut.total, 97.20, accuracy: 0.01)
    }
}`,
          checkpoints: [
            {
              question: 'Why was accuracy: 0.01 used in XCTAssertEqual for floating point calculations?',
              options: [
                'Because floating point numbers can have minute precision rounding artifacts (e.g. 97.20000000000002)',
                'Because Swift limits numbers to 2 decimal places',
                'Because of iOS display settings',
                'Because tax is always rounded to pennies'
              ],
              correctAnswer: 0,
              explanation: 'Floating point arithmetic requires an accuracy delta to account for IEEE 754 precision representation.',
            }
          ],
          challenge: {
            task: 'Write a unit test asserting that adding two items of $25 and $75 to a cart produces a subtotal of exactly $100.',
            hint: 'Use XCTAssertEqual(cart.subtotal, 100.0)',
            solution: `func test_cartSubtotal_sumsItemPrices() {
    let cart = CheckoutEngine()
    cart.add(item: CartItem(title: "Item 1", price: 25.0))
    cart.add(item: CartItem(title: "Item 2", price: 75.0))
    
    XCTAssertEqual(cart.subtotal, 100.0)
}`
          }
        }
      }
    ]
  }
];
