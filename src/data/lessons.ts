import { Lesson } from '@/types';

export const LESSONS: Lesson[] = [
  {
    id: 'swift-basics-variables',
    module: 1,
    moduleTitle: 'Модуль 1: Основи Swift',
    title: 'Змінні, Константи та Типи Даних',
    description: 'Дізнайтеся різницю між let та var, як працює виведення типів (Type Inference) та базові типи у Swift.',
    difficulty: 'Початковий',
    estimatedMinutes: 12,
    icon: 'Terminal',
    content: {
      theory: [
        'Swift — це суворо типізована, безпечна та швидка мова програмування, розроблена Apple для платформ iOS, iPadOS, macOS, watchOS та visionOS.',
        'Для створення незмінних значень (констант) використовується ключове слово `let`. Якщо значення змінне і змінюватиметься з часом — `var`. В Apple рекомендують завжди використовувати `let`, якщо значення не потребує зміни.',
        'Swift підтримує автоматичне виведення типів (Type Inference): компілятор сам розуміє тип за наданим значенням, або тип можна вказати явно.'
      ],
      codeSnippet: `// Оголошення константи (незмінне значення)
let appName: String = "SwiftLab"
let releaseYear = 2024 // Компілятор знає, що це Int

// Оголошення змінної (можна перезаписувати)
var activeUsers: Int = 1420
activeUsers += 1

// Основні типи даних:
let version: Double = 18.0
let isProduction: Bool = true
let initial: Character = "S"

// Інтерполяція рядків
let greeting = "Ласкаво просимо до \\(appName) версії \\(version)!"
print(greeting)`,
      explanation: [
        'Рядок `let appName` створює константу. Будь-яка спроба змінити її призведе до помилки компіляції під час збірки.',
        'Синтаксис `\\(значення)` всередині рядка називається String Interpolation (інтерполяція рядків). Це найбезпечніший і найчистіший спосіб поєднання змінних у текст.',
        'Swift є Type-Safe мовою: ви ніколи не зможете випадково передати `String` туди, де очікується `Int`.'
      ],
      keyTakeaways: [
        'Завжди починайте з `let`. Змінюйте на `var` тільки коли значення дійсно змінюється.',
        'Типи пишуться з великої літери: String, Int, Double, Bool.',
        'Інтерполяція рядків: "\\(variableName)".'
      ],
      commonMistakes: [
        'Використання `var` там, де значення ніколи не мутує — Xcode покаже warning: "Variable was never mutated; consider changing to let".',
        'Спроба додати `Int` до `Double` без явного приведення типу: `Double(myInt) + myDouble`.'
      ],
      challenge: {
        task: 'Створіть константу `iphoneModel` зі значенням "iPhone 16 Pro", змінну `batteryLevel` зі значенням 85 (Int), та виведіть текст: "Ваш iPhone 16 Pro має 85% заряду".',
        hint: 'Використовуйте let, var та інтерполяцію рядка через \\(...)',
        solution: `let iphoneModel = "iPhone 16 Pro"
var batteryLevel = 85
let statusMessage = "Ваш \\(iphoneModel) має \\(batteryLevel)% заряду"`
      }
    }
  },
  {
    id: 'swift-optionals-unwrapping',
    module: 1,
    moduleTitle: 'Модуль 1: Основи Swift',
    title: 'Опціонали (Optionals) та Безпечне Розгортання',
    description: 'Найважливіша концепція безпеки у Swift: робота з відсутніми значеннями (nil), guard let, if let та nil coalescing.',
    difficulty: 'Початковий',
    estimatedMinutes: 15,
    icon: 'ShieldCheck',
    content: {
      theory: [
        'В інших мовах відсутність значення (null / undefined) часто викликає краш "NullPointerException" під час виконання. У Swift ця проблема вирішена на рівні компілятора за допомогою Опціоналів (Optionals).',
        'Опціонал — це тип-обгортка, яка може містити значення певного типу або нічого (`nil`). Він позначається знаком питання `?` після типу (наприклад, `String?`).',
        'Щоб використати значення опціоналу, його необхідно "розгорнути" (unwrap). Є кілька способів: `if let`, `guard let`, оператор значення за замовчуванням `??` (Nil Coalescing) або примусове розгортання `!` (якого слід уникати).'
      ],
      codeSnippet: `var userNickname: String? = "steve_jobs"

// 1. Безпечне розгортання через if let
if let unwrappedName = userNickname {
    print("Привіт, \\(unwrappedName)!")
} else {
    print("Користувач не вказав нікнейм.")
}

// 2. Оператор Nil Coalescing (значення за замовчуванням)
let displayName = userNickname ?? "Гість"

// 3. guard let (використовується для раннього виходу з функцій)
func validateProfile(bio: String?) {
    guard let bio = bio, !bio.isEmpty else {
        print("Біографія обов'язкова!")
        return
    }
    print("Біографія валідна: \\(bio)")
}`,
      explanation: [
        '`userNickname: String?` означає, що тут може бути або текст типу String, або `nil`.',
        '`if let` створює тимчасову константу, яка існує лише всередині блоку if, якщо опціонал не дорівнює nil.',
        '`guard let` змушує перевірити умову на початку функції і вимагає обовʼязкового виходу (`return`, `throw`) у блоці `else`, якщо значення відсутнє. Це зменшує вкладеність коду ("піраміду смерті").'
      ],
      keyTakeaways: [
        'Знак `?` означає "тут може бути nil".',
        'Ніколи не використовуйте `!` (Force Unwrap), якщо не маєте 100% залізобетонної впевненості, інакше додаток впаде з Fatal Error!',
        '`guard let` — стандартний підхід для раннього виходу (Early Exit) у iOS розробці.'
      ],
      commonMistakes: [
        'Force Unwrapping `username!` — якщо там опиниться `nil`, додаток миттєво крашнеться в користувача.',
        'Зайве використання опціоналів для значень, які завжди гарантовано існують.'
      ],
      challenge: {
        task: 'Напишіть функцію, яка приймає опціональний рядок `avatarUrl: String?` та повертає або сам URL, або дефолтний рядок "default-avatar.png" за допомогою оператора `??`.',
        hint: 'Використовуйте оператор nil coalescing: `avatarUrl ?? ...`',
        solution: `func getAvatar(url: String?) -> String {
    return url ?? "default-avatar.png"
}`
      }
    }
  },
  {
    id: 'swift-collections-flow',
    module: 2,
    moduleTitle: 'Модуль 2: Колекції та Структури даних',
    title: 'Масиви, Словники та Set (Колекції у Swift)',
    description: 'Організовуйте дані за допомогою Array, Dictionary та Set, та маніпулюйте ними з функціональними методами map, filter.',
    difficulty: 'Початковий',
    estimatedMinutes: 14,
    icon: 'Layers',
    content: {
      theory: [
        'У Swift є три основні типи колекцій: `Array` (впорядковані списки), `Dictionary` (пари ключ-значення) та `Set` (невпорядковані унікальні елементи).',
        'Усі колекції у Swift є Value Types (типами значень): вони копіюються при присвоєнні або передачі у функції, що гарантує відсутність небажаних побічних ефектів.',
        'Swift має потужні функціональні методи обробки колекцій: `.map`, `.filter`, `.compactMap`, `.reduce`, `.sorted`.'
      ],
      codeSnippet: `// 1. Array (Масив)
var devices: [String] = ["iPhone 15", "iPhone 16", "iPad Pro"]
devices.append("Apple Watch Ultra")

// 2. Dictionary (Словник ключ-значення)
var devicePrices: [String: Double] = [
    "iPhone 16": 799.0,
    "iPhone 16 Pro": 999.0
]
let proPrice = devicePrices["iPhone 16 Pro"] // Повертає Double? (опціонал!)

// 3. Set (Унікальні значення)
var supportedSensors: Set<String> = ["FaceID", "LiDAR", "NFC", "FaceID"]
print(supportedSensors.count) // 3, дублікат "FaceID" автоматично відкинуто

// Функціональна обробка
let expensiveDevices = devicePrices
    .filter { $0.value >= 900 }
    .map { $0.key.uppercased() }

print(expensiveDevices) // ["IPHONE 16 PRO"]`,
      explanation: [
        'Зверніть увагу: отримання значення зі словника `devicePrices["key"]` завжди повертає Опціонал (`Double?`), тому що такого ключа може не існувати в словнику.',
        '`Set` працює за алгоритмами гешування O(1), тому перевірка `supportedSensors.contains("FaceID")` відбувається миттєво незалежно від кількості елементів.',
        'Скорочений синтаксис closure `$0` посилається на перший аргумент переданого замикання.'
      ],
      keyTakeaways: [
        'Array — зберігає порядок, дозволяє дублікати.',
        'Dictionary — швидкий пошук за унікальним ключем, повертає Optional.',
        'Set — тільки унікальні значення, надшвидкий пошук `.contains()`.',
        'Колекції у Swift є строго типізованими та безпечними.'
      ],
      commonMistakes: [
        'Спроба отримати елемент масиву за індексом, якого не існує: `devices[99]` викличе Out of bounds crash.',
        'Забувати, що доступ до Dictionary повертає Optional і його потрібно unwrap.'
      ],
      challenge: {
        task: 'Маючи масив чисел `let scores = [45, 88, 92, 60, 99]`, відфільтруйте лише оцінки >= 80 і помножте кожну на 1.1 за допомогою `.filter` та `.map`.',
        hint: 'Використовуйте ланцюжок: `scores.filter { $0 >= 80 }.map { Double($0) * 1.1 }`',
        solution: `let scores = [45, 88, 92, 60, 99]
let boosted = scores.filter { $0 >= 80 }.map { Double($0) * 1.1 }`
      }
    }
  },
  {
    id: 'swift-structs-classes-protocols',
    module: 3,
    moduleTitle: 'Модуль 3: Архітектурні цеглинки',
    title: 'Structs vs Classes, Протоколи та Розширення',
    description: 'Чому Apple будує SwiftUI на структурах (Structs), як працює різниця між Value та Reference types, і як писати чистий код з Протоколами.',
    difficulty: 'Середній',
    estimatedMinutes: 20,
    icon: 'Box',
    content: {
      theory: [
        'Це одне з найпопулярніших питань на будь-якій співбесіді з iOS розробки: яка різниця між Struct (структура) та Class (клас)?',
        'Struct є Value Type (тип значення). Зберігається в Stack памʼяті, копіюється при присвоєнні, не має спадкування, автоматично генерує ініціалізатор (memberwise init). Усі компоненти SwiftUI — це структури!',
        'Class є Reference Type (посилальний тип). Зберігається в Heap памʼяті, передається за посиланням, підтримує наслідування та вимагає управління памʼяттю через ARC (Automatic Reference Counting).',
        'Протокол (Protocol) — це контракт або інтерфейс, який описує вимоги (властивості та методи). Будь-яка структура чи клас може "підписатися" на протокол.'
      ],
      codeSnippet: `// 1. Протокол
protocol Playable {
    var title: String { get }
    func play()
}

// 2. Struct (Value Type) — основа SwiftUI
struct Song: Playable, Identifiable {
    let id = UUID()
    let title: String
    let artist: String
    var isFavorite: Bool = false
    
    // Щоб змінювати властивості структури всередині методу:
    mutating func toggleFavorite() {
        isFavorite.toggle()
    }
    
    func play() {
        print("Грає: \\(title) — \\(artist)")
    }
}

// 3. Extensions (Розширення можливостей без зміни оригіналу)
extension Double {
    var formattedCurrency: String {
        return String(format: "$%.2f", self)
    }
}

let price = 19.999
print(price.formattedCurrency) // "$20.00"`,
      explanation: [
        'У структурах методи, які модифікують внутрішні змінні, обовʼязково помічаються словом `mutating`.',
        'Extensions дозволяють додавати новий функціонал навіть до вбудованих типів Apple, таких як `String`, `Int`, `Color` або `View`.',
        'Swift заохочує Protocol-Oriented Programming (протокольно-орієнтоване програмування) замість глибоких ієрархій наслідування класів.'
      ],
      keyTakeaways: [
        'За замовчуванням завжди створюйте `struct`. Використовуйте `class` тільки коли дійсно потрібна спільна мутація або інтеграція з Objective-C.',
        'SwiftUI Views — це завжди легковагі структури `struct MyView: View`.',
        'Extensions роблять код модульним та легким для читання.'
      ],
      commonMistakes: [
        'Створення циклических сильних посилань (Retain Cycles) між класами, що призводить до витоку памʼяті (Memory Leaks). Завжди використовуйте `weak` посилання для delegates та closures.'
      ],
      challenge: {
        task: 'Створіть структуру `Developer` з властивостями `name: String` та `yearsOfExperience: Int`, яка має метод `isSenior() -> Bool`, що повертає true, якщо досвід >= 5 років.',
        hint: 'Оголосіть struct Developer { ... func isSenior() -> Bool { yearsOfExperience >= 5 } }',
        solution: `struct Developer {
    let name: String
    var yearsOfExperience: Int
    
    func isSenior() -> Bool {
        return yearsOfExperience >= 5
    }
}`
      }
    }
  },
  {
    id: 'swiftui-layout-stacks',
    module: 4,
    moduleTitle: 'Модуль 4: Основи SwiftUI',
    title: 'Стеки (VStack, HStack, ZStack) та Модифікатори',
    description: 'Створюйте сучасні інтерфейси iPhone за допомогою декларативного синтаксису SwiftUI, системи модифікаторів та гнучких стеків.',
    difficulty: 'Початковий',
    estimatedMinutes: 16,
    icon: 'Smartphone',
    content: {
      theory: [
        'SwiftUI — це сучасний декларативний фреймворк від Apple для створення інтерфейсів. Замість того, щоб вказувати "як" малювати пікселі, ви описуєте "що" має бути на екрані.',
        'Компонування базується на трьох основних стеках:',
        '1. `VStack` (Vertical Stack) — розташовує дочірні елементи вертикально один під одним.',
        '2. `HStack` (Horizontal Stack) — розташовує елементи горизонтально в один рядок.',
        '3. `ZStack` (Depth Stack) — нашаровує елементи вздовж осі Z (один поверх одного, наприклад фоновий градієнт та текст).',
        'Модифікатори викликаються ланцюжком і обгортають View у нове View. Важливий порядок модифікаторів!'
      ],
      codeSnippet: `import SwiftUI

struct ProfileCardView: View {
    var body: some View {
        ZStack {
            // Фоновій градієнт
            LinearGradient(
                colors: [.blue, .purple],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            // Картка контенту
            VStack(spacing: 16) {
                Image(systemName: "person.crop.circle.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .foregroundColor(.white)
                
                VStack(spacing: 4) {
                    Text("Олександр Кравченко")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text("iOS Developer • Kyiv")
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.8))
                }
                
                HStack(spacing: 20) {
                    Label("12 Apps", systemImage: "app.badge")
                    Label("4.9 ★", systemImage: "star.fill")
                }
                .font(.footnote)
                .foregroundColor(.white)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(.ultraThinMaterial)
                .clipShape(Capsule())
            }
            .padding(24)
            .background(Color.black.opacity(0.2))
            .cornerRadius(24)
            .padding(.horizontal, 20)
        }
    }
}`,
      explanation: [
        '`some View` означає непрозорий тип повернення (Opaque Return Type): компілятор знає точний тип структури, але нам не потрібно писати громіздку сигнатуру вручну.',
        'Системні іконки Apple доступні через `Image(systemName: "...")` з бібліотеки SF Symbols (понад 5000 векторних іконок).',
        'Порядок модифікаторів має критичне значення: `.background(...)` перед `.padding(...)` зафарбує лише початковий розмір, а після `.padding(...)` — розширений розмір!'
      ],
      keyTakeaways: [
        'VStack = вертикально, HStack = горизонтально, ZStack = один над одним.',
        'Spacer() розтягує простір і притискає елементи до країв.',
        'Порядок модифікаторів впливає на кінцевий вигляд компонента.'
      ],
      commonMistakes: [
        'Плутанина порядку `.padding()` та `.background()` — якщо поставити background першим, відступи будуть прозорими.',
        'Забувати `.resizable()` перед `.frame()` для Image з SF Symbols.'
      ],
      challenge: {
        task: 'Напишіть SwiftUI View з кнопкою "Оновити", що має синій фон, заокруглені кути 12pt, білий текст та відступи 16pt.',
        hint: 'Використовуйте Button, .padding(), .background(Color.blue), .foregroundColor(.white), .cornerRadius(12)',
        solution: `Button("Оновити") {
    print("Tapped")
}
.padding()
.background(Color.blue)
.foregroundColor(.white)
.cornerRadius(12)`
      }
    }
  },
  {
    id: 'swiftui-state-data-flow',
    module: 5,
    moduleTitle: 'Модуль 5: Управління станом (Data Flow)',
    title: '@State, @Binding та Новий @Observable у iOS 17',
    description: 'Опануйте єдине джерело істини (Single Source of Truth), реактивне оновлення екрана та звʼязування даних між компонентами.',
    difficulty: 'Середній',
    estimatedMinutes: 18,
    icon: 'RefreshCw',
    content: {
      theory: [
        'У SwiftUI інтерфейс є функцією від стану: `UI = f(State)`. Коли стан змінюється, SwiftUI автоматично перераховує змінну `body` і перемальовує лише змінені пікселі.',
        '`@State`: використовується для простого приватного стану конкретного View (наприклад, стан перемикача, лічильник, текст у полі вводу).',
        '`@Binding`: створює двосторонній звʼязок зі станом, який належить батьківському View. Позначається знаком `$`.',
        'Починаючи з iOS 17, Apple представила макрос `@Observable`. Більше не потрібні громіздкі `@Published` та `ObservableObject`!'
      ],
      codeSnippet: `import SwiftUI
import Observation

// 1. Модель стану для iOS 17+ з макросом @Observable
@Observable
class CartManager {
    var itemsCount: Int = 0
    var totalPrice: Double = 0.0
    
    func addItem(price: Double) {
        itemsCount += 1
        totalPrice += price
    }
}

// 2. Батьківське View зі @State
struct StoreView: View {
    @State private var cart = CartManager()
    @State private var isDiscountApplied: Bool = false
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Кошик товарів: \\(cart.itemsCount)")
                .font(.headline)
            
            Text("Сума: $\\(cart.totalPrice, specifier: "%.2f")")
                .font(.largeTitle)
                .bold()
            
            // Передаємо Binding через $ у дочірнє View
            DiscountToggleView(isOn: $isDiscountApplied)
            
            Button("Додати каву ($4.50)") {
                withAnimation(.spring()) {
                    cart.addItem(price: isDiscountApplied ? 3.50 : 4.50)
                }
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
        }
        .padding()
    }
}

// 3. Дочірнє View, що використовує @Binding
struct DiscountToggleView: View {
    @Binding var isOn: Bool
    
    var body: some View {
        Toggle("Знижка студента 20%", isOn: $isOn)
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
    }
}`,
      explanation: [
        'Коли користувач перемикає Toggle у `DiscountToggleView`, через `@Binding var isOn` оновлюється змінна `@State isDiscountApplied` у батьківському компоненті `StoreView`.',
        '`withAnimation(.spring())` автоматично анімує всі візуальні зміни, викликані зміною стану всередині цього блоку.',
        'Знак `$` перед змінною (`$isDiscountApplied`) створює проектовану властивість (Projected Value) — тобто сам `Binding`.'
      ],
      keyTakeaways: [
        '@State — володіє даними, живе всередині View.',
        '@Binding — посилається на дані чужого @State без їх копіювання.',
        '@Observable (iOS 17+) — сучасний стандарт для ViewModel та бізнес-логіки.'
      ],
      commonMistakes: [
        'Використання `@State` для передачі даних від батька до дитини (це створить окрему копію, і дитина не зможе змінити батьківський стан). Використовуйте `@Binding`.'
      ],
      challenge: {
        task: 'Створіть @State змінну `isLiked: Bool` та кнопку з іконкою "heart" (якщо false) або "heart.fill" червоного кольору (якщо true), яка перемикає свій стан.',
        hint: 'Використовуйте Image(systemName: isLiked ? "heart.fill" : "heart") та isLiked.toggle()',
        solution: `@State private var isLiked = false

Button {
    isLiked.toggle()
} label: {
    Image(systemName: isLiked ? "heart.fill" : "heart")
        .foregroundColor(isLiked ? .red : .gray)
}`
      }
    }
  },
  {
    id: 'swift-async-await-network',
    module: 6,
    moduleTitle: 'Модуль 6: Мережа та Concurrency',
    title: 'Асинхронний Swift (async/await) та URLSession',
    description: 'Отримуйте дані з REST API, парсіть JSON за допомогою протоколу Codable та оновлюйте UI без фризів інтерфейсу.',
    difficulty: 'Просунутий',
    estimatedMinutes: 22,
    icon: 'Wifi',
    content: {
      theory: [
        'Мобільний додаток ніколи не повинен блокувати головний потік (Main Thread), на якому малюється інтерфейс із частотою 60 або 120 Гц (ProMotion). Усі мережеві та важкі обчислення виконуються асинхронно у фоні.',
        'У сучасному Swift використовується елегантний механізм Structured Concurrency з ключовими словами `async` та `await`. Більше ніяких страшних замикань із completion handlers та `@escaping`!',
        'Протокол `Codable` автоматично перетворює сирий JSON у структури Swift без сторонніх бібліотек.',
        'Атрибут `@MainActor` гарантує, що оновлення властивостей UI відбуватиметься безпечно виключно на головному потоці.'
      ],
      codeSnippet: `import Foundation
import SwiftUI

// 1. Модель даних, що відповідає JSON структурі
struct GitHubUser: Codable, Identifiable {
    let id: Int
    let login: String
    let name: String?
    let avatarUrl: String
    let publicRepos: Int
    
    // Кастомний мапінг змійового snake_case на camelCase
    enum CodingKeys: String, CodingKey {
        case id, login, name
        case avatarUrl = "avatar_url"
        case publicRepos = "public_repos"
    }
}

// 2. Сервіс для завантаження
@Observable
class UserService {
    var user: GitHubUser?
    var isLoading = false
    var errorMessage: String?
    
    @MainActor
    func fetchUser(username: String) async {
        isLoading = true
        errorMessage = nil
        
        guard let url = URL(string: "https://api.github.com/users/\\(username)") else {
            errorMessage = "Некоректний URL"
            isLoading = false
            return
        }
        
        do {
            // Асинхронний запит через URLSession
            let (data, response) = try await URLSession.shared.data(from: url)
            
            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                errorMessage = "Помилка сервера"
                isLoading = false
                return
            }
            
            // Парсинг JSON в нашу структуру
            let decoded = try JSONDecoder().decode(GitHubUser.self, from: data)
            self.user = decoded
        } catch {
            self.errorMessage = "Помилка завантаження: \\(error.localizedDescription)"
        }
        
        self.isLoading = false
    }
}`,
      explanation: [
        '`try await URLSession.shared.data(from: url)` зупиняє виконання поточної корутини без блокування системного потоку, доки мережевий запит не поверне байти.',
        '`enum CodingKeys: String, CodingKey` дозволяє легко повʼязати серверне поле `avatar_url` з красивою константою `avatarUrl` у вашому Swift коді.',
        '`@MainActor` запобігає стану гонки (Data Race) і гарантує відсутність крашів "UI updated on background thread".'
      ],
      keyTakeaways: [
        'async/await — сучасний стандарт асинхронного програмування у Swift.',
        'Codable = Encodable + Decodable (автоматична робота з JSON).',
        'Усі оновлення UI повинні бути на @MainActor.'
      ],
      commonMistakes: [
        'Забувати обробляти помилки в блоці `do-catch` — якщо JSON на бекенді змінився, `JSONDecoder` кине помилку десеріалізації.',
        'Оновлення стану UI у фоновому потоці без `@MainActor`.'
      ],
      challenge: {
        task: 'Опишіть структуру `Product: Codable, Identifiable` з полями `id: Int`, `title: String`, `price: Double` для парсингу списку товарів з інтернет-магазину.',
        hint: 'struct Product: Codable, Identifiable { let id: Int; ... }',
        solution: `struct Product: Codable, Identifiable {
    let id: Int
    let title: String
    let price: Double
}`
      }
    }
  },
  {
    id: 'swiftdata-persistence',
    module: 7,
    moduleTitle: 'Модуль 7: Збереження даних (Persistence)',
    title: 'SwiftData: Сучасна база даних для iOS',
    description: 'Зберігайте стан та обʼєкти між перезапусками додатку за допомогою фреймворку SwiftData на заміну старого CoreData.',
    difficulty: 'Просунутий',
    estimatedMinutes: 20,
    icon: 'Database',
    content: {
      theory: [
        'Довгі роки розробники використовували важкий та складний CoreData з XML-файлами моделей. Починаючи з iOS 17, Apple представила SwiftData — нативний, сучасний фреймворк збереження даних.',
        'Він використовує можливості Swift макросів: достатньо додати `@Model` до звичайного класу, і він автоматично стає сутністю бази даних з підтримкою звʼязків, індексів та міграцій!',
        'У SwiftUI доступ до збережених обʼєктів відбувається декларативно за допомогою макроса `@Query`.'
      ],
      codeSnippet: `import SwiftUI
import SwiftData

// 1. Оголошення моделі через макрос @Model
@Model
class NoteItem {
    var id: UUID
    var title: String
    var content: String
    var createdAt: Date
    var isPinned: Bool
    
    init(title: String, content: String, isPinned: Bool = false) {
        self.id = UUID()
        self.title = title
        self.content = content
        self.createdAt = Date()
        self.isPinned = isPinned
    }
}

// 2. Використання у View
struct NotesListView: View {
    // Автоматичний живий запит до БД з сортуванням
    @Query(sort: \\NoteItem.createdAt, order: .reverse) private var notes: [NoteItem]
    @Environment(\\.modelContext) private var modelContext
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(notes) { note in
                    VStack(alignment: .leading) {
                        Text(note.title).font(.headline)
                        Text(note.content).font(.subheadline).foregroundColor(.secondary)
                    }
                }
                .onDelete(perform: deleteNotes)
            }
            .navigationTitle("Мої Нотатки")
            .toolbar {
                Button(action: addSampleNote) {
                    Label("Додати", systemImage: "plus")
                }
            }
        }
    }
    
    func addSampleNote() {
        let newNote = NoteItem(title: "Нова ідея", content: "Створити класний iOS додаток")
        modelContext.insert(newNote)
    }
    
    func deleteNotes(offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(notes[index])
        }
    }
}`,
      explanation: [
        'Макрос `@Model` самостійно генерує схему SQLite, підтримує кешування та відстежує зміни властивостей.',
        '`@Query` автоматично підписується на оновлення: щойно новий обʼєкт додається або видаляється через `modelContext`, список у UI моментально перемальовується.',
        '`@Environment(\\.modelContext)` надає доступ до контексту даних для вставки (`insert`) та видалення (`delete`).'
      ],
      keyTakeaways: [
        '@Model перетворює будь-який Swift клас на сутність бази даних.',
        '@Query декларативно отримує дані та підтримує сортування й предикати фільтрації (#Predicate).',
        'SwiftData ідеально інтегрований у SwiftUI без зайвого бойлерплейту.'
      ],
      commonMistakes: [
        'Спроба використати `struct` з макросом `@Model`. SwiftData підтримує лише посилальні класи (`class`).'
      ],
      challenge: {
        task: 'Додайте до класу моделі `NoteItem` нову необовʼязкову властивість `tag: String?` та поясніть, чи вимагатиме це зміни структури в базі.',
        hint: 'var tag: String? — опціональні поля легко мігрують у SwiftData без додаткових зусиль',
        solution: `@Model
class NoteItem {
    var tag: String?
    // SwiftData автоматично підтримує додавання опціональних полів
}`
      }
    }
  }
];

