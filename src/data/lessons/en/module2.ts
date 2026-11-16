import { Lesson } from '@/types';

export const module2LessonsEn: Lesson[] = [
  {
    id: 'swift-collections-arrays',
    module: 2,
    moduleTitle: 'Module 2: Collections and Algorithms',
    title: 'Arrays and Loops in Swift',
    description: 'Master ordered collections in Swift: zero-based indexing, append/insert/remove operations, safe access with .first/.last, for-in loops, and Copy-on-Write memory mechanics.',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'List',
    content: {
      realWorldContext: 'The Instagram feed, Apple Music tracks, or Amazon cart items are all ordered lists (Arrays). Incorrectly handling array indices is the leading cause of the dreaded "Index out of range" crash in mobile apps.',
      detailedTheory: [
        {
          title: 'Arrays Fundamentals',
          paragraphs: [
            'An Array in Swift is an ordered collection of elements of the same type, indexed starting at `0`.',
            'Arrays are Value Types: when you assign an array to a new variable, Swift uses Copy-on-Write (COW) to ensure memory is duplicated only when an actual mutation occurs.'
          ],
          callout: {
            type: 'warning',
            title: 'Index Out of Range!',
            text: 'Accessing an index that does not exist (such as `items[10]` when an array only has 3 items) triggers an immediate fatal crash. Always use safe properties like `.first`, `.last`, or check `indices.contains(index)`.'
          }
        }
      ],
      theory: [
        'Arrays are ordered, homogeneous collections indexed from 0.',
        'Accessing invalid indices causes an unrecoverable Fatal Error crash.',
        'for-in and enumerated() are standard tools for iteration.',
        'Copy-on-Write optimizes memory allocation during assignments.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Safe Access with for-in and Optional .first',
          code: `let tracks = ["Starlight", "Blinding Lights", "Levitating"]

// 1. Safe, idiomatic iteration
for (index, track) in tracks.enumerated() {
    print("\\(index + 1). \\(track)")
}

// 2. Safe optional access
if let currentTrack = tracks.first {
    print("Now playing: \\(currentTrack)")
}`,
          explanation: 'Properties like .first and .last return an Optional, returning nil gracefully if the array is empty instead of crashing.'
        },
        bad: {
          title: 'Hardcoded Direct Subscripting on Empty Arrays',
          code: `var tracks: [String] = []

// If array is empty -> FATAL CRASH: Index out of range
let current = tracks[0]
print(current)`,
          explanation: 'Accessing index [0] without verifying count crashes the app immediately.'
        }
      },
      codeSnippet: `// 1. Array declaration and manipulation
var cart: [String] = ["MacBook Pro", "AirPods Max"]

cart.append("iPhone 16 Pro") // Fast O(1) addition at the end
cart.insert("Apple Watch Ultra", at: 0) // Inserts at index 0, shifting elements O(N)

// 2. Safe removal
if !cart.isEmpty {
    let removedItem = cart.removeLast()
    print("Removed: \\(removedItem)")
}

// 3. Stride iteration
for i in stride(from: 0, to: 10, by: 2) {
    print("Counter: \\(i)") // 0, 2, 4, 6, 8
}`,
      explanation: [
        '`.append(item)` adds elements to the end in amortized O(1) time.',
        '`.insert(item, at: 0)` shifts all elements rightwards, taking O(N) time.',
        '`stride(from:to:by:)` allows custom step increments.'
      ],
      underTheHood: {
        title: 'How Copy-on-Write (COW) Works in Memory',
        points: [
          'When you create `var copy = originalArray`, Swift does not duplicate the underlying heap buffer immediately.',
          'Both variables share the exact same storage pointer in memory until one of them mutates a value (e.g. `copy.append(...)`).',
          'Only at the moment of mutation does Swift copy the data, saving massive amounts of RAM and CPU cycles.'
        ]
      },
      checkpoints: [
        {
          question: 'What is the index of the last element in an array with 5 items?',
          options: ['4', '5', '0', '1'],
          correctAnswer: 0,
          explanation: 'Because array indices start at 0, the last index of an N-element array is always N - 1 (5 - 1 = 4).'
        }
      ],
      keyTakeaways: [
        'Arrays are zero-indexed: first element is [0], last is [count - 1].',
        'Use `.isEmpty` instead of `.count == 0` for readability and speed.',
        'Copy-on-Write defers memory copying until actual mutation occurs.'
      ],
      commonMistakes: [
        'Using hardcoded indices like `items[0]` on potentially empty collections.',
        'Using `.insert(..., at: 0)` inside heavy loops, which causes repeated O(N) memory shifts.'
      ],
      challenge: {
        task: 'Write a function `safeGet(from array: [String], at index: Int) -> String?` that safely returns the item if the index exists, or nil if the index is out of bounds.',
        hint: 'Use array.indices.contains(index) or guard index >= 0 && index < array.count',
        solution: `func safeGet(from array: [String], at index: Int) -> String? {
    guard array.indices.contains(index) else {
        return nil
    }
    return array[index]
}`
      }
    },
    pages: [
      {
        id: 'arrays-intuition-zero-indexing',
        title: 'Intuition: Memory Offsets and Why Arrays Start at 0',
        stepLabel: '1. Intuition & Zero-Indexing',
        description: 'Understand how sequential memory works in iPhone hardware and why computer scientists count from zero.',
        content: {
          realWorldContext: 'When scrolling through TikTok or Spotify, the app doesn’t store every video in a separate variable. It lines them up in a continuous memory block called an Array.',
          detailedTheory: [
            {
              title: 'The Train Car Metaphor',
              paragraphs: [
                'Imagine a passenger train where cars are linked one after another in strict sequence.\n\nWhy is the first car car #0?\nBecause an array’s index represents a **Memory Offset (distance from the starting address)**:\n• The very first item sits right at the start of the memory block (0 steps offset).\n• The second item sits 1 step away from the start.\n• The third item sits 2 steps away.\n\nTherefore, an array of 3 items occupies offsets `[0]`, `[1]`, and `[2]`.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Why are array indices in Swift zero-based?',
              options: [
                'The index represents the memory offset distance from the start address',
                'It was chosen randomly in 1970',
                'Zero-based indexing uses less battery',
                'Because 1 is reserved for the compiler'
              ],
              correctAnswer: 0,
              explanation: 'Indices represent the byte offset multiplier from the memory base pointer (base + index * elementSize).'
            }
          ]
        }
      },
      {
        id: 'arrays-operations-crud',
        title: 'Operations Anatomy: append, insert, remove, and isEmpty',
        stepLabel: '2. Array Operations',
        description: 'Learn how to modify array contents efficiently and why .isEmpty beats .count == 0.',
        content: {
          codeSnippet: `var playlist = ["Midnight City", "Get Lucky"]

// Fast O(1) appending at the end
playlist.append("Starboy")

// Slow O(N) inserting at the front (shifts all elements right)
playlist.insert("Around the World", at: 0)

// Safe removal
if !playlist.isEmpty {
    let played = playlist.removeFirst()
    print("Finished track: \\(played)")
}`,
          explanation: [
            '`.append()` is amortized O(1) fast.',
            '`.isEmpty` checks if the collection contains at least one item without counting all elements.'
          ]
        }
      },
      {
        id: 'arrays-under-the-hood-cow',
        title: 'Under the Hood: Copy-on-Write (COW) and Buffer Allocation',
        stepLabel: '3. Memory & COW',
        description: 'How Swift achieves near-reference-type performance for value-type collections.',
        content: {
          detailedTheory: [
            {
              title: 'Copy-on-Write Magic',
              paragraphs: [
                'If you copy an array with 1,000,000 items (`var listB = listA`), Swift does not allocate another 8 megabytes of memory. Both variables point to the same shared heap storage buffer.',
                'Only when you call `listB.append(item)` does Swift detect multiple references and duplicate the buffer just-in-time!'
              ]
            }
          ],
          keyTakeaways: [
            'COW gives value types the speed of pointers with the safety of copies.',
            'Always verify bounds before accessing indices.',
            'Use `.first` and `.last` for safe optional element retrieval.'
          ]
        }
      },
      {
        id: 'arrays-errors-quiz',
        title: 'Common Array Errors in Xcode & Knowledge Check',
        stepLabel: '4. Errors & Quiz',
        description: 'Learn how to debug Index Out of Range crashes and test your array knowledge.',
        content: {
          checkpoints: [
            {
              question: 'Which method should you use to check if an array has items?',
              options: [
                'if !array.isEmpty',
                'if array.count > 0',
                'if array.first != nil',
                'if array.indices.count > 0'
              ],
              correctAnswer: 0,
              explanation: '!array.isEmpty is the most expressive, efficient, and idiomatic check in Swift.'
            }
          ]
        }
      },
      {
        id: 'arrays-playground-lab',
        title: 'Xcode Playground Lab & Challenge',
        stepLabel: '5. Hands-on Lab & Challenge',
        description: 'Build an e-commerce checkout shopping cart with discounts and safe element retrieval.',
        content: {
          codeSnippet: `// ==========================================
// HANDS-ON LAB: SHOPPING CART MANAGER
// ==========================================

var cartItems = ["AirPods Pro", "MagSafe Charger", "MacBook Air"]

func displayCartSummary() {
    print("=== YOUR CART (\\(cartItems.count) items) ===")
    for (idx, item) in cartItems.enumerated() {
        print("  \\(idx + 1). \\(item)")
    }
}

cartItems.append("USB-C Cable")
displayCartSummary()

if let nextItem = cartItems.first {
    print("Next to pack: \\(nextItem)")
}`,
          explanation: [
            'Enumerating arrays provides human-friendly 1-based display numbering while preserving 0-based programming indices.'
          ],
          challenge: {
            task: 'Write a function `safeGet(from array: [String], at index: Int) -> String?` that safely returns the item if the index exists, or nil if the index is out of bounds.',
            hint: 'Use array.indices.contains(index) or guard index >= 0 && index < array.count',
            solution: `func safeGet(from array: [String], at index: Int) -> String? {
    guard array.indices.contains(index) else {
        return nil
    }
    return array[index]
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-collections-dict-set',
    module: 2,
    moduleTitle: 'Module 2: Collections and Algorithms',
    title: 'Dictionaries and Sets: Key-Value Pairs and Hashable',
    description: 'Master fast O(1) lookups in Swift: key-value storage with Dictionary, unique deduplicated collections with Set, and the Hashable protocol.',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'Hash',
    content: {
      realWorldContext: 'When looking up a user profile by User ID among 10 million users, searching through an Array takes O(N) time (seconds of lag). Dictionaries and Sets use Hash Tables to find elements in instantaneous O(1) time (fractions of a microsecond).',
      detailedTheory: [
        {
          title: 'Dictionaries [Key: Value]',
          paragraphs: [
            'A Dictionary is an unordered collection of key-value pairs where every key must be unique and conform to the `Hashable` protocol.',
            'Accessing a dictionary via subscript `dict[key]` **ALWAYS** returns an Optional (`Value?`), because the key might not exist in the dictionary!'
          ]
        },
        {
          title: 'Sets: Fast Uniqueness',
          paragraphs: [
            'A `Set` is an unordered collection of unique elements. If you insert duplicate values into a Set, duplicates are automatically discarded.',
            'Sets support fast mathematical Venn-diagram operations: `union`, `intersection`, `subtracting`, and `isSubset`.'
          ]
        }
      ],
      theory: [
        'Dictionaries store key-value pairs; subscript access returns `Value?`.',
        'Sets store unordered, unique items conforming to `Hashable`.',
        'Hash tables provide near-instantaneous O(1) lookup times.',
        'Use default values in subscripting: `dict[key, default: fallback]`.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Fast O(1) Lookup with Dictionary or Set',
          code: `let userRoles: [String: String] = ["usr_1": "Admin", "usr_2": "Member"]

// Instant O(1) lookup:
if let role = userRoles["usr_1"] {
    print("User role: \\(role)")
}`,
          explanation: 'Hash tables jump directly to the memory bucket without scanning other elements.'
        },
        bad: {
          title: 'Slow O(N) Array Linear Scan',
          code: `let users = [User(id: "usr_1"), User(id: "usr_2")]

// Scans every single user sequentially from start to end!
let found = users.first(where: { $0.id == "usr_1" })`,
          explanation: 'Linear scanning gets slower with every new element added (10,000 checks for 10,000 items).'
        }
      },
      codeSnippet: `// 1. Dictionary with default fallback
var flightStatus: [String: String] = ["AA101": "On Time", "DL404": "Delayed"]

let status = flightStatus["UA990", default: "Scheduled"]
print("Flight UA990: \\(status)") // Scheduled

// 2. Set deduplication
let attendeeEmails: Set<String> = ["alex@apple.com", "sarah@google.com", "alex@apple.com"]
print("Unique attendees: \\(attendeeEmails.count)") // 2 (duplicate removed!)

// 3. Mathematical Set operations
let mobileDevs: Set<String> = ["Swift", "Kotlin", "Flutter"]
let webDevs: Set<String> = ["JavaScript", "TypeScript", "Kotlin"]

let commonSkills = mobileDevs.intersection(webDevs)
print("Shared skills: \\(commonSkills)") // ["Kotlin"]`,
      explanation: [
        '`flightStatus["UA990", default: ...]` safely returns the default without wrapping the result in an Optional.',
        '`attendeeEmails` automatically filters out duplicate entries.',
        '`.intersection()` extracts items present in both Sets in O(N) time.'
      ],
      underTheHood: {
        title: 'How Hash Tables Work',
        points: [
          'Swift runs each key through a high-performance SipHash algorithm to generate a 64-bit integer hash code.',
          'The hash code maps directly to an index bucket in an internal array, providing immediate O(1) lookup performance.'
        ]
      },
      checkpoints: [
        {
          question: 'Why does subscripting a dictionary with dict["key"] return an Optional?',
          options: [
            'Because the dictionary might not contain that key, returning nil instead of crashing',
            'Because dictionaries only store numbers',
            'Because keys are always encrypted',
            'It only returns an optional in debug mode'
          ],
          correctAnswer: 0,
          explanation: 'Dictionary subscripting returns Value? to safely handle absent keys without crashing.'
        }
      ],
      keyTakeaways: [
        'Use Dictionaries when you need key-value associations.',
        'Use Sets when uniqueness matters and duplicates must be discarded.',
        'Keys and Set elements must conform to the `Hashable` protocol.'
      ],
      commonMistakes: [
        'Forgetting that Dictionaries and Sets are completely unordered.',
        'Assuming a Dictionary subscript returns a non-optional value.'
      ],
      challenge: {
        task: 'Write a function `uniqueWordsCount(in sentence: String) -> Int` that splits a sentence by spaces and returns the number of unique words using a Set.',
        hint: 'Use sentence.split(separator: " ").map(String.init) and pass to Set(...)',
        solution: `func uniqueWordsCount(in sentence: String) -> Int {
    let words = sentence.split(separator: " ").map(String.init)
    let uniqueSet = Set(words)
    return uniqueSet.count
}`
      }
    },
    pages: [
      {
        id: 'dict-intuition-phonebook',
        title: 'Intuition: The Phonebook and the Unique VIP Club List',
        stepLabel: '1. Intuition & Hash Tables',
        description: 'Understand key-value indexing and set deduplication on real-life metaphors.',
        content: {
          realWorldContext: 'In an airport terminal, your flight number (e.g. "BA149") directly maps to a Departure Gate (e.g. "Gate B24"). That is a Dictionary.',
          detailedTheory: [
            {
              title: 'The Phonebook Metaphor',
              paragraphs: [
                'In an Array, you look up elements by arbitrary numeric position (`tracks[4]`).\nIn a **Dictionary**, you look up values by a meaningful identifier (`contacts["Sarah Connor"] -> "+1 555-0192"`).\n\nA **Set** is like a VIP guest club entrance list: your name can only appear once. If you arrive twice, the bouncer turns away the duplicate.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'What protocol must dictionary keys conform to in Swift?',
              options: [
                'Hashable',
                'Codable',
                'View',
                'Identifiable'
              ],
              correctAnswer: 0,
              explanation: 'Keys must conform to Hashable so Swift can compute an integer hash for fast bucket indexing.'
            }
          ]
        }
      },
      {
        id: 'dict-syntax-subscripts',
        title: 'Syntax Anatomy: Subscripts, Default Values, and Set Operations',
        stepLabel: '2. Syntax & Set Math',
        description: 'Learn modern subscripting tricks and Venn diagram operations.',
        content: {
          codeSnippet: `var userPreferences: [String: Bool] = [
    "notifications": true,
    "darkMode": false
]

// Update or insert
userPreferences["haptics"] = true

// Subscript with default
let autoPlay = userPreferences["autoPlay", default: true]
print("Auto-play: \\(autoPlay)")`,
          explanation: [
            'Using `default:` unwraps the result automatically, returning a non-optional `Bool`.'
          ]
        }
      },
      {
        id: 'dict-under-the-hood-hashable',
        title: 'Under the Hood: SipHash and Collision Resolution',
        stepLabel: '3. SipHash Mechanics',
        description: 'How Swift secures hash tables against Hash-DoS attacks using randomized seed keys.',
        content: {
          detailedTheory: [
            {
              title: 'Randomized Hash Seeds',
              paragraphs: [
                'Swift initializes a randomized 128-bit seed every time your app launches. This prevents malicious attackers from predicting hash collisions to freeze your app servers.'
              ]
            }
          ],
          keyTakeaways: [
            'Dictionaries offer O(1) key lookups.',
            'Sets offer O(1) membership testing (`set.contains(item)`).',
            'Order is never guaranteed in Dictionaries or Sets.'
          ]
        }
      },
      {
        id: 'dict-errors-quiz',
        title: 'Common Dictionary Errors & Knowledge Check',
        stepLabel: '4. Errors & Quiz',
        description: 'Avoid unwrap crashes and verify your understanding.',
        content: {
          checkpoints: [
            {
              question: 'What is the time complexity of set.contains(element)?',
              options: [
                'O(1) - Constant time lookup',
                'O(N) - Linear scan',
                'O(N^2) - Quadratic',
                'O(log N) - Logarithmic'
              ],
              correctAnswer: 0,
              explanation: 'Hash tables allow Set membership checks to complete in near-instantaneous O(1) time.'
            }
          ]
        }
      },
      {
        id: 'dict-playground-lab',
        title: 'Xcode Playground Lab & Challenge',
        stepLabel: '5. Hands-on Lab & Challenge',
        description: 'Build a server country code router and solve the unique word counter challenge.',
        content: {
          codeSnippet: `// ==========================================
// HANDS-ON LAB: REGIONAL ROUTER
// ==========================================

var regionGateways: [String: String] = [
    "US": "us-east-1.cloud.apple.com",
    "EU": "eu-central-1.cloud.apple.com",
    "JP": "ap-northeast-1.cloud.apple.com"
]

func resolveEndpoint(for countryCode: String) -> String {
    return regionGateways[countryCode, default: "global-edge.cloud.apple.com"]
}

print("Routing US: \\(resolveEndpoint(for: "US"))")
print("Routing BR: \\(resolveEndpoint(for: "BR")) // Falls back to default")`,
          explanation: [
            'Dictionaries provide instantaneous routing lookups with seamless fallbacks for missing keys.'
          ],
          challenge: {
            task: 'Write a function `uniqueWordsCount(in sentence: String) -> Int` that splits a sentence by spaces and returns the number of unique words using a Set.',
            hint: 'Use sentence.split(separator: " ").map(String.init) and pass to Set(...)',
            solution: `func uniqueWordsCount(in sentence: String) -> Int {
    let words = sentence.split(separator: " ").map(String.init)
    let uniqueSet = Set(words)
    return uniqueSet.count
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-closures-deep-dive',
    module: 2,
    moduleTitle: 'Module 2: Collections and Algorithms',
    title: 'Closures Deep Dive: Syntax, Escaping, and Capture Lists',
    description: 'Demystify closures in Swift: self-contained blocks of code, trailing closure syntax, capturing values, and preventing memory leaks with [weak self].',
    difficulty: 'Intermediate',
    estimatedMinutes: 24,
    icon: 'Sparkles',
    content: {
      realWorldContext: 'Closures power modern Swift: every SwiftUI button action (`Button("Tap") { ... }`), network completion handler, and array transformation uses closures.',
      detailedTheory: [
        {
          title: 'What is a Closure?',
          paragraphs: [
            'A closure is an anonymous, self-contained block of functionality that can be passed around and executed at a later time.',
            'Global and nested functions are actually special cases of closures!'
          ]
        },
        {
          title: 'Trailing Closure Syntax & Shorthand Arguments',
          paragraphs: [
            'When a closure is the final parameter of a function, Swift allows **Trailing Closure Syntax**: moving the closure outside the parentheses.\n\nSwift also provides shorthand argument names `$0`, `$1`, `$2` to eliminate redundant boilerplate.'
          ]
        }
      ],
      theory: [
        'Closures are reference types that capture values from outer scope.',
        'Trailing closure syntax cleans up call sites.',
        'Shorthand arguments `$0, $1` represent closure parameters in order.',
        'Use `[weak self]` in capture lists to prevent Retain Cycle memory leaks.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Concise Trailing Closure with Shorthand',
          code: `let numbers = [5, 2, 8, 1, 9]

// Idiomatic Swift:
let sorted = numbers.sorted { $0 < $1 }`,
          explanation: 'Trailing closure syntax and $0, $1 make functional transformations brief and elegant.'
        },
        bad: {
          title: 'Overly Verbose Closure Syntax',
          code: `let sorted = numbers.sorted(by: { (a: Int, b: Int) -> Bool in
    return a < b
})`,
          explanation: 'Redundant type annotations and nested parentheses add unnecessary visual noise.'
        }
      },
      codeSnippet: `// 1. Storing a closure in a variable
let greetUser: (String) -> String = { name in
    return "Hello, \\(name)! Welcome back."
}

print(greetUser("Alex"))

// 2. Trailing closure in action
func performCalculation(a: Int, b: Int, operation: (Int, Int) -> Int) -> Int {
    return operation(a, b)
}

let result = performCalculation(a: 10, b: 5) { $0 * $1 }
print("Result: \\(result)") // 50`,
      explanation: [
        '`(String) -> String` defines a closure type taking a String and returning a String.',
        '`performCalculation(a: 10, b: 5) { $0 * $1 }` demonstrates trailing closure syntax.'
      ],
      underTheHood: {
        title: 'How Closures Capture State in Heap Memory',
        points: [
          'When a closure references variables from its surrounding scope, Swift allocates a hidden box on the **Heap** to hold those variables.',
          'Because closures are Reference Types, multiple closures can share and mutate the same captured state.'
        ]
      },
      checkpoints: [
        {
          question: 'What do $0 and $1 represent inside an inline Swift closure?',
          options: [
            'Shorthand references to the closure’s first and second parameters',
            'Global system variables',
            'Hardware CPU registers',
            'Regular expressions'
          ],
          correctAnswer: 0,
          explanation: 'Swift automatically provides $0, $1, $2 as shorthand names for incoming closure arguments.'
        }
      ],
      keyTakeaways: [
        'Closures can be stored in variables and passed into functions as arguments.',
        'Trailing closure syntax makes SwiftUI layout code clean and expressive.',
        'Closures capture outer variables by reference, keeping them alive.'
      ],
      commonMistakes: [
        'Causing memory leaks by strongly capturing `self` in long-lived asynchronous closures.',
        'Writing explicit types inside closures when the compiler can easily infer them.'
      ],
      challenge: {
        task: 'Write a function `executeTwice(action: () -> Void)` that calls the passed closure twice.',
        hint: 'Call action() twice inside the body of executeTwice',
        solution: `func executeTwice(action: () -> Void) {
    action()
    action()
}`
      }
    },
    pages: [
      {
        id: 'closures-intuition-envelope',
        title: 'Intuition: The Recipe in a Sealed Envelope',
        stepLabel: '1. Intuition & Envelopes',
        description: 'Understand closures as self-contained executable packages of work.',
        content: {
          realWorldContext: 'When you tap a button in an iOS app, the button doesn’t execute its code immediately upon app launch. It holds onto your closure like a sealed envelope and opens it only when your finger taps the glass.',
          detailedTheory: [
            {
              title: 'The Recipe in an Envelope Metaphor',
              paragraphs: [
                'Imagine writing down a cooking recipe on an index card, sealing it in an envelope, and handing it to a friend: "Open this and cook dinner at 7:00 PM."\n\nThat envelope is a **Closure**. It carries both the instructions (code) and any spices it packed into the envelope from your kitchen (captured variables).'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Are closures in Swift Value Types or Reference Types?',
              options: [
                'Reference Types',
                'Value Types',
                'Primitives',
                'Global constants'
              ],
              correctAnswer: 0,
              explanation: 'Closures are Reference Types: assigning a closure to multiple variables points to the exact same execution block and captured state.'
            }
          ]
        }
      },
      {
        id: 'closures-syntax-trailing',
        title: 'Syntax Anatomy: From Verbose to Trailing Shorthand',
        stepLabel: '2. Syntax Evolution',
        description: 'Watch a closure evolve from 5 lines of boilerplate into 1 line of idiomatic Swift.',
        content: {
          codeSnippet: `let numbers = [10, 40, 20, 30]

// Stage 1: Full verbose syntax
let s1 = numbers.sorted(by: { (a: Int, b: Int) -> Bool in
    return a > b
})

// Stage 2: Inferred types
let s2 = numbers.sorted(by: { a, b in a > b })

// Stage 3: Shorthand arguments $0, $1
let s3 = numbers.sorted(by: { $0 > $1 })

// Stage 4: Trailing closure syntax
let s4 = numbers.sorted { $0 > $1 }

// Stage 5: Operator function as closure!
let s5 = numbers.sorted(by: >)`,
          explanation: [
            'Because operators like `>` are functions in Swift, `numbers.sorted(by: >)` is fully valid and lightning-fast!'
          ]
        }
      },
      {
        id: 'closures-under-the-hood-capturing',
        title: 'Under the Hood: Capture Semantics and Escaping Closures',
        stepLabel: '3. Capture Semantics',
        description: 'How closures capture variables and why @escaping is required for async completion blocks.',
        content: {
          detailedTheory: [
            {
              title: 'What does @escaping mean?',
              paragraphs: [
                'If a closure is stored in an external property or executed asynchronously after the parent function returns (e.g. after a network request finishes), it **escapes** the function’s lifetime.\n\nSwift requires you to mark such parameters as `@escaping` to warn you about potential memory retention.'
              ]
            }
          ],
          keyTakeaways: [
            'Trailing closure syntax makes SwiftUI View code clean.',
            '@escaping marks closures that outlive their parent function call.',
            'Always consider memory ownership when capturing `self`.'
          ]
        }
      },
      {
        id: 'closures-errors-quiz',
        title: 'Common Closure Errors & Knowledge Check',
        stepLabel: '4. Errors & Quiz',
        description: 'Avoid closure retain cycles and test your knowledge.',
        content: {
          checkpoints: [
            {
              question: 'When is a closure parameter required to be marked @escaping?',
              options: [
                'When the closure is stored in a property or executed asynchronously after the function returns',
                'Whenever a closure takes more than 2 parameters',
                'Whenever a closure returns an Int',
                'All closures must be marked @escaping'
              ],
              correctAnswer: 0,
              explanation: '@escaping informs the compiler that the closure outlives the execution scope of the function that received it.'
            }
          ]
        }
      },
      {
        id: 'closures-playground-lab',
        title: 'Xcode Playground Lab & Challenge',
        stepLabel: '5. Hands-on Lab & Challenge',
        description: 'Build a delayed task scheduler and solve the execution challenge.',
        content: {
          codeSnippet: `// ==========================================
// HANDS-ON LAB: TASK SCHEDULER
// ==========================================

func performAsyncSimulation(taskName: String, completion: @escaping (String) -> Void) {
    print("Initiating \\(taskName)...")
    // Simulate background work
    completion("Task [\\(taskName)] finished successfully.")
}

performAsyncSimulation(taskName: "Database Backup") { resultMessage in
    print("CALLBACK: \\(resultMessage)")
}`,
          explanation: [
            '`@escaping (String) -> Void` allows asynchronous dispatch and callbacks.'
          ],
          challenge: {
            task: 'Write a function `executeTwice(action: () -> Void)` that calls the passed closure twice.',
            hint: 'Call action() twice inside the body of executeTwice',
            solution: `func executeTwice(action: () -> Void) {
    action()
    action()
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-functional-methods',
    module: 2,
    moduleTitle: 'Module 2: Collections and Algorithms',
    title: 'Functional Methods: map, filter, reduce, and compactMap',
    description: 'Transform collections like a Senior iOS Engineer: replace clunky for-in loops with declarative functional chains: map, filter, reduce, and compactMap.',
    difficulty: 'Intermediate',
    estimatedMinutes: 24,
    icon: 'TrendingUp',
    content: {
      realWorldContext: 'Filtering out completed tasks, calculating total shopping cart values, or extracting non-nil avatar URLs: top iOS engineering teams write declarative functional pipelines instead of manual loops.',
      detailedTheory: [
        {
          title: 'The Big Four Functional Transforms',
          paragraphs: [
            '1. `map`: Transforms every item in a collection into a new representation (`[1, 2, 3]` -> `[2, 4, 6]`).\n2. `filter`: Selects only elements matching a boolean predicate (`[1, 2, 3]` -> `[2]`).\n3. `reduce`: Combines all elements into a single aggregate value (e.g. sum or total price).\n4. `compactMap`: Transforms items and automatically unwraps optionals, discarding all `nil` results!'
          ]
        }
      ],
      theory: [
        'map transforms elements 1-to-1.',
        'filter retains elements that return true.',
        'reduce accumulates values starting from an initial seed.',
        'compactMap strips out nil values automatically.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Clean Functional Pipeline',
          code: `let prices = [29.99, 14.50, 99.00, 5.00]

// Expressive, declarative, zero intermediate mutable state
let total = prices
    .filter { $0 >= 10.0 }
    .reduce(0.0, +)

print("Filtered total: $\\(total)")`,
          explanation: 'Clear intent, immutable constants, and impossible to introduce index-off-by-one errors.'
        },
        bad: {
          title: 'Imperative for-in Loop with Mutable State',
          code: `let prices = [29.99, 14.50, 99.00, 5.00]
var total = 0.0

for p in prices {
    if p >= 10.0 {
        total += p
    }
}`,
          explanation: 'Requires mutable var, manual accumulation, and more cognitive load to read.'
        }
      },
      codeSnippet: `let rawInputs = ["10", "apple", "25", "40", "banana"]

// 1. compactMap safely parses integers, discarding invalid non-numbers
let validNumbers: [Int] = rawInputs.compactMap { Int($0) }
print("Parsed numbers: \\(validNumbers)") // [10, 25, 40]

// 2. map: apply tax multiplier
let taxed = validNumbers.map { Double($0) * 1.08 }

// 3. reduce: compute grand total
let grandTotal = taxed.reduce(0.0, +)
print("Grand Total: $\\(grandTotal)")`,
      explanation: [
        '`Int($0)` returns an optional `Int?`. `compactMap` automatically strips out all `nil` failures.',
        '`reduce(0.0, +)` is shorthand for `reduce(0.0) { $0 + $1 }`.'
      ],
      underTheHood: {
        title: 'Compiler Inlining for Higher-Order Functions',
        points: [
          'The Swift compiler inlines `map` and `filter` closures directly into assembly loops.',
          'There is zero function call overhead compared to manual for-in loops in release mode.'
        ]
      },
      checkpoints: [
        {
          question: 'What is the primary difference between map and compactMap?',
          options: [
            'compactMap automatically filters out all nil results and unwraps optionals',
            'map is only for numbers',
            'compactMap is deprecated',
            'compactMap sorts elements alphabetically'
          ],
          correctAnswer: 0,
          explanation: 'compactMap unwraps optional returns and discards nil values from the resulting array.'
        }
      ],
      keyTakeaways: [
        'Use `map` for 1-to-1 transformations.',
        'Use `filter` to prune unwanted elements.',
        'Use `reduce` to condense arrays into a single value.',
        'Use `compactMap` to safely unwrap and filter optionals.'
      ],
      commonMistakes: [
        'Chaining 5 separate functional calls on massive arrays when a single pass or LazySequence would be more efficient.',
        'Using `map` when `compactMap` is needed, resulting in an array of optionals `[T?]`.'
      ],
      challenge: {
        task: 'Given an array of integers `[1, 2, 3, 4, 5, 6]`, filter out all odd numbers and calculate the sum of the remaining even numbers using filter and reduce.',
        hint: 'Use numbers.filter { $0 % 2 == 0 }.reduce(0, +)',
        solution: `let numbers = [1, 2, 3, 4, 5, 6]
let evenSum = numbers.filter { $0 % 2 == 0 }.reduce(0, +)
print(evenSum) // 12 (2 + 4 + 6)`
      }
    },
    pages: [
      {
        id: 'func-methods-intuition-pipeline',
        title: 'Intuition: The Industrial Conveyor Belt Pipeline',
        stepLabel: '1. Intuition & Pipelines',
        description: 'Understand higher-order functions as specialized robotic stations on a manufacturing line.',
        content: {
          realWorldContext: 'In an e-commerce checkout flow, you take a list of products, filter out out-of-stock items, apply a 20% Black Friday coupon, and sum up the total. That is a functional pipeline.',
          detailedTheory: [
            {
              title: 'The Manufacturing Pipeline Metaphor',
              paragraphs: [
                'Imagine raw products moving on a factory conveyor belt:\n• **Filter Station**: Discards damaged products that fail inspection.\n• **Map Station**: Paints every surviving product metallic silver.\n• **Reduce Station**: Weighs all finished products together and prints the total shipping weight on a box.\n\nEach station does one job cleanly without modifying items outside its station.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Which method reduces an array of numbers [1, 2, 3] into the single number 6?',
              options: [
                'reduce',
                'map',
                'filter',
                'forEach'
              ],
              correctAnswer: 0,
              explanation: 'reduce combines all elements into a single aggregate result.'
            }
          ]
        }
      },
      {
        id: 'func-methods-syntax-compactmap',
        title: 'Syntax Anatomy: flatMap vs. compactMap and Method Chaining',
        stepLabel: '2. compactMap Syntax',
        description: 'How to clean up optional data and flatten nested arrays in one clean line.',
        content: {
          codeSnippet: `let surveyRatings = ["5", "3", "N/A", "4", "invalid", "5"]

// Discards "N/A" and "invalid" automatically!
let cleanRatings: [Int] = surveyRatings.compactMap { Int($0) }
print("Clean ratings: \\(cleanRatings)") // [5, 3, 4, 5]

let average = Double(cleanRatings.reduce(0, +)) / Double(cleanRatings.count)
print("Average rating: \\(average)") // 4.25`,
          explanation: [
            '`compactMap` eliminates manual nil-checking loops.'
          ]
        }
      },
      {
        id: 'func-methods-under-the-hood-lazy',
        title: 'Under the Hood: Lazy Collections and Memory Allocations',
        stepLabel: '3. Lazy Sequences',
        description: 'How to avoid allocating temporary arrays when chaining multiple operations on large collections.',
        content: {
          detailedTheory: [
            {
              title: 'The Power of .lazy',
              paragraphs: [
                'When you chain `array.map(...).filter(...)`, Swift normally creates an intermediate array in memory after each step.\n\nAdding `.lazy` (`array.lazy.map(...).filter(...)`) defers computation until elements are accessed, skipping intermediate memory allocations completely!'
              ]
            }
          ],
          keyTakeaways: [
            'Functional pipelines eliminate intermediate mutable `var` state.',
            '`compactMap` is the safest way to convert strings to numbers.',
            'Use `.lazy` for large collections to avoid intermediate arrays.'
          ]
        }
      },
      {
        id: 'func-methods-errors-quiz',
        title: 'Common Functional Errors & Knowledge Check',
        stepLabel: '4. Errors & Quiz',
        description: 'Avoid accidental [T?] optional arrays and test your skills.',
        content: {
          checkpoints: [
            {
              question: 'What does ["1", "two", "3"].map { Int($0) } return?',
              options: [
                '[Optional(1), nil, Optional(3)] of type [Int?]',
                '[1, 3] of type [Int]',
                'Fatal crash',
                'Empty array'
              ],
              correctAnswer: 0,
              explanation: 'Standard map retains nil values, yielding an array of optionals [Int?]. Use compactMap to get [Int]!'
            }
          ]
        }
      },
      {
        id: 'func-methods-playground-lab',
        title: 'Xcode Playground Lab & Challenge',
        stepLabel: '5. Hands-on Lab & Challenge',
        description: 'Build a financial transaction analytics pipeline and solve the even sum challenge.',
        content: {
          codeSnippet: `// ==========================================
// HANDS-ON LAB: FINANCIAL ANALYTICS
// ==========================================

struct BankTransaction {
    let title: String
    let amountUSD: Double
    let isBusinessExpense: Bool
}

let transactions = [
    BankTransaction(title: "Office Monitor", amountUSD: 350.0, isBusinessExpense: true),
    BankTransaction(title: "Coffee", amountUSD: 4.75, isBusinessExpense: false),
    BankTransaction(title: "AWS Cloud Hosting", amountUSD: 240.0, isBusinessExpense: true),
    BankTransaction(title: "Lunch", amountUSD: 18.50, isBusinessExpense: false)
]

// Pipeline: Calculate total deductible business expenses
let deductibleTotal = transactions
    .filter { $0.isBusinessExpense }
    .map { $0.amountUSD }
    .reduce(0.0, +)

print("Tax Deductible Expenses Total: $\\(deductibleTotal)") // $590.0`,
          explanation: [
            'Declarative functional pipelines transform raw models into business insights with zero mutable state.'
          ],
          challenge: {
            task: 'Given an array of integers `[1, 2, 3, 4, 5, 6]`, filter out all odd numbers and calculate the sum of the remaining even numbers using filter and reduce.',
            hint: 'Use numbers.filter { $0 % 2 == 0 }.reduce(0, +)',
            solution: `let numbers = [1, 2, 3, 4, 5, 6]
let evenSum = numbers.filter { $0 % 2 == 0 }.reduce(0, +)
print(evenSum) // 12 (2 + 4 + 6)`
          }
        }
      }
    ]
  }
];
