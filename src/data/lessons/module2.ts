import { Lesson } from '@/types';

export const module2Lessons: Lesson[] = [
  {
    id: 'swift-collections-arrays',
    module: 2,
    moduleTitle: 'Модуль 2: Колекції та Алгоритми',
    title: 'Масиви (Array) та Цикли у Swift',
    description: 'Опануйте впорядковані колекції: динамічні масиви, методи додавання/видалення, безпечний доступ за індексом та цикли for-in.',
    difficulty: 'Початковий',
    estimatedMinutes: 16,
    icon: 'List',
    content: {
      realWorldContext: 'Стрічка новин Instagram, плейлист Apple Music, список діалогів у месенджері — це все впорядковані списки (Array). Неправильна робота з індексами масиву є найпоширенішою причиною помилки "Index out of range", яка призводить до крашу додатка.',
      detailedTheory: [
        {
          title: 'Основи масивів (Array)',
          paragraphs: [
            'Масив у Swift — це впорядкована колекція елементів однакового типу з індексацією від `0`.',
            'Масиви є Value Types (типами значень): коли ви присвоюєте масив іншій змінній або передаєте у функцію, створюється його незалежна копія (завдяки механізму Copy-on-Write це відбувається надзвичайно швидко).'
          ],
          callout: {
            type: 'warning',
            title: 'Index Out of Range!',
            text: 'Спроба звернутися за індексом, якого не існує (наприклад, `items[10]`, коли в масиві лише 3 елементи), спричиняє негайний Fatal Error. Завжди перевіряйте `indices.contains(index)` або використовуйте безпечні розширення.'
          }
        },
        {
          title: 'Ітерація через цикли for-in та enumerated()',
          paragraphs: [
            'Цикл `for item in array` дозволяє швидко пройтись по всіх елементах без ручного лічильника.',
            'Якщо вам потрібен одночасно і порядковий номер (індекс), і сам елемент, використовуйте метод `.enumerated()`, який повертає кортеж `(index, element)`.'
          ]
        }
      ],
      theory: [
        'Масиви — впорядковані колекції однакових типів з нульовою індексацією.',
        'Доступ за неіснуючим індексом викликає Fatal Error.',
        'Цикл `for-in` та метод `enumerated()` — стандартні інструменти обходу.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Безпечний обхід через for-in або перевірка first/indices',
          code: `let tracks = ["Track 1", "Track 2", "Track 3"]

// 1. Ідіоматичний for-in
for (index, track) in tracks.enumerated() {
    print("\\(index + 1). \\(track)")
}

// 2. Безпечний доступ до першого елемента
if let firstTrack = tracks.first {
    print("Грає: \\(firstTrack)")
}`,
          explanation: 'Властивості `.first` і `.last` повертають Optional: для порожнього масиву результатом буде `nil`, тож код може явно обробити цей випадок.'
        },
        bad: {
          title: 'Небезпечний доступ за фіксованим індексом [0]',
          code: `var tracks: [String] = []

// Якщо масив порожній — КРАШ ДОДАТКА!
let current = tracks[0]
print(current)`,
          explanation: 'Звернення до tracks[0] без попередньої перевірки на порожнечу призведе до падіння додатка з Fatal Error: Index out of range.'
        }
      },
      codeSnippet: `// 1. Оголошення та модифікація масиву
var shoppingCart: [String] = ["MacBook Pro", "AirPods Max"]

shoppingCart.append("iPhone 16 Pro")
shoppingCart.insert("Apple Watch Ultra", at: 0) // Вставка на початок

// 2. Безпечне видалення та перевірки
if !shoppingCart.isEmpty {
    let removedItem = shoppingCart.removeLast()
    print("Видалено з кошика: \\(removedItem)")
}

// 3. Ітерація по діапазону
for i in stride(from: 0, to: 10, by: 2) {
    print("Крок лічильника: \\(i)") // 0, 2, 4, 6, 8
}`,
      explanation: [
        '`.append(item)` додає елемент у кінець масиву за час O(1).',
        '`.insert(item, at: 0)` зсуває всі елементи вправо і займає час O(N).',
        '`stride(from:to:by:)` дає змогу крокувати з довільним інтервалом без створення додаткових масивів у памʼяті.'
      ],
      underTheHood: {
        title: 'Механізм Copy-on-Write (CoW)',
        points: [
          'У Swift масиви зберігають свої дані в динамічній памʼяті (Heap) через прихований буфер.',
          'Коли ви копіюєте масив `let b = a`, памʼять НЕ дублюється одразу. Обидва масиви вказують на одну й ту саму область даних.',
          'Реальне клонування памʼяті (фізичне копіювання байтів) відбувається лише в той момент, коли один із масивів намагається змінити свій вміст (Copy-on-Write). Це робить передачу масивів у Swift супершвидкою.'
        ]
      },
      checkpoints: [
        {
          question: 'Яке значення повертає вираз [1, 2, 3].first?',
          options: ['1', 'Optional(1)', '3', 'Fatal Error'],
          correctAnswer: 1,
          explanation: 'Властивість .first повертає опціонал Element? (якщо масив порожній — повернеться nil).'
        }
      ],
      keyTakeaways: [
        'Масиви нумеруються з 0.',
        'Використовуйте `.first` та `.last` замість `array[0]`, щоб уникнути Index out of range.',
        'Copy-on-Write оптимізує передачу масивів між функціями.'
      ],
      commonMistakes: [
        'Пряме звернення за індексом `array[i]` без перевірки розміру.',
        'Використання C-подібних циклів з лічильниками там, де достатньо простого `for item in array`.'
      ],
      challenge: {
        task: 'Напишіть функцію `safeGet(from array: [String], at index: Int) -> String?`, яка перевіряє, чи входить індекс у межі масиву, і повертає елемент або nil.',
        hint: 'Використовуйте array.indices.contains(index)',
        solution: `func safeGet(from array: [String], at index: Int) -> String? {
    guard array.indices.contains(index) else { return nil }
    return array[index]
}`
      }
    }
  },
  {
    id: 'swift-collections-dict-set',
    module: 2,
    moduleTitle: 'Модуль 2: Колекції та Алгоритми',
    title: 'Словники (Dictionary) та Множини (Set)',
    description: 'Дізнайтеся про колекції на основі геш-таблиць: пошук зі швидкістю O(1), унікальність елементів у Set та роботу з парами ключ-значення.',
    difficulty: 'Початковий',
    estimatedMinutes: 16,
    icon: 'Layers',
    content: {
      realWorldContext: 'Коли вам потрібно миттєво знайти користувача за його `userID` або кешувати переклади додатку, масив не підходить: пошук перебором у масиві з 10 000 елементів гальмує UI. Пошук у словнику й множині зазвичай має середню складність близьку до O(1), але в окремих випадках може бути повільнішим.',
      detailedTheory: [
        {
          title: 'Словники (Dictionary): Пари Ключ-Значення',
          paragraphs: [
            'Словник зберігає асоціації між унікальними ключами та їхніми значеннями (`[Key: Value]`).',
            'Важлива особливість: доступ за ключем `dict["myKey"]` повертає опціонал (`Value?`), оскільки запитаного ключа може не бути в словнику.'
          ],
          callout: {
            type: 'tip',
            title: 'Дефолтні значення у Dictionary',
            text: 'Swift дозволяє передати дефолтне значення прямо у сабскрипт: `counts[word, default: 0] += 1`. Це позбавляє необхідності писати зайві розгортання опціоналів.'
          }
        },
        {
          title: 'Множини (Set): Гарантія Унікальності',
          paragraphs: [
            'Set зберігає невпорядковані елементи, де кожен елемент зустрічається рівно один раз.',
            'Щоб тип міг зберігатися в Set або бути ключем у Dictionary, він зобовʼязаний відповідати протоколу `Hashable` (базові типи `String`, `Int`, `UUID` підтримують його "з коробки").'
          ]
        }
      ],
      theory: [
        'Dictionary зберігає пари ключ-значення, пошук за ключем повертає Optional.',
        'Set гарантує унікальність елементів; перевірка `.contains()` має середню складність близьку до O(1).',
        'Ключі Dictionary та елементи Set мають підтримувати протокол Hashable.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Перевірка присутності через Set за час O(1)',
          code: `let blockedUserIDs: Set<String> = ["id_101", "id_202", "id_303"]

// Миттєва перевірка без навантаження на процесор
if blockedUserIDs.contains("id_202") {
    print("Доступ заборонено")
}`,
          explanation: 'Set.contains працює за час O(1) через геш-таблицю, незалежно від кількості заблокованих користувачів.'
        },
        bad: {
          title: 'Пошук через Array.contains за O(N)',
          code: `let blockedUserIDs: [String] = ["id_101", "id_202", "id_303"]

// Повільний лінійний перебір кожного елемента
if blockedUserIDs.contains("id_202") {
    print("Доступ заборонено")
}`,
          explanation: 'У великому масиві Array.contains перебирає всі елементи по черзі (O(N)), що сповільнює роботу мобільного пристрою.'
        }
      },
      codeSnippet: `// 1. Робота зі словником (Dictionary)
var userSettings: [String: String] = [
    "theme": "Dark",
    "language": "uk-UA"
]

// Доступ повертає String? (опціонал)
let currentTheme = userSettings["theme"] ?? "System"
print("Обрана тема: \\(currentTheme)")

// Оновлення значення
userSettings["fontSize"] = "Large"

// 2. Робота з множиною (Set)
var tags: Set<String> = ["swift", "ios", "swiftui", "swift"]
print("Кількість унікальних тегів: \\(tags.count)") // 3 (дублікат "swift" видалено)

tags.insert("concurrency")
let hasiOS = tags.contains("ios") // true`,
      explanation: [
        'Пошук у `Set.contains()` виконується за сталий час O(1) завдяки внутрішньому обчисленню геш-суми.',
        '`userSettings["fontSize"] = "Large"` додає новий ключ або перезаписує існуючий, якщо він уже був.',
        'Дублікат "swift" у Set автоматично ігнорується.'
      ],
      underTheHood: {
        title: 'Як працює протокол Hashable',
        points: [
          'Коли ви кладете ключ у словник, Swift викликає `hash(into: &hasher)` і отримує 64-бітне число (геш-код).',
          'Це число вказує на точну "комірку" (bucket) у внутрішньому масиві памʼяті. Завдяки цьому пошук не вимагає перебору всіх елементів.'
        ]
      },
      checkpoints: [
        {
          question: 'Чому звернення до словника dict["key"] завжди повертає опціонал?',
          options: [
            'Тому що ключ може бути відсутній у словнику',
            'Тому що Swift повільно витягує дані',
            'Це обмеження мови C',
            'Значення в словнику завжди є строками'
          ],
          correctAnswer: 0,
          explanation: 'Якщо запитаного ключа немає, словник повертає nil замість аварійного падіння додатку.'
        }
      ],
      keyTakeaways: [
        'Dictionary для пар "ключ -> значення".',
        'Set для унікальних колекцій та супершвидкого пошуку `.contains()`.',
        'Ключі повинні підтримувати `Hashable`.'
      ],
      commonMistakes: [
        'Забування, що `dict[key]` повертає опціонал, і спроба форс-анврапу `dict[key]!`.',
        'Використання Array замість Set для перевірки списку унікальних ID.'
      ],
      challenge: {
        task: 'Напишіть функцію `countWordFrequencies(words: [String]) -> [String: Int]`, яка підраховує, скільки разів кожне слово зустрічається у списку слів.',
        hint: 'Використовуйте dict[word, default: 0] += 1',
        solution: `func countWordFrequencies(words: [String]) -> [String: Int] {
    var counts: [String: Int] = [:]
    for word in words {
        counts[word, default: 0] += 1
    }
    return counts
}`
      }
    }
  },
  {
    id: 'swift-closures-deep-dive',
    module: 2,
    moduleTitle: 'Модуль 2: Колекції та Алгоритми',
    title: 'Замикання (Closures): Захоплення та @escaping',
    description: 'Опануйте бекграунд-блоки Swift: замикання, скорочений запис $0, списки захоплення [weak self] та асинхронні замикання @escaping.',
    difficulty: 'Середній',
    estimatedMinutes: 20,
    icon: 'Zap',
    content: {
      realWorldContext: 'Кожен раз, коли ви натискаєте кнопку в SwiftUI, завантажуєте дані з сервера або анімуєте екран, ви використовуєте замикання (Closures). Нерозуміння того, як замикання захоплюють памʼять, є головною причиною витоків памʼяті (Memory Leaks) у iOS.',
      detailedTheory: [
        {
          title: 'Що таке Closure (Замикання)?',
          paragraphs: [
            'Замикання — це самодостатній блок коду, який можна передавати та використовувати у вашій програмі (аналог анонімних функцій чи лямбд в інших мовах).',
            'Синтаксис замикання: `{ (параметри) -> ТипПовернення in тілоКоду }`. Ключове слово `in` розділяє оголошення аргументів та сам код.'
          ]
        },
        {
          title: 'Скорочений синтаксис та аргументи $0, $1',
          paragraphs: [
            'Swift дозволяє писати замикання надзвичайно лаконічно. Якщо тип параметрів відомий, можна опускати типи, повернення і навіть імена параметрів, замінюючи їх позиційними іменами `$0` (перший аргумент), `$1` (другий).'
          ]
        },
        {
          title: 'Модифікатор @escaping та списки захоплення [weak self]',
          paragraphs: [
            'Якщо замикання викликається ПІСЛЯ того, як функція завершила своє виконання (наприклад, після завершення мережевого запиту через 2 секунди), воно повинно бути позначене атрибутом `@escaping`.',
            'Оскільки замикання зберігає посилання на навколишні обʼєкти, використовуйте `[weak self]`, щоб розірвати сильне циклічне посилання (Strong Reference Cycle).'
          ],
          callout: {
            type: 'warning',
            title: 'Увага: Retain Cycle',
            text: 'Якщо обʼєкт сильно утримує замикання, а замикання сильно захоплює цей самий обʼєкт через `self`, виникає цикл сильних посилань. Він не зникає автоматично, доки не розірвати цикл.'
          }
        }
      ],
      theory: [
        'Замикання — це анонімні функції, здатні захоплювати змінні зі свого оточення.',
        'Скорочений запис $0, $1 робить код функціональним і компактним.',
        '@escaping замикання виконуються асинхронно, для запобігання витокам памʼяті потрібен `[weak self]`.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Безпечне захоплення через [weak self]',
          code: `class ProfileViewModel {
    var username = "Steve"
    
    func loadData(completion: @escaping () -> Void) {
        DispatchQueue.global().async { [weak self] in
            // Безпечно: self не утримується силоміць
            guard let self = self else { return }
            print("Оновлено дані для: \\(self.username)")
            completion()
        }
    }
}`,
          explanation: '[weak self] запобігає витоку памʼяті: якщо користувач закрив екран до завершення запиту, контролер коректно вивільняється з RAM.'
        },
        bad: {
          title: 'Пряме захоплення self (Витік памʼяті)',
          code: `class ProfileViewModel {
    var username = "Steve"
    
    func loadData() {
        DispatchQueue.global().async {
            // Витік пам'яті (Retain Cycle)!
            print("Оновлено дані для: \\(self.username)")
        }
    }
}`,
          explanation: 'Пряме звернення до self всередині тривалого асинхронного блоку тримає весь обʼєкт у памʼяті.'
        }
      },
      codeSnippet: `// 1. Повний синтаксис замикання
let multiply: (Int, Int) -> Int = { (a: Int, b: Int) -> Int in
    return a * b
}
print(multiply(4, 5)) // 20

// 2. Скорочений синтаксис із $0 та $1
let numbers = [5, 2, 8, 1, 9]
let sortedDescending = numbers.sorted { $0 > $1 }
print(sortedDescending) // [9, 8, 5, 2, 1]

// 3. Trailing Closure (замикання, що винесене за дужки)
func executeTask(action: () -> Void) {
    print("Початок задачі")
    action()
    print("Кінець задачі")
}

executeTask {
    print("Виконується головна робота...")
}`,
      explanation: [
        'Коли останній параметр функції є замиканням, його можна винести за круглі дужки — це називається Trailing Closure Syntax.',
        '`numbers.sorted { $0 > $1 }` порівнює елементи без оголошення проміжних змінних.',
        'Замикання є Reference Types: коли ви присвоюєте замикання змінній, копіюється лише вказівник.'
      ],
      underTheHood: {
        title: 'Як замикання захоплює контекст у купі (Heap)',
        points: [
          'Якщо замикання захоплює локальну змінну, Swift автоматично виділяє для цієї змінної памʼять у купі (Heap Box), навіть якщо сама функція, де вона була створена, вже відпрацювала.',
          'Це дозволяє замиканню безпечно використовувати змінну пізніше в часі.'
        ]
      },
      checkpoints: [
        {
          question: 'Що означає модифікатор @escaping перед типом замикання у функції?',
          options: [
            'Замикання буде викликано після того, як сама функція завершить виконання',
            'Замикання виконується у фоновому потоці автоматично',
            'Замикання не може приймати жодних параметрів',
            'Замикання призводить до крашу'
          ],
          correctAnswer: 0,
          explanation: '@escaping вказує компілятору, що замикання виходить за межі часу життя функції (наприклад, у мережевому колбеку).'
        }
      ],
      keyTakeaways: [
        'Замикання — основа асинхронності та обробки подій у Swift.',
        'Використовуйте скорочення `$0`, `$1` для простих операцій.',
        'Перевіряйте граф володіння обʼєктами та захоплення `self`; `[weak self]` використовуйте там, де це відповідає очікуваному часу життя.'
      ],
      commonMistakes: [
        'Забування ключового слова `in` при вказанні параметрів у фігурних дужках.',
        'Сильне захоплення `self` всередині довгих мережевих або таймерних замикань.'
      ],
      challenge: {
        task: 'Створіть функцію `filterEvenNumbers(_ numbers: [Int], isEven: (Int) -> Bool) -> [Int]`, яка фільтрує лише ті числа, для яких замикання повертає true.',
        hint: 'Використовуйте for number in numbers та виклик isEven(number)',
        solution: `func filterEvenNumbers(_ numbers: [Int], isEven: (Int) -> Bool) -> [Int] {
    var result: [Int] = []
    for num in numbers {
        if isEven(num) {
            result.append(num)
        }
    }
    return result
}`
      }
    }
  },
  {
    id: 'swift-functional-methods',
    module: 2,
    moduleTitle: 'Модуль 2: Колекції та Алгоритми',
    title: 'Функціональні Методи: map, filter, reduce та compactMap',
    description: 'Перетворюйте дані декларативно: трансформуйте списки через map, відсікайте зайве з filter, рахуйте суми через reduce та прибирайте nil з compactMap.',
    difficulty: 'Середній',
    estimatedMinutes: 18,
    icon: 'Sparkles',
    content: {
      realWorldContext: 'Сучасна iOS-розробка майже не використовує ручні цикли `for` для обробки даних. Перетворення сирого JSON від сервера в обʼєкти інтерфейсу, пошук по каталогу товарів або підрахунок загальної вартості кошика у професійних додатках робиться в один ланцюжок функціональних методів.',
      detailedTheory: [
        {
          title: 'Четвірка головних функціональних методів',
          paragraphs: [
            '1. `.map { ... }`: трансформує кожен елемент масиву у щось інше (наприклад, числа у рядки або моделі в UI-компоненти). Результуючий масив має рівно таку ж кількість елементів.',
            '2. `.filter { ... }`: повертає лише ті елементи, які задовольняють умову (де замикання повертає `true`).',
            '3. `.reduce(початковеЗначення) { ... }`: згортає всю колекцію в одне єдине значення (суму, обʼєднаний рядок тощо).',
            '4. `.compactMap { ... }`: трансформує елементи і автоматично викидає всі `nil` значення, розгортаючи опціонали.'
          ]
        }
      ],
      theory: [
        'Функціональні методи дозволяють обробляти масиви декларативно без проміжних мутуючих змінних.',
        'map трансформує елементи 1-в-1.',
        'compactMap прибирає nil результати.',
        'reduce акумулює значення в єдиний результат.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Декларативний ланцюжок Swift',
          code: `let rawInputs = ["10", "abc", "42", "7", "zero"]

// Конвертуємо валідні числа, залишаємо парні, рахуємо їх суму
let sumOfEvens = rawInputs
    .compactMap { Int($0) }
    .filter { $0 % 2 == 0 }
    .reduce(0, +)

print("Сума парних: \\(sumOfEvens)") // 10 + 42 = 52`,
          explanation: 'Код не містить жодного тимчасового var масиву, легко тестується та читається як покроковий пайплайн.'
        },
        bad: {
          title: 'Імперативний цикл із ручними прапорцями',
          code: `let rawInputs = ["10", "abc", "42", "7", "zero"]
var sumOfEvens = 0

for item in rawInputs {
    if let number = Int(item) {
        if number % 2 == 0 {
            sumOfEvens += number
        }
    }
}`,
          explanation: 'Багато рядків коду, зайві змінні стану var та глибока вкладеність умов.'
        }
      },
      codeSnippet: `struct Product {
    let name: String
    let price: Double
    let isAvailable: Bool
}

let catalog = [
    Product(name: "Magic Mouse", price: 79.0, isAvailable: true),
    Product(name: "AirPods Pro", price: 249.0, isAvailable: false),
    Product(name: "Studio Display", price: 1599.0, isAvailable: true)
]

// 1. filter: Тільки товари в наявності
let available = catalog.filter { $0.isAvailable }

// 2. map: Список назв товарів у верхньому регістрі
let productTitles = available.map { $0.name.uppercased() }
print("Доступні товари: \\(productTitles)")

// 3. reduce: Загальна вартість усіх доступних товарів
let totalPrice = available.reduce(0.0) { runningTotal, product in
    runningTotal + product.price
}
print("Сума замовлення: $\\(totalPrice)")`,
      explanation: [
        '`$0.isAvailable` повертає булеве значення для відбору елементів у `filter`.',
        '`.map { $0.name.uppercased() }` перетворює масив `[Product]` у масив `[String]`.',
        '`.reduce(0.0, +)` або повний блок акумулює суму з початкового значення `0.0`.'
      ],
      underTheHood: {
        title: 'Продуктивність ланцюжків методів та Lazy Collections',
        points: [
          'Звичайний ланцюжок `.filter(...).map(...)` створює проміжний масив у памʼяті після кожного виклику.',
          'Якщо колекція містить сотні тисяч елементів, використовуйте `.lazy.filter(...).map(...)`. Це дозволяє обчислювати значення "на льоту" без виділення памʼяті під проміжні списки.'
        ]
      },
      checkpoints: [
        {
          question: 'Чим compactMap відрізняється від звичайного map?',
          options: [
            'compactMap автоматично фільтрує значення nil та розгортає Optional',
            'compactMap працює тільки зі строками',
            'compactMap сортує елементи',
            'compactMap повільніший у 10 разів'
          ],
          correctAnswer: 0,
          explanation: 'compactMap ідеальний, коли замикання повертає опціонал Element? (наприклад, при Int(string)).'
        }
      ],
      keyTakeaways: [
        '`map` змінює форму елементів.',
        '`filter` відсікає зайве.',
        '`reduce` згортає в одне значення.',
        '`compactMap` рятує від `nil`.'
      ],
      commonMistakes: [
        'Використання `map` замість `forEach` для виконання побічних ефектів (print).',
        'Створення ручних порожніх `var` масивів та додавання в них через `.append()` всередині циклу.'
      ],
      challenge: {
        task: 'Маючи масив цін `let prices = [100.0, 250.0, 50.0, 400.0]`, застосуйте знижку 20% до кожної ціни, залиште лише ті, що перевищують 100$, та відсортуйте за зростанням.',
        hint: 'Використайте ланцюжок .map { $0 * 0.8 }.filter { $0 > 100 }.sorted()',
        solution: `let prices = [100.0, 250.0, 50.0, 400.0]
let result = prices
    .map { $0 * 0.8 }
    .filter { $0 > 100 }
    .sorted()`
      }
    }
  }
];

