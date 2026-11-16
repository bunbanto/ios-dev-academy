import { Lesson } from '@/types';

export const module4LessonsEn: Lesson[] = [
  {
    id: 'swiftui-intro-declarative',
    module: 4,
    moduleTitle: 'Module 4: SwiftUI Fundamentals & Layout',
    title: 'Declarative UI: SwiftUI Philosophy and the View Protocol',
    description: 'Master the foundational mindset shift of modern iOS: declarative UI, UI = f(State), the View protocol, and the opaque return type some View.',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'Layout',
    content: {
      realWorldContext: 'For over a decade, iOS developers built interfaces imperatively with UIKit, manually calculating frames, managing AutoLayout constraints, and mutating UI elements step-by-step. In 2019, Apple introduced SwiftUI, moving iOS development to the declarative paradigm where you describe WHAT the UI should look like for a given state, and SwiftUI handles all mutations automatically.',
      detailedTheory: [
        {
          title: 'Imperative vs. Declarative Paradigm',
          paragraphs: [
            'In the imperative UIKit model, you tell the computer HOW to draw: "Create a button, set its origin to (20, 100), change its title to \'Loading\', disable user interaction, and start an activity spinner."',
            'In the declarative SwiftUI model, you declare WHAT the screen should display: "If isLoading is true, show a ProgressView; otherwise, show the Submit button." When state changes, SwiftUI diffs the hierarchy and updates only the pixels that changed.',
          ]
        },
        {
          title: 'The View Protocol & some View',
          paragraphs: [
            'In SwiftUI, every user interface component conforms to the `View` protocol, requiring a single computed property: `var body: some View { get }`.',
            'The keyword `some` signifies an **Opaque Return Type**. It tells the Swift compiler: "This property returns a specific concrete type conforming to View, but clients do not need to know the complex internal generic type hierarchy."'
          ]
        },
        {
          title: 'Why SwiftUI Views are Structs, Not Classes',
          paragraphs: [
            'In UIKit, `UIView` was a heavy class with hundreds of stored properties, layout caches, and Objective-C runtime overhead.',
            'SwiftUI Views are lightweight structs that allocate almost zero heap memory. They are not physical screens; they are disposable blueprints created and destroyed in microseconds.',
          ]
        }
      ],
      theory: [
        'SwiftUI is Declarative: UI = f(State).',
        'Views are lightweight structs, not heavy classes.',
        '`some View` uses opaque return types for fast compile-time optimization.',
        'The body property must be a pure function with no side effects.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Declarative SwiftUI (Clean, State-Driven)',
          code: `struct StatusBadgeView: View {
    let isOnline: Bool
    
    var body: some View {
        HStack {
            Circle()
                .fill(isOnline ? Color.green : Color.gray)
                .frame(width: 10, height: 10)
            
            Text(isOnline ? "Active Now" : "Offline")
                .font(.subheadline)
        }
    }
}`,
          explanation: 'The interface is derived purely from the isOnline boolean. When isOnline flips, SwiftUI automatically re-renders the badge.',
        },
        bad: {
          title: 'Imperative UIKit (Manual Frame & State Mutation)',
          code: `// Imperative UIKit approach
class StatusBadgeViewController: UIViewController {
    let circleView = UIView()
    let statusLabel = UILabel()
    
    func updateStatus(isOnline: Bool) {
        // Manual mutation error-prone steps
        circleView.backgroundColor = isOnline ? .green : .gray
        statusLabel.text = isOnline ? "Active Now" : "Offline"
        // Easy to forget one of the elements!
    }
}`,
          explanation: 'Requires manually updating every individual view component whenever state changes, leading to out-of-sync visual glitches.',
        }
      },
      codeSnippet: `import SwiftUI

// 1. Defining a declarative View struct
struct GreetingCardView: View {
    let username: String
    let unreadMessagesCount: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Welcome back, \\(username)!")
                .font(.title2)
                .fontWeight(.bold)
            
            if unreadMessagesCount > 0 {
                Text("You have \\(unreadMessagesCount) new messages")
                    .font(.subheadline)
                    .foregroundStyle(.blue)
            } else {
                Text("All caught up!")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 4)
    }
}`,
      explanation: [
        'GreetingCardView conforms to the View protocol and defines its hierarchy in var body.',
        'Conditional rendering (if / else) is powered by the @ViewBuilder result builder under the hood.',
        'Modifiers like .padding() and .cornerRadius() wrap the view and return modified view containers.',
      ],
      underTheHood: {
        title: 'How SwiftUI Computes UI Updates (The Diffing Engine)',
        points: [
          'SwiftUI maintains two representations: the lightweight View struct hierarchy and the underlying render graph (AttributeGraph).',
          'When state changes, SwiftUI invokes `var body`, produces a new lightweight struct tree, diffs it against the previous snapshot, and issues minimal draw calls only for differences.',
        ]
      },
      checkpoints: [
        {
          question: 'What does the mathematical formula "UI = f(State)" mean in SwiftUI?',
          options: [
            'The user interface is a pure function of the underlying application state',
            'You must write mathematical formulas to layout UI frames',
            'SwiftUI only supports scientific calculation apps',
            'UI rendering is delegated to an external Python server'
          ],
          correctAnswer: 0,
          explanation: 'In declarative UI, the screen at any moment is a direct reflection of current state data.',
        }
      ],
      keyTakeaways: [
        'SwiftUI views are declarative blueprints, not permanent heap objects.',
        'The body computed property must return some View.',
        'Never trigger side effects (network calls, file writes) inside var body.',
      ],
      commonMistakes: [
        'Trying to mutate variables or make async network calls inside var body.',
        'Creating views as classes instead of structs.',
      ],
      challenge: {
        task: 'Create a `NotificationBannerView` struct conforming to `View` with property `message: String`. In body, display an HStack with an Image(systemName: "bell.fill") and Text(message).',
        hint: 'Use HStack { Image(systemName: "bell.fill"); Text(message) }',
        solution: `struct NotificationBannerView: View {
    let message: String
    
    var body: some View {
        HStack {
            Image(systemName: "bell.fill")
                .foregroundColor(.yellow)
            Text(message)
                .font(.headline)
        }
        .padding()
    }
}`
      }
    },
    pages: [
      {
        id: 'swiftui-intro-intuition',
        title: 'Intuition: Declarative UI and the UI = f(State) Formula',
        stepLabel: '1. Intuition & Declarative UI',
        description: 'Understand the declarative paradigm shift using the restaurant ordering analogy.',
        content: {
          realWorldContext: 'Think of ordering food at a restaurant. You tell the waiter: "I would like a medium-rare steak with mashed potatoes." You do not enter the kitchen, ignite the stove, set the timer to 4 minutes, and plate the steak. You declare what you want, and the kitchen handles execution.',
          detailedTheory: [
            {
              title: 'Analogy: Restaurant Order vs. Kitchen Cooking',
              paragraphs: [
                '**Imperative Programming (UIKit)** is like stepping into the kitchen and cooking every step yourself: peel potatoes, salt water, turn stove to 350°F. If you forget to turn off the flame, dinner burns.',
                '**Declarative Programming (SwiftUI)** is ordering from the menu: "Show a title, an image, and a button." If the data says the user is logged out, the menu changes to a login button automatically.',
              ]
            },
            {
              title: 'The Golden Formula: UI = f(State)',
              paragraphs: [
                'In SwiftUI, you never directly write code to add or remove views from a screen.',
                'Instead, you modify the State (a variable like `isLoggedIn = true`), and the UI recalculates itself as a pure function of that state: `UI = f(State)`.',
              ],
              callout: {
                type: 'info',
                title: 'The 2019 Revolution',
                text: 'Before SwiftUI, 50% of iOS development time was spent debugging AutoLayout constraint conflicts and keeping UI views synchronized with backend data.',
              }
            }
          ],
          codeSnippet: `// The UI is a pure reflection of state
struct BatteryStatusView: View {
    let batteryPercentage: Int
    
    var body: some View {
        HStack {
            Image(systemName: batteryPercentage < 20 ? "battery.25" : "battery.100")
                .foregroundColor(batteryPercentage < 20 ? .red : .green)
            
            Text("\\(batteryPercentage)%")
                .font(.headline)
        }
    }
}`,
          checkpoints: [
            {
              question: 'In SwiftUI, how do you change the text displayed on the screen?',
              options: [
                'By updating the state variable that the Text view reads',
                'By calling label.setText("new text") directly on the component',
                'By restarting the app',
                'By sending an HTTP request'
              ],
              correctAnswer: 0,
              explanation: 'You never mutate UI views directly in SwiftUI; you update state, and SwiftUI re-renders the body automatically.',
            }
          ]
        }
      },
      {
        id: 'swiftui-intro-protocol-some-view',
        title: 'SwiftUI Anatomy: The View Protocol and some View',
        stepLabel: '2. View Protocol & some View',
        description: 'Explore why SwiftUI views are structs and decode the mystery of the some View keyword.',
        content: {
          realWorldContext: 'When you create a new SwiftUI file in Xcode, the template presents: `struct ContentView: View { var body: some View { ... } }`. Understanding every keyword here is essential.',
          detailedTheory: [
            {
              title: 'Why SwiftUI Views are Structs, Not Classes',
              paragraphs: [
                'In UIKit, every `UIView` was an Objective-C class allocating hundreds of bytes on the Heap with retain counting and delegate tables.',
                'SwiftUI Views are simple structs allocated on the Stack. Creating 10,000 SwiftUI view structs takes less than 1 millisecond and costs virtually zero memory!'
              ]
            },
            {
              title: 'The Secret of the "some View" Keyword',
              paragraphs: [
                'If you look at what a complex view body actually returns, it is a monstrous nested generic type like `ModifiedContent<VStack<TupleView<(Text, Button<Text>)>>, _PaddingLayout>`.',
                'Writing that type by hand would be impossible. The `some View` keyword (Opaque Return Type) tells the compiler: "Trust me, this returns a concrete type that conforms to View, figure out the exact generic type yourself at compile time."'
              ]
            }
          ],
          codeSnippet: `import SwiftUI

struct ProfileBadge: View {
    let name: String
    let role: String
    
    // body returns 'some View'
    var body: some View {
        VStack(alignment: .leading) {
            Text(name)
                .font(.headline)
            Text(role)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}`,
          checkpoints: [
            {
              question: 'What is the purpose of the "some" keyword before View?',
              options: [
                'It hides complex nested generic return types while preserving compile-time type safety',
                'It makes the view run asynchronously on a background thread',
                'It marks the view as optional (can be nil)',
                'It enables dark mode support'
              ],
              correctAnswer: 0,
              explanation: 'some View represents an opaque return type: a specific concrete View type that the compiler optimizes without exposing verbose generics.',
            }
          ]
        }
      },
      {
        id: 'swiftui-intro-diffing-tree',
        title: 'Under the Hood: The View Tree and Diffing Engine',
        stepLabel: '3. View Tree & Diffing',
        description: 'Discover how SwiftUI renders 60-120 FPS animations by diffing structural view trees.',
        content: {
          realWorldContext: 'When an iOS screen stutters during scrolling or animation, it is usually because the app is doing heavy computations inside the draw cycle. Understanding how SwiftUI diffs views keeps your apps silky smooth.',
          detailedTheory: [
            {
              title: 'How the Diffing Engine Works',
              paragraphs: [
                '1. When a state variable changes, SwiftUI calls the `body` property of the affected view.',
                '2. It builds a lightweight new struct tree in RAM.',
                '3. The **AttributeGraph** diffing engine compares the old struct tree with the new struct tree.',
                '4. Only the exact attributes that changed (e.g. text string or fill color) are sent to CoreAnimation/Metal on the GPU.',
              ]
            },
            {
              title: 'The Purity Rule of var body',
              paragraphs: [
                'Because SwiftUI can call `var body` dozens of times per second during gesture tracking or animation, `var body` must be a **pure function**.',
                'Never perform network requests, file I/O, or heavy calculations inside `var body`!'
              ]
            }
          ],
          codeSnippet: `struct CleanView: View {
    let price: Double
    let formattedPrice: String // Computed beforehand, not in body!
    
    var body: some View {
        Text(formattedPrice)
            .font(.title)
    }
}`,
          checkpoints: [
            {
              question: 'Why should you never make network requests inside var body?',
              options: [
                'Because body can be re-evaluated dozens of times per second during UI animations',
                'Because body cannot run on iOS devices',
                'Because Apple blocks network calls in structs',
                'Because body only executes once when the phone boots'
              ],
              correctAnswer: 0,
              explanation: 'var body must be fast and side-effect free because SwiftUI calls it repeatedly during layout passes and animations.',
            }
          ]
        }
      },
      {
        id: 'swiftui-intro-errors-quiz',
        title: 'Common SwiftUI Errors in Xcode & Knowledge Check',
        stepLabel: '4. Diagnostics & Quiz',
        description: 'Troubleshoot top beginner SwiftUI compilation errors in Xcode.',
        content: {
          realWorldContext: 'When starting with SwiftUI, cryptic Xcode error messages can feel intimidating. Learning what they mean will boost your confidence.',
          detailedTheory: [
            {
              title: 'Top Beginner SwiftUI Errors',
              paragraphs: [
                '1. **Type \'()\' cannot conform to \'View\'**:\nYou wrote a statement (like `print("hi")` or `let x = 5`) directly inside `var body` without wrapping it in an action closure.\n*Fix*: Only place View expressions inside body, or use `.onAppear { print("hi") }`.',
                '2. **Function declares an opaque return type \'some View\', but has no return statements in its body**:\nYour `var body` is empty or all conditional branches are commented out.\n*Fix*: Ensure at least one view element is returned.',
                '3. **The compiler is unable to type-check this expression in reasonable time**:\nYour view body is too complex with deeply nested views.\n*Fix*: Extract subviews into separate smaller structs.',
              ]
            }
          ],
          codeSnippet: `struct ErrorDemoView: View {
    var body: some View {
        VStack {
            // ❌ Error: print() returns Void (), which is not a View!
            // print("Loading view")
            
            Text("Hello, World!")
        }
        .onAppear {
            // ✅ Fix: Place imperative code inside lifecycle hooks
            print("View appeared successfully")
        }
    }
}`,
          checkpoints: [
            {
              question: 'How do you execute imperative code (like print) when a SwiftUI view appears?',
              options: [
                'Use the .onAppear { ... } modifier',
                'Write the code directly in var body',
                'Put it inside a Text view',
                'Call it in the struct destructor'
              ],
              correctAnswer: 0,
              explanation: 'The .onAppear modifier executes an action closure when the view is added to the screen hierarchy.',
            }
          ]
        }
      },
      {
        id: 'swiftui-intro-playground-lab',
        title: 'Xcode Playground Lab: UserProfileCardView Challenge',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a production-quality social profile card component with avatars, badges, and layout stacks.',
        content: {
          realWorldContext: 'In this lab, you will build the social profile card seen in apps like Twitter/X, Instagram, and LinkedIn.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Build a `UserProfileCardView` component that takes a `name: String`, `bio: String`, and `isVerified: Bool`. It should display a verification checkmark if verified.',
              ]
            }
          ],
          codeSnippet: `struct UserProfileCardView: View {
    let name: String
    let bio: String
    let isVerified: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(name)
                    .font(.headline)
                    .fontWeight(.bold)
                
                if isVerified {
                    Image(systemName: "checkmark.seal.fill")
                        .foregroundColor(.blue)
                }
            }
            
            Text(bio)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }
}`,
          checkpoints: [
            {
              question: 'What SwiftUI view component aligns its children horizontally?',
              options: [
                'HStack',
                'VStack',
                'ZStack',
                'List'
              ],
              correctAnswer: 0,
              explanation: 'HStack (Horizontal Stack) arranges its child views side-by-side in a horizontal line.',
            }
          ],
          challenge: {
            task: 'Create a `StatusBadgeView` with `let status: String` and `let isActive: Bool`. Display a green Circle if active, gray if inactive, next to the status Text in an HStack.',
            hint: 'Use Circle().fill(isActive ? Color.green : Color.gray).frame(width: 8, height: 8)',
            solution: `struct StatusBadgeView: View {
    let status: String
    let isActive: Bool
    
    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(isActive ? Color.green : Color.gray)
                .frame(width: 8, height: 8)
            Text(status)
                .font(.caption)
        }
    }
}`
          }
        }
      }
    ]
  },
  {
    id: 'swiftui-layout-stacks',
    module: 4,
    moduleTitle: 'Module 4: SwiftUI Fundamentals & Layout',
    title: 'Layout System: VStack, HStack, ZStack, and Spacer',
    description: 'Master the 3 fundamental layout containers of SwiftUI: vertical VStack, horizontal HStack, layered ZStack, and the dynamic Spacer spring.',
    difficulty: 'Beginner',
    estimatedMinutes: 22,
    icon: 'Layers',
    content: {
      realWorldContext: 'Every modern iOS interface — from an Amazon product card to an Apple Wallet boarding pass — is a composition of nested layout stacks. Mastering how stacks negotiate layout space with Spacer springs allows you to build any Figma design with precision.',
      detailedTheory: [
        {
          title: 'The Trinity of Layout Containers',
          paragraphs: [
            '1. `VStack (Vertical Stack)`: Positions child views in a vertical column top-to-bottom.',
            '2. `HStack (Horizontal Stack)`: Positions child views in a horizontal row leading-to-trailing.',
            '3. `ZStack (Zero-depth Stack)`: Layers child views on top of each other along the Z-axis (e.g. background cards, badges over images).',
          ]
        },
        {
          title: 'The Magic of Spacer() and Alignment',
          paragraphs: [
            '`Spacer()` is an expanding flexible view that behaves like a compressed physical spring: it expands to consume all available free space along the major axis of its containing stack, pushing sibling views outward to the screen boundaries.',
            'The `spacing` parameter controls the gap between adjacent child views, defaulting to system guidelines (8-10 points).',
          ]
        }
      ],
      theory: [
        'VStack positions children vertically.',
        'HStack positions children horizontally.',
        'ZStack layers children along the depth axis.',
        'Spacer() acts as a spring, consuming remaining space.',
        'Alignment pins content to leading, center, or trailing edges.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Adaptive Layout with Stacks and Spacer',
          code: `HStack {
    VStack(alignment: .leading) {
        Text("Pro Subscription").font(.headline)
        Text("$9.99/mo").font(.subheadline).foregroundStyle(.secondary)
    }
    
    Spacer() // Pushes button to trailing edge
    
    Button("Upgrade") {}
        .buttonStyle(.borderedProminent)
}
.padding()`,
          explanation: 'Adapts seamlessly to all iPhone screen sizes: small iPhone SE up to large iPhone 16 Pro Max.',
        },
        bad: {
          title: 'Hardcoded Pixel Offsets',
          code: `HStack {
    Text("Pro Subscription")
    Text("Upgrade")
        .offset(x: 180) // Hardcoded 180pt offset!
} // Breaks completely on different screen widths!`,
          explanation: 'Hardcoded offsets break on different screen sizes and accessibility dynamic type sizes.',
        }
      },
      codeSnippet: `// Composing Stacks for an iOS Card Component
struct SubscriptionCard: View {
    var body: some View {
        ZStack {
            // Layer 1: Rounded card background
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.secondarySystemBackground))
                .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
            
            // Layer 2: Foreground content
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text("PREMIUM")
                        .font(.caption)
                        .fontWeight(.heavy)
                        .foregroundStyle(.purple)
                    
                    Spacer()
                    
                    Image(systemName: "star.fill")
                        .foregroundStyle(.yellow)
                }
                
                Text("$19.99 / month")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Text("Unlock unlimited access to all courses and projects.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
            .padding(20)
        }
        .frame(height: 140)
        .padding(.horizontal)
    }
}`,
      explanation: [
        'ZStack layers the background rectangle behind the text content.',
        'VStack organizes the card header, price, and description vertically.',
        'HStack with Spacer pushes the badge to the left and the star icon to the far right.',
      ],
      underTheHood: {
        title: 'The 3 Layout Rules of SwiftUI',
        points: [
          '1. **Parent Proposes a Size**: The parent container offers a size proposal to its child view.',
          '2. **Child Chooses its Size**: The child determines its own dimensions based on its content (e.g., text length).',
          '3. **Parent Positions the Child**: The parent places the child in its coordinate space based on alignment.',
        ]
      },
      checkpoints: [
        {
          question: 'How does Spacer() behave inside an HStack?',
          options: [
            'It expands horizontally to fill all available width, pushing adjacent views to opposite edges',
            'It expands vertically to fill screen height',
            'It creates a fixed 10-point gap',
            'It hides the view'
          ],
          correctAnswer: 0,
          explanation: 'Inside an HStack, Spacer expands along the horizontal axis, claiming all unused width.',
        }
      ],
      keyTakeaways: [
        'Use nested Stacks instead of hardcoded coordinates.',
        'Spacer() distributes available space dynamically.',
        'ZStack layers elements from back-to-front.',
      ],
      commonMistakes: [
        'Placing too many Spacers inside a fixed-frame container, causing views to collapse.',
        'Forgetting alignment: .leading in VStack, resulting in centered text by default.',
      ],
      challenge: {
        task: 'Build a `HeaderBarView` with an HStack containing an Image(systemName: "line.3.horizontal"), a Spacer(), a Text("Dashboard"), a Spacer(), and an Image(systemName: "bell.fill").',
        hint: 'Use two Spacers to center the text between the two icons',
        solution: `struct HeaderBarView: View {
    var body: some View {
        HStack {
            Image(systemName: "line.3.horizontal")
            Spacer()
            Text("Dashboard").font(.headline)
            Spacer()
            Image(systemName: "bell.fill")
        }
        .padding()
    }
}`
      }
    },
    pages: [
      {
        id: 'stacks-intuition-shelves',
        title: 'Intuition: Physical Stacks and the Spacer Spring',
        stepLabel: '1. Intuition & Stacks',
        description: 'Understand how Stacks position elements using physical shelves and springs.',
        content: {
          realWorldContext: 'Imagine organizing books on a physical shelf. You can stack them vertically (VStack), line them up horizontally side-by-side (HStack), or put a sticker directly onto the cover of a book (ZStack).',
          detailedTheory: [
            {
              title: 'The Metaphor of the Compressed Spring',
              paragraphs: [
                'Think of `Spacer()` as a physical compressed metal spring.',
                'If you put a block on the left, a spring in the middle, and a block on the right, the spring pushes outward with equal force against both blocks until they hit the physical walls of the box.',
                'If you put two Spacers around an element (`Spacer()`, `Text`, `Spacer()`), they push equally from both sides, centering the text perfectly!'
              ]
            }
          ],
          codeSnippet: `HStack {
    Text("Left Item")
    Spacer() // Spring pushes elements apart
    Text("Right Item")
}`,
          checkpoints: [
            {
              question: 'What happens when you place two Spacers around a Text view inside an HStack?',
              options: [
                'The Text is perfectly centered horizontally between the screen margins',
                'The Text disappears',
                'The app crashes due to layout ambiguity',
                'The text rotates 90 degrees'
              ],
              correctAnswer: 0,
              explanation: 'Both springs expand with equal priority, distributing empty space evenly and centering the middle view.',
            }
          ]
        }
      },
      {
        id: 'stacks-syntax-alignment-spacing',
        title: 'Stack Anatomy: Alignment, Spacing, and Z-Index',
        stepLabel: '2. Alignment & Spacing',
        description: 'Configure precise alignment and custom spacing parameters across all three stacks.',
        content: {
          realWorldContext: 'In mobile typography, titles, subtitles, and captions look messy if they are centered haphazardly. Aligning everything to .leading creates clean, readable layouts.',
          detailedTheory: [
            {
              title: 'Alignment Parameters',
              paragraphs: [
                '• `VStack(alignment: .leading)`: Aligns all child views along their left (or right in RTL languages) edge.',
                '• `HStack(alignment: .firstTextBaseline)`: Aligns text elements along their font baselines, even if they have different font sizes!',
                '• `ZStack(alignment: .topTrailing)`: Pins overlay badges to the top-right corner.',
              ]
            },
            {
              title: 'Explicit Spacing',
              paragraphs: [
                'By default, iOS stacks add a small system spacing. You can override this with `VStack(spacing: 0)` to make views touch with zero gap, or specify explicit point values like `spacing: 16`.',
              ]
            }
          ],
          codeSnippet: `VStack(alignment: .leading, spacing: 4) {
    Text("John Appleseed")
        .font(.title3)
        .fontWeight(.bold)
    
    Text("iOS Software Engineer")
        .font(.subheadline)
        .foregroundStyle(.secondary)
}`,
          checkpoints: [
            {
              question: 'How do you remove all gap between views inside a VStack?',
              options: [
                'Set VStack(spacing: 0)',
                'Use Spacer(gap: 0)',
                'Apply .padding(0) to every child',
                'SwiftUI always requires at least 8pt gap'
              ],
              correctAnswer: 0,
              explanation: 'Setting spacing: 0 removes all default margin between adjacent stack children.',
            }
          ]
        }
      },
      {
        id: 'stacks-layout-algorithm',
        title: 'Under the Hood: The 3 Rules of the SwiftUI Layout Engine',
        stepLabel: '3. Layout Engine Rules',
        description: 'Learn the exact 3-step conversation between parents and children during layout passes.',
        content: {
          realWorldContext: 'Understanding the 3-step layout algorithm prevents layout bugs and unexpected clipping.',
          detailedTheory: [
            {
              title: 'The 3-Step Layout Negotiation',
              paragraphs: [
                '1. **Step 1: The Parent Proposes a Size**: The window or parent stack offers available width and height to the child.',
                '2. **Step 2: The Child Decides Its Own Size**: The child calculates how much space it needs. A `Text` view wraps its text and claims exact dimensions. An `Image` claims its pixel size.',
                '3. **Step 3: The Parent Positions the Child**: The parent assigns an (x, y) coordinate to the child inside its frame.',
              ],
              callout: {
                type: 'info',
                title: 'Crucial Layout Rule',
                text: 'A parent cannot force a child to be a size it does not want to be, unless the child is explicitly resizable or flexible.',
              }
            }
          ],
          codeSnippet: `// Demonstration of proposed vs chosen size
Text("Hello")
    .frame(width: 200, height: 100) // frame proposes 200x100
    .background(Color.yellow)       // background takes full 200x100`,
          checkpoints: [
            {
              question: 'Who ultimately determines the final size of a view in SwiftUI?',
              options: [
                'The child view itself based on its content and constraints',
                'The parent stack always forces the size',
                'The iOS operating system kernel',
                'The GPU shader'
              ],
              correctAnswer: 0,
              explanation: 'Rule #2 dictates that the child view decides its own size in response to the parent\'s proposal.',
            }
          ]
        }
      },
      {
        id: 'stacks-compiler-errors-quiz',
        title: 'Common Layout Traps & Knowledge Check',
        stepLabel: '4. Layout Traps & Quiz',
        description: 'Avoid common beginner layout issues like invisible ZStack layers and text clipping.',
        content: {
          realWorldContext: 'Common layout traps include placing Spacer inside a non-expanding stack or forgetting that ZStack layers views from back to front.',
          detailedTheory: [
            {
              title: 'Top Layout Traps',
              paragraphs: [
                '1. **ZStack Ordering**: Views declared earlier in the ZStack are placed in the background; views declared later are drawn on top. If you put an opaque background at the end, it will cover all your text!\n*Fix*: Always put background views as the first children in a ZStack.',
                '2. **Text Clipping**: If a fixed `.frame(width: 50)` is too small for a long label, SwiftUI truncates with an ellipsis (...).\n*Fix*: Use `.fixedSize(horizontal: false, vertical: true)` or allow flexible width.',
              ]
            }
          ],
          codeSnippet: `// Correct ZStack Ordering
ZStack {
    // 1. Background (drawn first, at the bottom)
    Color.black.ignoresSafeArea()
    
    // 2. Foreground content (drawn on top)
    Text("White text on black background")
        .foregroundColor(.white)
}`,
          checkpoints: [
            {
              question: 'In what order does ZStack layer its children?',
              options: [
                'First declared view in the background, subsequent views on top',
                'First declared view on top, subsequent views in the background',
                'Randomly depending on text length',
                'Alphabetically by view name'
              ],
              correctAnswer: 0,
              explanation: 'ZStack renders children from back to front in the order they appear in code.',
            }
          ]
        }
      },
      {
        id: 'stacks-playground-lab',
        title: 'Xcode Playground Lab: CryptoCardView Component',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a polished cryptocurrency / stock asset card using nested stacks and alignments.',
        content: {
          realWorldContext: 'Build the financial asset card seen in Apple Stocks, Robinhood, and Coinbase.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Create a `CryptoCardView` displaying coin symbol ("BTC"), coin name ("Bitcoin"), price ("$65,420.00"), and 24h change ("+4.5%").',
              ]
            }
          ],
          codeSnippet: `struct CryptoCardView: View {
    let symbol: String
    let name: String
    let price: String
    let changePercentage: String
    let isPositive: Bool
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(symbol)
                    .font(.headline)
                    .fontWeight(.bold)
                Text(name)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text(price)
                    .font(.headline)
                    .fontWeight(.semibold)
                Text(changePercentage)
                    .font(.subheadline)
                    .foregroundStyle(isPositive ? .green : .red)
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }
}`,
          checkpoints: [
            {
              question: 'Which alignment was used for the right-hand column price in CryptoCardView?',
              options: [
                'VStack(alignment: .trailing)',
                'VStack(alignment: .leading)',
                'VStack(alignment: .center)',
                'HStack(alignment: .bottom)'
              ],
              correctAnswer: 0,
              explanation: 'Trailing alignment aligns numbers cleanly to the right edge.',
            }
          ],
          challenge: {
            task: 'Build a `ProductRow` with `title: String` and `price: Double`. Position title on the leading edge and formatted price on trailing edge with an HStack and Spacer.',
            hint: 'Use HStack { Text(title); Spacer(); Text(String(format: "$%.2f", price)) }',
            solution: `struct ProductRow: View {
    let title: String
    let price: Double
    
    var body: some View {
        HStack {
            Text(title)
                .font(.body)
            Spacer()
            Text(String(format: "$%.2f", price))
                .fontWeight(.bold)
        }
        .padding()
    }
}`
          }
        }
      }
    ]
  },
  {
    id: 'swiftui-lists-scrollview',
    module: 4,
    moduleTitle: 'Module 4: SwiftUI Fundamentals & Layout',
    title: 'Dynamic Lists: List, ScrollView, and ForEach',
    description: 'Master displaying large datasets in iOS: the Identifiable protocol, native List cell reuse, ScrollView + LazyVStack, and memory efficiency.',
    difficulty: 'Intermediate',
    estimatedMinutes: 24,
    icon: 'List',
    content: {
      realWorldContext: 'Loading a feed of 1,000 tweets or 500 contacts using a standard VStack will immediately crash your iPhone because it allocates all 1,000 views in memory simultaneously. SwiftUI provides List and LazyVStack to virtualize cell creation and conserve memory.',
      detailedTheory: [
        {
          title: 'The Identifiable Protocol',
          paragraphs: [
            'For SwiftUI to animate and track dynamic list items when items are added, deleted, or reordered, every data model must provide a stable unique identifier.',
            'Conforming to `Identifiable` requires a single property: `var id: UUID` or `let id: String`. This enables passing arrays directly to `List(items)` or `ForEach(items)`.',
          ]
        },
        {
          title: 'List vs. ScrollView + LazyVStack',
          paragraphs: [
            '1. `List`: The native iOS table component (backed by UICollectionView). Provides out-of-the-box cell reuse, pull-to-refresh, swipe-to-delete, and platform list styling.',
            '2. `ScrollView + LazyVStack`: Provides maximum customization for freeform card feeds (Instagram, Pinterest). The `Lazy` keyword means views are only instantiated when scrolled into or near the viewport.',
          ]
        }
      ],
      theory: [
        'Models in dynamic lists must conform to `Identifiable`.',
        'List provides native iOS swipe actions and cell recycling.',
        'LazyVStack instantiates views on demand during scrolling.',
        'ForEach maps an array of models to a sequence of views.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Memory-Safe Virtualized List',
          code: `struct Article: Identifiable {
    let id = UUID()
    let title: String
}

List(articles) { article in
    Text(article.title)
} // Instantiates ONLY cells currently visible on screen!`,
          explanation: 'Can smoothly display 100,000 items with zero lag and minimal RAM usage.',
        },
        bad: {
          title: 'Eager VStack Inside ScrollView (Memory Spike)',
          code: `ScrollView {
    VStack {
        ForEach(articles) { article in
            HeavyArticleCellView(article: article)
        }
    } // Instantiates ALL 10,000 views at once -> Out Of Memory Crash!
}`,
          explanation: 'Instantiating thousands of complex subviews eagerly freezes the main thread and crashes the app.',
        }
      },
      codeSnippet: `// 1. Defining an Identifiable Model
struct Contact: Identifiable {
    let id = UUID()
    let name: String
    let phoneNumber: String
    let isFavorite: Bool
}

// 2. SwiftUI List with Swipe Actions
struct ContactsListView: View {
    @State private var contacts = [
        Contact(name: "Sarah Connor", phoneNumber: "+1 (555) 019-2831", isFavorite: true),
        Contact(name: "David Miller", phoneNumber: "+1 (555) 019-4822", isFavorite: false),
        Contact(name: "Emily Watson", phoneNumber: "+1 (555) 019-8811", isFavorite: true)
    ]
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(contacts) { contact in
                    HStack {
                        VStack(alignment: .leading) {
                            Text(contact.name)
                                .font(.headline)
                            Text(contact.phoneNumber)
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }
                        
                        Spacer()
                        
                        if contact.isFavorite {
                            Image(systemName: "star.fill")
                                .foregroundStyle(.yellow)
                        }
                    }
                }
                .onDelete { indexSet in
                    contacts.remove(atOffsets: indexSet)
                }
            }
            .navigationTitle("Contacts")
        }
    }
}`,
      explanation: [
        'Contact conforms to Identifiable with let id = UUID().',
        'ForEach combined with .onDelete automatically enables native iOS swipe-to-delete gesture.',
        'NavigationStack provides the native large title navigation header.',
      ],
      underTheHood: {
        title: 'Virtualization & Cell Recycling',
        points: [
          'List calculates visible row positions. As a cell scrolls off the top of the screen, its visual backing layer is placed in a reuse pool and reassigned to incoming rows at the bottom.',
          'LazyVStack destroys subviews that scroll far outside the visible viewport buffer to reclaim RAM.',
        ]
      },
      checkpoints: [
        {
          question: 'What protocol must a model conform to for seamless use in List(items) { item in ... }?',
          options: [
            'Identifiable',
            'Equatable',
            'Codable',
            'Observable'
          ],
          correctAnswer: 0,
          explanation: 'Identifiable requires a unique id property that SwiftUI uses to track and diff elements.',
        }
      ],
      keyTakeaways: [
        'Always conform list data models to Identifiable.',
        'Use List for standard iOS settings, tables, and swipe actions.',
        'Use ScrollView + LazyVStack for custom card feeds and grid designs.',
      ],
      commonMistakes: [
        'Using array indices as IDs (\`ForEach(0..<items.count, id: \\.self)\`), causing buggy animations when items are deleted.',
        'Using non-lazy VStack inside ScrollView for long datasets.',
      ],
      challenge: {
        task: 'Define an `Identifiable` struct `TaskItem` with `id = UUID()`, `title: String`, and `isCompleted: Bool`. Display an array of items in a SwiftUI `List`.',
        hint: 'Use struct TaskItem: Identifiable and List(tasks) { task in ... }',
        solution: `struct TaskItem: Identifiable {
    let id = UUID()
    let title: String
    let isCompleted: Bool
}

struct TaskListView: View {
    let tasks: [TaskItem]
    
    var body: some View {
        List(tasks) { task in
            HStack {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                Text(task.title)
            }
        }
    }
}`
      }
    },
    pages: [
      {
        id: 'lists-intuition-virtualization',
        title: 'Intuition: The Conveyor Belt of List Virtualization',
        stepLabel: '1. Intuition & Virtualization',
        description: 'Understand list cell reuse through the factory conveyor belt analogy.',
        content: {
          realWorldContext: 'If you have an iPhone with 2,000 photos, iOS does not decode 2,000 high-resolution images simultaneously. It only allocates views for the 6 photos currently visible on your glass screen.',
          detailedTheory: [
            {
              title: 'Analogy: The Conveyor Belt',
              paragraphs: [
                'Think of the screen as a window looking at a moving conveyor belt.',
                'The conveyor belt only keeps 8-10 physical plastic trays in circulation. As a tray scrolls past the top of the window, a worker wipes it clean and puts the new incoming item on it at the bottom.',
                'This recycling of visual cells is called **Virtualization**. It is the reason iOS apps scroll smoothly at 120Hz ProMotion.',
              ]
            }
          ],
          codeSnippet: `// Virtualized: only visible rows are alive in memory
List(0..<100_000, id: \\.self) { index in
    Text("Row #\\(index)")
}`,
          checkpoints: [
            {
              question: 'Why does List not crash when displaying 100,000 elements?',
              options: [
                'It only instantiates and renders the handful of cells currently visible on screen',
                'Swift converts text to binary',
                'The list is stored on iCloud',
                'iOS compresses 100,000 rows into 1 pixel'
              ],
              correctAnswer: 0,
              explanation: 'Virtualization recycles cell views, keeping only visible elements in active memory.',
            }
          ]
        }
      },
      {
        id: 'lists-syntax-identifiable',
        title: 'Anatomy of Lists: Identifiable, ForEach, and Dynamic Data',
        stepLabel: '2. Identifiable & ForEach',
        description: 'Conform models to Identifiable and master the ForEach construct.',
        content: {
          realWorldContext: 'Whenever you pull records from a database or JSON API, each record has a primary key id. Identifiable links that ID directly to SwiftUI.',
          detailedTheory: [
            {
              title: 'The Identifiable Protocol in Depth',
              paragraphs: [
                'When conforming to `Identifiable`, your `id` property can be any `Hashable` type: a `UUID`, a `String`, or an `Int`.',
                '`UUID()` generates a globally unique 128-bit identifier, making it ideal for client-created models.',
              ]
            },
            {
              title: 'The ForEach Structure',
              paragraphs: [
                '`ForEach` is not a traditional Swift `for-in` loop. It is a View structure that generates individual child views from an identified collection.',
                'Because it produces views, you can attach view modifiers like `.onDelete` or `.onMove` directly to ForEach inside a List.',
              ]
            }
          ],
          codeSnippet: `struct Song: Identifiable {
    let id: String // Can be Spotify track URI
    let title: String
    let artist: String
}

let playlist = [
    Song(id: "trk-1", title: "Blinding Lights", artist: "The Weeknd"),
    Song(id: "trk-2", title: "Levitating", artist: "Dua Lipa")
]

List(playlist) { song in
    VStack(alignment: .leading) {
        Text(song.title).font(.headline)
        Text(song.artist).font(.subheadline).foregroundStyle(.secondary)
    }
}`,
          checkpoints: [
            {
              question: 'What types can be used for the id property in an Identifiable model?',
              options: [
                'Any type conforming to Hashable (UUID, String, Int)',
                'Only Int numbers',
                'Only Strings',
                'Only UIViews'
              ],
              correctAnswer: 0,
              explanation: 'The id property on Identifiable can be any Hashable type.',
            }
          ]
        }
      },
      {
        id: 'lists-lazy-vs-eager',
        title: 'Under the Hood: List vs. ScrollView + LazyVStack Performance',
        stepLabel: '3. List vs. LazyVStack',
        description: 'Benchmark architectural differences between native List and custom LazyVStack feeds.',
        content: {
          realWorldContext: 'Choosing between List and ScrollView + LazyVStack is one of the most common architectural decisions in iOS app design.',
          detailedTheory: [
            {
              title: 'Comparing the Two Approaches',
              paragraphs: [
                '• **List**: Uses Apple\'s native UITableView/UICollectionView backend. Supports system swipe actions, row reordering, pull-to-refresh, and separator lines. Best for standard settings, transaction lists, and inbox feeds.',
                '• **ScrollView + LazyVStack**: Clean canvas without system table styles or borders. Best for custom card feeds (Instagram, Pinterest) and dynamic spacing.',
              ]
            }
          ],
          codeSnippet: `// Custom Card Feed with ScrollView + LazyVStack
ScrollView {
    LazyVStack(spacing: 16) {
        ForEach(posts) { post in
            PostCardView(post: post)
        }
    }
    .padding()
}`,
          checkpoints: [
            {
              question: 'When should you choose List over ScrollView + LazyVStack?',
              options: [
                'When you need native iOS swipe-to-delete, table styling, and cell separator lines',
                'When building a custom photo grid',
                'When you only have 1 item',
                'When you want to disable scrolling'
              ],
              correctAnswer: 0,
              explanation: 'List provides built-in platform features like swipe actions, separators, and native table styling.',
            }
          ]
        }
      },
      {
        id: 'lists-compiler-errors-quiz',
        title: 'Common List Errors in Xcode & Knowledge Check',
        stepLabel: '4. Diagnostics & Quiz',
        description: 'Troubleshoot index-based ForEach bugs and duplicate ID warnings.',
        content: {
          realWorldContext: 'If two items in a list share the same ID, SwiftUI prints a runtime warning: "ForEach: duplicate id found, this will produce undefined behavior!"',
          detailedTheory: [
            {
              title: 'Top List Pitfalls',
              paragraphs: [
                '1. **Duplicate Identifiers**: If two items share `id = 1`, SwiftUI animations will glitch, and deleting one may delete the other.\n*Fix*: Ensure all IDs are strictly unique, or use `UUID()`.',
                '2. **Using id: \\.self on Non-Unique Primitive Types**: Writing `ForEach(["Apple", "Banana", "Apple"], id: \\.self)` triggers duplicate ID warnings.\n*Fix*: Map items to an Identifiable wrapper struct.',
              ]
            }
          ],
          codeSnippet: `// ❌ Bug: Duplicate strings share the same ID
// ForEach(["Book", "Pen", "Book"], id: \\.self) { ... }

// ✅ Fix: Use unique UUIDs
struct ShoppingItem: Identifiable {
    let id = UUID()
    let name: String
}

let safeItems = [
    ShoppingItem(name: "Book"),
    ShoppingItem(name: "Pen"),
    ShoppingItem(name: "Book") // Different unique UUID!
]`,
          checkpoints: [
            {
              question: 'What happens if two elements in a SwiftUI ForEach share identical IDs?',
              options: [
                'SwiftUI warns about undefined behavior; animations and deletions may glitch',
                'The iOS device restarts immediately',
                'The list stops scrolling',
                'The duplicate item is automatically renamed'
              ],
              correctAnswer: 0,
              explanation: 'Duplicate IDs break the diffing engine, causing visual glitches and unpredictable animations.',
            }
          ]
        }
      },
      {
        id: 'lists-playground-lab',
        title: 'Xcode Playground Lab: TransactionHistoryView Component',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a banking transaction history list with date groups, positive/negative amounts, and deletion.',
        content: {
          realWorldContext: 'Build the transaction history feed used in banking and fintech apps like Revolut, Chase, or Apple Card.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Build a `TransactionHistoryView` displaying bank transactions with merchant name, category, formatted amount (e.g. `-$4.50` or `+$1,200.00`), and a category icon.',
              ]
            }
          ],
          codeSnippet: `struct Transaction: Identifiable {
    let id = UUID()
    let merchant: String
    let category: String
    let amount: Double
    let iconName: String
}

struct TransactionHistoryView: View {
    @State private var transactions = [
        Transaction(merchant: "Starbucks", category: "Coffee", amount: -5.75, iconName: "cup.and.saucer.fill"),
        Transaction(merchant: "Apple Store", category: "Electronics", amount: -1299.00, iconName: "laptopcomputer"),
        Transaction(merchant: "Payroll Deposit", category: "Salary", amount: 3500.00, iconName: "arrow.down.circle.fill")
    ]
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(transactions) { tx in
                    HStack(spacing: 12) {
                        Image(systemName: tx.iconName)
                            .foregroundColor(.white)
                            .padding(8)
                            .background(Color.blue)
                            .clipShape(Circle())
                        
                        VStack(alignment: .leading) {
                            Text(tx.merchant).font(.headline)
                            Text(tx.category).font(.caption).foregroundStyle(.secondary)
                        }
                        
                        Spacer()
                        
                        Text(String(format: "%@$%.2f", tx.amount > 0 ? "+" : "", tx.amount))
                            .fontWeight(.bold)
                            .foregroundColor(tx.amount > 0 ? .green : .primary)
                    }
                }
                .onDelete { indexSet in
                    transactions.remove(atOffsets: indexSet)
                }
            }
            .navigationTitle("Transactions")
        }
    }
}`,
          checkpoints: [
            {
              question: 'Which method on ForEach enables swipe-to-delete in a List?',
              options: [
                '.onDelete(perform:)',
                '.onSwipe(perform:)',
                '.removeRows(perform:)',
                '.deleteAction()'
              ],
              correctAnswer: 0,
              explanation: '.onDelete(perform:) provides the native iOS swipe-to-delete gesture and IndexSet offset.',
            }
          ],
          challenge: {
            task: 'Build a `SimpleListView` that displays a list of strings using `ForEach(items, id: \\.self)` with a navigation title "My List".',
            hint: 'Wrap List inside NavigationStack',
            solution: `struct SimpleListView: View {
    let items = ["Swift", "SwiftUI", "Combine", "SwiftData"]
    
    var body: some View {
        NavigationStack {
            List(items, id: \\.self) { item in
                Text(item)
            }
            .navigationTitle("My List")
        }
    }
}`
          }
        }
      }
    ]
  },
  {
    id: 'swiftui-modifiers-components',
    module: 4,
    moduleTitle: 'Module 4: SwiftUI Fundamentals & Layout',
    title: 'Modifiers: Order of Execution and Custom Components',
    description: 'Learn why modifier order is critical in SwiftUI, how to author reusable ViewModifiers, and how to decompose monolithic screens into clean components.',
    difficulty: 'Intermediate',
    estimatedMinutes: 22,
    icon: 'Sparkles',
    content: {
      realWorldContext: 'One of the most frequent beginner frustrations in SwiftUI is wondering why a background color fills only the text instead of the whole button, or why a cornerRadius clips off a shadow. In SwiftUI, modifiers wrap views like concentric picture frames, meaning the exact order of calls dictates the visual result.',
      detailedTheory: [
        {
          title: 'Modifier Order MATTERS',
          paragraphs: [
            'In SwiftUI, modifiers do NOT mutate the existing view in place. Each modifier wraps the previous view inside a new parent container view.',
            'That is why `.background(Color.blue).padding()` colors only the tight text bounds blue before adding blank padding, whereas `.padding().background(Color.blue)` expands the view frame first and fills the entire padded rectangle with blue.',
          ]
        },
        {
          title: 'Decomposing Monolithic Views',
          paragraphs: [
            'When `var body` grows past 100 lines, Xcode compilation slows down and throws the infamous error: "The compiler is unable to type-check this expression in reasonable time".',
            'Best practice is extracting logical chunks into independent sub-structs conforming to `View`.',
          ]
        },
        {
          title: 'Custom ViewModifier Protocol',
          paragraphs: [
            'To avoid duplicating sets of modifiers across multiple screens, SwiftUI provides the `ViewModifier` protocol.',
            'You can encapsulate card styling, custom buttons, or typography into a reusable modifier and expose it via a convenient `View` extension.',
          ]
        }
      ],
      theory: [
        'Each modifier wraps the view in a new container layer.',
        'Modifier order strictly determines visual layout.',
        'Monolithic screens should be decomposed into small independent sub-views.',
        'ViewModifier encapsulates reusable styling.',
      ],
      comparisonSnippet: {
        good: {
          title: 'Correct Order: Padding -> Background -> CornerRadius',
          code: `Text("Purchase Now")
    .foregroundColor(.white)
    .padding(.horizontal, 24)
    .padding(.vertical, 12)
    .background(Color.blue)
    .cornerRadius(8) // Fills the entire padded button!`,
          explanation: 'Padding expands the content bounds before background colors it and cornerRadius clips the rounded corners.',
        },
        bad: {
          title: 'Incorrect Order: Background -> Padding',
          code: `Text("Purchase Now")
    .foregroundColor(.white)
    .background(Color.blue) // Colors ONLY the tight text frame
    .padding(16)            // Blank uncolored margin around blue text!
    .cornerRadius(8)`,
          explanation: 'Applying background before padding leaves a small blue box surrounded by blank white space.',
        }
      },
      codeSnippet: `// 1. Defining a Custom ViewModifier
struct CardStyle: ViewModifier {
    var backgroundColor: Color = Color(.secondarySystemBackground)
    
    func body(content: Content) -> some View {
        content
            .padding()
            .background(backgroundColor)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.08), radius: 6, x: 0, y: 3)
    }
}

// 2. Exposing as a convenient View extension
extension View {
    func asCard(backgroundColor: Color = Color(.secondarySystemBackground)) -> some View {
        self.modifier(CardStyle(backgroundColor: backgroundColor))
    }
}

// 3. Clean usage in any View
struct ProductOverview: View {
    var body: some View {
        VStack(alignment: .leading) {
            Text("AirPods Max").font(.headline)
            Text("$549.00").foregroundStyle(.secondary)
        }
        .asCard() // One-liner custom modifier!
    }
}`,
      explanation: [
        'CardStyle encapsulates padding, background, corner radius, and drop shadow into a single reusable unit.',
        'The View extension enables idiomatic dot-syntax (.asCard()).',
        'Changes to brand design tokens only need updating in one central modifier.',
      ],
      underTheHood: {
        title: 'The View Wrapping Architecture',
        points: [
          'Calling `Text("A").padding().background(.blue)` does not change Text properties.',
          'It constructs the type `_ModifiedContent<_ModifiedContent<Text, _PaddingLayout>, _BackgroundStyleModifier<Color>>`.',
          'Each modifier is literally a parent container wrapping the child inside.',
        ]
      },
      checkpoints: [
        {
          question: 'Why does .padding().background(Color.blue) behave differently from .background(Color.blue).padding()?',
          options: [
            'Because each modifier wraps the view in a new layer; padding first expands the size before background paints it',
            'Because SwiftUI processes modifiers from right to left',
            'Because background cancels previous modifiers',
            'Because padding only works on buttons'
          ],
          correctAnswer: 0,
          explanation: 'Modifiers are view wrappers applied sequentially. Padding expands the bounds before background applies color.',
        }
      ],
      keyTakeaways: [
        'Think of modifiers as wrapping layers like concentric picture frames.',
        'Order of modifiers determines layout, color bounds, and clip regions.',
        'Create custom ViewModifier structs to keep code DRY and consistent.',
      ],
      commonMistakes: [
        'Applying .shadow() before .cornerRadius(), causing shadows to be clipped off.',
        'Writing giant 300-line body properties instead of extracting smaller components.',
      ],
      challenge: {
        task: 'Create a custom `ViewModifier` called `PrimaryButtonModifier` that applies white text, blue background, 16pt padding, and 10pt corner radius.',
        hint: 'Implement struct PrimaryButtonModifier: ViewModifier { func body(content: Content) -> some View }',
        solution: `struct PrimaryButtonModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .foregroundColor(.white)
            .padding()
            .background(Color.blue)
            .cornerRadius(10)
    }
}

extension View {
    func primaryButtonStyle() -> some View {
        self.modifier(PrimaryButtonModifier())
    }
}`
      }
    },
    pages: [
      {
        id: 'modifiers-intuition-picture-frames',
        title: 'Intuition: The Picture Frame Wrapping Analogy',
        stepLabel: '1. Intuition & Picture Frames',
        description: 'Visualize how SwiftUI modifiers wrap views like concentric picture frames.',
        content: {
          realWorldContext: 'Imagine a photograph. You take the photo, place a white mat border around it (padding), put it inside an oak wooden frame (background), and round the outer corners with sandpaper (cornerRadius).',
          detailedTheory: [
            {
              title: 'Concentric Framing Analogy',
              paragraphs: [
                'If you sandpaper the photo before putting the wooden frame around it, the wooden frame still has sharp square corners!',
                'In SwiftUI, every modifier wraps the existing view in a new, slightly larger picture frame. Order is everything.',
              ]
            }
          ],
          codeSnippet: `Text("Framed Content")
    .padding(10)            // Mat border
    .background(Color.blue) // Wooden frame
    .cornerRadius(8)        // Sanding the outer corners`,
          checkpoints: [
            {
              question: 'Does a SwiftUI modifier mutate the original view struct in place?',
              options: [
                'No, it creates a new container view wrapping the previous one',
                'Yes, it modifies the internal memory buffer',
                'Yes, by passing self as inout',
                'Only in release mode'
              ],
              correctAnswer: 0,
              explanation: 'SwiftUI modifiers wrap views in new generic container views (_ModifiedContent).',
            }
          ]
        }
      },
      {
        id: 'modifiers-syntax-order-matters',
        title: 'Modifier Anatomy: Order of Execution and Visual Impact',
        stepLabel: '2. Order of Execution',
        description: 'See side-by-side examples of how changing modifier sequence alters visual results.',
        content: {
          realWorldContext: 'A common bug is placing .shadow() before or after .clipShape() / .cornerRadius(). Placing shadow after cornerRadius casts a shadow from the rounded shape; placing it before causes the shadow to be clipped off!',
          detailedTheory: [
            {
              title: 'The Shadow & CornerRadius Rule',
              paragraphs: [
                '1. Apply `.background(...)` to set the card color.',
                '2. Apply `.cornerRadius(...)` or `.clipShape(...)` to shape the edges.',
                '3. Apply `.shadow(...)` LAST so the shadow radiates from the rounded shape without being clipped.',
              ]
            }
          ],
          codeSnippet: `// Proper Card Elevation Hierarchy
Text("Premium Member")
    .padding()
    .background(Color.white)
    .cornerRadius(12)
    .shadow(color: .black.opacity(0.15), radius: 8, x: 0, y: 4) // Correct: Shadow is outer layer`,
          checkpoints: [
            {
              question: 'Where should .shadow(...) be placed relative to .cornerRadius(...)?',
              options: [
                'After cornerRadius, so the shadow is cast from the rounded shape',
                'Before background',
                'At the very top before Text',
                'Inside the initializer'
              ],
              correctAnswer: 0,
              explanation: 'Applying shadow after cornerRadius ensures the shadow radiates from the rounded perimeter without clipping.',
            }
          ]
        }
      },
      {
        id: 'modifiers-custom-decomposition',
        title: 'Custom ViewModifiers and Component Decomposition',
        stepLabel: '3. Custom ViewModifiers',
        description: 'Create production design system modifiers and clean component structures.',
        content: {
          realWorldContext: 'In enterprise apps, brand styles (brand colors, rounded corners, button shadows) must remain consistent across 50+ screens.',
          detailedTheory: [
            {
              title: 'The ViewModifier Protocol',
              paragraphs: [
                'A custom ViewModifier conforms to `ViewModifier` and implements `func body(content: Content) -> some View`.',
                'It accepts the placeholder `content` and wraps it with whatever styling modifiers you choose.',
              ]
            }
          ],
          codeSnippet: `struct PromoBadge: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.caption2)
            .fontWeight(.heavy)
            .foregroundColor(.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(Color.red)
            .clipShape(Capsule())
    }
}

extension View {
    func promoBadge() -> some View {
        modifier(PromoBadge())
    }
}

Text("SALE").promoBadge()`,
          checkpoints: [
            {
              question: 'What method must a struct conforming to ViewModifier implement?',
              options: [
                'func body(content: Content) -> some View',
                'func apply()',
                'func render()',
                'func drawRect()'
              ],
              correctAnswer: 0,
              explanation: 'ViewModifier requires func body(content: Content) -> some View.',
            }
          ]
        }
      },
      {
        id: 'modifiers-compiler-errors-quiz',
        title: 'Common Modifier Traps & Knowledge Check',
        stepLabel: '4. Traps & Quiz',
        description: 'Avoid common modifier compilation errors and verify your understanding.',
        content: {
          realWorldContext: 'Modifiers like `.frame(width: 100)` return `some View`, which can sometimes hide sub-type methods if invoked in the wrong order.',
          detailedTheory: [
            {
              title: 'Top Modifier Traps',
              paragraphs: [
                '1. **Applying specific modifiers after general View modifiers**:\nFor instance, `.font(...)` is available on all Views, but `.textCase(...)` or `.keyboardType(...)` are only available on specific types like `Text` or `TextField`. If you apply `.padding()` first, you cannot call `.textCase()` on the resulting wrapper!\n*Fix*: Apply specific type modifiers first, then general layout modifiers.',
                '2. **Forgetting .resizable() on Images**:\nApplying `.frame(width: 50, height: 50)` on an `Image` without `.resizable()` does not resize the image pixels; it only resizes the transparent container!\n*Fix*: Always write `Image("logo").resizable().scaledToFit().frame(...)`.',
              ]
            }
          ],
          codeSnippet: `// ❌ Wrong: Image does not resize
// Image("avatar").frame(width: 40, height: 40)

// ✅ Correct: resizable() allows pixel scaling
Image(systemName: "person.circle.fill")
    .resizable()
    .scaledToFit()
    .frame(width: 40, height: 40)`,
          checkpoints: [
            {
              question: 'Why must Image have .resizable() before .frame()?',
              options: [
                'Images render at their intrinsic asset size by default; resizable allows pixel scaling within the proposed frame',
                'Because frame only works on Text',
                'Because iOS requires vector images',
                'To enable dark mode'
              ],
              correctAnswer: 0,
              explanation: 'Without .resizable(), SwiftUI images retain their intrinsic pixel size and ignore frame dimensions.',
            }
          ]
        }
      },
      {
        id: 'modifiers-playground-lab',
        title: 'Xcode Playground Lab: ProductOverview Component',
        stepLabel: '5. Hands-on Lab',
        description: 'Build a modular product card with custom badge modifiers, elevated shadows, and responsive sizing.',
        content: {
          realWorldContext: 'Build the e-commerce product card component used in Apple Store, Amazon, and Nike apps.',
          detailedTheory: [
            {
              title: 'Lab Overview',
              paragraphs: [
                'Create a `ProductOverviewCard` that displays a product title, price, discount badge modifier, and Buy button.',
              ]
            }
          ],
          codeSnippet: `struct DiscountModifier: ViewModifier {
    let discountPercent: Int
    
    func body(content: Content) -> some View {
        ZStack(alignment: .topTrailing) {
            content
            
            Text("-\\(discountPercent)%")
                .font(.caption)
                .fontWeight(.bold)
                .foregroundColor(.white)
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(Color.red)
                .cornerRadius(4)
                .padding(8)
        }
    }
}

extension View {
    func withDiscountBadge(_ percent: Int) -> some View {
        modifier(DiscountModifier(discountPercent: percent))
    }
}

struct ProductOverviewCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Rectangle()
                .fill(Color.gray.opacity(0.2))
                .frame(height: 120)
                .overlay(Image(systemName: "headphones").font(.largeTitle))
            
            Text("AirPods Max")
                .font(.headline)
            
            Text("$479.00")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
        .withDiscountBadge(15) // Reusable modifier applied!
        .frame(width: 200)
    }
}`,
          checkpoints: [
            {
              question: 'What is the main architectural benefit of extracting styles into ViewModifiers?',
              options: [
                'Consistency across screens and single point of maintenance for design tokens',
                'Makes the app 50% smaller in download size',
                'Allows running code in Android',
                'Removes the need for SwiftUI'
              ],
              correctAnswer: 0,
              explanation: 'Custom ViewModifiers provide design system consistency and centralized style maintenance.',
            }
          ],
          challenge: {
            task: 'Create an extension on `View` that adds a method `.roundedCard()` applying 16pt padding, secondarySystemBackground, and 12pt corner radius.',
            hint: 'Use self.padding().background(Color(.secondarySystemBackground)).cornerRadius(12)',
            solution: `extension View {
    func roundedCard() -> some View {
        self
            .padding()
            .background(Color(.secondarySystemBackground))
            .cornerRadius(12)
    }
}`
          }
        }
      }
    ]
  }
];
