import { Lesson } from '@/types';

export const module1LessonsEn: Lesson[] = [
  {
    id: 'swift-basics-variables',
    module: 1,
    moduleTitle: 'Module 1: Swift Fundamentals',
    title: 'Variables, Constants, and Strict Typing',
    description: 'Master the core building blocks of Swift: mutable variables with var, immutable constants with let, Type Safety, Type Inference, and String Interpolation.',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'Terminal',
    content: {
      realWorldContext: 'In mobile development, preventing accidental state corruption is critical. In Swift, let prevents reassigning values, while var allows updates. Modern iOS apps prefer let for 80%+ of declarations to ensure predictable state.',
      detailedTheory: [
        {
          title: 'Constants (let) vs. Variables (var)',
          paragraphs: [
            'Swift was engineered from the ground up for safety and speed. At the center of this philosophy is the strict separation between constants (`let`) and variables (`var`).',
            'A constant cannot be reassigned once initialized. This allows the compiler to optimize memory and guarantees that other parts of your app cannot accidentally mutate your data.'
          ]
        },
        {
          title: 'Type Safety & Type Inference',
          paragraphs: [
            'Swift is a strongly typed, type-safe language. Every variable has a definite type determined at compile time.',
            'With Type Inference, you rarely have to write explicit types manually (`let score = 100` is automatically inferred as `Int`).'
          ]
        }
      ],
      theory: [
        'Use `let` by default; use `var` only when mutation is necessary.',
        'Type Inference automatically deduces types at compile time.',
        'Swift never performs implicit type conversion (`Double(5) + 3.14`).',
        'String interpolation `\\(value)` is safe, fast, and idiomatic.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Safe, Immutable Declarations with let',
          code: `let maxLoginAttempts = 3
var currentAttempts = 0

currentAttempts += 1
print("Attempts left: \\(maxLoginAttempts - currentAttempts)")`,
          explanation: 'Constants prevent accidental changes to business limits, and string interpolation creates clean formatted output.'
        },
        bad: {
          title: 'Unnecessary Mutation with var Everywhere',
          code: `var maxLoginAttempts = 3 // Bug risk: can be accidentally altered!
var currentAttempts = 0

maxLoginAttempts = 10 // Business logic silently broken
let message = "Attempts: " + String(currentAttempts)`,
          explanation: 'Using var for immutable values invites accidental bugs, and manual string concatenation with + is brittle.'
        }
      },
      codeSnippet: `// 1. Immutable identifiers and state tracking
let accountID = "ACC-94812"
var balanceUSD: Double = 1250.50

// 2. Safe transaction update
let depositAmount: Double = 300.00
balanceUSD += depositAmount

// 3. String interpolation
let notification = "Account \\(accountID) balance updated: $\\(balanceUSD)"
print(notification) // Account ACC-94812 balance updated: $1550.5`,
      explanation: [
        '`let accountID` guarantees the account number can never be modified during runtime.',
        '`var balanceUSD` allows accumulating and deducting funds using `+=` or `-=`.',
        '`String Interpolation` via `\\(...)` safely converts numeric types into text without type errors.'
      ],
      underTheHood: {
        title: 'Compiler Optimizations for Constants',
        points: [
          'When you declare a value with `let`, LLVM (the Swift compiler backend) can place it directly into CPU registers or inline it into assembly instructions.',
          'Type checking occurs entirely at compile time, eliminating runtime type validation overhead.'
        ]
      },
      checkpoints: [
        {
          question: 'What happens when you declare a variable with var but never mutate it in your code?',
          options: [
            'Xcode issues a warning suggesting you replace var with let',
            'The app crashes immediately at startup',
            'Swift automatically deletes the variable',
            'The compiler refuses to build the app'
          ],
          correctAnswer: 0,
          explanation: 'Xcode emits a compiler warning: "Variable was never mutated; consider changing to let" to encourage immutability.'
        }
      ],
      keyTakeaways: [
        'Always default to `let`; switch to `var` only when you need to reassign a value.',
        'Swift is strictly type-safe and will never implicitly cast numeric types.',
        'String interpolation `\\(value)` is the gold standard for formatting text.'
      ],
      commonMistakes: [
        'Attempting to add `Int` and `Double` directly without explicit casting like `Double(count)`.',
        'Using `var` everywhere out of habit from dynamically typed languages like JavaScript or Python.'
      ],
      challenge: {
        task: 'Declare a constant `deviceName` of type `String` with the value "iPhone 16 Pro", and a variable `batteryLevel` of type `Int` with value 85. Update the battery level to 80 and print "iPhone 16 Pro: 80% battery" using string interpolation.',
        hint: 'Use let for deviceName and var for batteryLevel',
        solution: `let deviceName: String = "iPhone 16 Pro"
var batteryLevel: Int = 85
batteryLevel = 80
print("\\(deviceName): \\(batteryLevel)% battery")`
      }
    },
    pages: [
      {
        id: 'vars-intuition-boxes',
        title: 'Intuition: Memory Boxes and the Immutability Philosophy',
        stepLabel: '1. Intuition & Variables',
        description: 'Understand how computers store values in memory and why modern iOS development loves immutability.',
        content: {
          realWorldContext: 'When you open Uber, your User ID never changes during a trip, but your driver’s GPS coordinates update every second. Knowing what stays fixed and what mutates is the foundation of robust software engineering.',
          detailedTheory: [
            {
              title: 'The Storage Box Metaphor: Sharpie vs. Whiteboard',
              paragraphs: [
                'Imagine two labeled plastic storage containers on your desk:\n• **Constant (`let`)**: You write the label with a permanent Sharpie marker. Once you seal the box with an item inside, it is permanent. No one can swap its contents.\n• **Variable (`var`)**: You write the label with an erasable dry-erase marker. You can open the box at any time, wipe off the label, and replace the contents with something new.\n\nWhy does Apple urge developers to use `let` whenever possible? Because if a value cannot change, it can never be corrupted by multi-threaded background processes!'
              ]
            },
            {
              title: 'Type Safety: Square Pegs and Round Holes',
              paragraphs: [
                'In some languages (like JavaScript or Python), you can assign a number `42` to a variable, and later assign text `"Hello"` to the same variable. This frequently leads to catastrophic runtime crashes.\n\nSwift prevents this completely: once a box is designated to hold a `String`, attempting to place an `Int` inside will stop compilation with a clear error.'
              ],
              callout: {
                type: 'tip',
                title: 'Apple Engineering Rule',
                text: 'Always write `let` first. If you later write a line of code that reassigns it, Xcode will tell you, and you can switch to `var` with confidence.'
              }
            }
          ],
          checkpoints: [
            {
              question: 'Why does Swift encourage developers to use let instead of var wherever possible?',
              options: [
                'Immutability prevents accidental state modification and allows compiler optimizations',
                'let consumes less internet bandwidth',
                'var is deprecated in Swift 6',
                'let variables are stored on the server'
              ],
              correctAnswer: 0,
              explanation: 'Constants guarantee that data cannot be mutated unexpectedly from other parts of the app or background threads.'
            },
            {
              question: 'What is Type Inference in Swift?',
              options: [
                'The compiler automatically determines the variable type based on the initial assigned value',
                'Swift converts all variables to strings automatically',
                'The developer must write the type explicitly on every line',
                'A tool for downloading Swift packages'
              ],
              correctAnswer: 0,
              explanation: 'Type Inference lets you write cleaner code by allowing the compiler to deduce types from context, such as let age = 25 inferring Int.'
            }
          ]
        }
      },
      {
        id: 'vars-syntax-types',
        title: 'Syntax Anatomy: Basic Types, Annotations, and String Interpolation',
        stepLabel: '2. Syntax & Types',
        description: 'Master the 5 core primitive types of Swift and clean text formatting with string interpolation.',
        content: {
          realWorldContext: 'Every profile screen in an iOS app contains names (`String`), ages (`Int`), prices (`Double`), and flags like notifications enabled (`Bool`).',
          detailedTheory: [
            {
              title: 'The Core Primitive Types in Swift',
              paragraphs: [
                '• `String`: Text surrounded by double quotes (`"Welcome back!"`).\n• `Int`: Whole numbers without decimals (`42`, `-10`). On 64-bit devices, it spans up to ±9 quintillion.\n• `Double`: Floating-point numbers with high precision (~15 decimal digits, e.g. `19.99`).\n• `Float`: 32-bit floating-point numbers (~6 decimal digits). Used in graphics frameworks like Metal.\n• `Bool`: Logical truth values (`true` or `false`).'
              ]
            },
            {
              title: 'Explicit Type Annotations',
              paragraphs: [
                'When you want to declare a variable without immediately assigning it a value, you supply a type annotation with a colon:\n`var maximumScore: Int`\n`let currencySymbol: String = "$"`'
              ]
            }
          ],
          codeSnippet: `// 1. Primitive declarations
let userName: String = "Sarah Connor"
let userAge: Int = 28
var accountBalance: Double = 3450.75
var isBiometricsEnabled: Bool = true

// 2. String Interpolation
let summary = "User: \\(userName), Age: \\(userAge), Balance: $\\(accountBalance)"
print(summary)

// 3. Multi-line string literal
let termsOfService = """
Welcome to the Academy.
By using this application, you agree to:
- Learn Swift idioms every day
- Build clean, declarative SwiftUI apps
"""`,
          explanation: [
            'Multi-line strings use triple double quotes `"""` on separate lines.',
            '`String Interpolation` inside `\\(...)` accepts any valid Swift expression, including arithmetic: `"Total: $\\(price * 1.08)"`.'
          ]
        }
      },
      {
        id: 'vars-under-the-hood-memory',
        title: 'Under the Hood: Stack Memory, Bit Widths, and No Implicit Conversions',
        stepLabel: '3. Memory & Rules',
        description: 'How integers and floats are laid out in hardware registers and why Swift rejects implicit numeric casting.',
        content: {
          realWorldContext: 'In financial and banking apps like Chase or Revolut, precision errors can cause real money discrepancies. Swift enforces strict explicit conversions to prevent silent data loss.',
          detailedTheory: [
            {
              title: 'Why Swift Rejects Implicit Type Conversion',
              paragraphs: [
                'In C or JavaScript, adding an integer to a float (`5 + 3.14`) silently converts the integer. But what if you convert a `Double` with decimals into an `Int`? The decimal part is truncated without warning!\n\nSwift eliminates silent data truncation. If you want to combine an `Int` and a `Double`, you must explicitly state your intent:\n`let total = Double(quantity) * unitPrice`.'
              ]
            },
            {
              title: 'Stack Memory and Hardware Registers',
              paragraphs: [
                'Primitive types like `Int`, `Double`, and `Bool` are Value Types stored directly on the **Stack** or in CPU registers. They require zero heap allocation, making their creation and access virtually instantaneous.'
              ]
            }
          ],
          comparisonSnippet: {
            good: {
              title: 'Explicit, Intentional Type Casting',
              code: `let itemsCount: Int = 3
let pricePerItem: Double = 14.99

// Explicit conversion: safe and obvious
let total = Double(itemsCount) * pricePerItem
print("Total: $\\(total)") // $44.97`,
              explanation: 'The developer makes an intentional decision to convert itemsCount to Double before multiplication.'
            },
            bad: {
              title: 'Attempting Implicit Arithmetic',
              code: `let itemsCount: Int = 3
let pricePerItem: Double = 14.99

// COMPILER ERROR: Binary operator '*' cannot be applied to operands of type 'Int' and 'Double'
let total = itemsCount * pricePerItem`,
              explanation: 'Swift refuses to guess whether the result should be an Int or a Double.'
            }
          },
          keyTakeaways: [
            'Numeric types never convert automatically in Swift.',
            'Stack allocation provides near-zero performance cost for primitive types.',
            'Explicit casts like `Double(count)` prevent rounding and truncation bugs.'
          ]
        }
      },
      {
        id: 'vars-compiler-errors-quiz',
        title: 'Xcode Compiler Errors & Knowledge Check',
        stepLabel: '4. Errors & Quiz',
        description: 'Learn how to read and fix common Xcode variable errors and test your understanding.',
        content: {
          realWorldContext: 'The Swift compiler is famous for its precise error messages and helpful Fix-it suggestions. Let’s learn how to read them.',
          detailedTheory: [
            {
              title: 'Top 3 Variable Errors in Xcode',
              paragraphs: [
                '1. **Cannot assign to value: \'xxx\' is a \'let\' constant**:\nYou tried to change a value declared with `let`.\n*Fix*: Change `let` to `var` if the value must mutate.\n\n2. **Cannot convert value of type \'String\' to specified type \'Int\'**:\nYou tried to assign text to a numeric variable.\n*Fix*: Ensure data matches the expected type or parse it with `Int(text)`.\n\n3. **Variable \'xxx\' used before being initialized**:\nYou declared a variable with a type annotation but attempted to read it before giving it an initial value.\n*Fix*: Assign an initial value upon declaration or in your setup method.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Which of the following code snippets will fail to compile in Swift?',
              options: [
                'let x: Double = 10 + 3.14',
                'let a: Int = 10; let b: Double = 3.14; let c = Double(a) + b',
                'var score = 10; score = 20',
                'let a: Int = 5; let b: Double = 2.5; let result = a + b'
              ],
              correctAnswer: 3,
              explanation: 'let result = a + b fails because Swift does not allow binary operations between Int and Double without explicit casting.'
            },
            {
              question: 'What is the value of result after let result = Int(7.9)?',
              options: [
                '7 (truncated towards zero)',
                '8 (rounded up)',
                '7.9',
                'It produces a compiler crash'
              ],
              correctAnswer: 0,
              explanation: 'Converting a floating-point number to Int truncates the fractional portion, leaving 7.'
            },
            {
              question: 'How do you insert the variable city into the string "Welcome to ..."?',
              options: [
                '"Welcome to \\(city)"',
                '"Welcome to " + city.toString()',
                '"Welcome to ${city}"',
                '"Welcome to {city}"'
              ],
              correctAnswer: 0,
              explanation: 'Swift uses \\(variable) for string interpolation.'
            }
          ]
        }
      },
      {
        id: 'vars-playground-lab',
        title: 'Xcode Playground Lab & Code Challenge',
        stepLabel: '5. Hands-on Lab & Challenge',
        description: 'Build a complete digital wallet profile with transaction math, currency formatting, and the final challenge.',
        content: {
          realWorldContext: 'Build an account overview model in an Xcode Playground with user identifiers, balance calculations, and formatted status logs.',
          codeSnippet: `// ==========================================
// HANDS-ON LAB: DIGITAL WALLET PROFILE
// ==========================================

// 1. Account constants
let accountHolder: String = "Alex Rivera"
let accountID: String = "US-CHASE-0094182"
let accountTier: String = "Premium Gold"

// 2. Mutable wallet state
var balanceUSD: Double = 1450.00
var totalTransactionsCount: Int = 12

// 3. Simulate an incoming salary deposit
let salaryDeposit: Double = 3200.50
balanceUSD += salaryDeposit
totalTransactionsCount += 1

// 4. Simulate a subscription payment
let streamingSubscription: Double = 19.99
balanceUSD -= streamingSubscription
totalTransactionsCount += 1

// 5. Output formatted statements
print("=== ACCOUNT STATEMENT ===")
print("Holder: \\(accountHolder) [\\(accountTier)]")
print("Account: \\(accountID)")
print("Current Balance: $\\(balanceUSD)")
print("Activity: \\(totalTransactionsCount) transactions recorded.")`,
          explanation: [
            '`let accountID` guarantees the banking identifier can never be tampered with.',
            '`var balanceUSD` accurately tracks additions and deductions.',
            'All output is formatted cleanly via string interpolation.'
          ],
          challenge: {
            task: 'Declare a constant `deviceName` of type `String` with value "iPhone 16 Pro", and a variable `batteryLevel` of type `Int` with value 85. Update the battery level to 80 and print "iPhone 16 Pro: 80% battery" using string interpolation.',
            hint: 'Use let deviceName: String = "iPhone 16 Pro" and var batteryLevel = 85',
            solution: `let deviceName: String = "iPhone 16 Pro"
var batteryLevel: Int = 85
batteryLevel = 80
print("\\(deviceName): \\(batteryLevel)% battery")`
          }
        }
      }
    ]
  },
  {
    id: 'swift-control-flow',
    module: 1,
    moduleTitle: 'Module 1: Swift Fundamentals',
    title: 'Control Flow: if-else, switch, and Closed Ranges',
    description: 'Master branch evaluation in Swift: how if-else makes decisions, why switch must be exhaustive, closed ranges (a...b), and the ternary operator.',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'GitFork',
    content: {
      realWorldContext: 'Every screen transition, biometric login check, or discount calculation relies on branching logic. In Swift, control flow is strictly checked at compile time, eliminating missing edge cases.',
      detailedTheory: [
        {
          title: 'Conditionals with if, else if, and else',
          paragraphs: [
            'In Swift, conditions must evaluate to a strict `Bool` (`true` or `false`). You cannot use integers as booleans like in C or JavaScript (`if (1)` is an error).',
            'Parentheses around conditions are optional, but curly braces around execution blocks are strictly required.'
          ]
        },
        {
          title: 'Exhaustive switch & Pattern Matching',
          paragraphs: [
            'Swift’s `switch` statement is significantly more powerful than in other languages. It supports closed ranges (`1...10`), tuple matching, and type casting.',
            'Crucially, `switch` must be **exhaustive**: you must handle every single possible value, or provide a `default:` branch. There is no implicit fallthrough, so `break` is not needed!'
          ]
        }
      ],
      theory: [
        'Conditions must strictly evaluate to Bool.',
        'switch statements must be exhaustive.',
        'No implicit fallthrough: break is unnecessary.',
        'Ranges: `0...10` (inclusive) and `0..<10` (half-open).'
      ],
      comparisonSnippet: {
        good: {
          title: 'Clean, Exhaustive switch with Ranges',
          code: `let httpStatusCode = 404

switch httpStatusCode {
case 200...299:
    print("Success")
case 400...499:
    print("Client Error")
case 500...599:
    print("Server Error")
default:
    print("Unknown Status")
}`,
          explanation: 'Clear, concise range matching without messy cascading if-else conditions.'
        },
        bad: {
          title: 'Cascading if-else Ladder',
          code: `if httpStatusCode >= 200 && httpStatusCode <= 299 {
    print("Success")
} else if httpStatusCode >= 400 && httpStatusCode <= 499 {
    print("Client Error")
} else {
    print("Other")
}`,
          explanation: 'Repetitive, harder to scan, and prone to boundary condition bugs.'
        }
      },
      codeSnippet: `let userAge = 21
let hasStudentDiscount = true

// 1. Standard if-else
if userAge >= 65 {
    print("Senior Ticket: $8")
} else if userAge >= 18 && hasStudentDiscount {
    print("Student Ticket: $10")
} else {
    print("Standard Ticket: $15")
}

// 2. Ternary operator (condition ? trueVal : falseVal)
let accessStatus = userAge >= 21 ? "Access Granted" : "Restricted"
print("Venue Entry: \\(accessStatus)")

// 3. For-in loop over a closed range
for count in 1...3 {
    print("Ready in \\(count)...")
}`,
      explanation: [
        'Swift boolean logic strictly evaluates `&&` (AND) and `||` (OR).',
        'The ternary operator `condition ? a : b` is ideal for inline conditional styling in SwiftUI.',
        '`1...3` represents an inclusive range spanning 1, 2, and 3.'
      ],
      underTheHood: {
        title: 'Compiler Jump Tables for switch',
        points: [
          'When compiling a `switch` statement, LLVM optimizes the branch targets into a jump table in assembly.',
          'This allows CPU branch prediction to execute the match in O(1) time regardless of how many cases exist.'
        ]
      },
      checkpoints: [
        {
          question: 'What is required for every switch statement in Swift?',
          options: [
            'It must be exhaustive, covering all possible cases or including a default case',
            'Every case must end with a break statement',
            'It only works with integer numbers',
            'Parentheses must surround the switch variable'
          ],
          correctAnswer: 0,
          explanation: 'Swift requires complete exhaustiveness to ensure no unhandled states slip through to runtime.'
        }
      ],
      keyTakeaways: [
        'Swift conditions require strict `Bool` values.',
        '`switch` must be exhaustive and does not require `break`.',
        'Use `a..<b` for half-open ranges and `a...b` for closed ranges.'
      ],
      commonMistakes: [
        'Trying to use numbers as booleans like `if count { ... }` instead of `if count > 0`.',
        'Forgetting the `default` case when switching over non-enumerable types like `Int` or `String`.'
      ],
      challenge: {
        task: 'Write a `switch` statement that checks a variable `temperature` (Int). Print "Freezing" for temperatures below 0, "Moderate" for 0...25, and "Hot" for anything above 25.',
        hint: 'Use case ..<0, case 0...25, and default',
        solution: `let temperature = 18

switch temperature {
case ..<0:
    print("Freezing")
case 0...25:
    print("Moderate")
default:
    print("Hot")
}`
      }
    },
    pages: [
      {
        id: 'flow-intuition-forks',
        title: 'Intuition: Crossroads, Road Signs, and Traffic Lights',
        stepLabel: '1. Intuition & Branches',
        description: 'Understand how code makes decisions and why compiler guarantees eliminate silent logic bugs.',
        content: {
          realWorldContext: 'When you open Spotify, the app checks: Is this user a Premium subscriber? If yes, stream in lossless quality and skip ads. If no, inject an audio ad and restrict track skipping. That fork in the road is control flow.',
          detailedTheory: [
            {
              title: 'The Fork in the Road Metaphor',
              paragraphs: [
                'Imagine driving a car toward a fork in the road:\n• A road sign reads: "If you have an E-Pass, take the left express lane. Otherwise, take the right cash toll lane."\n\nYour car cannot take both lanes simultaneously. You inspect your dashboard (`condition`), determine whether it is `true` or `false`, and commit to one path.\n\nIn Swift, control flow is guaranteed to be safe: the compiler ensures there are no ambiguous paths where your app is left stranded without instructions.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Can you write if 1 { ... } in Swift like in C or JavaScript?',
              options: [
                'No, Swift requires a strict boolean expression like if x == 1',
                'Yes, 1 evaluates to true automatically',
                'Yes, but only in debug mode',
                'Only inside a switch statement'
              ],
              correctAnswer: 0,
              explanation: 'Swift is strictly type-safe; conditional statements require an expression that explicitly evaluates to Bool.'
            }
          ]
        }
      },
      {
        id: 'flow-syntax-switch-ranges',
        title: 'Syntax Anatomy: Exhaustive switch, Ranges, and Pattern Matching',
        stepLabel: '2. Exhaustive switch',
        description: 'Learn why Swift’s switch is vastly superior to other languages and how to match closed ranges.',
        content: {
          realWorldContext: 'When handling HTTP response codes (200, 404, 500) from an API, a range-based switch is the cleanest way to route errors.',
          codeSnippet: `let creditScore = 740

switch creditScore {
case 300..<580:
    print("Rating: Poor")
case 580..<670:
    print("Rating: Fair")
case 670..<740:
    print("Rating: Good")
case 740...850:
    print("Rating: Excellent")
default:
    print("Invalid Score")
}`,
          explanation: [
            '`300..<580` uses the half-open range operator, matching from 300 up to (but not including) 580.',
            '`740...850` uses the closed range operator, including both 740 and 850.',
            '`default:` satisfies the exhaustiveness requirement.'
          ]
        }
      },
      {
        id: 'flow-under-the-hood-jumps',
        title: 'Under the Hood: Branch Prediction, Jump Tables, and No Fallthrough',
        stepLabel: '3. Jump Tables',
        description: 'How modern Apple Silicon CPUs predict conditional branches and execute switches at maximum speed.',
        content: {
          realWorldContext: 'Modern iPhone processors execute billions of instructions per second using Branch Prediction to guess which code path will run before the check even completes.',
          detailedTheory: [
            {
              title: 'No Fallthrough by Default',
              paragraphs: [
                'In older languages like C or Java, forgetting a `break` statement causes execution to fall through into the next case, causing notorious security bugs.\n\nSwift fixes this: each case terminates automatically after its block completes. If you ever genuinely need fallthrough, you must write the explicit `fallthrough` keyword.'
              ]
            }
          ],
          keyTakeaways: [
            'Swift cases never fall through automatically.',
            'Jump tables make multi-case switch statements run in constant O(1) time.',
            'Range matching makes boundary validation clean and bug-free.'
          ]
        }
      },
      {
        id: 'flow-errors-quiz',
        title: 'Common Compiler Errors & Knowledge Check',
        stepLabel: '4. Errors & Quiz',
        description: 'Avoid common pitfalls with conditions and test your understanding of branching.',
        content: {
          realWorldContext: 'Review the most common mistakes beginners make with conditional statements in Xcode.',
          checkpoints: [
            {
              question: 'What error will Xcode display for: switch number { case 1: print("One") }?',
              options: [
                'Switch must be exhaustive',
                'Missing break statement',
                'Unexpected number type',
                'Variable not found'
              ],
              correctAnswer: 0,
              explanation: 'Because Int has billions of possible values, you must either cover all values or provide a default case.'
            },
            {
              question: 'Which range operator includes both endpoints a and b?',
              options: [
                'a...b (Closed Range)',
                'a..<b (Half-open Range)',
                'a->b',
                'a:b'
              ],
              correctAnswer: 0,
              explanation: 'The three-dot operator a...b includes both endpoints.'
            }
          ]
        }
      },
      {
        id: 'flow-playground-lab',
        title: 'Xcode Playground Lab & Challenge',
        stepLabel: '5. Hands-on Lab & Challenge',
        description: 'Build a flight boarding gate pass evaluator and solve the final temperature challenge.',
        content: {
          realWorldContext: 'Build an airline boarding tier evaluation logic based on passenger status and loyalty points.',
          codeSnippet: `// ==========================================
// HANDS-ON LAB: AIRLINE BOARDING PASS SYSTEM
// ==========================================

let loyaltyPoints = 45000
let hasPriorityPass = true

let boardingGroup: String

switch loyaltyPoints {
case 100_000...:
    boardingGroup = "Group 1 (Executive Platinum)"
case 50_000..<100_000:
    boardingGroup = "Group 2 (Platinum Pro)"
case 25_000..<50_000 where hasPriorityPass:
    boardingGroup = "Group 3 (Gold Priority)"
default:
    boardingGroup = "Group 4 (Main Cabin)"
}

print("Welcome aboard! Proceed to: \\(boardingGroup)")`,
          explanation: [
            '`100_000...` is a one-sided range matching 100,000 and anything higher.',
            '`where hasPriorityPass` demonstrates pattern matching with an additional boolean condition filter.'
          ],
          challenge: {
            task: 'Write a `switch` statement that checks a variable `temperature` (Int). Print "Freezing" for temperatures below 0, "Moderate" for 0...25, and "Hot" for anything above 25.',
            hint: 'Use case ..<0, case 0...25, and default',
            solution: `let temperature = 18

switch temperature {
case ..<0:
    print("Freezing")
case 0...25:
    print("Moderate")
default:
    print("Hot")
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-optionals-unwrapping',
    module: 1,
    moduleTitle: 'Module 1: Swift Fundamentals',
    title: 'Optionals and Safe Unwrapping: if let, guard let, and nil-coalescing',
    description: 'Solve the billion-dollar mistake: understand why nil exists, how to safely unwrap Optionals with if let and guard let, and use the default ?? operator.',
    difficulty: 'Beginner',
    estimatedMinutes: 24,
    icon: 'HelpCircle',
    content: {
      realWorldContext: 'In 1965, computer scientist Tony Hoare invented the null pointer, later calling it his "billion-dollar mistake" because null references have caused countless crashes in Android and Windows apps. Swift solved this with Optionals: a variable can never be nil unless explicitly marked with a question mark (?).',
      detailedTheory: [
        {
          title: 'What is an Optional (Type?)',
          paragraphs: [
            'An Optional represents two states: either there is a valid value inside, or there is nothing at all (`nil`).',
            'You cannot use an optional directly without unwrapping it first. This forces you to think about missing data before your app ever runs.'
          ]
        },
        {
          title: 'Unwrapping Strategies: if let vs. guard let',
          paragraphs: [
            '• `if let`: Unwraps the value inside a conditional block.\n• `guard let`: Checks that a value exists; if missing, it exits the function immediately (`return`). The unwrapped variable remains available for the rest of the function scope!\n• Nil-coalescing (`??`): Provides an immediate fallback default value if the optional is nil.'
          ]
        }
      ],
      theory: [
        'Optionals either contain a value or `nil`.',
        'Force unwrapping (`!`) causes runtime crashes if the value is nil.',
        'Use `if let` for local scoped checks.',
        'Use `guard let` for early exit guard clauses.',
        'The `??` operator supplies an instant fallback default.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Safe Unwrapping with guard let or if let',
          code: `func displayUser(name: String?) {
    guard let validName = name else {
        print("Guest User")
        return
    }
    print("Welcome, \\(validName)!")
}`,
          explanation: 'Safe, clear, and impossible to crash: if name is nil, the function exits cleanly.'
        },
        bad: {
          title: 'Dangerous Force Unwrapping (!)',
          code: `func displayUser(name: String?) {
    // If name is nil -> FATAL CRASH: Unexpectedly found nil
    print("Welcome, " + name!)
}`,
          explanation: 'Force unwrapping with exclamation mark is the leading cause of crashes in production iOS apps.'
        }
      },
      codeSnippet: `// 1. Optional declaration
var optionalEmail: String? = "alex@apple.com"

// 2. if let unwrapping
if let email = optionalEmail {
    print("Sending confirmation to \\(email)")
} else {
    print("No email provided.")
}

// 3. Nil-coalescing operator (??)
let displayEmail = optionalEmail ?? "support@example.com"
print("Contact: \\(displayEmail)")

// 4. Optional Chaining
struct Profile { var bio: String? }
var userProfile: Profile? = Profile(bio: "iOS Developer")
let length = userProfile?.bio?.count ?? 0
print("Bio length: \\(length)")`,
      explanation: [
        '`optionalEmail` holds either a `String` or `nil`.',
        '`userProfile?.bio?.count` uses optional chaining: if any link in the chain is nil, the entire expression gracefully evaluates to nil.'
      ],
      underTheHood: {
        title: 'Optionals are Enums Under the Hood',
        points: [
          'In Swift, an Optional is simply an enum: `enum Optional<Wrapped> { case none, case some(Wrapped) }`.',
          'The `?` and `!` syntax is pure syntactic sugar provided by the compiler to make optionals concise to write.'
        ]
      },
      checkpoints: [
        {
          question: 'What happens if you force unwrap (!) an optional variable that contains nil?',
          options: [
            'The application crashes immediately with a Fatal Error',
            'It returns an empty string',
            'It returns 0',
            'Xcode prints a yellow warning'
          ],
          correctAnswer: 0,
          explanation: 'Force unwrapping a nil value triggers a fatal runtime error: "Fatal error: Unexpectedly found nil while unwrapping an Optional value".'
        }
      ],
      keyTakeaways: [
        'Never use force unwrapping (`!`) unless you have an absolute architectural guarantee.',
        '`guard let` flattens code and keeps unwrapped variables in outer scope.',
        'Use nil-coalescing `??` for simple fallback values.'
      ],
      commonMistakes: [
        'Using `!` to silence compiler errors instead of properly unwrapping with `if let` or `guard let`.',
        'Creating nested pyramids of `if let` statements instead of combining them on one line.'
      ],
      challenge: {
        task: 'Write a function `parseScore(from text: String?) -> Int` that unwraps the text safely and attempts to convert it to an integer. If the text is nil or invalid, return 0 using nil-coalescing.',
        hint: 'Use guard let or if let with Int(text ?? "") ?? 0',
        solution: `func parseScore(from text: String?) -> Int {
    guard let validText = text, let score = Int(validText) else {
        return 0
    }
    return score
}`
      }
    },
    pages: [
      {
        id: 'opt-intuition-giftbox',
        title: 'Intuition: The Wrapped Gift Box Metaphor',
        stepLabel: '1. Intuition & Gift Box',
        description: 'Understand the two states of an Optional and why opening boxes blindly leads to disasters.',
        content: {
          realWorldContext: 'When a user fills out a registration form, their middle name or apartment number is optional. In Swift, we express this explicitly with Optionals.',
          detailedTheory: [
            {
              title: 'The Gift Box Metaphor',
              paragraphs: [
                'Imagine receiving a wrapped Amazon gift box in the mail:\n• The box might contain a brand-new iPhone (`.some(value)`).\n• Or the box might be completely empty (`.none` / `nil`).\n\nCan you make a phone call using the cardboard box directly? Of course not! You must first **unwrap** the box.\n\n• **Force unwrapping (`!`)**: You blindly smash the box with a hammer. If there was a phone inside, great! But if it was empty, you just smashed a hammer into your table (Fatal Crash).\n• **Safe unwrapping (`if let` / `guard let`)**: You gently open the lid, look inside, and only proceed if a real item is present.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'What are the two states of an Optional in Swift?',
              options: [
                'Some(value) containing the wrapped data, or None (nil)',
                'True or False',
                'Positive or Negative',
                'Cached or Remote'
              ],
              correctAnswer: 0,
              explanation: 'An optional represents either an existing wrapped value (.some) or the complete absence of value (.none/nil).'
            }
          ]
        }
      },
      {
        id: 'opt-syntax-unwrapping',
        title: 'Syntax Anatomy: if let, guard let, and Shadowing',
        stepLabel: '2. Unwrapping Syntax',
        description: 'Compare if let with guard let and learn modern Swift variable shadowing.',
        content: {
          realWorldContext: 'In mobile apps, network responses frequently omit fields. We handle missing data using guard clauses for early exits.',
          codeSnippet: `func processPayment(cardToken: String?, amount: Double?) {
    // Modern Swift variable shadowing (if let cardToken = cardToken)
    guard let cardToken, let amount else {
        print("Missing payment details. Aborting.")
        return
    }
    
    // cardToken and amount are non-optional and available here!
    print("Charging $\\(amount) on token: \\(cardToken.prefix(8))...")
}`,
          explanation: [
            'Swift 5.7+ introduced shorthand shadowing: `if let name` instead of `if let name = name`.',
            '`guard let` requires an `else` block that must exit the scope with `return`, `throw`, or `fatalError`.'
          ]
        }
      },
      {
        id: 'opt-under-the-hood-enum',
        title: 'Under the Hood: Optional Enum Memory Representation',
        stepLabel: '3. Enum Representation',
        description: 'Discover how the compiler stores Optionals using extra discriminant tag bytes.',
        content: {
          detailedTheory: [
            {
              title: 'Optional<T> Memory Layout',
              paragraphs: [
                'At the binary level, Swift allocates memory for the wrapped type `T`, plus a single extra byte called a **tag byte** (or discriminant). If the tag byte is `0`, the value is present; if `1`, it is nil.',
                'For references and pointers, Swift uses special **spare bit patterns** (like 0x0), requiring zero additional memory overhead!'
              ]
            }
          ],
          keyTakeaways: [
            'Optionals are enums under the hood: `Optional<Wrapped>`.',
            '`guard let` prevents the "pyramid of doom" by flattening nested checks.',
            'Nil-coalescing `??` is the cleanest way to provide default fallbacks.'
          ]
        }
      },
      {
        id: 'opt-errors-quiz',
        title: 'Common Optional Errors & Knowledge Check',
        stepLabel: '4. Errors & Quiz',
        description: 'Learn why Force Unwrapping is banned in top iOS teams and test your skills.',
        content: {
          checkpoints: [
            {
              question: 'What is the advantage of guard let over if let?',
              options: [
                'The unwrapped variable remains available in the outer function scope following the guard check',
                'guard let executes 10x faster',
                'guard let works without curly braces',
                'guard let can only be used with numbers'
              ],
              correctAnswer: 0,
              explanation: 'guard let promotes early exit and leaves the unwrapped variable available in the parent scope.'
            },
            {
              question: 'What does the nil-coalescing operator ?? do?',
              options: [
                'Unwraps the optional if present, or returns the default value on the right if nil',
                'Forces an app crash if nil',
                'Divides two optional numbers',
                'Compares two optionals for equality'
              ],
              correctAnswer: 0,
              explanation: 'The ?? operator supplies an immediate fallback value whenever an optional is nil.'
            }
          ]
        }
      },
      {
        id: 'opt-playground-lab',
        title: 'Xcode Playground Lab & Challenge',
        stepLabel: '5. Hands-on Lab & Challenge',
        description: 'Build a user authentication token validator with safe unwrapping.',
        content: {
          codeSnippet: `// ==========================================
// HANDS-ON LAB: SAFE AUTHENTICATION PARSER
// ==========================================

struct AuthResponse {
    let accessToken: String?
    let userDisplayName: String?
    let expiresInSeconds: Int?
}

func handleLogin(response: AuthResponse) {
    guard let token = response.accessToken else {
        print("Login Failed: No access token received.")
        return
    }
    
    let name = response.userDisplayName ?? "Anonymous User"
    let expiry = response.expiresInSeconds ?? 3600
    
    print("Authenticated: Welcome \\(name)!")
    print("Session active for \\(expiry / 60) minutes with token: \\(token.prefix(6))...")
}

let sampleResponse = AuthResponse(accessToken: "tok_sec_9941824", userDisplayName: "David Miller", expiresInSeconds: 7200)
handleLogin(response: sampleResponse)`,
          explanation: [
            '`guard let token` ensures authentication cannot proceed without a valid token.',
            'Fallback defaults gracefully handle missing display names and expiry times.'
          ],
          challenge: {
            task: 'Write a function `parseScore(from text: String?) -> Int` that unwraps the text safely and attempts to convert it to an integer. If the text is nil or invalid, return 0 using nil-coalescing.',
            hint: 'Use guard let or if let with Int(text ?? "") ?? 0',
            solution: `func parseScore(from text: String?) -> Int {
    guard let validText = text, let score = Int(validText) else {
        return 0
    }
    return score
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-functions-params',
    module: 1,
    moduleTitle: 'Module 1: Swift Fundamentals',
    title: 'Functions: Parameters, Return Values, and Inout',
    description: 'Master modular code in Swift: argument labels vs. parameter names, default values, variadic parameters, and mutating arguments with inout.',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'Terminal',
    content: {
      realWorldContext: 'Functions are the workhorses of software development. In Swift, function calls read like natural English sentences thanks to argument labels (e.g. `downloadImage(from: url, into: imageView)`).',
      detailedTheory: [
        {
          title: 'Argument Labels & Parameter Names',
          paragraphs: [
            'Swift functions have a unique and expressive feature: each parameter can have an **Argument Label** (used by callers for readability) and a **Parameter Name** (used internally in the function body).',
            'If you don’t want an argument label at call sites, you suppress it with an underscore `_`.'
          ]
        },
        {
          title: 'Default Parameter Values',
          paragraphs: [
            'You can assign default values to parameters (`func send(message: String, isUrgent: Bool = false)`). Callers can omit optional arguments, keeping call sites clean.'
          ]
        }
      ],
      theory: [
        'Functions use `func name(params) -> ReturnType`.',
        'Argument labels make call sites read like fluent English.',
        'Parameters are immutable `let` constants by default.',
        '`inout` allows functions to mutate passed arguments directly.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Fluent Swift Argument Labels',
          code: `func send(_ message: String, to recipient: String) {
    print("Delivering: '\\(message)' to \\(recipient)")
}

// Reads like natural English!
send("Meeting at 3 PM", to: "Jordan")`,
          explanation: 'Suppressing the first label and using "to" for the second creates fluent, expressive code.'
        },
        bad: {
          title: 'Vague, C-Style Parameter Calls',
          code: `func sendMessage(m: String, r: String) {
    print(m + " " + r)
}

// What do these strings represent? Mystery parameters!
sendMessage(m: "Meeting at 3 PM", r: "Jordan")`,
          explanation: 'Abbreviated names obscure parameter purpose and hurt maintainability.'
        }
      },
      codeSnippet: `// 1. Function with argument labels and default parameter
func calculateFinalPrice(basePrice: Double, taxRate: Double = 0.08) -> Double {
    return basePrice * (1.0 + taxRate)
}

let laptopPrice = calculateFinalPrice(basePrice: 1200.0)
print("Total: $\\(laptopPrice)") // $1296.0

// 2. inout parameter for in-place mutation
func doubleInPlace(_ number: inout Int) {
    number *= 2
}

var currentPoints = 50
doubleInPlace(&currentPoints) // & indicates inout address
print("Points doubled: \\(currentPoints)") // 100`,
      explanation: [
        '`taxRate: Double = 0.08` allows omitting the tax parameter for standard calculations.',
        '`&currentPoints` passes a reference pointer to allow `inout` in-place modification.'
      ],
      underTheHood: {
        title: 'How inout Works: Copy-In Copy-Out',
        points: [
          'Under the hood, `inout` does not simply pass a raw C pointer.',
          'Instead, Swift uses **Copy-In Copy-Out**: the value is copied into the function parameter upon entry, and upon return, the mutated value is copied back over the original variable.'
        ]
      },
      checkpoints: [
        {
          question: 'How do you suppress an argument label so callers do not have to write it?',
          options: [
            'Place an underscore _ before the parameter name (e.g. func greet(_ name: String))',
            'Place a question mark ? after the parameter',
            'Use the private keyword',
            'Functions always require labels'
          ],
          correctAnswer: 0,
          explanation: 'An underscore _ indicates that the argument label is omitted at call sites.'
        }
      ],
      keyTakeaways: [
        'Design functions so call sites read like clear English sentences.',
        'Function parameters are immutable constants unless marked `inout`.',
        'Use default parameter values to eliminate method overloading.'
      ],
      commonMistakes: [
        'Trying to reassign a function parameter directly without marking it `inout`.',
        'Forgetting the ampersand `&` when passing an argument to an `inout` parameter.'
      ],
      challenge: {
        task: 'Write a function `formatGreeting(name: String, title: String = "Engineer") -> String` that returns "Hello, Engineer Sarah!" when called with name "Sarah".',
        hint: 'Use return "Hello, \\(title) \\(name)!" with default title = "Engineer"',
        solution: `func formatGreeting(name: String, title: String = "Engineer") -> String {
    return "Hello, \\(title) \\(name)!"
}`
      }
    },
    pages: [
      {
        id: 'func-intuition-machine',
        title: 'Intuition: The Factory Machine Metaphor',
        stepLabel: '1. Intuition & Machines',
        description: 'Understand functions as reusable input-output machines that keep code modular.',
        content: {
          realWorldContext: 'Whenever an app calculates shipping rates, formats timestamps, or validates passwords, it delegates the work to a dedicated function.',
          detailedTheory: [
            {
              title: 'The Coffee Machine Metaphor',
              paragraphs: [
                'Think of a modern espresso machine:\n• **Inputs (Parameters)**: Coffee beans, water volume, and milk preference.\n• **Internal Processing (Body)**: Grind beans, heat water to 200°F, extract under pressure.\n• **Output (Return Value)**: A fresh cup of coffee.\n\nYou don’t need to rebuild the machine every time someone wants a drink. You just invoke the machine with your chosen parameters!'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Are function parameters mutable inside the function body by default?',
              options: [
                'No, parameters are immutable let constants by default',
                'Yes, they can always be reassigned',
                'Only if they are numbers',
                'Only in release builds'
              ],
              correctAnswer: 0,
              explanation: 'Function parameters are immutable constants by default to prevent unexpected side effects.'
            }
          ]
        }
      },
      {
        id: 'func-syntax-labels',
        title: 'Syntax Anatomy: Argument Labels vs. Parameter Names',
        stepLabel: '2. Argument Labels',
        description: 'How to craft clean, expressive Swift API signatures following Apple Human Interface guidelines.',
        content: {
          codeSnippet: `// Argument label 'from', Parameter name 'origin'
// Argument label 'to', Parameter name 'destination'
func bookFlight(from origin: String, to destination: String) -> String {
    return "Flight booked from \\(origin) to \\(destination)."
}

// Call site reads like a fluent sentence:
let confirmation = bookFlight(from: "New York (JFK)", to: "London (LHR)")
print(confirmation)`,
          explanation: [
            '`from` and `to` are argument labels visible to callers.',
            '`origin` and `destination` are internal parameter names used within the function body.'
          ]
        }
      },
      {
        id: 'func-under-the-hood-inout',
        title: 'Under the Hood: inout and Copy-In Copy-Out',
        stepLabel: '3. inout Mechanics',
        description: 'How Swift mutates values in-place safely without unsafe C pointers.',
        content: {
          detailedTheory: [
            {
              title: 'Memory Safety with inout',
              paragraphs: [
                'When you pass a variable to an `inout` parameter using `&`, Swift enforces exclusive access to that variable (Law of Exclusivity), preventing race conditions and pointer aliasing.'
              ]
            }
          ],
          keyTakeaways: [
            'Argument labels make code self-documenting.',
            '`inout` enables in-place mutation using Copy-In Copy-Out.',
            'Default parameters keep APIs clean and extensible.'
          ]
        }
      },
      {
        id: 'func-errors-quiz',
        title: 'Common Function Errors & Knowledge Check',
        stepLabel: '4. Errors & Quiz',
        description: 'Avoid parameter mutation mistakes and check your understanding.',
        content: {
          checkpoints: [
            {
              question: 'What prefix must you include when passing an argument into an inout parameter?',
              options: [
                'Ampersand & (e.g. modifyValue(&myNumber))',
                'Asterisk *',
                'Hashtag #',
                'Dollar sign $'
              ],
              correctAnswer: 0,
              explanation: 'The ampersand & explicitly marks that the caller allows the function to mutate the variable in-place.'
            }
          ]
        }
      },
      {
        id: 'func-playground-lab',
        title: 'Xcode Playground Lab & Challenge',
        stepLabel: '5. Hands-on Lab & Challenge',
        description: 'Build a checkout invoice calculation utility and test greeting formatting.',
        content: {
          codeSnippet: `// ==========================================
// HANDS-ON LAB: INVOICE GENERATOR
// ==========================================

func generateInvoice(clientName: String, subtotal: Double, discountPercent: Double = 0.0) -> String {
    let discount = subtotal * (discountPercent / 100.0)
    let finalAmount = subtotal - discount
    
    return """
    === INVOICE ===
    Client: \\(clientName)
    Subtotal: $\\(subtotal)
    Discount: -$\\(discount) (\\(discountPercent)%)
    Total Due: $\\(finalAmount)
    """
}

let invoice = generateInvoice(clientName: "Acme Corp", subtotal: 500.0, discountPercent: 15.0)
print(invoice)`,
          explanation: [
            'Default parameters allow generating standard invoices without specifying discountPercent every time.'
          ],
          challenge: {
            task: 'Write a function `formatGreeting(name: String, title: String = "Engineer") -> String` that returns "Hello, Engineer Sarah!" when called with name "Sarah".',
            hint: 'Use return "Hello, \\(title) \\(name)!" with default title = "Engineer"',
            solution: `func formatGreeting(name: String, title: String = "Engineer") -> String {
    return "Hello, \\(title) \\(name)!"
}`
          }
        }
      }
    ]
  }
];
