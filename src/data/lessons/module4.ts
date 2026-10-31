import { Lesson } from '@/types';

export const module4Lessons: Lesson[] = [
  {
    id: 'swiftui-intro-declarative',
    module: 4,
    moduleTitle: 'Модуль 4: Основи SwiftUI та Лейаут',
    title: 'Декларативний UI: Філософія SwiftUI та протокол View',
    description: 'Зрозумійте фундаментальну різницю між імперативним UIKit та декларативним SwiftUI: як влаштований протокол View та непрозорий тип some View.',
    difficulty: 'Початковий',
    estimatedMinutes: 16,
    icon: 'Smartphone',
    content: {
      realWorldContext: 'Раніше в UIKit розробники вручну створювали кнопки, додавали їх через addSubview, налаштовували десятки констрейнтів AutoLayout і вручну оновлювали текст при кожній зміні даних. SwiftUI змінив це назавжди: ви просто описуєте, ЯКИМ має бути екран для поточного стану, а фреймворк сам малює та оптимізує пікселі.',
      detailedTheory: [
        {
          title: 'Імперативний проти Декларативного підходу',
          paragraphs: [
            'В імперативному підході (UIKit) ви описуєте ПОКРОКОВІ КОМАНДИ: "створи кнопку -> пофарбуй у синій колір -> додай слухач -> коли юзер натисне, зміни текст лейбла на інший".',
            'У декларативному підході (SwiftUI) ви описуєте КІНЦЕВИЙ РЕЗУЛЬТАТ: "якщо користувач онлайн — покажи зелений бейдж, інакше сірий". Інтерфейс є прямою функцією від стану: `UI = f(State)`.'
          ]
        },
        {
          title: 'Протокол View та непрозорий тип `some View`',
          paragraphs: [
            'У SwiftUI будь-який елемент інтерфейсу є структурою, що відповідає протоколу `View`.',
            'Єдина вимога протоколу — наявність обчислювальної властивості `var body: some View`. Ключове слово `some` позначає Opaque Return Type: компілятор знає точний конкретний тип вашого UI-дерева, але приховує його складність від зовнішнього коду.'
          ],
          callout: {
            type: 'tip',
            title: 'Чому SwiftUI View — це структури, а не класи?',
            text: 'SwiftUI View зазвичай є легкими значеннями, але їх обчислення все одно має вартість. Продуктивність залежить від складності `body`, обсягу роботи та оновлень стану; її варто вимірювати профайлером.'
          }
        }
      ],
      theory: [
        'SwiftUI — декларативний фреймворк Apple: `UI = f(State)`.',
        'Усі компоненти — легкі структури з протоколом `View`.',
        '`some View` — непрозорий тип повернення (Opaque Return Type).',
        'SwiftUI автоматично оновлює інтерфейс при зміні залежних даних.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Декларативний SwiftUI',
          code: `struct StatusBadgeView: View {
    let isOnline: Bool
    
    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(isOnline ? Color.green : Color.gray)
                .frame(width: 8, height: 8)
            Text(isOnline ? "В мережі" : "Офлайн")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}`,
          explanation: 'Короткий, самоописовий та безпечний код. Зміна стану автоматично перемальовує лише потрібні елементи.'
        },
        bad: {
          title: 'Імперативний підхід UIKit (Констрейнти та мутація)',
          code: `class StatusBadgeView: UIView {
    let dot = UIView()
    let label = UILabel()
    
    func updateStatus(isOnline: Bool) {
        dot.backgroundColor = isOnline ? .green : .gray
        label.text = isOnline ? "В мережі" : "Офлайн"
        // Необхідно вручну стежити за оновленням лейауту!
    }
}`,
          explanation: 'Ручне керування життєвим циклом вʼюшки створює ризик забути викликати оновлення при зміні моделі.'
        }
      },
      codeSnippet: `import SwiftUI

struct WelcomeCardView: View {
    let username: String
    let unreadMessagesCount: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Привіт, \\(username)! 👋")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundStyle(.primary)
            
            if unreadMessagesCount > 0 {
                Text("У вас \\(unreadMessagesCount) нових сповіщень")
                    .font(.subheadline)
                    .foregroundStyle(.blue)
            } else {
                Text("Всі повідомлення прочитано")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(16)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}`,
      explanation: [
        'Всередині `var body` використовується спеціальний будівельник результатів `@ViewBuilder`, що дозволяє писати умови `if-else` прямо всередині верстки.',
        'Модифікатори `.padding()`, `.background()`, `.clipShape()` загортають елемент у нові View шар за шаром.'
      ],
      underTheHood: {
        title: 'Як SwiftUI обчислює зміни (Diffing Algorithm)',
        points: [
          'Коли залежний стан змінюється, SwiftUI повторно обчислює відповідні частини опису інтерфейсу та узгоджує зміни з поточним UI. Внутрішні деталі цього процесу є реалізацією фреймворку.',
          'SwiftUI намагається оновити інтерфейс ефективно, але плавність не гарантована: важкі обчислення чи надмірні оновлення можуть спричинити пропущені кадри.'
        ]
      },
      checkpoints: [
        {
          question: 'Що означає "some View" у властивості var body: some View?',
          options: [
            'Це непрозорий тип повернення: body повертає конкретний тип View, відомий компілятору під час збірки',
            'Це означає, що View може бути nil',
            'Це посилання на випадковий системний колір',
            'Це застарілий модифікатор'
          ],
          correctAnswer: 0,
          explanation: 'some View гарантує протоколу View, що body поверне конкретний компонент інтерфейсу без необхідності писати довгі generics назви.'
        }
      ],
      keyTakeaways: [
        'SwiftUI описує стан, а не кроки перемальовування.',
        'View зазвичай описують структурами; це не означає, що їх обчислення або зберігання стану не мають вартості.',
        'SwiftUI узгоджує UI зі станом, а анімації потрібно задавати відповідними API; плавність залежить від навантаження та реалізації.'
      ],
      commonMistakes: [
        'Спроба створити View як `class` замість `struct`.',
        'Використання важких обчислень чи блокуючих мережевих викликів прямо всередині `var body`.'
      ],
      challenge: {
        task: 'Створіть простий SwiftUI компонент `GreetingBadge`, який приймає рядок `name` та відображає його жирним шрифтом `.headline` всередині синього прямокутника з заокругленими кутами.',
        hint: 'Використовуйте Text(name).font(.headline).padding().background(Color.blue).clipShape(RoundedRectangle(cornerRadius: 10))',
        solution: `import SwiftUI

struct GreetingBadge: View {
    let name: String
    
    var body: some View {
        Text(name)
            .font(.headline)
            .foregroundStyle(.white)
            .padding()
            .background(Color.blue)
            .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}`
      }
    }
  },
  {
    id: 'swiftui-layout-stacks',
    module: 4,
    moduleTitle: 'Модуль 4: Основи SwiftUI та Лейаут',
    title: 'Лейаут-Стеки: VStack, HStack, ZStack та Spacers',
    description: 'Побудуйте будь-який сучасний інтерфейс за допомогою трьох стеків: вертикального VStack, горизонтального HStack та нашарування ZStack.',
    difficulty: 'Початковий',
    estimatedMinutes: 18,
    icon: 'Layers',
    content: {
      realWorldContext: 'Будь-який інтерфейс у iOS — від карточки товару в Amazon до екрана повідомлення в Telegram — це комбінація вкладених стеків. Зрозумівши, як стеки розподіляють вільний простір і як працює пружина `Spacer()`, ви зможете зверстати будь-який дизайн з Figma за лічені хвилини.',
      detailedTheory: [
        {
          title: 'Трійка фундаментальних контейнерів',
          paragraphs: [
            '1. `VStack (Vertical Stack)`: розміщує елементи один під одним вертикально.',
            '2. `HStack (Horizontal Stack)`: розміщує елементи поруч горизонтально зліва направо.',
            '3. `ZStack (Zero-depth Stack)`: нашаровує елементи по осі глибини один поверх одного (наприклад, бейдж або текст поверх фонового зображення).'
          ]
        },
        {
          title: 'Магія Spacer() та вирівнювання (Alignment & Spacing)',
          paragraphs: [
            '`Spacer()` — це гнучкий простір, який поводиться як стиснута пружина: він розширюється і забирає весь доступний вільний простір вздовж головної осі стека, притискаючи сусідні елементи до країв екрана.',
            'Параметр `spacing` у стеках контролює відстань між дочірніми елементами (за замовчуванням iOS підставляє системний стандарт 8-10pt).'
          ]
        }
      ],
      theory: [
        'VStack — вертикальне розміщення.',
        'HStack — горизонтальне розміщення.',
        'ZStack — нашарування по осі Z (глибина).',
        'Spacer() забирає весь вільний простір, притискаючи контент.',
        'Вирівнювання (alignment) налаштовує привʼязку контенту (leading, center, trailing).'
      ],
      comparisonSnippet: {
        good: {
          title: 'Чистий адаптивний лейаут зі Spacer',
          code: `HStack {
    VStack(alignment: .leading) {
        Text("Підписка Pro").font(.headline)
        Text("$9.99/міс").font(.subheadline).foregroundStyle(.secondary)
    }
    
    Spacer() // Пружина розштовхує елементи по краях
    
    Button("Купити") { /* дія */ }
        .buttonStyle(.borderedProminent)
}
.padding()`,
          explanation: 'Елементи ідеально адаптуються під будь-яку діагональ: від iPhone SE до 16 Pro Max та iPad.'
        },
        bad: {
          title: 'Жорстко захардкоджені координати чи відступи',
          code: `HStack {
    Text("Підписка Pro")
        .padding(.trailing, 180) // Зламається на iPhone меншого розміру!
    Button("Купити") {}
}`,
          explanation: 'Фіксовані ручні відступи padding(.trailing, 180) гарантовано поїдуть або вилізуть за межі на інших пристроях.'
        }
      },
      codeSnippet: `import SwiftUI

struct MetricCardView: View {
    let title: String
    let value: String
    let iconName: String
    let changePercentage: Double
    
    var body: some View {
        ZStack(alignment: .topTrailing) {
            // Шар 1 (Фон)
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(.secondarySystemBackground))
            
            // Шар 2 (Головний контент)
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    Image(systemName: iconName)
                        .font(.title2)
                        .foregroundStyle(.blue)
                    
                    Spacer()
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(value)
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                    
                    Text(title)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .padding(18)
            
            // Шар 3 (Бейдж відсотка поверх у правому кутку)
            Text(changePercentage >= 0 ? "+\\(changePercentage)%" : "\\(changePercentage)%")
                .font(.caption2)
                .fontWeight(.bold)
                .foregroundStyle(changePercentage >= 0 ? .green : .red)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background((changePercentage >= 0 ? Color.green : Color.red).opacity(0.15))
                .clipShape(Capsule())
                .padding(16)
        }
        .frame(height: 140)
    }
}`,
      explanation: [
        '`ZStack(alignment: .topTrailing)` розміщує бейдж зміни відсотка у правому верхньому кутку поверх фонового прямокутника.',
        '`VStack(alignment: .leading)` вирівнює всі текстові мітки по лівому краю.',
        '`Spacer()` всередині верхнього `HStack` гарантує, що іконка залишається зліва.'
      ],
      underTheHood: {
        title: '3 правила системи компонування SwiftUI Layout Engine',
        points: [
          '1. Батьківський контейнер пропонує дочірньому елементу доступний розмір (Proposed Size).',
          '2. Дочірній елемент САМ вирішує, скільки пікселів йому потрібно (Actual Size).',
          '3. Батько розміщує дочірній елемент у своєму просторі відповідно до вирівнювання.',
          'Дочірній View обирає розмір у межах запропонованих обмежень; модифікатори на кшталт `.frame` можуть змінити ці пропозиції та розміщення.'
        ]
      },
      checkpoints: [
        {
          question: 'Що станеться, якщо додати Spacer() між двома елементами в HStack?',
          options: [
            'Елементи розсунуться до протилежних країв контейнера',
            'Між ними зʼявиться відступ рівно 10 пікселів',
            'Елементи сховаються',
            'Виникне помилка збірки'
          ],
          correctAnswer: 0,
          explanation: 'Spacer() у HStack розширюється по горизонталі, заповнюючи весь вільний простір.'
        }
      ],
      keyTakeaways: [
        'VStack — вертикально, HStack — горизонтально, ZStack — шар за шаром.',
        '`Spacer()` — головний інструмент створення адаптивних гнучких інтерфейсів.',
        'Комбінація цих трьох стеків дозволяє відтворити будь-який макет.'
      ],
      commonMistakes: [
        'Спроба розсунути елементи через гігантські значення `.padding(.trailing, 200)` замість `Spacer()`.',
        'Використання ZStack для розміщення елементів поруч один з одним.'
      ],
      challenge: {
        task: 'Створіть `HStack`, де зліва розташована іконка "star.fill" жовтого кольору, поруч назва фільму, а справа через Spacer кнопка з текстом "Деталі".',
        hint: 'Використовуйте HStack { Image(systemName: "star.fill"); Text(...); Spacer(); Button(...) }',
        solution: `import SwiftUI

struct MovieRow: View {
    var body: some View {
        HStack {
            Image(systemName: "star.fill")
                .foregroundStyle(.yellow)
            Text("Інтерстеллар")
                .fontWeight(.medium)
            Spacer()
            Button("Деталі") {}
                .buttonStyle(.bordered)
        }
        .padding()
    }
}`
      }
    }
  },
  {
    id: 'swiftui-lists-scrollview',
    module: 4,
    moduleTitle: 'Модуль 4: Основи SwiftUI та Лейаут',
    title: 'Динамічні Списки: List, ScrollView та ForEach',
    description: 'Навчіться відображати великі списки даних: протокол Identifiable, нативний List, кастомні стрічки ScrollView + LazyVStack та оптимізація памʼяті.',
    difficulty: 'Середній',
    estimatedMinutes: 20,
    icon: 'List',
    content: {
      realWorldContext: 'Для дуже довгих списків звичайний `VStack` може створювати зайву роботу й споживати більше памʼяті, бо будує дочірні елементи заздалегідь. Наслідки залежать від розміру й складності елементів. `List` і `LazyVStack` відкладають створення частини вмісту, але мають різну поведінку й не гарантують створення тільки видимих елементів або конкретний механізм повторного використання.',
      detailedTheory: [
        {
          title: 'Протокол Identifiable',
          paragraphs: [
            'Щоб SwiftUI міг швидко відображати та анімувати елементи у списку, кожна модель даних повинна мати унікальний ідентифікатор.',
            'Підписання моделі під протокол `Identifiable` вимагає наявності поля `var id: UUID` або `let id: String`. Це дозволяє передавати масив у `List(items)` або `ForEach(items)` без додаткових параметрів.'
          ]
        },
        {
          title: 'List проти ScrollView + LazyVStack',
          paragraphs: [
            '1. `List`: нативний компонент iOS (аналог UITableView). Має вбудовану підтримку свайпів (swipe to delete), pull-to-refresh, розділювальних ліній і автоматично перемальовує лише видимі клітинки.',
            '2. `ScrollView + LazyVStack`: дає більше свободи для кастомного компонування (сітки, нестандартні картки без системних рамок). Префікс `Lazy` означає, що клітинка створиться лише тоді, коли користувач доскролить до неї.'
          ]
        }
      ],
      theory: [
        'Моделі для списків повинні відповідати `Identifiable`.',
        '`List` — системні списки з підтримкою свайпів та оновлення.',
        '`LazyVStack` завантажує клітинки ліниво під час скролу, бережучи памʼять.',
        '`ForEach` генерує View-елементи з масиву моделей.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Лінивий скрол через LazyVStack для великих списків',
          code: `ScrollView {
    LazyVStack(spacing: 12) {
        ForEach(posts) { post in
            PostCardView(post: post)
        }
    }
}`,
          explanation: 'LazyVStack відкладає створення частини дочірніх View до потреби під час прокручування; точний момент визначає SwiftUI.'
        },
        bad: {
          title: 'Звичайний важкий VStack всередині ScrollView',
          code: `ScrollView {
    VStack(spacing: 12) { // Звичайний VStack будує дочірні View заздалегідь
        ForEach(posts) { post in
            PostCardView(post: post)
        }
    }
}`,
          explanation: 'Звичайний VStack може створити всі дочірні View заздалегідь; для довгих списків це може збільшити початкову роботу та витрати памʼяті.'
        }
      },
      codeSnippet: `import SwiftUI

// 1. Модель даних з протоколом Identifiable
struct Contact: Identifiable {
    let id = UUID()
    let name: String
    let phoneNumber: String
    let isFavorite: Bool
}

struct ContactsListView: View {
    @State private var contacts = [
        Contact(name: "Олена Коваль", phoneNumber: "+380 50 123 4567", isFavorite: true),
        Contact(name: "Дмитро Мельник", phoneNumber: "+380 67 987 6543", isFavorite: false),
        Contact(name: "Анна Шевченко", phoneNumber: "+380 93 555 4433", isFavorite: true)
    ]
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(contacts) { contact in
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
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
            .navigationTitle("Контакти")
        }
    }
}`,
      explanation: [
        'Завдяки `Contact: Identifiable` цикл `ForEach(contacts)` знає, як відстежувати зміни кожного рядка.',
        'Модифікатор `.onDelete` вмикає системний свайп для видалення клітинки вліво.',
        '`NavigationStack` додає нативний заголовок великого розміру (.navigationTitle).'
      ],
      underTheHood: {
        title: 'Механізм переінтенсифікації комірок (Cell Recycling)',
        points: [
          'Реалізація `List` є деталлю SwiftUI і може змінюватися між версіями системи; покладайтеся на задокументовану поведінку, а не на конкретний UIKit-контейнер.',
          '`List` оптимізує відображення довгих списків, але швидкодія залежить від моделі, рядків і виконуваної роботи. Не слід припускати, що будь-який список матиме сталу продуктивність для довільного обсягу даних.'
        ]
      },
      checkpoints: [
        {
          question: 'Яку вимогу накладає протокол Identifiable на структуру?',
          options: [
            'Наявність властивості id з унікальним значенням для кожного елемента',
            'Обовʼязкове спадкування від NSObject',
            'Наявність функції saveToDatabase()',
            'Поле id обовʼязково має бути типом Int'
          ],
          correctAnswer: 0,
          explanation: 'Протокол Identifiable вимагає наявності поля id: Hashable (зазвичай UUID або String).'
        }
      ],
      keyTakeaways: [
        'Для списків із системною поведінкою (свайпи, секції) обирайте `List`.',
        'Для нестандартних карточок та стрічок обирайте `ScrollView + LazyVStack`.',
        'Завжди підписуйте моделі даних під `Identifiable`.'
      ],
      commonMistakes: [
        'Використання нелінивого `VStack` для відображення великих масивів з інтернету.',
        'Використання некоректного ідентифікатора (наприклад, дубльованого імені) у `ForEach`.'
      ],
      challenge: {
        task: 'Створіть модель `Transaction: Identifiable` з полями `id = UUID()`, `title: String`, `amount: Double`. Виведіть список у `List`, де додатні суми зелені, а відʼємні — червоні.',
        hint: 'Використовуйте тернарний оператор для вибору кольору .foregroundStyle(item.amount >= 0 ? .green : .red)',
        solution: `import SwiftUI

struct Transaction: Identifiable {
    let id = UUID()
    let title: String
    let amount: Double
}

struct TransactionList: View {
    let items = [
        Transaction(title: "Кафе", amount: -120.0),
        Transaction(title: "Зарплата", amount: 45000.0)
    ]
    
    var body: some View {
        List(items) { item in
            HStack {
                Text(item.title)
                Spacer()
                Text("\\(item.amount >= 0 ? "+" : "")\\(item.amount, specifier: "%.2f") ₴")
                    .foregroundStyle(item.amount >= 0 ? .green : .red)
                    .fontWeight(.bold)
            }
        }
    }
}`
      },
      xcodeLab: {
        task: 'Зберіть список покупок у SwiftUI',
        steps: [
          'Створіть новий проєкт iOS у Xcode з шаблоном App і SwiftUI.',
          'Замініть вміст ContentView.swift прикладом нижче.',
          'Запустіть застосунок у симуляторі: додайте кілька товарів і перевірте, що список оновлюється.'
        ],
        code: `import SwiftUI

struct ShoppingListView: View {
    @State private var items: [ShoppingItem] = []
    @State private var newItem = ""

    var body: some View {
        NavigationStack {
            VStack {
                List(items) { item in
                    Text(item.title)
                }

                HStack {
                    TextField("Назва товару", text: $newItem)
                        .textFieldStyle(.roundedBorder)
                    Button("Додати", action: addItem)
                        .disabled(newItem.trimmingCharacters(in: .whitespaces).isEmpty)
                }
                .padding()
            }
            .navigationTitle("Покупки")
        }
    }

    private func addItem() {
        let item = newItem.trimmingCharacters(in: .whitespaces)
        guard !item.isEmpty else { return }
        items.append(ShoppingItem(title: item))
        newItem = ""
    }
}

struct ShoppingItem: Identifiable {
    let id = UUID()
    let title: String
}`,
        expectedOutput: 'Після натискання «Додати» товар з’являється у списку, а поле очищується.',
        tips: 'Для реального застосунку використовуйте стабільні унікальні ID замість назви товару як id елемента.'
      }
    }
  },
  {
    id: 'swiftui-modifiers-components',
    module: 4,
    moduleTitle: 'Модуль 4: Основи SwiftUI та Лейаут',
    title: 'Модифікатори: Порядок виклику та Власні Компоненти',
    description: 'Дізнайтеся, чому порядок модифікаторів має вирішальне значення у SwiftUI, як створювати кастомні ViewModifier та розбивати монолітні екрани на компоненти.',
    difficulty: 'Середній',
    estimatedMinutes: 18,
    icon: 'Sparkles',
    content: {
      realWorldContext: 'Одна з найчастіших помилок новачків у SwiftUI — нерозуміння того, чому фоновий колір заливає лише текст, а не всю кнопку, або чому рамка обрізає тінь. Усе це залежить від черговості модифікаторів. Декомпозиція коду на окремі перевикористовувані компоненти робить проект підтримуваним у великих додатках.',
      detailedTheory: [
        {
          title: 'Порядок модифікаторів МАЄ ЗНАЧЕННЯ',
          paragraphs: [
            'У SwiftUI модифікатори НЕ змінюють існуюче View на місці. Кожен модифікатор створює НОВЕ View-обгортку навколо попереднього.',
            'Саме тому код `.background(Color.blue).padding()` спочатку пофарбує прямокутник тексту в синій, а потім додасть біле поле навколо, тоді як `.padding().background(Color.blue)` спочатку розширить поле кліку, а потім пофарбує все разом у синій.'
          ]
        },
        {
          title: 'Декомпозиція на чисті компоненти',
          paragraphs: [
            'Коли `var body` розростається до 100+ рядків, Xcode починає повільно компілювати код та видавати помилку "The compiler is unable to type-check this expression in reasonable time".',
            'Правильний підхід — виносити логічні блоки в окремі дрібні структури або обчислювальні властивості.'
          ]
        }
      ],
      theory: [
        'Кожен модифікатор огортає View у новий шар.',
        'Порядок виклику змінює підсумковий візуальний результат.',
        'Великі екрани обовʼязково розбиваються на менші незалежні `struct MyComponent: View`.',
        'Протокол `ViewModifier` дозволяє виносити повторюваний набір стилів в один виклик.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Правильний порядок: відступ -> фон -> заокруглення',
          code: `Button("Підтвердити") {}
    .foregroundStyle(.white)
    .padding(.horizontal, 24)
    .padding(.vertical, 12)
    .background(Color.blue)
    .clipShape(Capsule())`,
          explanation: 'Спершу розширюються внутрішні поля кнопки, потім накладається фоновий колір, і фінально все заокруглюється у капсулу.'
        },
        bad: {
          title: 'Помилковий порядок модифікаторів',
          code: `Button("Підтвердити") {}
    .foregroundStyle(.white)
    .background(Color.blue) // Фон застосувався до стиснутого тексту!
    .clipShape(Capsule())
    .padding(.horizontal, 24) // Відступ додано вже ПІСЛЯ фону`,
          explanation: 'Кнопка вийде спотвореною: синій колір буде лише під буквами, а відступи залишаться прозорими.'
        }
      },
      codeSnippet: `import SwiftUI

// 1. Створення кастомного ViewModifier для красивої тіні
struct CardStyleModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(16)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .shadow(color: .black.opacity(0.08), radius: 10, x: 0, y: 4)
    }
}

// 2. Зручне розширення для лаконічного виклику
extension View {
    func cardStyle() -> some View {
        modifier(CardStyleModifier())
    }
}

// 3. Використання декомпозованих компонентів
struct ProductOverview: View {
    var body: some View {
        VStack(spacing: 16) {
            ProductHeader(title: "AirPods Max 2", subtitle: "Apple Inc.")
            ProductPriceBadge(price: "$549.00")
        }
        .cardStyle() // Застосування кастомного модифікатора
        .padding()
    }
}

struct ProductHeader: View {
    let title: String
    let subtitle: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title).font(.title2).bold()
            Text(subtitle).font(.caption).foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct ProductPriceBadge: View {
    let price: String
    var body: some View {
        Text(price)
            .font(.headline)
            .foregroundStyle(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color.blue)
            .clipShape(Capsule())
    }
}`,
      explanation: [
        'Протокол `ViewModifier` обʼєднує стилі у повторно використовуваний шаблон.',
        'Декомпозиція на `ProductHeader` та `ProductPriceBadge` спрощує підтримку та тестування інтерфейсу.'
      ],
      underTheHood: {
        title: 'Типи-матрьошки у SwiftUI (ModifiedContent)',
        points: [
          'Під капотом кожен виклик на кшталт `.padding()` перетворює тип `Text` у тип `ModifiedContent<Text, _PaddingLayout>`.',
          'Якщо додати `.background()`, тип стане `ModifiedContent<ModifiedContent<Text, _PaddingLayout>, _BackgroundStyleModifier<Color>>`.',
          'Саме тому Opaque Return Type `some View` рятує нас від необхідності вручну писати ці монструозні типи.'
        ]
      },
      checkpoints: [
        {
          question: 'Чому .padding() потрібно викликати ДО .background(), якщо ми хочемо збільшити площу кольорової плашки?',
          options: [
            'Тому що модифікатор background зафарбує простір, сформований попереднім кроком padding',
            'Тому що background після padding заборонений компілятором',
            'Це правило працює тільки для кнопок',
            'Порядок модифікаторів не має жодного значення'
          ],
          correctAnswer: 0,
          explanation: 'Кожен модифікатор огортає результат попереднього, тому відступ повинен збільшити розмір до застосування фону.'
        }
      ],
      keyTakeaways: [
        'Порядок модифікаторів критичний: змінюйте черговість з розумом.',
        'Використовуйте `ViewModifier` для однакових стилів карток чи заголовків.',
        'Розбивайте великі View на маленькі дочірні структури.'
      ],
      commonMistakes: [
        'Записування 200+ рядків верстки в один `var body`.',
        'Виклик `.clipShape()` до `.padding()`, що зрізає бажані відступи.'
      ],
      challenge: {
        task: 'Створіть власний `ViewModifier` під назвою `PillBackground`, який додає горизонтальний відступ 16, вертикальний 8, сірий фон `Color(.systemGray6)` та форму `Capsule()`.',
        hint: 'struct PillBackground: ViewModifier { func body(content: Content) -> some View { ... } }',
        solution: `import SwiftUI

struct PillBackground: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color(.systemGray6))
            .clipShape(Capsule())
    }
}`
      }
    }
  }
];

