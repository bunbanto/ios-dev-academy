import { Lesson } from '@/types';

export const module1Lessons: Lesson[] = [
  {
    id: 'swift-basics-variables',
    module: 1,
    moduleTitle: 'Модуль 1: Основи Swift',
    title: 'Змінні, Константи та Сувора Типізація',
    description: 'Дізнайтеся фундаментальну різницю між let та var, принципи Type Safety, Type Inference та роботу з базовими типами.',
    difficulty: 'Початковий',
    estimatedMinutes: 15,
    icon: 'Terminal',
    content: {
      realWorldContext: 'У будь-якому додатку важливо захистити значення від випадкової зміни. У Swift `let` забороняє переприсвоїти прив’язку, а `var` дозволяє її оновлювати.',
      detailedTheory: [
        {
          title: 'Константи (let) проти Змінних (var)',
          paragraphs: [
            'Swift розроблено з акцентом на безпеку та передбачуваність коду. Основою цього є розділення даних на константи (незмінні значення, оголошені через `let`) та змінні (значення, які можуть мутувати під час виконання програми, оголошені через `var`).',
            'Зазвичай варто починати з `let`, якщо саме прив’язку не потрібно переприсвоювати. Використовуйте `var`, коли значення має змінюватися.'
          ],
          callout: {
            type: 'tip',
            title: 'Порада від Apple',
            text: 'Якщо ви оголосите сутність через `var`, але жодного разу не зміните її в коді, компілятор Xcode видасть попередження (Warning): "Variable was never mutated; consider changing to let".'
          }
        },
        {
          title: 'Type Safety та Type Inference (Виведення типів)',
          paragraphs: [
            'Swift є суворо типізованою мовою (Type-Safe). Це означає, що кожна змінна має чітко визначений тип, відомий ще під час компіляції. Ви ніколи не зможете випадково передати текст `String` у функцію, яка очікує число `Int`.',
            'Завдяки Type Inference вам не обовʼязково писати тип вручну. Наприклад, під час запису `let score = 100`, компілятор автоматично визначить, що `score` має тип `Int`.'
          ],
          callout: {
            type: 'warning',
            title: 'Підводний камінь типів',
            text: 'Swift не виконує неявного приведення числових типів! Ви не можете додати `Int` до `Double` напряму (`5 + 3.14` викличе помилку компіляції). Числа необхідно приводити явно: `Double(5) + 3.14`.'
          }
        },
        {
          title: 'Інтерполяція рядків (String Interpolation)',
          paragraphs: [
            'Для поєднання змінних у текст у Swift використовується синтаксис `\\(значення)`. Це набагато безпечніше та швидше за конкатенацію рядків плюсами (`+`), оскільки Swift автоматично конвертує будь-який тип у його строкове представлення.'
          ]
        }
      ],
      theory: [
        'Swift — суворо типізована, безпечна мова від Apple.',
        'Для незмінних значень використовується `let`, для змінних — `var`.',
        'Компілятор автоматично виводить типи (Type Inference) та запобігає небезпечним операціям.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Ідіоматичний та безпечний код',
          code: `let maxLoginAttempts = 3
var currentAttempts = 0

currentAttempts += 1
let alertMessage = "Спроба \\(currentAttempts) з \\(maxLoginAttempts)"`,
          explanation: 'Константа let захищена від випадкового перезапису, змінна var мутує лише за потреби, а інтерполяція рядків формує чистий текст без помилок типів.'
        },
        bad: {
          title: 'Небезпечне використання var та конкатенації',
          code: `var maxLoginAttempts = 3 // Помилка мислення: це константа!
var currentAttempts = 0

currentAttempts = currentAttempts + 1
// Конкатенація викликає зайве виділення пам'яті
var alertMessage = "Спроба " + String(currentAttempts) + " з " + String(maxLoginAttempts)`,
          explanation: 'Використання var для незмінних параметрів створює ризик випадкових багів у командній розробці, а ручне склеювання рядків плюсами менш читабельне.'
        }
      },
      codeSnippet: `// 1. Оголошення констант та змінних
let bankAccountID: String = "UA-98321-4820"
let interestRate: Double = 3.5 // Type Inference (Double)
var balanceUSD: Double = 1250.75

// 2. Операція мутації балансу
let depositAmount: Double = 250.00
balanceUSD += depositAmount

// 3. Інтерполяція рядків
let report = "Рахунок: \\(bankAccountID) | Залишок: $\\(balanceUSD)"
print(report)`,
      explanation: [
        '`let bankAccountID` фіксує номер рахунку. Жодна функція в системі не зможе його підмінити.',
        '`var balanceUSD` дозволяє накопичувати кошти або списувати їх за допомогою операторів `+=` або `-=`.',
        '`String Interpolation` через `\\(...)` автоматично підставляє числа та рядки в готовий текстовий шаблон.'
      ],
      underTheHood: {
        title: 'Що перевіряє компілятор Swift',
        points: [
          'Компілятор перевіряє, що константі не присвоюють нове значення після ініціалізації. Конкретні оптимізації залежать від контексту та режиму збірки.',
          'Більшість перевірок типів виконується під час компіляції. Це допомагає виявляти несумісні операції до запуску програми; конкретні оптимізації залежать від коду та режиму збірки.',
          'Цілі числа за замовчуванням мають тип `Int` (64 біти на сучасних iPhone та Mac).'
        ],
        note: 'Вибір `let` робить намір коду зрозумілішим і не дає випадково переприсвоїти значення.'
      },
      checkpoints: [
        {
          question: 'Яке ключове слово обрати для назви застосунку, яку не потрібно переприсвоювати?',
          options: ['var', 'let', 'const', 'static var'],
          correctAnswer: 1,
          explanation: 'Для прив’язки, яку не потрібно переприсвоювати, використовуйте `let`; для переприсвоєння — `var`.'
        },
        {
          question: 'Що відбудеться при спробі виконати код: let total = 10 + 4.5?',
          options: [
            'total автоматично стане Double зі значенням 14.5',
            'Помилка компіляції: не можна додавати Int до Double без явного приведення',
            'total округлиться до Int зі значенням 14',
            'Xcode впаде з Fatal Error під час виконання'
          ],
          correctAnswer: 1,
          explanation: 'Swift не виконує неявного приведення типів. Потрібно писати Double(10) + 4.5.'
        }
      ],
      keyTakeaways: [
        'Віддавайте перевагу `let`, якщо прив’язку не потрібно переприсвоювати.',
        'Swift Type-Safe: типи String, Int, Double, Bool несумісні без явного приведення.',
        'Інтерполяція `\\(variable)` — найбезпечніший спосіб форматування рядків.'
      ],
      commonMistakes: [
        'Оголошення всіх полів через `var` "на всяк випадок".',
        'Спроба змінити значення константи після її ініціалізації.',
        'Додавання `Int` до `Double` напряму без конструктора `Double(myInt)`.'
      ],
      challenge: {
        task: 'Оголосіть константу `appTitle` зі значенням "FitnessPro", змінну `dailySteps` зі значенням 7500. Збільшіть кроки на 1200 та виведіть рядок "У додатку FitnessPro зафіксовано 8700 кроків".',
        hint: 'Використайте let, var, оператор += та інтерполяцію рядка \\(...)',
        solution: `let appTitle = "FitnessPro"
var dailySteps = 7500
dailySteps += 1200
let message = "У додатку \\(appTitle) зафіксовано \\(dailySteps) кроків"`
      },
      xcodeLab: {
        task: 'Створення калькулятора податку в Xcode Playground',
        steps: [
          'Відкрийте Xcode та створіть новий iOS Playground (Blank).',
          'Оголосіть константу ціни товару `let rawPrice: Double = 199.99` та ставку податку `let taxRate: Double = 0.20`.',
          'Обчисліть підсумкову ціну у змінній `var finalPrice` та додайте вартість курʼєрської доставки.',
          'Виведіть результат у консоль за допомогою print().'
        ],
        code: `import Foundation

let rawPrice: Double = 199.99
let taxRate: Double = 0.20
let shippingCost: Double = 15.00

var finalPrice = rawPrice * (1.0 + taxRate)
finalPrice += shippingCost

print("Фінальна ціна замовлення: $\\(String(format: "%.2f", finalPrice))")`,
        expectedOutput: 'Фінальна ціна замовлення: $254.99',
        tips: 'Використовуйте String(format: "%.2f", number) для заокруглення дробів до двох знаків після коми.'
      }
    }
  },
  {
    id: 'swift-control-flow',
    module: 1,
    moduleTitle: 'Модуль 1: Основи Swift',
    title: 'Керування потоком: Умови, Guard та Switch',
    description: 'Опануйте конструкції if/else, тернарний оператор, оператор guard для раннього виходу та pattern matching у switch.',
    difficulty: 'Початковий',
    estimatedMinutes: 16,
    icon: 'GitBranch',
    content: {
      realWorldContext: 'Кожен екран входу або чекаут в онлайн-магазині перевіряє умови: чи коректний пароль, чи вистачає коштів, чи ввімкнено FaceID. Безпечне розгалуження коду гарантує, що некоректні дані не зламають логіку додатку.',
      detailedTheory: [
        {
          title: 'Конструкції if-else та Тернарний оператор',
          paragraphs: [
            'У Swift умовні вирази не вимагають круглих дужок навколо умови (на відміну від C++, Java чи JS), але фігурні дужки `{}` обовʼязкові завжди.',
            'Тернарний умовний оператор `умова ? значенняЯкщоTrue : значенняЯкщоFalse` ідеально підходить для коротких присвоєнь, особливо в конфігурації UI-модифікаторів SwiftUI.'
          ]
        },
        {
          title: 'guard statement: Патерн раннього виходу (Early Exit)',
          paragraphs: [
            'Ключове слово `guard` перевіряє умову, яка обовʼязково має бути правдивою, щоб функція продовжила роботу. Якщо умова не виконується, блок `else` змушує негайно вийти з контексту (`return`, `throw`).',
            'Це запобігає появі "піраміди смерті" (глибоко вкладених блоків `if { if { if { ... } } }`) та робить код пласким і читабельним.'
          ],
          callout: {
            type: 'tip',
            title: 'Правило чистого коду',
            text: 'Використовуйте guard на самому початку функцій для перевірки аргументів. Усе тіло функції після guard гарантовано працює з валідними даними.'
          }
        },
        {
          title: 'Потужний switch та Pattern Matching',
          paragraphs: [
            'Оператор `switch` у Swift надзвичайно функціональний: він підтримує перевірку діапазонів чисел (`1...10`), кортежів, рядків та умов `where`.',
            'Важлива особливість: `switch` у Swift є вичерпним (exhaustive). Ви повинні описати або всі можливі випадки, або додати блок `default`.'
          ]
        }
      ],
      theory: [
        'Умови if/else та тернарний оператор контролюють виконання програми.',
        'Оператор `guard` забезпечує ранній вихід (Early Exit) та захищає функції від некоректних даних.',
        'Оператор `switch` підтримує діапазони, умови where та є обовʼязково вичерпним.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Ранній вихід через guard',
          code: `func processPayment(amount: Double, userBalance: Double) {
    guard amount > 0 else {
        print("Сума повинна бути більшою за нуль")
        return
    }
    guard userBalance >= amount else {
        print("Недостатньо коштів")
        return
    }
    
    // Тіло функції чисте та без вкладеності
    let newBalance = userBalance - amount
    print("Успішно сплачено! Залишок: \\(newBalance)")
}`,
          explanation: 'Код читається лінійно зверху вниз, усі невалідні стани відсікаються миттєво без зайвих рівнів відступів.'
        },
        bad: {
          title: 'Вкладені драбини if (Піраміда смерті)',
          code: `func processPayment(amount: Double, userBalance: Double) {
    if amount > 0 {
        if userBalance >= amount {
            let newBalance = userBalance - amount
            print("Успішно сплачено! Залишок: \\(newBalance)")
        } else {
            print("Недостатньо коштів")
        }
    } else {
        print("Сума повинна бути більшою за нуль")
    }
}`,
          explanation: 'Глибока вкладеність робить код важким для підтримки, а помилки опиняються в самому кінці далеко від умови.'
        }
      },
      codeSnippet: `// 1. Тернарний оператор для налаштування теми
let isDarkMode = true
let backgroundColor = isDarkMode ? "DarkSlate" : "PureWhite"

// 2. Switch з діапазонами та умовами
let httpStatusCode = 404

switch httpStatusCode {
case 200..<300:
    print("Успішний запит (2xx)")
case 401:
    print("Потрібна повторна авторизація")
case 404:
    print("Ресурс не знайдено на сервері")
case 400..<500:
    print("Клієнтська помилка запиту")
case 500...599:
    print("Помилка на стороні сервера")
default:
    print("Невідомий код статусу")
}`,
      explanation: [
        'Оператор `200..<300` перевіряє напіввідкритий діапазон від 200 до 299 включно.',
        'Swift автоматично завершує `switch` після першого успішного співпадіння — ключове слово `break` писати не потрібно (на відміну від C/Java).',
        'Блок `default` гарантує вичерпність (exhaustiveness), без якої код не скомпілюється.'
      ],
      underTheHood: {
        title: 'Як switch компілюється в Jump Table',
        points: [
          'Компілятор Swift перетворює статичні вирази `switch` у так звані Jump Tables (таблиці переходів) в машинному коді.',
          'Це дає швидкість O(1) переходу до потрібної гілки замість послідовної перевірки десятків умов O(N), як це відбувається в ланцюжку `if-else if-else`.'
        ]
      },
      checkpoints: [
        {
          question: 'Що обовʼязково має бути присутнє у блоці else оператора guard?',
          options: [
            'Оператор виходу з контексту (return, throw, break або fatalError)',
            'Виклик print()',
            'Оголошення змінної var',
            'Ключове слово continue'
          ],
          correctAnswer: 0,
          explanation: 'guard гарантує ранній вихід, тому блок else зобовʼязаний завершити виконання поточної гілки коду.'
        }
      ],
      keyTakeaways: [
        'Використовуйте `guard` для перевірки передумов на початку функцій.',
        'У `switch` не потрібен `break` наприкінці кожного `case`.',
        'Тернарний оператор `? :` чудовий для коротких лаконічних рішень.'
      ],
      commonMistakes: [
        'Забутий вихід (`return`) у тілі `guard else`.',
        'Створення надмірної вкладеності з `if { if { ... } }` замість лінійних `guard`.',
        'Спроба використати невиправдано складний `if-else` ланцюжок замість чіткого `switch`.'
      ],
      challenge: {
        task: 'Напишіть функцію `evaluateBattery(level: Int)`, яка через switch повертає рядок "Критичний" (рівень 0...10), "Низький" (11...20), "Нормальний" (21...80), "Повний" (81...100) або "Невідомий" для всіх інших.',
        hint: 'Використовуйте switch level { case 0...10: ... }',
        solution: `func evaluateBattery(level: Int) -> String {
    switch level {
    case 0...10: return "Критичний"
    case 11...20: return "Низький"
    case 21...80: return "Нормальний"
    case 81...100: return "Повний"
    default: return "Невідомий"
    }
}`
      }
    }
  },
  {
    id: 'swift-optionals-unwrapping',
    module: 1,
    moduleTitle: 'Модуль 1: Основи Swift',
    title: 'Опціонали (Optionals) та Безпечне Розгортання',
    description: 'Головна концепція надійності Swift: nil-safety, if let, guard let, Nil-Coalescing (??) та Optional Chaining.',
    difficulty: 'Початковий',
    estimatedMinutes: 18,
    icon: 'ShieldCheck',
    content: {
      realWorldContext: 'Опціонали змушують явно враховувати відсутнє значення під час компіляції. Це допомагає уникнути частини помилок, повʼязаних із nil, але не робить застосунок захищеним від усіх збоїв.',
      detailedTheory: [
        {
          title: 'Що таке Опціонал (Optional) насправді?',
          paragraphs: [
            'Опціонал — це тип-коробка, яка може містити або конкретне значення визначеного типу, або бути абсолютно порожньою (`nil`).',
            'Опціонал позначається знаком питання після типу: `String?`, `Int?`, `User?`. Під капотом це насправді перелічення `enum Optional<Wrapped> { case none, case some(Wrapped) }`.'
          ],
          callout: {
            type: 'warning',
            title: 'Force Unwrapping (!): коли ризик невиправданий',
            text: 'Знак оклику `username!` (Force Unwrap) каже компілятору: "Я гарантую, що там не nil". Якщо під час виконання в користувача там виявиться nil — додаток миттєво впаде з Fatal Error. У прикладному коді краще обирати безпечне розгортання, якщо відсутнє значення є можливим. Force unwrap доречний лише за гарантованого інваріанта; інакше він може завершити програму з помилкою.'
          }
        },
        {
          title: 'Основні техніки безпечного розгортання',
          paragraphs: [
            '1. `if let`: розгортає значення у локальну константу всередині блоку if.',
            '2. `guard let`: розгортає значення для всього подальшого тіла функції, а у випадку `nil` змушує негайно вийти.',
            '3. Оператор `??` (Nil-Coalescing): надає значення за замовчуванням, якщо опціонал дорівнює `nil`.',
            '4. Optional Chaining (`?.`): дозволяє викликати властивості або методи в ланцюжку. Якщо хоча б одна ланка `nil`, весь вираз поверне `nil` без падіння програми.'
          ]
        }
      ],
      theory: [
        'Опціонали представляють можливу відсутність значення (nil) на рівні системи типів.',
        'Безпечні способи: if let, guard let, nil-coalescing (??) та optional chaining (?.).',
        'Примусове розгортання (!) заборонене в реальних проектах через ризик фатального крашу.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Безпечне розгортання з резервним значенням',
          code: `let userBio: String? = nil

// Безпечне отримання тексту для UI
let displayBio = userBio ?? "Користувач ще не додав опис про себе."
print(displayBio)`,
          explanation: 'Оператор ?? елегантно надає зрозумілий дефолтний текст і запобігає будь-яким збоям у відображенні інтерфейсу.'
        },
        bad: {
          title: 'Смертельний Force Unwrap (!)',
          code: `let userBio: String? = nil

// КРАШ ДОДАТКА під час виконання!
let displayBio = userBio! 
print(displayBio)`,
          explanation: 'Коли в реального користувача поле bio пусте, рядок userBio! призведе до Fatal Error: Unexpectedly found nil while unwrapping an Optional value.'
        }
      },
      codeSnippet: `// 1. Оголошення опціоналів
var remoteAvatarURL: String? = "https://cdn.example.com/user_42.png"
var telegramHandle: String? = nil

// 2. Безпечне розгортання через if let (Shadowing)
if let avatar = remoteAvatarURL {
    print("Завантажуємо фото: \\(avatar)")
} else {
    print("Встановлюємо системну заглушку")
}

// 3. Nil-Coalescing оператор (??)
let contactDisplay = telegramHandle ?? "@anonymous"

// 4. Optional Chaining
struct Company { var name: String }
struct Employee { var company: Company? }

let worker: Employee? = Employee(company: Company(name: "Apple Inc."))
let companyName = worker?.company?.name ?? "Безробітний"
print("Компанія: \\(companyName)")`,
      explanation: [
        '`if let avatar = remoteAvatarURL` тимчасово витягує чистий `String` з `String?` лише на час виконання блоку.',
        'Синтаксис `worker?.company?.name` безпечно перевіряє кожен крок ланцюжка. Якщо `worker` або `company` дорівнює `nil`, обчислення зупиняється.',
        'Оператор `??` повертає значення типу `String` у цьому прикладі; чи буде рядок порожнім, залежить від значення за замовчуванням.'
      ],
      underTheHood: {
        title: 'Як Swift представляє Optional',
        points: [
          'У Swift опціонал реалізовано як generic enum з двома кейсами: `.none` та `.some(val)`.',
          'Компілятор використовує оптимізацію невикористаних бітів (Spare Bits) у вказівниках 64-бітних архітектур ARM64. Завдяки цьому зберігання `Optional` для класів займає рівно стільки ж памʼяті, скільки й звичайний вказівник (0 байтів оверхеду!).'
        ]
      },
      checkpoints: [
        {
          question: 'Який тип матиме змінна res у виразі: let res = optionalNumber ?? 0 (де optionalNumber має тип Int?)?',
          options: ['Int', 'Int?', 'Optional<Int>', 'Any'],
          correctAnswer: 0,
          explanation: 'Оператор ?? гарантує дефолтне значення, тому результуючий тип розгортається до звичайного Int.'
        },
        {
          question: 'Чому слід уникати використання знака оклику user.email!?',
          options: [
            'Це сповільнює роботу процесора',
            'Якщо значення виявиться nil, додаток миттєво впаде з помилкою Fatal Error',
            'Xcode забороняє публікацію в App Store з оператором !',
            'Значення автоматично перетвориться на 0'
          ],
          correctAnswer: 1,
          explanation: 'Force unwrapping викликає невідновний краш програми у разі відсутності значення.'
        }
      ],
      keyTakeaways: [
        '`String?` — це не String, а контейнер, де може бути nil.',
        'Використовуйте `if let`, `guard let` або `??` для розгортання.',
        'Забудьте про `!` у комерційному коді.'
      ],
      commonMistakes: [
        'Використання `!` для швидкого позбавлення від помилки компілятора.',
        'Порівняння `if myVar != nil { myVar! }` замість красивого `if let myVar = myVar`.'
      ],
      challenge: {
        task: 'Напишіть функцію `parseAge(input: String?) -> Int`, яка перевіряє опціональний вхідний рядок, намагається перетворити його в Int(`Int(input)`), і якщо число валідне і більше 0 — повертає його, інакше повертає 18.',
        hint: 'Використовуйте guard let з кількома умовами та конвертацією Int(...)',
        solution: `func parseAge(input: String?) -> Int {
    guard let input = input, let age = Int(input), age > 0 else {
        return 18
    }
    return age
}`
      }
    }
  },
  {
    id: 'swift-functions-params',
    module: 1,
    moduleTitle: 'Модуль 1: Основи Swift',
    title: 'Функції: Лейбли Аргументів та Повернення Значень',
    description: 'Навчіться проектувати функції у стилі Apple: зовнішні та внутрішні імена параметрів, дефолтні значення, кортежі та inout.',
    difficulty: 'Початковий',
    estimatedMinutes: 15,
    icon: 'Code2',
    content: {
      realWorldContext: 'Swift славиться своєю виразністю, що нагадує природну англійську мову. Наприклад, виклик методу в Apple SDK виглядає як речення: `view.insertSubview(button, at: 0)`. Розуміння лейблів функцій — основа для написання чистого коду в команді.',
      detailedTheory: [
        {
          title: 'Анатомія функції у Swift',
          paragraphs: [
            'Функції оголошуються ключовим словом `func`. Swift дозволяє задавати два імені для кожного параметра:',
            '1. Аргументний лейбл (Argument Label) — використовується зовні під час виклику функції для зручності читання.',
            '2. Імʼя параметра (Parameter Name) — використовується всередині тіла функції для роботи зі значенням.',
            'Якщо аргументний лейбл не потрібен при виклику, його замінюють на підкреслення `_`.'
          ]
        },
        {
          title: 'Дефолтні значення та повернення кількох значень',
          paragraphs: [
            'Параметри функцій можуть мати значення за замовчуванням (`func greet(name: String = "Гість")`). Це дозволяє уникнути створення десятків перевантажених функцій.',
            'Якщо функція повинна повернути кілька повʼязаних значень, замість створення окремої структури можна використати кортеж (Tuple): `-> (min: Int, max: Int)`.'
          ]
        }
      ],
      theory: [
        'Функції мають зовнішні аргументні лейбли та внутрішні імена параметрів.',
        'Підкреслення `_` приховує лейбл під час виклику.',
        'Підтримуються дефолтні аргументи та повернення кількох значень через Tuples.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Ідіоматичний виклик у стилі Swift API Guidelines',
          code: `func sendMessage(_ text: String, to recipient: String, priority: Int = 1) {
    print("Надсилання '\\(text)' до \\(recipient) з пріоритетом \\(priority)")
}

// Виклик читається як зв'язне речення:
sendMessage("Привіт!", to: "Олександр")`,
          explanation: 'Використання to створює природну англійську фразу при виклику, а priority має дефолтне значення і може не передаватися.'
        },
        bad: {
          title: 'Незрозумілий та перевантажений виклик',
          code: `func send(text: String, user: String, priority: Int) {
    print("Надсилання")
}

// Виклик виглядає шаблонно і громіздко:
send(text: "Привіт!", user: "Олександр", priority: 1)`,
          explanation: 'Відсутність чітких прийменників робить виклики сухими, а обовʼязкова передача priority змушує писати зайвий код.'
        }
      },
      codeSnippet: `// 1. Функція з аргументним лейблом та значенням за замовчуванням
func calculateDiscount(price: Double, discountPercent: Double = 10.0) -> Double {
    let factor = 1.0 - (discountPercent / 100.0)
    return price * factor
}

let regularSale = calculateDiscount(price: 1000.0) // 900.0 (дефолтна знижка 10%)
let blackFriday = calculateDiscount(price: 1000.0, discountPercent: 30.0) // 700.0

// 2. Повернення кортежу (Tuple)
func getUserLocation() -> (latitude: Double, longitude: Double, city: String) {
    return (50.4501, 30.5234, "Київ")
}

let location = getUserLocation()
print("Місто: \\(location.city), координати: \\(location.latitude), \\(location.longitude)")`,
      explanation: [
        'Параметр `discountPercent` має дефолтне значення `10.0`, що робить його опціональним при виклику.',
        'Стрілка `-> Double` визначає тип даних, які функція обовʼязково повертає через `return`.',
        'Кортеж `(latitude, longitude, city)` дає змогу звертатися до повернених полів за зрозумілими іменами.'
      ],
      underTheHood: {
        title: 'Передача параметрів за значенням (Value Semantics)',
        points: [
          'Усі параметри функцій у Swift за замовчуванням є константами `let`. Ви не можете змінити параметр всередині функції (`price = 200` викликає помилку компіляції).',
          'Якщо вам дійсно потрібно змінити оригінальну змінну, передану у функцію, використовується ключове слово `inout` та символ `&` під час виклику (передача за посиланням).'
        ]
      },
      checkpoints: [
        {
          question: 'Як викликати функцію func downloadImage(from urlString: String)?',
          options: [
            'downloadImage(from: "https://...")',
            'downloadImage(urlString: "https://...")',
            'downloadImage("https://...")',
            'downloadImage(from urlString: "https://...")'
          ],
          correctAnswer: 0,
          explanation: 'from — це зовнішній лейбл аргументу, тому під час виклику пишеться from: ...'
        }
      ],
      keyTakeaways: [
        'Зовнішні лейбли роблять виклик функції зрозумілим реченням.',
        'Підкреслення `_` прибирає необхідність писати імʼя параметра при виклику.',
        'Параметри функції є незмінними константами `let` за замовчуванням.'
      ],
      commonMistakes: [
        'Спроба змінити значення параметра всередині функції без модифікатора `inout`.',
        'Ігнорування значення, що повертає функція, без `@discardableResult`.'
      ],
      challenge: {
        task: 'Створіть функцію `formatCurrency(_ amount: Double, currency: String = "UAH") -> String`, яка повертає рядок у форматі "150.00 UAH".',
        hint: 'Використовуйте _ для першого параметра, дефолтне значення для валюти та інтерполяцію',
        solution: `func formatCurrency(_ amount: Double, currency: String = "UAH") -> String {
    return "\\(String(format: "%.2f", amount)) \\(currency)"
}`
      }
    }
  }
];

