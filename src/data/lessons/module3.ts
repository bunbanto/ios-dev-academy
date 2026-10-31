import { Lesson } from '@/types';

export const module3Lessons: Lesson[] = [
  {
    id: 'swift-structs-value-types',
    module: 3,
    moduleTitle: 'Модуль 3: ООП та Архітектура Типів',
    title: 'Структури (struct) та Value Types у Swift',
    description: 'Дізнайтеся, чому структури є основою Swift та SwiftUI: семантика значень, автоматичні ініціалізатори та ключове слово mutating.',
    difficulty: 'Середній',
    estimatedMinutes: 18,
    icon: 'Box',
    content: {
      realWorldContext: 'Майже весь SwiftUI побудований на структурах (`struct MyView: View`). Структури часто зручно використовувати для моделей даних і SwiftUI View. Вони мають семантику значень, але сам вибір `struct` не гарантує потокобезпечності: це залежить від доступу до стану та синхронізації.',
      detailedTheory: [
        {
          title: 'Семантика значень (Value Semantics)',
          paragraphs: [
            'Структури (`struct`) у Swift належать до типів значень (Value Types).',
            'Присвоєння структури має семантику значень: зміни однієї прив’язки не змінюють іншу. Для стандартних колекцій Swift часто застосовує Copy-on-Write, тож фізичну копію даних може відкласти до моменту зміни. Зміна копії ніколи не вплине на оригінал. Це усуває цілий клас багів, повʼязаних із "несподіваними змінами з іншого кутка програми".'
          ]
        },
        {
          title: 'Автоматичний Memberwise Initializer',
          paragraphs: [
            'На відміну від класів, структурам не потрібно вручну писати конструктор `init(...)`. Компілятор Swift автоматично створює memberwise-ініціалізатор для всіх полів структури.'
          ]
        },
        {
          title: 'Ключове слово mutating',
          paragraphs: [
            'Оскільки структури є типами значень, їхні методи не можуть змінювати власні властивості за замовчуванням.',
            'Якщо метод змінює хоча б одне поле всередині структури, його обовʼязково потрібно позначити модифікатором `mutating`.'
          ]
        }
      ],
      theory: [
        'Структури — Value Types: копіюються при присвоєнні.',
        'Мають автоматичний конструктор Memberwise Init.',
        'Методи, що змінюють поля, маркуються як `mutating`.',
        'Ідеальні для моделей даних та компонентів SwiftUI.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Ізольовані структури (Неможливо зламати оригінал)',
          code: `struct UserSettings {
    var isPushEnabled: Bool
}

var original = UserSettings(isPushEnabled: true)
var copy = original

// Зміна копії НЕ впливає на оригінал
copy.isPushEnabled = false
print(original.isPushEnabled) // true! Оригінал захищений`,
          explanation: 'Кожен екземпляр має власну ізольовану копію даних. Це зменшує ризик неочікуваних спільних змін, але саме по собі не усуває всі гонки даних: важливо враховувати спільні посилальні значення та конкурентний доступ.'
        },
        bad: {
          title: 'Неочікувана зміна спільного стану в класах',
          code: `class UserSettings {
    var isPushEnabled: Bool
    init(isPushEnabled: Bool) { self.isPushEnabled = isPushEnabled }
}

let original = UserSettings(isPushEnabled: true)
let copy = original

// Зміна копії змінює і оригінал!
copy.isPushEnabled = false
print(original.isPushEnabled) // false! Оригінал спотворено`,
          explanation: 'Класи передаються за посиланням: випадкова зміна властивості в одній частині додатку ламає дані в іншій.'
        }
      },
      codeSnippet: `// 1. Оголошення структури моделі
struct BankCard {
    let cardNumber: String
    let cardHolder: String
    var balance: Double
    
    // Метод мутації стану
    mutating func deposit(amount: Double) {
        balance += amount
    }
    
    // Обчислювальна властивість (Computed Property)
    var maskedNumber: String {
        let last4 = cardNumber.suffix(4)
        return "**** **** **** \\(last4)"
    }
}

// 2. Використання
var myCard = BankCard(cardNumber: "4149499312345678", cardHolder: "TARAS SHEVCHENKO", balance: 500.0)
myCard.deposit(amount: 150.0)

print(myCard.maskedNumber) // **** **** **** 5678
print("Баланс: $\\(myCard.balance)") // 650.0`,
      explanation: [
        '`mutating func deposit` явно повідомляє компілятору, що виклик методу призведе до заміни внутрішнього стану структури.',
        '`var maskedNumber` — це computed property, яка не займає памʼять, а обчислюється "на льоту".',
        'Якщо екземпляр оголошено як `let myCard`, викликати `deposit()` буде неможливо, оскільки вся структура стає константною.'
      ],
      underTheHood: {
        title: 'Де зберігаються значення Swift',
        points: [
          'Swift не гарантує розміщення кожного значення структури на стеку. Фізичне розміщення залежить від контексту, оптимізацій компілятора та того, як значення зберігається.',
          'Стек і купа мають різні правила керування памʼяттю. Не варто робити висновок про швидкодію лише з того, що тип оголошено як `struct` або `class`.'
        ]
      },
      checkpoints: [
        {
          question: 'Чому метод структури, що змінює її поля, повинен мати ключове слово mutating?',
          options: [
            'Тому що структури за замовчуванням є незмінними Value Types',
            'Це вимагається тільки для публічних методів',
            'Щоб метод працював у фоновому потоці',
            'Це застарілий синтаксис Swift 2'
          ],
          correctAnswer: 0,
          explanation: 'mutating сигналізує компілятору, що поточний екземпляр структури зазнає змін під час виклику.'
        }
      ],
      keyTakeaways: [
        'Структури — стандартний вибір за замовчуванням в Apple екосистемі.',
        'Value Semantics захищає від побічних ефектів при паралельній роботі.',
        'Компілятор генерує безкоштовний memberwise init.'
      ],
      commonMistakes: [
        'Оголошення екземпляра через `let` і спроба викликати `mutating` метод.',
        'Створення класу там, де достатньо простої та швидкої структури.'
      ],
      challenge: {
        task: 'Опишіть структуру `Point` з полями `x: Double` та `y: Double`, і методом `mutating func moveBy(dx: Double, dy: Double)`, який змінює координати.',
        hint: 'Оголосіть змінні var x, var y всередині структури',
        solution: `struct Point {
    var x: Double
    var y: Double
    
    mutating func moveBy(dx: Double, dy: Double) {
        x += dx
        y += dy
    }
}`
      }
    }
  },
  {
    id: 'swift-classes-reference-types',
    module: 3,
    moduleTitle: 'Модуль 3: ООП та Архітектура Типів',
    title: 'Класи (class) та Reference Types',
    description: 'Опануйте обʼєктно-орієнтоване програмування у Swift: типи посилань, спадкування, ініціалізатори convenience/required та метод деініціалізації deinit.',
    difficulty: 'Середній',
    estimatedMinutes: 20,
    icon: 'Terminal',
    content: {
      realWorldContext: 'Хоча SwiftUI віддає перевагу структурам для інтерфейсу, класи залишаються критично важливими для сервісів довгого життя: менеджерів геолокації (CoreLocation), аудіоплеєрів (AVFoundation), мережевих сесій та збереження спільного стану додатку.',
      detailedTheory: [
        {
          title: 'Семантика посилань (Reference Semantics)',
          paragraphs: [
            'Класи (`class`) мають семантику посилань: присвоєння іншій змінній створює ще одне посилання на той самий екземпляр. Деталі фізичного розміщення памʼяті визначає реалізація Swift.',
            'Обидва вказівники тепер посилаються на один і той самий живий обʼєкт.'
          ]
        },
        {
          title: 'Ініціалізація та спадкування (Inheritance)',
          paragraphs: [
            'Класи підтримують ієрархічне спадкування (`class Child: Parent`). Класи вимагають явного написання `init(...)` (автоматичного memberwise init у класів немає).',
            'Ключове слово `super.init()` забезпечує послідовну ініціалізацію батьківських властивостей.'
          ]
        },
        {
          title: 'Деініціалізатор deinit',
          paragraphs: [
            'Метод `deinit` автоматично викликається системою в ту саму мілісекунду, коли обʼєкт видаляється з памʼяті (кількість сильних посилань впала до нуля).',
            'Це найкраще місце для відписки від повідомлень, закриття файлів або зупинки таймерів.'
          ]
        }
      ],
      theory: [
        'Класи мають семантику посилань і підтримують спадкування.',
        'Підтримують спадкування та перевизначення методів (`override`).',
        'Метод `deinit` спрацьовує перед видаленням обʼєкта з памʼяті.',
        'Вимагають ручного написання `init`.',
        'Оператор `===` (три знаки рівності) перевіряє, чи посилаються дві змінні на один фізичний обʼєкт.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Використання класу для спільного сервісу (Singleton/Service)',
          code: `class AudioPlaybackManager {
    static let shared = AudioPlaybackManager()
    var isPlaying = false
    
    private init() {} // Захист від створення дублікатів
    
    func playTrack(named: String) {
        isPlaying = true
        print("Відтворення: \\(named)")
    }
}`,
          explanation: 'Клас ідеальний для менеджерів, які повинні існувати в єдиному екземплярі на весь життєвий цикл додатку.'
        },
        bad: {
          title: 'Використання структури для синглтона або менеджера стану',
          code: `struct AudioPlaybackManager {
    var isPlaying = false
    mutating func playTrack() { isPlaying = true }
}

var m1 = AudioPlaybackManager()
var m2 = m1 // Роздвоєння сервісу в пам'яті!`,
          explanation: 'Структури копіюються: замість одного менеджера ви отримаєте декілька неузгоджених копій у різних частинах коду.'
        }
      },
      codeSnippet: `// 1. Базовий клас
class Vehicle {
    let brand: String
    var speed: Double = 0.0
    
    init(brand: String) {
        self.brand = brand
    }
    
    func accelerate() {
        speed += 10.0
    }
    
    deinit {
        print("Vehicle \\(brand) видалено з пам'яті")
    }
}

// 2. Дочірній клас зі спадкуванням
class ElectricCar: Vehicle {
    var batteryPercentage: Int
    
    init(brand: String, batteryPercentage: Int) {
        self.batteryPercentage = batteryPercentage
        super.init(brand: brand)
    }
    
    override func accelerate() {
        super.accelerate()
        speed += 15.0 // Електромобіль прискорюється швидше
    }
}

let tesla = ElectricCar(brand: "Tesla Model S", batteryPercentage: 90)
tesla.accelerate()
print("Швидкість: \\(tesla.speed) км/год") // 25.0`,
      explanation: [
        '`super.init(brand: brand)` викликає ініціалізатор базового класу після того, як власні поля (`batteryPercentage`) заповнені.',
        '`override func accelerate()` замінює поведінку батьківського методу, але може викликати `super.accelerate()` для збереження базової логіки.',
        'Інші змінні можуть посилатися на той самий екземпляр.'
      ],
      underTheHood: {
        title: 'Динамічна диспетчеризація методів (vtable)',
        points: [
          'Класи використовують Dynamic Dispatch через таблицю віртуальних методів (vtable). Під час виклику методу компілятор звертається до таблиці, щоб знайти правильну реалізацію (батьківську чи перевизначену).',
          'Якщо клас не планується наслідувати, додавайте ключове слово `final class`. Це вмикає Static Dispatch і суттєво прискорює виконання коду.'
        ]
      },
      checkpoints: [
        {
          question: 'Коли викликається метод deinit у класі?',
          options: [
            'У момент, коли на обʼєкт більше не залишається жодного сильного посилання (ARC)',
            'Коли користувач натискає кнопку "Назад"',
            'Коли завершується метод viewDidLoad',
            'deinit потрібно викликати вручну через myClass.deinit()'
          ],
          correctAnswer: 0,
          explanation: 'ARC автоматично викликає deinit перед звільненням памʼяті обʼєкта.'
        }
      ],
      keyTakeaways: [
        'Класи — Reference Types: кілька змінних можуть посилатися на один екземпляр.',
        'Підтримують спадкування та перевизначення `override`.',
        'Використовуйте `final`, щоб заборонити наслідування та прискорити виклики.'
      ],
      commonMistakes: [
        'Забування виклику `super.init()` у спадкоємцях.',
        'Використання класів для простих DTO моделей замість легких структур.'
      ],
      challenge: {
        task: 'Створіть клас `BankAccount` з полями `owner: String` та `balance: Double`. Додайте метод `withdraw(amount: Double) -> Bool`, який знімає гроші, якщо їх достатньо, і повертає true, або false у разі браку коштів.',
        hint: 'Обовʼязково напишіть init(owner:balance:)',
        solution: `class BankAccount {
    let owner: String
    var balance: Double
    
    init(owner: String, balance: Double) {
        self.owner = owner
        self.balance = balance
    }
    
    func withdraw(amount: Double) -> Bool {
        guard balance >= amount else { return false }
        balance -= amount
        return true
    }
}`
      }
    }
  },
  {
    id: 'swift-memory-arc',
    module: 3,
    moduleTitle: 'Модуль 3: ООП та Архітектура Типів',
    title: 'Керування Памʼяттю: ARC, Strong, Weak та Unowned',
    description: 'Дізнайтеся, як працює автоматичний підрахунок посилань (ARC), що таке Retain Cycles і як використовувати weak та unowned посилання.',
    difficulty: 'Просунутий',
    estimatedMinutes: 22,
    icon: 'ShieldCheck',
    content: {
      realWorldContext: 'Витік памʼяті в iOS — це невидимий вбивця додатків. Коли користувач відкриває екран чату або фотогалереї, а після закриття памʼять не звільняється, додаток роздувається до 500 МБ і iOS безжально "вбиває" його через систему jetsam (Out of Memory Crash). Розуміння ARC — обовʼязкова тема будь-якої Middle/Senior співбесіди.',
      detailedTheory: [
        {
          title: 'Як працює Automatic Reference Counting (ARC)',
          paragraphs: [
            'У Swift немає важкого Garbage Collector, як у Java чи C#. Замість цього використовується ARC (Автоматичний підрахунок посилань).',
            'Сильні посилання утримують екземпляр класу. Коли сильних посилань більше не залишається, ARC звільняє об’єкт і викликає `deinit`; точний момент завершення локального значення може залежати від оптимізацій компілятора.'
          ]
        },
        {
          title: 'Циклічні посилання (Retain Cycles)',
          paragraphs: [
            'Якщо два обʼєкти сильно посилаються один на одного й інших шляхів звільнення немає, ARC не може звільнити їх автоматично: це цикл сильних посилань.'
          ]
        },
        {
          title: 'Рішення: weak проти unowned',
          paragraphs: [
            '1. `weak`: слабке посилання, яке НЕ збільшує лічильник ARC. Воно ЗАВЖДИ має бути змінною `var` та обовʼязково опціональним (`weak var delegate: SomeDelegate?`). Коли обʼєкт знищується, `weak` посилання автоматично стає `nil`.',
            '2. `unowned`: аналог weak, але вважається, що обʼєкт ніколи не стане nil під час свого використання. Якщо ви звернетеся до знищеного unowned обʼєкта, станеться Fatal Error (використовуйте з обережністю!).'
          ]
        }
      ],
      theory: [
        'ARC веде облік посилань на обʼєкти в купі (Heap).',
        'Retain Cycle виникає, коли два обʼєкти утримують одне одного сильними посиланнями.',
        '`weak` посилання є опціональним і не утримує обʼєкт; коли обʼєкт звільняється, посилання стає `nil`.',
        '`unowned` очікує, що обʼєкт завжди живий.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Розірвання циклу через weak delegate',
          code: `class Apartment {
    let unit: String
    weak var tenant: Person? // Слабке посилання!
    
    init(unit: String) { self.unit = unit }
    deinit { print("Квартира \\(unit) звільнена з пам'яті") }
}`,
          explanation: 'weak посилання не збільшує лічильник ARC, що дозволяє обом обʼєктам коректно очиститись.'
        },
        bad: {
          title: 'Сильне взаємне посилання (Retain Cycle)',
          code: `class Apartment {
    let unit: String
    var tenant: Person? // СИЛЬНЕ посилання!
    
    init(unit: String) { self.unit = unit }
    deinit { print("Цей deinit НІКОЛИ не викличеться!") }
}`,
          explanation: 'Взаємні strong посилання заморожують обидва обʼєкти в оперативній памʼяті назавжди.'
        }
      },
      codeSnippet: `class Person {
    let name: String
    var apartment: Apartment?
    
    init(name: String) {
        self.name = name
        print("\\(name) ініціалізовано")
    }
    
    deinit {
        print("\\(name) видалено з пам'яті (deinit)")
    }
}

class Apartment {
    let unitNumber: String
    weak var tenant: Person? // Слабке посилання захищає від витоку
    
    init(unitNumber: String) {
        self.unitNumber = unitNumber
    }
    
    deinit {
        print("Квартира \\(unitNumber) видалена з пам'яті")
    }
}

// Демонстрація життєвого циклу
var alex: Person? = Person(name: "Олексій")
var flat: Apartment? = Apartment(unitNumber: "42-B")

alex?.apartment = flat
flat?.tenant = alex

// Звільняємо змінні
alex = nil // Person видаляється, flat.tenant автоматично стає nil!
flat = nil // Apartment також успішно видаляється!`,
      explanation: [
        'Завдяки `weak var tenant: Person?` створення звʼязку не блокує видалення Олексія.',
        'Коли зникає останнє сильне посилання на `alex`, ARC звільняє обʼєкт і викликає `deinit`; слабкі посилання на нього стають `nil`.'
      ],
      underTheHood: {
        title: 'Таблиці Side Tables у середовищі Swift Runtime',
        points: [
          'Як Swift обнуляє `weak` посилання в `nil` без крашів?',
          'Коли на обʼєкт вперше створюється `weak` посилання, Swift створює допоміжну структуру — Side Table, яка окремо зберігає лічильник слабких посилань.',
          'Коли сильний лічильник падає до 0, сам обʼєкт деініціалізується, але Side Table залишається жити, поки всі слабкі посилання не будуть переведені в `nil`.'
        ]
      },
      checkpoints: [
        {
          question: 'Чому weak посилання обовʼязково має бути оголошене як var та мати опціональний тип?',
          options: [
            'Тому що система повинна мати змогу записати туди nil, коли обʼєкт буде видалено',
            'Тому що let не підтримує класи',
            'Це просто домовленість команди Apple',
            'Щоб прискорити роботу компілятора'
          ],
          correctAnswer: 0,
          explanation: 'Коли цільовий обʼєкт вивільняється, ARC автоматично встановлює слабке посилання в nil, що вимагає var та Optional.'
        }
      ],
      keyTakeaways: [
        'ARC керує памʼяттю автоматично, рахуючи strong посилання.',
        'Retain Cycles трапляються в делегатах, звʼязках батько-дитина та замиканнях.',
        'Завжди позначайте делегати як `weak var delegate: SomeDelegate?`.'
      ],
      commonMistakes: [
        'Оголошення делегатів через звичайний `var` без `weak`.',
        'Використання `unowned` замість `weak` для обʼєктів, які можуть померти раніше.'
      ],
      challenge: {
        task: 'Опишіть клас `VideoPlayer` та клас `PlayerController`. У контролері створіть сильне посилання на плеєр, а у плеєрі — слабке `weak` посилання на контролер, щоб уникнути Retain Cycle.',
        hint: 'Використовуйте weak var controller: PlayerController?',
        solution: `class PlayerController {
    var player: VideoPlayer?
}

class VideoPlayer {
    weak var controller: PlayerController?
}`
      }
    }
  },
  {
    id: 'swift-enums-associated-values',
    module: 3,
    moduleTitle: 'Модуль 3: ООП та Архітектура Типів',
    title: 'Перелічення (enum) та Стан Екрана (State Modeling)',
    description: 'Дізнайтеся, чому Enum у Swift — це суперсила: Associated Values, Raw Values, моделювання станів екрана (Loading, Success, Error) та CaseIterable.',
    difficulty: 'Середній',
    estimatedMinutes: 18,
    icon: 'Layers',
    content: {
      realWorldContext: 'Будь-який мобільний екран може перебувати в одному з 4 взаємовиключних станів: "Завантаження", "Контент", "Помилка" або "Порожній список". Замість створення трьох прапорців `isLoading: Bool`, `hasError: Bool`, `errorMessage: String?`, професійні розробники використовують один елегантний Enum з Associated Values.',
      detailedTheory: [
        {
          title: 'Чим Enum у Swift відрізняється від інших мов',
          paragraphs: [
            'У більшості мов перелічення — це просто гарні обгортки над цілими числами. У Swift `enum` — це повноцінний першокласний тип.',
            'Він може містити методи, обчислювальні властивості, і найголовніше — Асоційовані Значення (Associated Values). Кожен кейс може нести з собою будь-який обсяг власних даних.'
          ]
        },
        {
          title: 'Моделювання стану інтерфейсу (UI ViewState)',
          paragraphs: [
            'Завдяки Associated Values ми можемо описати стан екрана так, що стан помилки просто фізично не зможе існувати одночасно зі станом завантаження. Це усуває цілий клас суперечливих станів UI.'
          ]
        }
      ],
      theory: [
        'Enum у Swift підтримує Associated Values (прикріплені дані до кожного case).',
        'Підтримує Raw Values (фіксовані типи: String, Int).',
        'Протокол `CaseIterable` дозволяє отримати `.allCases`.',
        'Ідеальний інструмент для моделювання ViewState у SwiftUI.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Безпечний Enum ViewState з Associated Values',
          code: `enum ViewState {
    case idle
    case loading
    case success([String])
    case failure(String)
}

// Неможливо опинитися в стані "і завантаження, і успіх одночасно"!
let currentState: ViewState = .success(["Post 1", "Post 2"])`,
          explanation: 'Enum гарантує, що екран має рівно один активний стан з відповідними йому даними.'
        },
        bad: {
          title: 'Суперечливі булеві прапорці (Boolean Blindness)',
          code: `var isLoading = false
var isSuccess = true
var errorMessage: String? = "Збій мережі" // Суперечність!

// Баг інтерфейсу: показується спінер чи екран помилки?`,
          explanation: 'Кілька булевих змінних створюють комбінаторний вибух невалідних станів.'
        }
      },
      codeSnippet: `// 1. Оголошення Enum для мережевого стану
enum NetworkResult<T> {
    case success(data: T, statusCode: Int)
    case failure(error: String)
}

// 2. Enum із Raw Values (Рядкові значення для збереження)
enum UserRole: String, CaseIterable {
    case admin = "ADMINISTRATOR"
    case moderator = "MODERATOR"
    case student = "STUDENT"
}

// 3. Обробка стану через switch з витягуванням значень (Pattern Matching)
let apiResponse: NetworkResult<String> = .success(data: "Користувача авторизовано", statusCode: 200)

switch apiResponse {
case .success(let data, let code):
    print("Успіх [\\(code)]: \\(data)")
case .failure(let error):
    print("Помилка: \\(error)")
}

// Отримання всіх кейсів
print("Усі ролі в системі: \\(UserRole.allCases.map { $0.rawValue })")`,
      explanation: [
        'Синтаксис `case .success(let data, let code)` розпаковує асоційовані дані прямо у гілці `switch`.',
        '`UserRole: String` автоматично робить rawValue рядками, що зручно для збереження в базу даних чи парсингу JSON.',
        '`CaseIterable` генерує масив `allCases` автоматично.'
      ],
      underTheHood: {
        title: 'Як Enum з Associated Values зберігається в памʼяті',
        points: [
          'Swift виділяє під такий `enum` стільки байт, скільки потрібно для збереження найбільшого з його асоційованих кейсів, плюс 1 байт під дискримінатор тегу (Tag Byte), який вказує процесору, який саме case зараз активний.',
          'Це вкрай компактна та оптимізована структура памʼяті.'
        ]
      },
      checkpoints: [
        {
          question: 'Для чого потрібні Associated Values у Swift Enum?',
          options: [
            'Щоб прикріпляти довільні корисні дані до конкретного кейсу перелічення',
            'Щоб перелічення працювало швидше',
            'Щоб конвертувати enum у цілі числа',
            'Для звʼязку з CoreData'
          ],
          correctAnswer: 0,
          explanation: 'Associated Values дозволяють передавати параметри разом із кейсом (наприклад, case failure(String)).'
        }
      ],
      keyTakeaways: [
        'Замінюйте набори булевих прапорців одним `enum ViewState`.',
        'Associated Values дозволяють безпечно передавати дані відповідного стану.',
        'Використовуйте `CaseIterable` для легкого виведення списків опцій у SwiftUI Picker.'
      ],
      commonMistakes: [
        'Зберігання кількох прапорців `isLoading`, `isError` замість єдиного стейт-енума.',
        'Спроба примусово змусити enum наслідуватися від класів (enum у Swift підтримує протоколи, але не наслідування).'
      ],
      challenge: {
        task: 'Створіть `enum PaymentMethod` з кейсами `applePay`, `creditCard(last4: String)` та `cash`. Опишіть обчислювальну властивість `title: String`, яка повертає текстову назву для кожного способу оплати.',
        hint: 'Використовуйте switch self всередині var title: String { ... }',
        solution: `enum PaymentMethod {
    case applePay
    case creditCard(last4: String)
    case cash
    
    var title: String {
        switch self {
        case .applePay: return "Apple Pay"
        case .creditCard(let last4): return "Карта закінчується на \\(last4)"
        case .cash: return "Готівка"
        }
    }
}`
      }
    }
  },
  {
    id: 'swift-protocols-extensions',
    module: 3,
    moduleTitle: 'Модуль 3: ООП та Архітектура Типів',
    title: 'Протоколи (protocol) та Розширення (extension)',
    description: 'Основа протокольно-орієнтованого програмування (POP): визначення контрактів, Protocol Extensions, поліморфізм та модульність коду.',
    difficulty: 'Середній',
    estimatedMinutes: 20,
    icon: 'Sparkles',
    content: {
      realWorldContext: 'Apple заявляє: "Swift — це протокольно-орієнтована мова". Замість побудови складних гігантських ієрархій наслідування класів (як у старому ООП), в iOS розробці прийнято збирати функціонал через маленькі, сфокусовані протоколи (`Identifiable`, `Equatable`, `Codable`, `View`).',
      detailedTheory: [
        {
          title: 'Що таке Протокол (Protocol)?',
          paragraphs: [
            'Протокол визначає "контракт" — план вимог до методів, властивостей та функціоналу, який повинен надати будь-який тип, що підписується під нього.',
            'На відміну від класів, де наслідування можливе лише від одного батька (Single Inheritance), структура або клас у Swift можуть відповідати НЕОБМЕЖЕНІЙ кількості протоколів одночасно.'
          ]
        },
        {
          title: 'Розширення протоколів (Protocol Extensions)',
          paragraphs: [
            'Унікальна фіча Swift: ви можете написати розширення для протоколу (`extension MyProtocol`) і надати реалізацію методів за замовчуванням (Default Implementation).',
            'Усі типи, що підпишуться на цей протокол, автоматично отримають цю поведінку без повторного написання коду!'
          ]
        }
      ],
      theory: [
        'Протокол — це контракт вимог без власної памʼяті.',
        'Підтримується множинне підписання на протоколи.',
        'Extension дозволяє додавати методи до будь-яких існуючих типів (навіть до стандартних `String` чи `Int`).',
        'Protocol Extensions надають реалізацію за замовчуванням.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Композиція через протоколи (Protocol-Oriented)',
          code: `protocol IdentifiableEntity { var id: String { get } }
protocol JSONSerializable { func toJSON() -> String }

// Легка структура комбінує поведінки
struct User: IdentifiableEntity, JSONSerializable {
    let id: String
    func toJSON() -> String { "{\\"id\\": \\"\\(id)\\"}" }
}`,
          explanation: 'Гнучка композиція: тип бере лише ті можливості, які йому потрібні, без важкого спадкування.'
        },
        bad: {
          title: 'Монолітна піраміда спадкування класів',
          code: `class BaseObject { var id = "" }
class NetworkObject: BaseObject { /* 500 рядків коду */ }
class UserObject: NetworkObject { /* Тягне за собою всю вагу предків */ }`,
          explanation: 'Жорстка привʼязка до предка тягне за собою непотрібний функціонал та ускладнює тестування.'
        }
      },
      codeSnippet: `// 1. Оголошення протоколу
protocol Payable {
    var totalAmount: Double { get }
    func processPayment() -> Bool
}

// 2. Реалізація за замовчуванням через extension
extension Payable {
    func printReceipt() {
        print("Чек сформовано на суму: $\\(totalAmount)")
    }
}

// 3. Підписання структури під протокол
struct Order: Payable {
    let orderID: String
    let itemsCount: Int
    let totalAmount: Double
    
    func processPayment() -> Bool {
        print("Списання $\\(totalAmount) для замовлення #\\(orderID)")
        return true
    }
}

let order = Order(orderID: "UA-9901", itemsCount: 3, totalAmount: 49.99)
_ = order.processPayment()
order.printReceipt() // Метод отримано безкоштовно з extension!`,
      explanation: [
        'Вимога `{ get }` означає, що властивість має бути доступна для читання (може бути як `let`, так і обчислювальною `var`).',
        '`extension Payable` надав готовий метод `printReceipt()`, тому в структурі `Order` писати його з нуля не довелося.',
        'Один протокол може наслідувати інший протокол (`protocol Special: Payable`).'
      ],
      underTheHood: {
        title: 'Екзистенційні контейнери (Existential Containers)',
        points: [
          'Коли ви використовуєте протокол як тип `let p: Payable = order`, Swift упаковує значення в спеціальний Existential Container розміром у 5 машинних слів (40 байт).',
          'Він містить буфер для даних, таблицю свідків протоколу (Protocol Witness Table - PWT) та метадані типу. Саме PWT забезпечує виклик правильних методів у runtime.'
        ]
      },
      checkpoints: [
        {
          question: 'Чи можна за допомогою extension додати метод до стандартного типу Swift, наприклад String?',
          options: [
            'Так, розширення можуть додавати методи та обчислювальні властивості до будь-якого типу',
            'Ні, системні типи Apple змінювати суворо заборонено',
            'Тільки якщо у вас є вихідний код Swift',
            'Тільки в бета-версіях Xcode'
          ],
          correctAnswer: 0,
          explanation: 'Extensions у Swift дозволяють розширювати навіть стандартні структури мови новими корисними методами.'
        }
      ],
      keyTakeaways: [
        'Swift заохочує композицію замість глибокого спадкування класів.',
        'Protocol Extensions дають змогу писати спільну логіку для багатьох типів.',
        'Стандартні протоколи `Equatable`, `Comparable`, `Identifiable` — фундамент SwiftUI.'
      ],
      commonMistakes: [
        'Спроба додати збережену властивість (`stored property` зі значенням) усередину `extension` (дозволені тільки обчислювальні `computed properties`).',
        'Створення надто великих "божественних" протоколів замість маленьких сфокусованих.'
      ],
      challenge: {
        task: 'Напишіть `extension Int`, який додає метод `squared() -> Int`, що повертає квадрат числа (self * self).',
        hint: 'Використовуйте extension Int { func squared() -> Int { return self * self } }',
        solution: `extension Int {
    func squared() -> Int {
        return self * self
    }
}`
      }
    }
  }
];

