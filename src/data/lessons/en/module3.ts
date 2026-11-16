import { Lesson } from '@/types';

export const module3LessonsEn: Lesson[] = [
  {
    id: 'swift-structs-value-types',
    module: 3,
    moduleTitle: 'Module 3: OOP & Type Architecture',
    title: 'Structures (struct) and Value Types in Swift',
    description: 'Learn why structs form the backbone of Swift and SwiftUI: value semantics, automatic memberwise initializers, and the mutating keyword.',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    icon: 'Box',
    content: {
      realWorldContext: 'Nearly all of SwiftUI is built on structs (`struct MyView: View`). Structs are ideal for data models and declarative UI views. They have value semantics, meaning mutations to one variable do not unexpectedly corrupt another part of your application.',
      detailedTheory: [
        {
          title: 'Value Semantics',
          paragraphs: [
            'Structures (`struct`) in Swift belong to Value Types.',
            'Assigning a struct copies the value: changes to one variable never affect another. For standard collections, Swift uses Copy-on-Write (COW), deferring physical copying until an actual write occurs. This eliminates an entire category of bugs caused by unintended shared mutable state.'
          ]
        },
        {
          title: 'Automatic Memberwise Initializer',
          paragraphs: [
            'Unlike classes, structs do not require writing a boilerplate constructor manually. The Swift compiler automatically synthesizes a memberwise initializer for all stored properties.'
          ]
        },
        {
          title: 'The mutating Keyword',
          paragraphs: [
            'Because structs are value types, their instance methods cannot mutate internal properties by default.',
            'If a method modifies one or more stored properties, it must be explicitly marked with the `mutating` keyword.'
          ]
        }
      ],
      theory: [
        'Structs are Value Types: values are copied upon assignment or passing to functions.',
        'The compiler synthesizes a free Memberwise Initializer.',
        'Methods mutating internal properties must be marked `mutating`.',
        'Structs are the gold standard for data models and SwiftUI components.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Isolated Structs (Original Data is Protected)',
          code: `struct UserSettings {
    var isPushEnabled: Bool
}

var original = UserSettings(isPushEnabled: true)
var copy = original

// Modifying the copy does NOT affect original
copy.isPushEnabled = false
print(original.isPushEnabled) // true! Original is safe`,
          explanation: 'Each struct instance holds its own isolated value. This prevents unintentional side effects when state is passed across views or functions.'
        },
        bad: {
          title: 'Unintended Shared State in Classes',
          code: `class UserSettings {
    var isPushEnabled: Bool
    init(isPushEnabled: Bool) { self.isPushEnabled = isPushEnabled }
}

let original = UserSettings(isPushEnabled: true)
let copy = original

// Modifying copy mutates original too!
copy.isPushEnabled = false
print(original.isPushEnabled) // false! Original was mutated`,
          explanation: 'Classes pass references by pointer: mutating an object in one part of your app silently changes it everywhere else.'
        }
      },
      codeSnippet: `// 1. Defining a Model Struct
struct BankCard {
    let cardNumber: String
    let cardHolder: String
    var balance: Double
    
    // Mutating state method
    mutating func deposit(amount: Double) {
        balance += amount
    }
    
    // Computed property calculated on demand
    var maskedNumber: String {
        let last4 = cardNumber.suffix(4)
        return "**** **** **** \\(last4)"
    }
}

// 2. Usage
var myCard = BankCard(cardNumber: "4149499312345678", cardHolder: "ALEX MORGAN", balance: 500.0)
myCard.deposit(amount: 150.0)

print(myCard.maskedNumber) // **** **** **** 5678
print("Balance: $\\(myCard.balance)") // Balance: $650.0`,
      explanation: [
        '`mutating func deposit` explicitly tells the compiler that invoking this method replaces the struct instance with an updated value.',
        '`var maskedNumber` is a computed property that does not allocate storage; it calculates its string dynamically when accessed.',
        'If the instance were declared as `let myCard`, calling `deposit()` would produce a compiler error because constants are fully immutable.'
      ],
      underTheHood: {
        title: 'Where Swift Values Live in Memory',
        points: [
          'Swift places struct values on the Stack when local, enabling ultra-fast sub-nanosecond allocation and automatic cleanup when going out of scope.',
          'Unlike Reference Types on the Heap, structs do not require runtime reference counting overhead unless they encapsulate heap-allocated objects.'
        ]
      },
      checkpoints: [
        {
          question: 'Why must a struct method modifying its properties be marked with mutating?',
          options: [
            'Because structs are immutable Value Types by default',
            'It is only needed for public API methods',
            'To make the method run on a background thread',
            'It is deprecated Swift 2 legacy syntax'
          ],
          correctAnswer: 0,
          explanation: 'The mutating keyword tells the Swift compiler that this method modifies the internal state of the struct instance.'
        }
      ],
      keyTakeaways: [
        'Structs are Apple\'s default recommendation for data models and UI state.',
        'Value Semantics eliminates side effects and unexpected state mutations.',
        'The compiler automatically generates memberwise initializers.'
      ],
      commonMistakes: [
        'Declaring an instance with let and then attempting to call a mutating method.',
        'Using a class when a simple, fast struct would be safer and more performant.'
      ],
      challenge: {
        task: 'Define a `Point` struct with properties `x: Double` and `y: Double`, and a method `mutating func moveBy(dx: Double, dy: Double)` that updates the coordinates.',
        hint: 'Declare var x and var y inside the struct',
        solution: `struct Point {
    var x: Double
    var y: Double
    
    mutating func moveBy(dx: Double, dy: Double) {
        x += dx
        y += dy
    }
}`
      }
    },
    pages: [
      {
        id: 'structs-intuition-value-types',
        title: 'Intuition: What is a Struct and Why Apple Favors Value Types',
        stepLabel: '1. Intuition & Value Types',
        description: 'Understand the critical difference between copying values vs sharing references using real-world analogies.',
        content: {
          realWorldContext: 'Whenever you build a settings screen, an e-commerce product card, or a user profile, you are creating data models. In Swift, your primary tool is the struct. Apple loves structs so much that the modern UI framework SwiftUI is built entirely on them!',
          detailedTheory: [
            {
              title: 'Analogy: Printed Paper vs. Google Docs',
              paragraphs: [
                'Imagine you wrote a recipe on a piece of paper and photocopied it for a coworker. Your coworker takes their paper copy home and scribbles a note on it: "add cinnamon". Does your original paper at home change? Of course not! You have two completely independent physical copies.',
                'This is a **Value Type** in Swift. When you assign a struct or pass it to a function, you pass an independent copy. Mutating one never modifies the other.',
                'Now imagine a shared Google Doc. If someone edits a sentence, everyone with the link sees that change immediately. That is a **Reference Type (class)**. While shared state is sometimes useful, it is the #1 source of nasty unexpected bugs in mobile apps.'
              ],
              callout: {
                type: 'info',
                title: 'Swift Golden Rule',
                text: 'Always start with a struct. Only switch to a class when you explicitly need reference semantics, inheritance, or interoperability with Objective-C.'
              }
            },
            {
              title: 'Why Copying is Safe and Fast',
              paragraphs: [
                'In older programming languages, developers avoided copying large objects because it was considered slow. In Swift, value types are blazing fast because they live on the Stack rather than the Heap.',
                'For heavy collections like Array and Dictionary, Swift utilizes **Copy-on-Write (COW)**: the data is only physically duplicated in memory when you actually mutate it!'
              ]
            }
          ],
          codeSnippet: `// Value Semantics in action
struct Recipe {
    var name: String
    var ingredients: [String]
}

var myRecipe = Recipe(name: "Pancakes", ingredients: ["Flour", "Milk", "Eggs"])

// Create a copy
var friendRecipe = myRecipe
friendRecipe.ingredients.append("Cinnamon")

// Check original
print(myRecipe.ingredients)     // ["Flour", "Milk", "Eggs"] -> Untouched!
print(friendRecipe.ingredients) // ["Flour", "Milk", "Eggs", "Cinnamon"]`,
          checkpoints: [
            {
              question: 'What happens when you assign a struct instance to a new variable?',
              options: [
                'An independent copy of the value is created',
                'A pointer to the same shared object is created',
                'The original variable is cleared (moved)',
                'A compile-time error occurs'
              ],
              correctAnswer: 0,
              explanation: 'Structs in Swift are Value Types. Assignment creates an independent copy with value semantics.'
            },
            {
              question: 'Why did Apple build SwiftUI on structs instead of classes?',
              options: [
                'Structs are lightweight, safe from unintended mutations, and fast to recreate',
                'Classes are deprecated in iOS',
                'Structs take zero bytes in memory',
                'Structs support multiple inheritance'
              ],
              correctAnswer: 0,
              explanation: 'Value semantics allow SwiftUI to safely diff and recompute view hierarchies without retain cycles, memory leaks, or side effects.'
            }
          ]
        }
      },
      {
        id: 'structs-syntax-stored-computed',
        title: 'Struct Anatomy: Stored, Computed Properties, and Observers',
        stepLabel: '2. Syntax Anatomy',
        description: 'Explore stored and computed properties, compiler-synthesized initializers, and property observers.',
        content: {
          realWorldContext: 'When an item in an Amazon cart has a base price of $100 and a 20% coupon, the final price of $80 does not need a separate database column; it can be computed on the fly whenever accessed.',
          detailedTheory: [
            {
              title: 'Stored vs. Computed Properties',
              paragraphs: [
                '• **Stored Properties**: Variables or constants stored inside the struct instance (`let id: UUID`, `var name: String`). They allocate physical memory.',
                '• **Computed Properties**: Do not store values directly. Instead, they provide a getter block (`get`) that computes the value on demand. They are always declared with `var` and an explicit return type.'
              ]
            },
            {
              title: 'Free Memberwise Initializer',
              paragraphs: [
                'One of Swift\'s best developer experience features is that you do not need to write an `init(...)` by hand for structs. The compiler automatically synthesizes one containing all stored properties in the order they were declared.',
                'If a property has a default value (`var quantity: Int = 1`), it automatically becomes an optional parameter in the synthesized initializer.'
              ],
              callout: {
                type: 'info',
                title: 'Important init Rule',
                text: 'If you write a custom initializer inside the struct body, the automatic memberwise initializer is discarded. To keep both, put your custom init inside an extension: `extension MyStruct { init(...) }`!'
              }
            },
            {
              title: 'Property Observers: willSet and didSet',
              paragraphs: [
                'You can observe changes to stored properties using observers:',
                '• `willSet`: Runs right before the property value is saved (receives parameter `newValue`).',
                '• `didSet`: Runs right after the new value is stored (receives parameter `oldValue`). Perfect for updating UI or running validation.'
              ]
            }
          ],
          codeSnippet: `struct ProductItem {
    let id: String
    let title: String
    var unitPrice: Double
    var quantity: Int {
        didSet {
            print("Quantity changed from \\(oldValue) to \\(quantity)")
        }
    }
    
    // Computed property: no storage, calculated on the fly
    var totalPrice: Double {
        return unitPrice * Double(quantity)
    }
}

// Automatic memberwise initializer
var item = ProductItem(id: "prod-101", title: "AirPods Pro", unitPrice: 249.0, quantity: 1)
print("Total: $\\(item.totalPrice)") // $249.0

item.quantity = 2 // Prints: Quantity changed from 1 to 2
print("Total: $\\(item.totalPrice)") // $498.0`,
          checkpoints: [
            {
              question: 'How do you preserve the automatic memberwise initializer when adding a custom init?',
              options: [
                'Place the custom init inside an extension of the struct',
                'Mark the struct as @memberwise',
                'Add the override keyword before init',
                'It is impossible; a custom init always deletes memberwise init'
              ],
              correctAnswer: 0,
              explanation: 'Defining a custom init in an extension preserves the compiler-generated memberwise initializer in the primary definition.'
            },
            {
              question: 'Why can computed properties NOT be declared with let?',
              options: [
                'Because their return value can change depending on external state or properties',
                'Because let is reserved for classes only',
                'Because computed properties cannot return strings',
                'Because Swift requires var for all properties'
              ],
              correctAnswer: 0,
              explanation: 'A computed property calculates its value dynamically on each access; since it does not have fixed storage, it must be declared with var.'
            }
          ]
        }
      },
      {
        id: 'structs-mutating-memory',
        title: 'State-Changing Methods: The mutating Keyword & Memory Model',
        stepLabel: '3. mutating & Memory',
        description: 'Understand why value types require mutating methods and how Stack allocation works under the hood.',
        content: {
          realWorldContext: 'In an Apple Watch fitness app, the step counter continually increments during a workout. Because step data is a value type, mutating its properties must be declared explicitly so Swift can enforce safety.',
          detailedTheory: [
            {
              title: 'Why is the mutating Keyword Required?',
              paragraphs: [
                'By default, methods on a struct cannot modify any stored properties. Why? Because structs are immutable values by nature.',
                'When you mark a method as `mutating`, Swift does something fascinating under the hood: it passes `self` as an `inout` reference. The method can modify properties, and when it finishes, the entire modified struct replaces the original in memory.'
              ],
              callout: {
                type: 'warning',
                title: 'Constant let Limitation',
                text: 'If a struct instance is declared with `let`, calling a `mutating` method triggers a compiler error. Even if the internal properties are declared with `var`, a `let` struct makes the entire instance immutable!'
              }
            },
            {
              title: 'Stack vs. Heap Memory Mechanics',
              paragraphs: [
                '• **Stack Memory**: A strict LIFO (Last-In, First-Out) structure. Variables allocated here exist only while the function scope is active. Allocation takes a single CPU pointer increment (less than 1 nanosecond). Structs live on the stack.',
                '• **Heap Memory**: A dynamic pool of memory used for reference types (classes). Requires searching for free blocks, tracking reference counts (ARC), and synchronizing thread access. Significantly slower.'
              ]
            }
          ],
          codeSnippet: `struct Wallet {
    var balance: Double
    
    // Mutating method allows modifying internal state
    mutating func spend(amount: Double) -> Bool {
        guard balance >= amount else {
            print("Declined: Insufficient funds")
            return false
        }
        balance -= amount
        return true
    }
}

var myWallet = Wallet(balance: 100.0) // var is REQUIRED for mutating
myWallet.spend(amount: 45.0)
print("Balance: $\\(myWallet.balance)") // $55.0

let savedWallet = Wallet(balance: 200.0)
// savedWallet.spend(amount: 10.0)
// COMPILER ERROR: Cannot use mutating member on immutable value: 'savedWallet' is a 'let' constant`,
          checkpoints: [
            {
              question: 'What happens under the hood when a mutating method runs on a struct?',
              options: [
                'self is passed as inout, allowing modifications that replace the struct instance',
                'The struct is automatically converted into a class in memory',
                'A new background thread is spawned for writes',
                'The properties are saved directly to disk'
              ],
              correctAnswer: 0,
              explanation: 'Mutating methods pass self as an inout parameter, modifying the value and replacing the original instance upon completion.'
            }
          ]
        }
      },
      {
        id: 'structs-compiler-errors-quiz',
        title: 'Common Compiler Errors & Knowledge Check',
        stepLabel: '4. Diagnostics & Quiz',
        description: 'Learn how to read and fix Xcode struct errors, plus verify your understanding.',
        content: {
          realWorldContext: 'Every iOS developer encounters compiler errors when working with structs and mutability. Recognizing them instantly saves hours of frustration.',
          detailedTheory: [
            {
              title: 'Top 3 Struct Errors in Xcode',
              paragraphs: [
                '1. **Cannot assign to property: \'self\' is immutable**:\nYou tried to modify a property inside a struct method without marking it as `mutating func`.\n*Fix*: Add the `mutating` keyword before `func`.',
                '2. **Cannot use mutating member on immutable value: \'x\' is a \'let\' constant**:\nYou instantiated a struct with `let` and attempted to call a mutating method or modify a property.\n*Fix*: Change `let x = ...` to `var x = ...`.',
                '3. **\'StructName\' initializer is inaccessible due to \'internal\' protection level**:\nIf you define a struct in a Swift package or framework, the default memberwise init is internal and cannot be called from outside the module.\n*Fix*: Write an explicit `public init` in your framework module.'
              ]
            }
          ],
          codeSnippet: `// Error demonstration
struct Counter {
    var count = 0
    
    // ❌ Error: Cannot assign to property: 'self' is immutable
    // func increment() { count += 1 }
    
    // ✅ Fix: Add mutating keyword
    mutating func increment() {
        count += 1
    }
}

let staticCounter = Counter()
// ❌ Error: Cannot use mutating member on immutable value
// staticCounter.increment()

var liveCounter = Counter()
liveCounter.increment() // ✅ Works! count is now 1`,
          checkpoints: [
            {
              question: 'Why does "let instance = MyStruct()" prevent modifying even var properties?',
              options: [
                'Because structs are Value Types; the let applies immutability to the entire struct memory block',
                'Because Xcode has a bug with var properties',
                'Because var properties inside structs are converted to constants at compile time',
                'Because structs can only contain let constants'
              ],
              correctAnswer: 0,
              explanation: 'Value types are unified memory blocks. Marking the instance as let makes every byte of that struct immutable.'
            },
            {
              question: 'Where are local struct variables typically allocated?',
              options: [
                'On the Stack (ultra-fast, auto-cleaned up on scope exit)',
                'On the Heap (dynamic reference counting)',
                'In the GPU VRAM',
                'Directly on the SSD drive'
              ],
              correctAnswer: 0,
              explanation: 'Structs are allocated on the Stack, providing zero reference counting overhead and instant memory reclamation.'
            }
          ]
        }
      },
      {
        id: 'structs-playground-lab',
        title: 'Xcode Playground Lab & StepCounter Challenge',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a production-grade fitness step counter struct with computed properties, mutating methods, and observers.',
        content: {
          realWorldContext: 'In this lab, you will build a complete health-tracking model for an Apple Health / Fitness app widget.',
          detailedTheory: [
            {
              title: 'Lab Overview: FitnessTracker Struct',
              paragraphs: [
                'You will build a `StepTracker` struct that records daily walking steps. It will track daily goal progress percentage via a computed property and provide a mutating method to log new steps.'
              ]
            }
          ],
          codeSnippet: `// Final Lab Solution Preview
struct StepTracker {
    let dailyGoal: Int
    var currentSteps: Int = 0 {
        didSet {
            print("Steps updated: \\(currentSteps) / \\(dailyGoal)")
        }
    }
    
    var progressPercentage: Double {
        guard dailyGoal > 0 else { return 0.0 }
        let progress = (Double(currentSteps) / Double(dailyGoal)) * 100.0
        return min(progress, 100.0)
    }
    
    var isGoalAchieved: Bool {
        return currentSteps >= dailyGoal
    }
    
    mutating func addSteps(_ steps: Int) {
        guard steps > 0 else { return }
        currentSteps += steps
    }
    
    mutating func reset() {
        currentSteps = 0
    }
}

var tracker = StepTracker(dailyGoal: 10_000)
tracker.addSteps(3500)
tracker.addSteps(6700)
print("Goal achieved? \\(tracker.isGoalAchieved)") // true
print("Progress: \\(tracker.progressPercentage)%") // 100.0%`,
          checkpoints: [
            {
              question: 'What is the primary benefit of tracking progress with a computed property instead of a stored property?',
              options: [
                'It is always in sync with currentSteps without risking state inconsistency',
                'It makes the app run 10x faster',
                'It allows storing data in iCloud automatically',
                'It prevents compiler warnings'
              ],
              correctAnswer: 0,
              explanation: 'Computed properties recalculate dynamically, ensuring they can never get out of sync with the underlying stored state.'
            }
          ],
          challenge: {
            task: 'Create a `FitnessTracker` struct with `dailyGoal: Int` and `var currentSteps: Int = 0`. Add a computed property `progressPercentage: Double` and a mutating method `addSteps(_ count: Int)`.',
            hint: 'Divide Double(currentSteps) by Double(dailyGoal) and multiply by 100.0',
            solution: `struct FitnessTracker {
    let dailyGoal: Int
    var currentSteps: Int = 0
    
    var progressPercentage: Double {
        guard dailyGoal > 0 else { return 0.0 }
        return (Double(currentSteps) / Double(dailyGoal)) * 100.0
    }
    
    mutating func addSteps(_ count: Int) {
        guard count > 0 else { return }
        currentSteps += count
    }
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-classes-reference-types',
    module: 3,
    moduleTitle: 'Module 3: OOP & Type Architecture',
    title: 'Classes (class) and Reference Types',
    description: 'Master reference semantics, inheritance, initializers, two-phase initialization, and deinit in Swift classes.',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    icon: 'Layers',
    content: {
      realWorldContext: 'Shared services such as an authenticated user session (`UserSessionManager`), a Bluetooth device coordinator, or a database connection pool require a single source of truth shared across screens. This is where reference types (classes) shine.',
      detailedTheory: [
        {
          title: 'Reference Semantics',
          paragraphs: [
            'Classes are Reference Types. When you assign a class instance to a new variable or pass it into a function, you are not copying the data; you are creating another reference (pointer) to the same object on the Heap.',
            'Modifications made through one reference are immediately reflected in all other references pointing to the same object.'
          ]
        },
        {
          title: 'Initialization & Inheritance',
          paragraphs: [
            'Classes do not receive an automatic memberwise initializer. You must define an `init(...)` explicitly if properties lack default values.',
            'Classes support single inheritance: a subclass can inherit properties and methods from a superclass and customize them using the `override` keyword.'
          ]
        },
        {
          title: 'The deinit Deinitializer',
          paragraphs: [
            'Classes can declare a `deinit` method. Swift calls `deinit` automatically right before the object is deallocated from memory, giving you a hook to close sockets, clean up temporary files, or remove notification observers.'
          ]
        }
      ],
      theory: [
        'Classes are Reference Types that live on the Heap.',
        'Multiple variables can point to the same object in memory.',
        'Classes require explicit init() constructors.',
        'deinit runs automatically when reference count reaches 0.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Shared Service with a Class',
          code: `class NetworkManager {
    var authToken: String?
}

// Both screens point to the EXACT same session
let globalManager = NetworkManager()
globalManager.authToken = "jwt-secret-token"

let settingsScreenRef = globalManager
print(settingsScreenRef.authToken) // "jwt-secret-token"`,
          explanation: 'When state must be shared and synchronized globally across different views, reference types are appropriate.'
        },
        bad: {
          title: 'Using Struct for a Global Shared Service',
          code: `struct NetworkManager {
    var authToken: String?
}

var globalManager = NetworkManager()
globalManager.authToken = "jwt-secret-token"

// Accidentally creates an independent copy!
var profileScreenCopy = globalManager
profileScreenCopy.authToken = "updated-token"

print(globalManager.authToken) // Still "jwt-secret-token" -> Out of sync!`,
          explanation: 'Using a struct for a singleton or shared service leads to fragmented, out-of-sync copies across screens.'
        }
      },
      codeSnippet: `// 1. Defining a Base Class
class BankAccount {
    let accountNumber: String
    private(set) var balance: Double
    
    init(accountNumber: String, initialBalance: Double) {
        self.accountNumber = accountNumber
        self.balance = initialBalance
    }
    
    func deposit(amount: Double) {
        balance += amount
    }
    
    deinit {
        print("Account \\(accountNumber) deallocated from memory.")
    }
}

// 2. Subclass with Inheritance
class PremiumSavingsAccount: BankAccount {
    var interestRate: Double
    
    init(accountNumber: String, initialBalance: Double, interestRate: Double) {
        self.interestRate = interestRate
        super.init(accountNumber: accountNumber, initialBalance: initialBalance)
    }
    
    override func deposit(amount: Double) {
        let bonus = amount * 0.01 // 1% bonus
        super.deposit(amount: amount + bonus)
    }
}`,
      explanation: [
        '`super.init` must be called during two-phase initialization after all child properties are assigned.',
        '`override func deposit` customizes the superclass behavior while delegating to `super.deposit`.',
        '`deinit` executes automatically when no more references point to the instance.'
      ],
      underTheHood: {
        title: 'Dynamic Method Dispatch (vtable)',
        points: [
          'Because classes support inheritance and polymorphism, method calls are looked up dynamically at runtime via a Virtual Method Table (vtable).',
          'Marking classes or methods as `final` enables direct static dispatch, allowing compiler optimizations and inlining similar to structs.'
        ]
      },
      checkpoints: [
        {
          question: 'What is the main difference between struct and class assignment?',
          options: [
            'Classes pass a reference to the shared object; structs copy the value',
            'Structs pass a reference; classes copy the value',
            'Classes are always stored on the Stack',
            'Structs support inheritance while classes do not'
          ],
          correctAnswer: 0,
          explanation: 'Classes use reference semantics (pointing to the same memory on the heap), whereas structs use value semantics (independent copies).'
        }
      ],
      keyTakeaways: [
        'Use classes when identity and shared state matter.',
        'Use the identity operator === to check if two references point to the same memory address.',
        'Mark classes as final whenever inheritance is not explicitly planned.'
      ],
      commonMistakes: [
        'Creating retain cycles between classes without using weak references.',
        'Overusing inheritance hierarchies instead of composition with protocols.'
      ],
      challenge: {
        task: 'Create a `UserSession` class with property `username: String` and a method `logout()`. In deinit, print "Session closed".',
        hint: 'Define class UserSession with init and deinit',
        solution: `class UserSession {
    let username: String
    
    init(username: String) {
        self.username = username
    }
    
    func logout() {
        print("User \\(username) logged out.")
    }
    
    deinit {
        print("Session closed for \\(username)")
    }
}`
      }
    },
    pages: [
      {
        id: 'classes-intuition-reference-semantics',
        title: 'Intuition: What are Classes and How Shared References Work',
        stepLabel: '1. Intuition & Reference Semantics',
        description: 'Understand reference semantics using the Google Docs analogy and the identity operator ===.',
        content: {
          realWorldContext: 'When multiple screens in an app need to know if the user is authenticated, you cannot give each screen a separate copy of the user session. They must all reference the exact same active session object.',
          detailedTheory: [
            {
              title: 'Analogy: Shared Google Doc vs. Printed Paper',
              paragraphs: [
                'Think of a class instance as a live Google Doc URL. You send the URL link to 5 team members. If Alex changes the title on page 1, Sarah and David see that change in real time.',
                'The link itself is tiny (just an 8-byte pointer in memory), but it directs everyone to the exact same shared object on the Heap.'
              ]
            },
            {
              title: 'The Identity Operator === (Three Equal Signs)',
              paragraphs: [
                'In Swift, `==` checks if two values are equal in content. But for classes, you also have `===` (Identity Operator).',
                'The `===` operator asks: "Do these two variables point to the exact same memory address on the Heap?"'
              ],
              callout: {
                type: 'info',
                title: 'Where Class Instances Live',
                text: 'Class instances are allocated dynamically on the Heap. The variables you hold in your functions are simply 64-bit pointers stored on the Stack pointing to the Heap object.'
              }
            }
          ],
          codeSnippet: `class Profile {
    var displayName: String
    init(displayName: String) { self.displayName = displayName }
}

let refA = Profile(displayName: "Alex")
let refB = refA // Points to the EXACT same memory address

refB.displayName = "Jordan"
print(refA.displayName) // "Jordan" (Mutated via refB!)

print(refA === refB) // true: Identical memory address

let refC = Profile(displayName: "Jordan")
print(refA === refC) // false: Different memory addresses even if content is identical`,
          checkpoints: [
            {
              question: 'What does the === operator check in Swift?',
              options: [
                'Whether two references point to the exact same memory address on the Heap',
                'Whether two structs have identical property values',
                'Whether two variables have the same string length',
                'Whether an object has been deallocated'
              ],
              correctAnswer: 0,
              explanation: 'The identity operator === checks pointer equality: whether two references point to the exact same memory instance on the heap.'
            }
          ]
        }
      },
      {
        id: 'classes-syntax-initializers',
        title: 'Class Anatomy: Required init(), self, and Two-Phase Initialization',
        stepLabel: '2. Initializers & self',
        description: 'Explore why classes lack memberwise initializers and how Swift enforces two-phase initialization safety.',
        content: {
          realWorldContext: 'In complex apps, creating a database manager or view model requires initializing all dependencies cleanly before any methods can be invoked.',
          detailedTheory: [
            {
              title: 'Why Classes Lack a Memberwise Init',
              paragraphs: [
                'Because classes support inheritance, having an automatic memberwise init could create dangerous ambiguity when subclasses add new properties.',
                'Therefore, if any stored property in a class lacks a default value, you must write an explicit `init(...)`.'
              ]
            },
            {
              title: 'Two-Phase Initialization',
              paragraphs: [
                'Swift enforces a strict two-phase initialization rule to prevent reading uninitialized memory:',
                '• **Phase 1**: Every stored property introduced by the subclass must be assigned a value. Then `super.init(...)` must be called.',
                '• **Phase 2**: Once the entire inheritance tree has initialized its stored properties, you can access `self` and call instance methods.'
              ]
            }
          ],
          codeSnippet: `class Vehicle {
    let vin: String
    var speed: Double = 0.0
    
    init(vin: String) {
        self.vin = vin
    }
}

class ElectricCar: Vehicle {
    var batteryLevel: Double
    
    init(vin: String, batteryLevel: Double) {
        // Phase 1: Initialize own properties FIRST
        self.batteryLevel = batteryLevel
        
        // Delegate to superclass
        super.init(vin: vin)
        
        // Phase 2: Now self is fully initialized and usable
        self.validateBattery()
    }
    
    private func validateBattery() {
        if batteryLevel < 0.0 { batteryLevel = 0.0 }
    }
}`,
          checkpoints: [
            {
              question: 'In two-phase initialization, when can you call self.someMethod()?',
              options: [
                'Only in Phase 2, after super.init() has completed',
                'At the very beginning of the initializer',
                'Before assigning stored properties',
                'Anytime, Swift has no restriction'
              ],
              correctAnswer: 0,
              explanation: 'Phase 2 begins only after all stored properties up the hierarchy are initialized and super.init() has returned.'
            }
          ]
        }
      },
      {
        id: 'classes-inheritance-override',
        title: 'Inheritance, override, and the final Keyword',
        stepLabel: '3. Inheritance & final',
        description: 'Learn how to extend base class functionality, override methods safely, and optimize performance with final.',
        content: {
          realWorldContext: 'In iOS UIKit, UIViewController is the classic base class that all view controllers inherit from. Understanding override and super calls is essential.',
          detailedTheory: [
            {
              title: 'The override Keyword',
              paragraphs: [
                'Swift requires you to explicitly prefix overridden methods with `override`. This prevents accidental name collisions when a superclass updates its API.',
                'Inside an overridden method, calling `super.myMethod()` ensures the base class logic continues to execute.'
              ]
            },
            {
              title: 'The final Keyword for Speed and Safety',
              paragraphs: [
                'Marking a class or method as `final` tells the compiler that it cannot be subclassed or overridden.',
                'This allows the compiler to bypass dynamic table dispatch and use direct static dispatch, making method invocations as fast as plain C function calls!'
              ],
              callout: {
                type: 'tip',
                title: 'Performance Best Practice',
                text: 'Mark your classes as final by default (`final class MyViewModel`). Only remove final when subclassing is an intentional architectural requirement.'
              }
            }
          ],
          codeSnippet: `class AudioPlayer {
    func play(sound: String) {
        print("Playing audio: \\(sound)")
    }
}

final class StreamingAudioPlayer: AudioPlayer {
    var bufferSize: Int = 1024
    
    override func play(sound: String) {
        print("Buffering \\(sound)...")
        super.play(sound: sound) // Call base class implementation
    }
}

// ❌ Compiler Error: Cannot inherit from final class 'StreamingAudioPlayer'
// class CustomStreamingPlayer: StreamingAudioPlayer {}`,
          checkpoints: [
            {
              question: 'What is the performance advantage of marking a class as final?',
              options: [
                'The compiler can use direct static dispatch instead of dynamic vtable lookup',
                'The class is moved to the GPU',
                'Reference counting is completely disabled',
                'The class takes 50% less RAM'
              ],
              correctAnswer: 0,
              explanation: 'final allows devirtualization: the compiler resolves function calls at compile-time instead of performing runtime vtable lookups.'
            }
          ]
        }
      },
      {
        id: 'classes-compiler-errors-quiz',
        title: 'Common Class Compiler Errors & Knowledge Check',
        stepLabel: '4. Diagnostics & Quiz',
        description: 'Recognize common class pitfalls such as missing super.init and uninitialized stored properties.',
        content: {
          realWorldContext: 'Understanding compiler diagnostics around initializers will save you countless hours when building custom view controllers or view models.',
          detailedTheory: [
            {
              title: 'Top Class Compilation Errors',
              paragraphs: [
                '1. **Property \'self.x\' not initialized at super.init call**:\nYou called `super.init()` before giving values to all stored properties in the current class.\n*Fix*: Initialize your own properties before calling `super.init()`.',
                '2. **Overriding non-@objc method outside of declaration**:\nYou forgot the `override` keyword or the method signatures do not match exactly.\n*Fix*: Check parameter names and types.',
                '3. **Cannot inherit from non-class type**:\nYou tried to make a struct inherit from another struct (`struct A: B`).\n*Fix*: Structs do not support inheritance. Use Protocols and composition instead!'
              ]
            }
          ],
          codeSnippet: `class BaseService {
    let endpoint: String
    init(endpoint: String) { self.endpoint = endpoint }
}

class AuthService: BaseService {
    let apiKey: String
    
    init(apiKey: String) {
        // ❌ Error if super.init is called before self.apiKey is set
        // super.init(endpoint: "https://api.app.com")
        
        self.apiKey = apiKey // ✅ Step 1: Initialize own property
        super.init(endpoint: "https://api.app.com") // ✅ Step 2: Call super
    }
}`,
          checkpoints: [
            {
              question: 'Can a struct inherit from another struct in Swift?',
              options: [
                'No, inheritance is only supported by classes',
                'Yes, up to 3 levels of inheritance',
                'Yes, if marked with @inheritable',
                'Only if both structs are in the same file'
              ],
              correctAnswer: 0,
              explanation: 'Swift structs do not support inheritance. To share functionality between structs, use protocols and extensions.'
            }
          ]
        }
      },
      {
        id: 'classes-playground-lab',
        title: 'Xcode Playground Lab: ShoppingCart Shared Manager',
        stepLabel: '5. Hands-on Lab',
        description: 'Implement a thread-safe shopping cart manager class demonstrating reference semantics and deinit cleanup.',
        content: {
          realWorldContext: 'In an e-commerce app, the shopping cart must be shared across the product detail view, the navigation header, and the checkout flow.',
          detailedTheory: [
            {
              title: 'Lab Overview: ShoppingCartManager',
              paragraphs: [
                'Build a `ShoppingCartManager` class that holds an array of items, calculates the subtotal, and logs when the cart is cleared.'
              ]
            }
          ],
          codeSnippet: `// Shopping Cart Reference Manager
struct CartItem {
    let id: String
    let name: String
    let price: Double
}

final class ShoppingCartManager {
    private(set) var items: [CartItem] = []
    
    var totalPrice: Double {
        return items.reduce(0) { $0 + $1.price }
    }
    
    func add(item: CartItem) {
        items.append(item)
    }
    
    func remove(itemId: String) {
        items.removeAll { $0.id == itemId }
    }
    
    deinit {
        print("ShoppingCartManager cleaned up from memory.")
    }
}

let sharedCart = ShoppingCartManager()
sharedCart.add(item: CartItem(id: "1", name: "MagSafe Charger", price: 39.0))
sharedCart.add(item: CartItem(id: "2", name: "iPhone Case", price: 49.0))

print("Total: $\\(sharedCart.totalPrice)") // $88.0`,
          checkpoints: [
            {
              question: 'When does a class deinit block execute?',
              options: [
                'When the last strong reference to the object is released and reference count hits 0',
                'When the app enters the background',
                'Every time a method finishes executing',
                'When the device battery is low'
              ],
              correctAnswer: 0,
              explanation: 'ARC deallocates an object and executes its deinit immediately when its strong reference count drops to zero.'
            }
          ],
          challenge: {
            task: 'Build a `UserSession` class with `userId: String` and `var isActive: Bool = true`. Add a method `endSession()` that sets isActive to false.',
            hint: 'Declare final class UserSession with init and endSession method',
            solution: `final class UserSession {
    let userId: String
    var isActive: Bool = true
    
    init(userId: String) {
        self.userId = userId
    }
    
    func endSession() {
        isActive = false
    }
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-memory-arc',
    module: 3,
    moduleTitle: 'Module 3: OOP & Type Architecture',
    title: 'Memory Management and ARC (Automatic Reference Counting)',
    description: 'Understand how Swift manages memory automatically: retain cycles, weak vs unowned references, and debugging leaks with Xcode Memory Graph.',
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    icon: 'Cpu',
    content: {
      realWorldContext: 'In mobile apps with limited memory, memory leaks cause the app to consume hundreds of megabytes until iOS abruptly kills it with an OOM (Out Of Memory) crash. ARC eliminates manual retain/release, but you must still understand reference cycles.',
      detailedTheory: [
        {
          title: 'How ARC Works',
          paragraphs: [
            'Swift uses Automatic Reference Counting (ARC) to track memory on the Heap.',
            'Every time a strong reference points to an object, its reference count increments (+1). When a reference is set to nil or goes out of scope, the count decrements (-1). When the count reaches 0, the object is immediately deallocated.'
          ]
        },
        {
          title: 'Retain Cycles (Strong Reference Cycles)',
          paragraphs: [
            'A retain cycle occurs when Object A holds a strong reference to Object B, and Object B holds a strong reference back to Object A.',
            'Even if both external variables are set to nil, their internal counts never drop to 0. They become orphaned in memory, causing a silent leak!'
          ]
        },
        {
          title: 'weak vs. unowned References',
          paragraphs: [
            '• **weak**: Never increments the reference count. When the object deallocates, Swift automatically zeroes out the reference to `nil`. Must always be an optional (`weak var`).',
            '• **unowned**: Does not increment reference count either, but assumes the object will NEVER be nil while referenced. Accessing a deallocated unowned reference crashes the app instantly!'
          ]
        }
      ],
      theory: [
        'ARC tracks strong references automatically.',
        'Retain cycles prevent objects from deallocating, leaking memory.',
        'Use `weak` when the referenced object can become nil.',
        'Use `unowned` only when the referenced object has an identical or longer lifetime.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Breaking Retain Cycles with weak',
          code: `class Apartment {
    let unit: String
    weak var tenant: Person? // weak breaks the cycle!
    init(unit: String) { self.unit = unit }
    deinit { print("Apartment \\(unit) deallocated") }
}

class Person {
    let name: String
    var apartment: Apartment?
    init(name: String) { self.name = name }
    deinit { print("Person \\(name) deallocated") }
}`,
          explanation: 'Because tenant is weak, releasing Person drops the count to 0. Both objects deallocate cleanly.'
        },
        bad: {
          title: 'Strong Retain Cycle (Memory Leak)',
          code: `class Apartment {
    let unit: String
    var tenant: Person? // STRONG reference back to Person
    init(unit: String) { self.unit = unit }
    deinit { print("Apartment deallocated") }
}

class Person {
    let name: String
    var apartment: Apartment? // STRONG reference to Apartment
    init(name: String) { self.name = name }
    deinit { print("Person deallocated") }
}

var alex: Person? = Person(name: "Alex")
var apt: Apartment? = Apartment(unit: "4B")
alex?.apartment = apt
apt?.tenant = alex

alex = nil
apt = nil // Neither deinit prints! Leaked forever in RAM!`,
          explanation: 'Both objects hold strong references to each other. Reference count never reaches 0.'
        }
      },
      codeSnippet: `// Real-world Delegate Pattern with weak
protocol NetworkDelegate: AnyObject {
    func didCompleteDownload()
}

class Downloader {
    // MUST be weak to prevent retain cycle with parent
    weak var delegate: NetworkDelegate?
    
    func start() {
        print("Downloading...")
        delegate?.didCompleteDownload()
    }
}

class ViewController: NetworkDelegate {
    let downloader = Downloader()
    
    init() {
        downloader.delegate = self
    }
    
    func didCompleteDownload() {
        print("Download finished!")
    }
    
    deinit {
        print("ViewController deallocated without leaks.")
    }
}`,
      explanation: [
        'The delegate protocol must be constrained to `AnyObject` to allow marking it `weak`.',
        'Marking `weak var delegate` prevents the child object from keeping the parent view controller alive forever.'
      ],
      underTheHood: {
        title: 'Side Tables and Weak Zeroing',
        points: [
          'When an object has weak references attached, Swift allocates a lightweight "Side Table" entry on the heap to track weak counts separately.',
          'When the main object deallocates, the side table zeros out all weak pointers to prevent dangling pointer crashes.'
        ]
      },
      checkpoints: [
        {
          question: 'What is the main requirement for declaring a weak variable?',
          options: [
            'It must be declared with var and have an Optional type',
            'It must be a let constant',
            'It can only be used inside structs',
            'It must be marked with @objc'
          ],
          correctAnswer: 0,
          explanation: 'weak variables must be optional var because Swift automatically sets them to nil when the referenced object deallocates.'
        }
      ],
      keyTakeaways: [
        'Retain cycles occur when two class instances hold strong references to each other.',
        'Always use weak for delegate variables and closure captures [weak self].',
        'Use the Xcode Memory Graph Debugger to spot retain cycles during development.'
      ],
      commonMistakes: [
        'Capturing self strongly inside escaping closures or network callbacks.',
        'Using unowned on objects that could be dismissed before the closure completes.'
      ],
      challenge: {
        task: 'Declare a `Car` class and a `Driver` class. Create a bidirectional relationship without causing a retain cycle.',
        hint: 'Make one of the references weak var',
        solution: `class Driver {
    let name: String
    var car: Car?
    init(name: String) { self.name = name }
    deinit { print("Driver deallocated") }
}

class Car {
    let model: String
    weak var driver: Driver?
    init(model: String) { self.model = model }
    deinit { print("Car deallocated") }
}`
      }
    },
    pages: [
      {
        id: 'arc-intuition-reference-counting',
        title: 'Intuition: How ARC Works and What Retain Cycles Are',
        stepLabel: '1. Intuition & ARC Ropes',
        description: 'Visualize Automatic Reference Counting using helium balloons and ropes.',
        content: {
          realWorldContext: 'In languages like C or early Objective-C, developers had to manually write retain and release calls. Missing a release caused a leak; calling release twice caused a crash. ARC automates this at compile time.',
          detailedTheory: [
            {
              title: 'Analogy: Helium Balloons and Ropes',
              paragraphs: [
                'Imagine an object on the Heap is a helium balloon floating in the air. Every strong reference is a rope tied to that balloon.',
                'As long as at least 1 rope is tied to the balloon (Reference Count >= 1), it stays in memory.',
                'When the last person lets go of their rope (Count = 0), the balloon floats away into the sky (Swift deallocates the memory immediately).'
              ]
            },
            {
              title: 'The Danger of Retain Cycles',
              paragraphs: [
                'Now imagine Balloon A ties its rope to Balloon B, and Balloon B ties its rope to Balloon A. Then you cut both ties to the ground.',
                'Do they float away? No! They hold onto each other with a count of 1. You can no longer reach them from your code, yet they stay trapped in memory forever. That is a retain cycle!'
              ]
            }
          ],
          codeSnippet: `class Balloon {
    let color: String
    init(color: String) { self.color = color }
    deinit { print("\\(color) balloon popped and deallocated!") }
}

var rope1: Balloon? = Balloon(color: "Red") // Count = 1
var rope2 = rope1                           // Count = 2

rope1 = nil // Count drops to 1 (still in memory)
rope2 = nil // Count drops to 0 -> "Red balloon popped and deallocated!"`,
          checkpoints: [
            {
              question: 'When is a class object deallocated by ARC?',
              options: [
                'As soon as its strong reference count reaches 0',
                'Only when the application terminates',
                'Every 10 seconds during garbage collection',
                'When the device runs out of storage space'
              ],
              correctAnswer: 0,
              explanation: 'ARC is deterministic: deallocation happens immediately as soon as the strong reference count drops to 0.'
            }
          ]
        }
      },
      {
        id: 'arc-weak-unowned',
        title: 'Breaking Memory Leaks: weak vs. unowned References',
        stepLabel: '2. weak vs unowned',
        description: 'Master the rules for choosing between weak optionals and unowned non-optionals.',
        content: {
          realWorldContext: 'In an iPhone app, a modal payment sheet has a delegate pointing back to the presenting view controller. Forgetting weak on that delegate leaks the entire view controller and all its child views.',
          detailedTheory: [
            {
              title: 'The weak Reference',
              paragraphs: [
                'A `weak` reference does not increment the reference count. It is a fragile rope.',
                'If the target object is deallocated, Swift automatically resets the weak pointer to `nil`. That is why weak references must always be `var` and an `Optional`.'
              ]
            },
            {
              title: 'The unowned Reference',
              paragraphs: [
                'An `unowned` reference also does not increment reference count, but it is non-optional. It asserts: "I promise this object will never be deallocated while I am still around."',
                'If you access an `unowned` reference after the object has been destroyed, your app will crash immediately with a fatal memory access error.'
              ],
              callout: {
                type: 'warning',
                title: 'Golden Rule for weak vs unowned',
                text: 'When in doubt, always use weak. Only use unowned when two objects have identical lifecycles, such as a CreditCard and its Customer where the card cannot exist without the customer.'
              }
            }
          ],
          codeSnippet: `class Customer {
    let name: String
    var card: CreditCard?
    init(name: String) { self.name = name }
    deinit { print("Customer \\(name) deallocated") }
}

class CreditCard {
    let number: String
    // unowned because a card cannot exist without a Customer owner
    unowned let owner: Customer
    
    init(number: String, owner: Customer) {
        self.number = number
        self.owner = owner
    }
    deinit { print("CreditCard \\(number) deallocated") }
}`,
          checkpoints: [
            {
              question: 'What happens if you read an unowned reference after the object was deallocated?',
              options: [
                'An immediate fatal runtime crash',
                'It silently returns nil',
                'It creates a new default instance',
                'It pauses the current thread'
              ],
              correctAnswer: 0,
              explanation: 'unowned assumes the pointer is always valid. If the target was deallocated, accessing it triggers a fatal runtime crash.'
            }
          ]
        }
      },
      {
        id: 'arc-closures-capture-lists',
        title: 'Retain Cycles in Closures: [weak self] and Capture Lists',
        stepLabel: '3. Closures & [weak self]',
        description: 'Learn why escaping closures capture self strongly and how capture lists protect your code.',
        content: {
          realWorldContext: 'Network requests in iOS (`URLSession`, async handlers, timer callbacks) are the single most frequent cause of retain cycles in modern Swift applications.',
          detailedTheory: [
            {
              title: 'Why Closures Capture References',
              paragraphs: [
                'Closures are Reference Types. When you write `self.reloadData()` inside an escaping closure, the closure captures a strong reference to `self` so that `self` is guaranteed to stay alive until the closure executes.',
                'If `self` also stores the closure (for example, in a property `var onCompletion: (() -> Void)?`), you have created a direct retain cycle: self -> closure -> self!'
              ]
            },
            {
              title: 'The Capture List [weak self]',
              paragraphs: [
                'To break this cycle, you define a **Capture List** at the beginning of the closure: `{ [weak self] in ... }`.',
                'Inside the closure, `self` becomes optional. You can safely unwrap it using `guard let self else { return }`.'
              ]
            }
          ],
          codeSnippet: `class ProductDetailViewModel {
    var title: String = "MacBook Pro"
    var onDataLoaded: (() -> Void)?
    
    func startFetch() {
        // [weak self] prevents retain cycle
        onDataLoaded = { [weak self] in
            guard let self else { return }
            print("Finished loading for: \\(self.title)")
        }
    }
    
    deinit {
        print("ProductDetailViewModel deallocated cleanly!")
    }
}`,
          checkpoints: [
            {
              question: 'Why is [weak self] needed inside an escaping closure stored on self?',
              options: [
                'Because self strongly holds the closure, and the closure strongly captures self',
                'Because Swift requires all closures to have capture lists',
                'To make the closure run asynchronously on a background thread',
                'To prevent SwiftUI from redrawing the screen'
              ],
              correctAnswer: 0,
              explanation: 'When self owns the closure and the closure references self, a strong reference cycle is formed unless broken with [weak self].'
            }
          ]
        }
      },
      {
        id: 'arc-compiler-errors-quiz',
        title: 'Memory Leaks & Xcode Memory Graph Debugger',
        stepLabel: '4. Memory Graph & Quiz',
        description: 'Learn how to detect retain cycles visually with Xcode tools and test your ARC knowledge.',
        content: {
          realWorldContext: 'Xcode includes a built-in visual tool called the Memory Graph Debugger. Clicking the three connected circles icon during a debug session reveals every retain cycle with a purple exclamation mark.',
          detailedTheory: [
            {
              title: 'Diagnosing Memory Leaks in Xcode',
              paragraphs: [
                '1. Run your app in the iOS Simulator via Xcode.',
                '2. Navigate into a screen and then navigate back out.',
                '3. In the debug bar at the bottom, click the **Debug Memory Graph** icon.',
                '4. Look at the left navigator: any leaked instances that failed to deallocate will have purple warning badges showing the exact strong reference cycle graph.'
              ]
            }
          ],
          codeSnippet: `// Checking deinit execution during debugging
class OrderCoordinator {
    init() { print("Coordinator initialized") }
    
    // Always add deinit logs when debugging navigation leaks
    deinit {
        print("✅ Coordinator successfully deallocated")
    }
}`,
          checkpoints: [
            {
              question: 'What is the fastest way to verify a view controller deallocates after being dismissed?',
              options: [
                'Add a print statement in deinit and verify it outputs to the console',
                'Check the battery usage settings',
                'Restart Xcode',
                'Compile the project with the release flag'
              ],
              correctAnswer: 0,
              explanation: 'Adding a log inside deinit provides instant feedback: if it does not print when dismissed, you have a retain cycle.'
            }
          ]
        }
      },
      {
        id: 'arc-playground-lab',
        title: 'Xcode Playground Lab: Memory Leak Investigation',
        stepLabel: '5. Hands-on Lab',
        description: 'Build and fix a realistic retain cycle between a User and a Subscription model.',
        content: {
          realWorldContext: 'In apps with subscription tiers (Spotify, Netflix), user accounts link to active subscriptions. We will construct a model and verify clean deallocation.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Create a `User` class and a `Subscription` class. Link them bidirectionally and confirm that setting references to nil triggers both `deinit` handlers.'
              ]
            }
          ],
          codeSnippet: `// Safe Bidirectional Architecture
class User {
    let name: String
    var subscription: Subscription?
    
    init(name: String) {
        self.name = name
        print("User \\(name) created")
    }
    
    deinit {
        print("User \\(name) deallocated")
    }
}

class Subscription {
    let tier: String
    // weak reference breaks retain cycle
    weak var user: User?
    
    init(tier: String) {
        self.tier = tier
        print("Subscription \\(tier) created")
    }
    
    deinit {
        print("Subscription \\(tier) deallocated")
    }
}

// Verification scope
do {
    let user = User(name: "Sarah")
    let sub = Subscription(tier: "Family Plan")
    user.subscription = sub
    sub.user = user
}
// Both deallocations print successfully!`,
          checkpoints: [
            {
              question: 'Why did the do { ... } scope cause deallocation?',
              options: [
                'Because variables went out of scope, dropping reference counts to 0',
                'Because do blocks delete memory automatically',
                'Because the CPU was cleared',
                'Because Swift crashed'
              ],
              correctAnswer: 0,
              explanation: 'When execution leaves the do block scope, local strong references are released. With count = 0, ARC cleans them up.'
            }
          ],
          challenge: {
            task: 'Create a `Car` and `Engine` class where the Engine holds a weak reference back to Car. Verify both deallocate when out of scope.',
            hint: 'Use weak var car: Car? inside Engine',
            solution: `class Car {
    var engine: Engine?
    deinit { print("Car deallocated") }
}

class Engine {
    weak var car: Car?
    deinit { print("Engine deallocated") }
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-enums-associated-values',
    module: 3,
    moduleTitle: 'Module 3: OOP & Type Architecture',
    title: 'Enumerations (enum) and Associated Values',
    description: 'Leverage the full power of Swift enums: eliminate Boolean Blindness, type-safe state machines, Raw Values, and Associated Values.',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    icon: 'ToggleLeft',
    content: {
      realWorldContext: 'In mobile apps, asynchronous UI states (loading, success, error) are often mismanaged with multiple boolean flags (isLoading, isError, hasData) that lead to invalid combinations. Swift enums guarantee that an app can only ever be in one valid state at a time.',
      detailedTheory: [
        {
          title: 'Enums as State Machines',
          paragraphs: [
            'An Enumeration (`enum`) defines a common type for a group of related values.',
            'By modeling UI states with an enum, impossible states become unrepresentable in the type system. You eliminate Boolean Blindness.'
          ]
        },
        {
          title: 'Raw Values',
          paragraphs: [
            'Enums can be prepopulated with default primitive values (such as `String`, `Int`, or `Double`).',
            'Swift provides safe instantiation from raw values via `init?(rawValue:)`, returning an optional if the raw value does not match any defined case.'
          ]
        },
        {
          title: 'Associated Values (Swift Superpower)',
          paragraphs: [
            'Unlike enums in C, C++, or Java, Swift enums can attach custom payload values to individual cases.',
            'For example, a `success` case can carry a data payload, while a `failure` case carries an error message or HTTP status code.'
          ]
        }
      ],
      theory: [
        'Enums prevent Boolean Blindness and invalid state combinations.',
        'Raw Values give cases fixed primitive representations (String, Int).',
        'Associated Values allow cases to hold dynamic typed payloads.',
        'switch statements on enums must be exhaustive.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Type-Safe UI State with Enum',
          code: `enum ViewState {
    case idle
    case loading
    case success(data: [String])
    case error(message: String)
}

let state: ViewState = .success(data: ["Item 1", "Item 2"])

switch state {
case .idle: showPlaceholder()
case .loading: showSpinner()
case .success(let items): renderList(items)
case .error(let msg): showErrorBanner(msg)
}`,
          explanation: 'Impossible to be loading and showing an error simultaneously. The compiler enforces handling every valid state.'
        },
        bad: {
          title: 'Boolean Blindness with Multiple Flags',
          code: `var isLoading: Bool = true
var isError: Bool = true
var data: [String]? = nil

// Bug: What happens if BOTH isLoading AND isError are true?
// The UI enters an unpredictable glitched state!`,
          explanation: 'Independent boolean flags permit 2^N state combinations, many of which represent invalid UI states.'
        }
      },
      codeSnippet: `// Modeling an e-commerce order lifecycle
enum OrderStatus {
    case placed(orderId: String)
    case inTransit(trackingNumber: String, estimatedDeliveryDays: Int)
    case delivered(signedBy: String)
    case cancelled(reason: String)
}

let order: OrderStatus = .inTransit(trackingNumber: "1Z9999999999", estimatedDeliveryDays: 2)

switch order {
case .placed(let id):
    print("Order \\(id) is confirmed.")
case .inTransit(let tracking, let days):
    print("In transit [\\(tracking)], arrives in \\(days) days.")
case .delivered(let recipient):
    print("Delivered to \\(recipient).")
case .cancelled(let reason):
    print("Cancelled: \\(reason)")
}`,
      explanation: [
        'Each enum case encapsulates exactly the data required for that specific business state.',
        'Pattern matching with `switch` cleanly unpacks the associated values in a type-safe manner.'
      ],
      underTheHood: {
        title: 'Memory Layout of Enums with Associated Values',
        points: [
          'Swift enums with associated values are implemented as tagged unions.',
          'The enum allocates memory equal to the size of its largest case payload, plus a 1-byte integer tag to identify the active case.'
        ]
      },
      checkpoints: [
        {
          question: 'What is the main benefit of Associated Values over Raw Values?',
          options: [
            'Associated Values allow different cases to store different custom data types per instance',
            'Associated Values are faster to execute in the CPU',
            'Associated Values convert automatically to JSON',
            'Raw Values can only store booleans'
          ],
          correctAnswer: 0,
          explanation: 'Associated values can vary per instance and carry different types, whereas raw values are static compile-time constants of one type.'
        }
      ],
      keyTakeaways: [
        'Enums make invalid application states unrepresentable.',
        'Use Associated Values to attach relevant payloads to specific events.',
        'Swift requires switch statements on enums to be exhaustive.'
      ],
      commonMistakes: [
        'Overusing default: in switch statements, losing compiler warnings when new enum cases are added.',
        'Trying to mix Raw Values and Associated Values in the same enum definition.'
      ],
      challenge: {
        task: 'Define an `enum NetworkResult` with cases `success(data: String)` and `failure(errorCode: Int)`. Write a switch that prints a message for each case.',
        hint: 'Use associated values in parentheses',
        solution: `enum NetworkResult {
    case success(data: String)
    case failure(errorCode: Int)
}

let result: NetworkResult = .success(data: "Payload")
switch result {
case .success(let data):
    print("Success: \\(data)")
case .failure(let code):
    print("Error code: \\(code)")
}`
      }
    },
    pages: [
      {
        id: 'enums-intuition-state-machines',
        title: 'Intuition: Type-Safe State Machines vs. Boolean Blindness',
        stepLabel: '1. Intuition & State Machines',
        description: 'Understand how enums prevent invalid state combinations using the car gearbox analogy.',
        content: {
          realWorldContext: 'In an Uber or DoorDash app, a ride or delivery can only be in one state: searching, driver assigned, on the way, or completed. You cannot be on the way and searching at the same moment.',
          detailedTheory: [
            {
              title: 'Analogy: Car Gearbox',
              paragraphs: [
                'A car automatic transmission can only be in Park, Reverse, Neutral, or Drive. It is physically impossible to be in Reverse and Drive at the same time.',
                'Enums bring that same mechanical physical guarantee to your Swift code: impossible states cannot exist.'
              ]
            },
            {
              title: 'Eliminating Stringly-Typed Code',
              paragraphs: [
                'In older codebases, developers passed strings like `"admin"`, `"user"`, or `"guest"`. A single typo like `"Admin"` causes silent, difficult-to-track authentication failures.',
                'Enums provide compile-time autocomplete and verification: Xcode will not even compile if you misspell a case.'
              ]
            }
          ],
          codeSnippet: `enum UserRole {
    case admin
    case editor
    case viewer
}

func authorize(role: UserRole) {
    switch role {
    case .admin: print("Full access")
    case .editor: print("Edit access")
    case .viewer: print("Read-only access")
    }
}`,
          checkpoints: [
            {
              question: 'What is the danger of using string constants for roles instead of an enum?',
              options: [
                'A typo in the string compiles fine but fails silently at runtime',
                'Strings run slower on the GPU',
                'Strings cannot be passed to functions',
                'Enums require more memory than strings'
              ],
              correctAnswer: 0,
              explanation: 'Stringly-typed code lacks compiler safety; typos in strings lead to silent runtime bugs.'
            }
          ]
        }
      },
      {
        id: 'enums-syntax-raw-values',
        title: 'Enum Anatomy: Basic Syntax and Raw Values',
        stepLabel: '2. Syntax & Raw Values',
        description: 'Explore primitive raw values, automatic string synthesis, and CaseIterable.',
        content: {
          realWorldContext: 'When decoding an API response where status comes as an integer (200, 404, 500) or string ("pending", "active"), raw values make mapping trivial.',
          detailedTheory: [
            {
              title: 'What are Raw Values?',
              paragraphs: [
                'When you declare `enum Direction: String`, Swift assigns raw values. If you do not provide explicit strings, Swift automatically uses the case name as the raw string!',
                'For integer enums (`enum Priority: Int`), Swift auto-increments starting from 0 (or your chosen starting index).'
              ]
            },
            {
              title: 'Safe Initialization with init?(rawValue:)',
              paragraphs: [
                'Because the raw value passed from a network API might be invalid, `init?(rawValue:)` is a failable initializer that returns an Optional.',
                'If the raw value matches, you get the enum case; if not, you get `nil`.'
              ]
            }
          ],
          codeSnippet: `enum AppTheme: String, CaseIterable {
    case light = "Light Mode"
    case dark = "Dark Mode"
    case system = "System Default"
}

// 1. Accessing raw value
let theme = AppTheme.dark
print(theme.rawValue) // "Dark Mode"

// 2. Safe instantiation from raw value
if let userTheme = AppTheme(rawValue: "Dark Mode") {
    print("Loaded theme: \\(userTheme)")
}

// 3. CaseIterable provides .allCases
for item in AppTheme.allCases {
    print("Available: \\(item.rawValue)")
}`,
          checkpoints: [
            {
              question: 'Why is enum init(rawValue:) failable (returns Optional)?',
              options: [
                'Because the supplied raw value might not match any declared enum case',
                'Because enums are stored on the Heap',
                'Because raw values can only be integers',
                'Because enums can be nil'
              ],
              correctAnswer: 0,
              explanation: 'If you pass an unknown raw value (e.g. rawValue: "neon"), the initializer safely returns nil.'
            }
          ]
        }
      },
      {
        id: 'enums-associated-values-pattern',
        title: 'Swift Superpower: Associated Values and Pattern Matching',
        stepLabel: '3. Associated Values',
        description: 'Attach dynamic payloads to enum cases and unpack them with pattern matching.',
        content: {
          realWorldContext: 'In payment processing, Apple Pay might only need a token, while a Credit Card requires the last 4 digits and cardholder name. Associated values model this with precision.',
          detailedTheory: [
            {
              title: 'Associated Values vs. Raw Values',
              paragraphs: [
                '• **Raw Values**: Fixed at compile-time for the entire enum type. All cases share the same primitive type.',
                '• **Associated Values**: Set at runtime when each instance is created. Every case can carry completely different types of custom data payloads.'
              ]
            },
            {
              title: 'Pattern Matching with switch and if case let',
              paragraphs: [
                'You unpack associated values inside a `switch` using `case .myCase(let value):`.',
                'If you only care about one specific case, you can use the concise `if case let .myCase(value) = state` syntax!'
              ]
            }
          ],
          codeSnippet: `enum PaymentMethod {
    case cash
    case creditCard(last4: String, expirationDate: String)
    case applePay(token: String)
}

let payment = PaymentMethod.creditCard(last4: "4242", expirationDate: "12/28")

switch payment {
case .cash:
    print("Paying with physical cash")
case .creditCard(let last4, let exp):
    print("Charged card ending in \\(last4), exp: \\(exp)")
case .applePay(let token):
    print("Authorized Apple Pay token: \\(token)")
}

// If you only care about credit card:
if case let .creditCard(last4, _) = payment {
    print("Receipt sent for card *\\(last4)")
}`,
          checkpoints: [
            {
              question: 'Can an enum have both Raw Values and Associated Values simultaneously in Swift?',
              options: [
                'No, an enum can have Raw Values OR Associated Values, but never both',
                'Yes, by using the @hybrid attribute',
                'Yes, if raw values are Strings',
                'Only in SwiftUI views'
              ],
              correctAnswer: 0,
              explanation: 'Swift enums must choose between Raw Values (fixed constants) or Associated Values (dynamic payloads).'
            }
          ]
        }
      },
      {
        id: 'enums-compiler-errors-quiz',
        title: 'Common Enum Errors in Xcode & Knowledge Check',
        stepLabel: '4. Diagnostics & Quiz',
        description: 'Fix non-exhaustive switch errors and understand enum best practices.',
        content: {
          realWorldContext: 'Xcode compiler errors for enums are designed to enforce complete coverage across your app.',
          detailedTheory: [
            {
              title: 'Top Enum Compilation Errors',
              paragraphs: [
                '1. **Switch must be exhaustive**:\nYou omitted one or more enum cases in a `switch` statement.\n*Fix*: Add cases for the missing options. Avoid using `default:` unless strictly necessary, so the compiler reminds you if you add a new case in the future!',
                '2. **Enum with raw type cannot have cases with arguments**:\nYou tried to define `enum MyEnum: String` while also adding a case with an associated value `case item(id: Int)`.\n*Fix*: Remove the raw value type definition if you need associated values.'
              ]
            }
          ],
          codeSnippet: `enum TaskStatus {
    case pending
    case inProgress
    case completed
}

let status = TaskStatus.inProgress

// ✅ Exhaustive switch: compiler is happy!
switch status {
case .pending: print("Pending")
case .inProgress: print("In Progress")
case .completed: print("Done")
}`,
          checkpoints: [
            {
              question: 'Why do senior iOS engineers avoid using default: in enum switch statements?',
              options: [
                'So that adding a new enum case in the future triggers compiler errors at every place that needs updating',
                'Because default: is slower in CPU execution',
                'Because default: is deprecated in Swift',
                'Because default: causes memory leaks'
              ],
              correctAnswer: 0,
              explanation: 'Exhaustive switches ensure that when new business cases are added, the compiler flags every location in the codebase needing an update.'
            }
          ]
        }
      },
      {
        id: 'enums-playground-lab',
        title: 'Xcode Playground Lab: Order Delivery Tracker',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a production-grade delivery tracking state machine with computed properties and pattern matching.',
        content: {
          realWorldContext: 'Build the order tracking state machine for an Amazon or FedEx style package delivery app.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Create an enum `DeliveryStatus` with cases `processing`, `shipped(trackingCode: String)`, and `delivered`. Add a computed property `displayTitle: String` that formats a user-friendly string for each state.'
              ]
            }
          ],
          codeSnippet: `enum DeliveryStatus {
    case processing
    case shipped(trackingCode: String)
    case delivered
    
    var displayTitle: String {
        switch self {
        case .processing:
            return "Preparing order in warehouse"
        case .shipped(let code):
            return "Package on the way: Tracking #\\(code)"
        case .delivered:
            return "Package has been delivered!"
        }
    }
}

let order = DeliveryStatus.shipped(trackingCode: "UPS-987213")
print(order.displayTitle) // Package on the way: Tracking #UPS-987213`,
          checkpoints: [
            {
              question: 'Can enums have computed properties and methods in Swift?',
              options: [
                'Yes, enums can declare computed properties and methods',
                'No, enums can only have cases',
                'Only if they inherit from NSObject',
                'Only in debug builds'
              ],
              correctAnswer: 0,
              explanation: 'Enums in Swift are full-fledged types that can contain methods, computed properties, and protocol conformance.'
            }
          ],
          challenge: {
            task: 'Create an `enum PaymentMethod` with cases `applePay`, `creditCard(last4: String)`, and `cash`. Add a computed property `title: String` that returns "Apple Pay", "Card ending in ...", or "Cash".',
            hint: 'Use switch self inside var title: String',
            solution: `enum PaymentMethod {
    case applePay
    case creditCard(last4: String)
    case cash
    
    var title: String {
        switch self {
        case .applePay:
            return "Apple Pay"
        case .creditCard(let last4):
            return "Card ending in \\(last4)"
        case .cash:
            return "Cash"
        }
    }
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-protocols-extensions',
    module: 3,
    moduleTitle: 'Module 3: OOP & Type Architecture',
    title: 'Protocols (protocol) and Extensions (extension)',
    description: 'Write modular, decoupled Swift code: interface contracts, protocol conformance, extensions, and default implementations.',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    icon: 'FileCode',
    content: {
      realWorldContext: 'In large applications, tight coupling between classes makes testing and updates painful. Protocols define contracts of what types must do without specifying how they do it. Swift is widely celebrated as the world\'s first Protocol-Oriented Programming (POP) language.',
      detailedTheory: [
        {
          title: 'What is a Protocol?',
          paragraphs: [
            'A Protocol is a blueprint of methods, properties, and other requirements that suit a particular task.',
            'A protocol does not provide implementation by itself; it defines a contract. Any `struct`, `class`, or `enum` that adopts the protocol must satisfy its requirements.'
          ]
        },
        {
          title: 'Protocol Extensions (Default Implementations)',
          paragraphs: [
            'In Swift, protocols can be extended using the `extension` keyword to provide default implementations for methods and computed properties.',
            'Conforming types automatically inherit this default behavior for free, dramatically reducing code duplication.'
          ]
        },
        {
          title: 'Composition over Inheritance',
          paragraphs: [
            'Instead of building rigid monolithic class inheritance hierarchies, Swift encourages composing small, focused protocols (e.g., `Codable`, `Identifiable`, `Equatable`).'
          ]
        }
      ],
      theory: [
        'Protocols define interface contracts of requirements.',
        'Structs, classes, and enums can conform to multiple protocols.',
        'Protocol extensions provide default implementations.',
        'Protocol composition provides flexible, modular architecture.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Protocol-Oriented Architecture (Decoupled)',
          code: `protocol PaymentGateway {
    func processPayment(amount: Double) -> Bool
}

class StripeService: PaymentGateway {
    func processPayment(amount: Double) -> Bool {
        print("Charging $\\(amount) via Stripe API")
        return true
    }
}

class MockPaymentGateway: PaymentGateway {
    func processPayment(amount: Double) -> Bool {
        print("Mock payment approved for unit tests")
        return true
    }
}`,
          explanation: 'Your app depends on the PaymentGateway abstraction, enabling trivial mocking in unit tests.'
        },
        bad: {
          title: 'Monolithic Class Inheritance Hierarchy',
          code: `class MonolithicBasePaymentService {
    func processPayment(amount: Double) {
        // Tightly coupled to production Stripe SDK!
        // Hard to mock or test!
    }
}`,
          explanation: 'Tightly couples screens to concrete production dependencies, preventing easy unit testing.'
        }
      },
      codeSnippet: `// 1. Defining a Protocol with Property & Method Requirements
protocol Discountable {
    var rawPrice: Double { get }
    var discountRate: Double { get }
    func finalPrice() -> Double
}

// 2. Default implementation via Extension
extension Discountable {
    var discountRate: Double { return 0.10 } // Default 10% discount
    
    func finalPrice() -> Double {
        return rawPrice * (1.0 - discountRate)
    }
}

// 3. Conformance
struct Book: Discountable {
    let title: String
    let rawPrice: Double
    // discountRate and finalPrice() are inherited for free!
}

let book = Book(title: "SwiftUI Masterclass", rawPrice: 50.0)
print("Final Price: $\\(book.finalPrice())") // $45.0`,
      explanation: [
        'Protocol requirements specify getter `{ get }` or getter/setter `{ get set }`.',
        'Protocol extensions provide default functionality without requiring subclassing.',
        'Conforming types can choose to use the default implementation or override it.'
      ],
      underTheHood: {
        title: 'Existential Containers and Witness Tables',
        points: [
          'When you use a protocol as a type (`let service: PaymentGateway`), Swift wraps the value in an Existential Container (40 bytes).',
          'It uses a Protocol Witness Table (PWT) to look up and dispatch method implementations dynamically.'
        ]
      },
      checkpoints: [
        {
          question: 'What is the primary superpower of Protocol Extensions in Swift?',
          options: [
            'Providing default implementations so conforming types do not have to rewrite boilerplate code',
            'Allowing protocols to store variables in memory',
            'Enabling multiple inheritance for classes',
            'Making all protocol methods run in the background'
          ],
          correctAnswer: 0,
          explanation: 'Protocol extensions allow writing default method bodies and computed properties inherited by all conforming types.'
        }
      ],
      keyTakeaways: [
        'Protocols define interface contracts without mandating implementation details.',
        'Types can conform to unlimited protocols, avoiding single inheritance limits.',
        'Protocol Extensions provide shared default functionality cleanly.'
      ],
      commonMistakes: [
        'Attempting to store stored properties inside a protocol (only computed properties are allowed).',
        'Over-complicating architecture with protocols when a simple struct would suffice.'
      ],
      challenge: {
        task: 'Define a protocol `Named` with property requirement `var name: String { get }`. Create a struct `User` conforming to it.',
        hint: 'Use protocol Named { var name: String { get } }',
        solution: `protocol Named {
    var name: String { get }
}

struct User: Named {
    let name: String
}`
      }
    },
    pages: [
      {
        id: 'protocols-intuition-contracts',
        title: 'Intuition: What is a Protocol and POP Philosophy',
        stepLabel: '1. Intuition & Contracts',
        description: 'Understand protocols as interface contracts using the driver license and USB-C analogies.',
        content: {
          realWorldContext: 'Think of a USB-C port on your MacBook. Apple does not care whether you plug in a Samsung SSD, a Dell monitor, or an Anker charger. As long as the device adheres to the USB-C standard protocol, it works seamlessly.',
          detailedTheory: [
            {
              title: 'Analogy: Driver\'s License and USB-C Plugs',
              paragraphs: [
                'A driver\'s license is a protocol. The government does not care whether you are tall, short, an engineer, or a chef. As long as you satisfy the driver protocol (you passed the test), you are authorized to drive on the road.',
                'Similarly, protocols in Swift focus on capabilities rather than lineage: "What can this type DO?", rather than "What class did this type inherit from?".'
              ]
            },
            {
              title: 'Why Swift is Called Protocol-Oriented',
              paragraphs: [
                'In 2015, Dave Abrahams delivered the famous WWDC talk "Protocol-Oriented Programming in Swift".',
                'He demonstrated how classical OOP class hierarchies often lead to fragile base classes, unwanted inherited state, and tight coupling. Protocols + Structs provide a safer, cleaner alternative.'
              ]
            }
          ],
          codeSnippet: `// Focusing on capabilities
protocol PrintableDocument {
    func printContent()
}

struct Invoice: PrintableDocument {
    let invoiceNumber: Int
    func printContent() { print("Printing Invoice #\\(invoiceNumber)") }
}

struct Photo: PrintableDocument {
    let resolution: String
    func printContent() { print("Printing photo at \\(resolution)") }
}

let queue: [PrintableDocument] = [Invoice(invoiceNumber: 42), Photo(resolution: "4K")]
for doc in queue { doc.printContent() }`,
          checkpoints: [
            {
              question: 'What is the main philosophical shift of Protocol-Oriented Programming over classical OOP?',
              options: [
                'Focusing on capabilities and interfaces rather than rigid inheritance hierarchies',
                'Replacing all classes with global functions',
                'Eliminating all memory allocation',
                'Making Swift code look like C++'
              ],
              correctAnswer: 0,
              explanation: 'POP focuses on what a type can do (capabilities via protocols) rather than what it is (lineage via class hierarchies).'
            }
          ]
        }
      },
      {
        id: 'protocols-syntax-conformance',
        title: 'Protocol Anatomy: Property Requirements { get set } and Methods',
        stepLabel: '2. Syntax & Requirements',
        description: 'Learn the exact rules for { get }, { get set }, and mutating method requirements.',
        content: {
          realWorldContext: 'In an iOS app, any item displayed in a SwiftUI List must conform to the Identifiable protocol, requiring a unique id property.',
          detailedTheory: [
            {
              title: 'Property Requirements: { get } vs. { get set }',
              paragraphs: [
                '• `{ get }`: The property must be readable. Conforming types can implement it as a `let` constant, a `var` stored property, or a `var` computed property.',
                '• `{ get set }`: The property must be readable AND writable. Conforming types must implement it as a `var` stored or read-write computed property.'
              ]
            },
            {
              title: 'Method Requirements and mutating',
              paragraphs: [
                'If a protocol method can mutate the state of a conforming struct, you must mark it with `mutating func` in the protocol declaration.',
                'Classes conforming to that protocol do not need to write `mutating` because classes are reference types.'
              ]
            }
          ],
          codeSnippet: `protocol Toggleable {
    var isOn: Bool { get set }
    mutating func toggle()
}

struct LightSwitch: Toggleable {
    var isOn: Bool = false
    
    mutating func toggle() {
        isOn.toggle()
    }
}

var bedroomLight = LightSwitch()
bedroomLight.toggle()
print("Is light on? \\(bedroomLight.isOn)") // true`,
          checkpoints: [
            {
              question: 'How can a conforming type satisfy a { get } property requirement?',
              options: [
                'As a let constant, a var stored property, or a var computed property',
                'Only as a private let constant',
                'Only as a computed property with no get block',
                'Only as a class method'
              ],
              correctAnswer: 0,
              explanation: '{ get } requires read access; a let constant, var variable, or computed property all satisfy this requirement.'
            }
          ]
        }
      },
      {
        id: 'protocols-extensions-defaults',
        title: 'Extensions: Extending Existing Types and Default Implementations',
        stepLabel: '3. Extensions & Defaults',
        description: 'Retroactive modeling, organizing code with extensions, and shared default implementations.',
        content: {
          realWorldContext: 'Want to add a method to check if a String is a valid email? In Swift, you do not need to subclass String: you simply write `extension String`!',
          detailedTheory: [
            {
              title: 'What is an Extension?',
              paragraphs: [
                'Extensions allow you to add new methods, computed properties, and protocol conformances to ANY existing type — even types from Apple\'s standard library like `Int`, `Double`, or `Array`!',
                'This technique is known as **Retroactive Modeling**.'
              ]
            },
            {
              title: 'Default Implementations in Protocol Extensions',
              paragraphs: [
                'When you write an `extension MyProtocol`, any method you implement there becomes the default behavior for every conforming type.',
                'Conforming types do not need to implement the method unless they want to customize (override) the default behavior.'
              ]
            }
          ],
          codeSnippet: `// 1. Extending Apple's Double type
extension Double {
    var asCurrencyString: String {
        return String(format: "$%.2f", self)
    }
}

let itemPrice = 49.9
print(itemPrice.asCurrencyString) // "$49.90"

// 2. Protocol Default Implementation
protocol Greetable {
    var name: String { get }
    func greet() -> String
}

extension Greetable {
    func greet() -> String {
        return "Hello, my name is \\(name)!"
    }
}

struct Student: Greetable {
    let name: String
    // greet() is provided automatically!
}

let alex = Student(name: "Alex")
print(alex.greet()) // "Hello, my name is Alex!"`,
          checkpoints: [
            {
              question: 'Can an extension add new stored properties that allocate memory to an existing type?',
              options: [
                'No, extensions can only add computed properties and methods',
                'Yes, if marked with @stored',
                'Yes, for classes only',
                'Only in release builds'
              ],
              correctAnswer: 0,
              explanation: 'Extensions cannot add stored properties because changing memory layout would break binary compatibility.'
            }
          ]
        }
      },
      {
        id: 'protocols-compiler-errors-quiz',
        title: 'Common Protocol Errors in Xcode & Knowledge Check',
        stepLabel: '4. Diagnostics & Quiz',
        description: 'Learn how to read and resolve protocol conformance errors in Xcode.',
        content: {
          realWorldContext: 'The single most common protocol error in Swift is: "Type X does not conform to protocol Y". Xcode provides Fix-It buttons to help generate missing stubs.',
          detailedTheory: [
            {
              title: 'Top Protocol Compilation Errors',
              paragraphs: [
                '1. **Type \'X\' does not conform to protocol \'Y\'**:\nYou missed one or more required properties or methods.\n*Fix*: Click the red Xcode circle and choose "Fix" to generate the required protocol stubs.',
                '2. **Extensions must not contain stored properties**:\nYou tried to declare `var myStorage = 10` inside an `extension`.\n*Fix*: Use a computed property instead, or declare the stored property inside the primary type definition.',
                '3. **Cannot use mutating member on immutable value**:\nA protocol method marked with `mutating` was called on a `let` struct.\n*Fix*: Change the variable declaration to `var`.'
              ]
            }
          ],
          codeSnippet: `protocol IdentifiableItem {
    var id: String { get }
    func display()
}

// ❌ If display() is missing:
// Error: Type 'Song' does not conform to protocol 'IdentifiableItem'

struct Song: IdentifiableItem {
    let id: String
    let title: String
    
    // ✅ Conforms to all requirements
    func display() {
        print("Now playing: \\(title)")
    }
}`,
          checkpoints: [
            {
              question: 'What does clicking "Fix" on a protocol conformance error in Xcode do?',
              options: [
                'Automatically inserts empty stubs for all missing protocol requirements',
                'Deletes the protocol from the file',
                'Changes the struct into a class',
                'Restarts the simulator'
              ],
              correctAnswer: 0,
              explanation: 'Xcode\'s Fix-It automatically inserts skeletal stubs for all required properties and methods.'
            }
          ]
        }
      },
      {
        id: 'protocols-playground-lab',
        title: 'Xcode Playground Lab: Modular Payment Gateway',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a fully decoupled payment processing system with Apple Pay and Credit Card implementations.',
        content: {
          realWorldContext: 'In this lab, you will build the payment gateway architecture used by modern apps like Airbnb, Uber, and Shopify.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Define a `PaymentService` protocol. Implement concrete services for `ApplePayService` and `CreditCardService`. Write a `CheckoutCoordinator` that accepts any `PaymentService` interchangeably.'
              ]
            }
          ],
          codeSnippet: `// Decoupled Payment Architecture
protocol PaymentService {
    var providerName: String { get }
    func processPayment(amount: Double) -> Bool
}

struct ApplePayService: PaymentService {
    let providerName = "Apple Pay"
    func processPayment(amount: Double) -> Bool {
        print("Touch ID / Face ID authorized for $\\(amount) via \\(providerName)")
        return true
    }
}

struct CreditCardService: PaymentService {
    let providerName = "Credit Card"
    let last4: String
    func processPayment(amount: Double) -> Bool {
        print("Charging $\\(amount) to card *\\(last4)")
        return true
    }
}

class CheckoutCoordinator {
    let service: PaymentService
    
    init(service: PaymentService) {
        self.service = service
    }
    
    func checkout(amount: Double) {
        print("Starting checkout with \\(service.providerName)...")
        let success = service.processPayment(amount: amount)
        if success { print("Payment confirmed!") }
    }
}

let coordinator = CheckoutCoordinator(service: ApplePayService())
coordinator.checkout(amount: 129.99)`,
          checkpoints: [
            {
              question: 'Why does CheckoutCoordinator accept PaymentService protocol instead of a concrete class?',
              options: [
                'So it can accept Apple Pay, Credit Card, or a Mock service for unit tests without changing its code',
                'To make it compile faster',
                'Because Swift forbids concrete types in classes',
                'To avoid using memory'
              ],
              correctAnswer: 0,
              explanation: 'Dependency inversion via protocols decouples the coordinator from specific payment implementations, enabling easy substitution and testing.'
            }
          ],
          challenge: {
            task: 'Define a protocol `Validator` with method `func validate(_ input: String) -> Bool`. Implement `EmailValidator` that returns true if input contains "@".',
            hint: 'Use protocol Validator { func validate(_ input: String) -> Bool }',
            solution: `protocol Validator {
    func validate(_ input: String) -> Bool
}

struct EmailValidator: Validator {
    func validate(_ input: String) -> Bool {
        return input.contains("@")
    }
}`
          }
        }
      }
    ]
  }
];
