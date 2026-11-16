import { Lesson } from '@/types';

export const module4Lessons: Lesson[] = [
  {
    id: 'swiftui-intro-declarative',
    module: 4,
    moduleTitle: 'Модуль 4: Основи SwiftUI та компонування',
    title: 'Декларативний UI: Філософія SwiftUI та протокол View',
    description: 'Зрозумійте фундаментальну різницю між імперативним UIKit та декларативним SwiftUI: як влаштований протокол View та непрозорий тип some View.',
    difficulty: 'Початковий',
    estimatedMinutes: 20,
    icon: 'Smartphone',
    content: {
      realWorldContext: 'Раніше в UIKit розробники вручну створювали кнопки, додавали їх через addSubview, налаштовували десятки констрейнтів AutoLayout і вручну оновлювали текст при кожній зміні даних. SwiftUI змінив це назавжди: ви просто описуєте, ЯКИМ має бути екран для поточного стану, а фреймворк сам малює та оптимізує пікселі.',
      detailedTheory: [
        {
          title: 'Імперативний проти Декларативного підходу',
          paragraphs: [
            'В імперативному підході (UIKit) ви описуєте ПОКРОКОВІ КОМАНДИ: "створи кнопку -> пофарбуй у синій колір -> додай слухач -> коли юзер натисне, зміни текст лейбла на інший".',
            'У декларативному підході (SwiftUI) ви описуєте КІНЦЕВИЙ РЕЗУЛЬТАТ: "якщо користувач онлайн — покажи зелений значок, інакше сірий". Інтерфейс є прямою функцією від стану: `UI = f(State)`.'
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
        // Необхідно вручну стежити за оновленням компонування!
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
    },
    pages: [
      {
        id: 'swiftui-intro-intuition',
        title: 'Інтуїція: Що таке Декларативний UI та формула UI = f(State)',
        stepLabel: '1. Інтуїція & Декларативність',
        description: 'Зрозумійте відмінність між покроковим наказом компʼютеру та описом бажаного стану на життєвих метафорах.',
        content: {
          realWorldContext: 'Коли ви замовляєте таксі в Uber або Bolt, на екрані показується карта з машинкою. Якщо водій прийняв замовлення — машинка їде, якщо шукає — крутиться спінер. У старій системі (UIKit) розробники писали сотні рядків коду для ручного приховування та показу кожного пікселя. У SwiftUI ви описуєте екран як просту математичну функцію від стану.',
          detailedTheory: [
            {
              title: 'Метафора: Замовлення в ресторані проти приготування на кухні',
              paragraphs: [
                'Уявіть, що ви прийшли в кавʼярню:\n• **Імперативний підхід (старий UIKit)**: ви заходите за барну стійку і самі командуєте баристі: "Візьми холдер -> насип 18 грамів зерна -> спресуй темпером під кутом 90 градусів -> увімкни пролив на 27 секунд -> збий молоко до 65 градусів -> перелий у чашку". Якщо ви пропустите хоч один крок, кава зіпсується.\n• **Декларативний підхід (сучасний SwiftUI)**: ви просто кажете офіціанту: "Будь ласка, велике капучино на вівсяному молоці без цукру". Ви описуєте **ЩО** ви хочете отримати в результаті, а не **ЯК** покроково це готувати.\n\nSwiftUI бере на себе всю рутину: створення обʼєктів, розрахунок координат пікселів, оптимізацію памʼяті та плавні системні анімації.'
              ]
            },
            {
              title: 'Головна формула SwiftUI: UI = f(State)',
              paragraphs: [
                'Інтерфейс користувача (`UI`) у SwiftUI — це чистий візуальний відбиток поточного стану (`State`).\n\nКоли змінюється стан (наприклад, користувач натиснув кнопку "Лайк"), SwiftUI самостійно вираховує різницю і перемальовує виключно серцевинку лайка, не чіпаючи решту екрана.'
              ],
              callout: {
                type: 'tip',
                title: 'Революція 2019 року',
                text: 'Apple представила SwiftUI у 2019 році як єдиний стандарт інтерфейсу для всіх платформ: iOS, iPadOS, macOS, watchOS, tvOS та visionOS.'
              }
            }
          ],
          checkpoints: [
            {
              question: 'Що означає формула UI = f(State) у філософії SwiftUI?',
              options: [
                'Інтерфейс користувача є прямим відображенням поточного стану даних застосунку',
                'Для кожного екрана потрібно писати математичні формули в Excel',
                'Стан екрана не можна змінювати після запуску',
                'UI компілюється тільки на серверах Apple'
              ],
              correctAnswer: 0,
              explanation: 'У SwiftUI ви не керуєте пікселями вручну; інтерфейс автоматично перебудовується при кожній зміні стану State.'
            },
            {
              question: 'У чому головна відмінність декларативного підходу SwiftUI від імперативного UIKit?',
              options: [
                'У SwiftUI ви описуєте бажаний кінцевий вигляд інтерфейсу, а не покроковий алгоритм малювання',
                'UIKit швидший за SwiftUI на всіх пристроях',
                'У SwiftUI заборонено використовувати кнопки та зображення',
                'SwiftUI працює без мови програмування Swift'
              ],
              correctAnswer: 0,
              explanation: 'Декларативність дозволяє описувати інтерфейс на основі стану без ручного маніпулювання кожним окремим елементом UIView.'
            }
          ]
        }
      },
      {
        id: 'swiftui-intro-protocol-some-view',
        title: 'Анатомія SwiftUI: Протокол View та непрозорий тип some View',
        stepLabel: '2. Анатомія View & some View',
        description: 'Розбираємо протокол View, єдину вимогу var body, що насправді означає слово some та чому View є структурами.',
        content: {
          realWorldContext: 'Кожен компонент, від найпростішого текстового напису `Text("Привіт")` до складного екрана налаштувань профілю, є структурою, що відповідає протоколу `View`.',
          detailedTheory: [
            {
              title: 'Чому SwiftUI View — це struct, а не class?',
              paragraphs: [
                'В UIKit кожен `UIView` був важким класом із сотнями успадкованих властивостей, що призводило до значних витрат памʼяті.\n\nУ SwiftUI елемент `View` — це крихітна надлегка **структура (struct)**. Вона не малює пікселі безпосередньо, а лише слугує "кресленням" (blueprint) для рендерера Apple. Створення та знищення такої структури займає наносекунди!'
              ]
            },
            {
              title: 'Таємниця ключового слова some View',
              paragraphs: [
                'Протокол `View` має лише одну вимогу:\n`var body: some View { get }`\n\nСлово `some` позначає **Opaque Return Type (непрозорий тип повернення)**. Воно повідомляє компілятору: "Тут повертається конкретний тип, що відповідає протоколу View. Тобі, компіляторе, цей точний тип відомий, але для мене (розробника) нехай він залишається абстрактним `some View`".\n\nЯкби не було слова `some`, нам довелося б вручну писати страшні назви типів на кшталт `VStack<TupleView<(Text, Button<Text>)>>`!'
              ],
              callout: {
                type: 'info',
                title: 'Будівельник @ViewBuilder',
                text: 'Тіло `var body` неявно позначене атрибутом `@ViewBuilder`. Це дозволяє писати кілька елементів один за одним без коми та використовувати стандартні `if-else` блоки для показу чи приховування елементів.'
              }
            }
          ],
          codeSnippet: `import SwiftUI

// Анатомія мінімального SwiftUI компонента
struct UserBadgeView: View {
    let name: String
    let isPremium: Bool
    
    // Єдина обов'язкова вимога протоколу View
    var body: some View {
        HStack(spacing: 8) {
            Text(name)
                .font(.headline)
            
            // Умова завдяки @ViewBuilder
            if isPremium {
                Image(systemName: "checkmark.seal.fill")
                    .foregroundStyle(.yellow)
            }
        }
    }
}

// Попередній перегляд для полотна Xcode Canvas
#Preview {
    UserBadgeView(name: "Олексій", isPremium: true)
}`,
          explanation: [
            '`struct UserBadgeView: View` — створення легковажної структури-креслення.',
            '`var body: some View` повертає опис інтерфейсу, що складається з горизонтального стека `HStack`.',
            '`#Preview` дозволяє бачити результат рендерингу в реальному часі прямо в Xcode без запуску симулятора.'
          ]
        }
      },
      {
        id: 'swiftui-intro-diffing-tree',
        title: 'Під капотом: Дерево View та алгоритм Diffing',
        stepLabel: '3. Дерево View & Diffing',
        description: 'Як SwiftUI порівнює дерева інтерфейсу та чому категорично не можна виконувати важкі розрахунки у body.',
        content: {
          realWorldContext: 'Користувач швидко набирає текст у полі пошуку. При кожному натисканні літери SwiftUI викликає `var body`. Якщо розмістити всередині `body` сортування масиву на 50 000 елементів або мережевий запит, екран гарантовано зависне.',
          detailedTheory: [
            {
              title: 'Як влаштований механізм Diffing',
              paragraphs: [
                'Коли змінюється стан, SwiftUI створює нове легковажне дерево структур `View` і порівнює його зі старим деревом (цей процес називається **Diffing**).\n\nSwiftUI визначає, які саме вузли дерева дійсно змінилися, і віддає команду системному рушію Render Server оновити тільки ті пікселі, де є різниця. Це забезпечує ідеальну плавність 120 кадрів на секунду (ProMotion).'
              ]
            },
            {
              title: 'Правило чистоти var body',
              paragraphs: [
                'Властивість `var body` може викликатися сотні разів на секунду під час анімацій та скролу.\n\n**Суворе правило**: `var body` має бути виключно декларативним описом інтерфейсу. Жодних мережевих викликів `fetchData()`, розрахунків баз даних чи створення файлів усередині `body`!'
              ]
            }
          ],
          comparisonSnippet: {
            good: {
              title: 'Чистий body: дані підготовлені заздалегідь',
              code: `struct ProductCard: View {
    let title: String
    let formattedPrice: String // Обчислено заздалегідь!
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(title).font(.headline)
            Text(formattedPrice).foregroundStyle(.secondary)
        }
    }
}`,
              explanation: 'body містить лише відображення вже готових даних: рендеринг блискавичний.'
            },
            bad: {
              title: 'Важкі обчислення або форматування щоразу всередині body',
              code: `struct ProductCard: View {
    let title: String
    let price: Double
    
    var body: some View {
        // ПОМИЛКА: Створення NumberFormatter при кожному кадрі рендеру!
        let formatter = NumberFormatter()
        let formatted = formatter.string(from: NSNumber(value: price)) ?? ""
        
        return VStack {
            Text(title)
            Text(formatted)
        }
    }`,
              explanation: 'Створення важких обʼєктів на зразок DateFormatter чи NumberFormatter всередині body викликає мікро-фризи інтерфейсу.'
            }
          },
          keyTakeaways: [
            'SwiftUI View — це легковажні описи, що швидко створюються і знищуються.',
            'Diffing алгоритм порівнює дерева і змінює тільки змінені пікселі.',
            'Властивість `body` повинна бути максимально простою та вільною від важких операцій.'
          ]
        }
      },
      {
        id: 'swiftui-intro-errors-quiz',
        title: 'Типові помилки SwiftUI в Xcode & Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо проблеми типів some View, ліміт 10 елементів та перевіряємо засвоєння фундаментальних концепцій.',
        content: {
          realWorldContext: 'Навіть досвідчені розробники іноді стикаються із заплутаними помилками компілятора при роботі з generic-структурою SwiftUI.',
          detailedTheory: [
            {
              title: 'Топ помилок SwiftUI початківців',
              paragraphs: [
                '1. **Type \'MyView\' does not conform to protocol \'View\'**:\nВи створили структуру, але забули оголосити властивість `var body: some View` або помилилися в назві `body`.\n*Виправлення*: переконайтеся, що `var body: some View` оголошено точно з цим імʼям та типами.\n\n2. **Function declares an opaque return type \'some View\', but the return statements in its body do not have matching underlying types**:\nВи спробували використати звичайний `return` всередині `if-else`, повертаючи різні типи View (наприклад, `return Text(...)` в одній гілці та `return Image(...)` в іншій) без контейнера `Group` чи `@ViewBuilder`.\n*Виправлення*: обгорніть елементи у `VStack`, `HStack` або `Group`.\n\n3. **Extra arguments at positions... (Ліміт на 10 елементів)**:\nУ старих версіях SwiftUI усередині одного контейнера не могло бути понад 10 прямих дочірніх View. Якщо у вас багато елементів, розбийте їх на менші групи за допомогою `Group { ... }` або винесіть у підкомпоненти.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Яку єдину вимогу містить протокол SwiftUI.View?',
              options: [
                'Наявність обчислювальної властивості var body: some View',
                'Наявність методу func render(to: Screen)',
                'Обовʼязкове спадкування від класу UIView',
                'Наявність змінної var frame: CGRect'
              ],
              correctAnswer: 0,
              explanation: 'Єдина обовʼязкова вимога протоколу View — наявність обчислювальної властивості var body: some View.'
            },
            {
              question: 'Чому не можна виконувати запити до мережі або важкі операції всередині var body?',
              options: [
                'Тому що body може викликатися системою багато разів за секунду при перемальовуванні та анімаціях',
                'Тому що мова Swift взагалі забороняє мережу на смартфонах',
                'body призначений тільки для збереження файлів на диск',
                'Мережеві запити дозволені тільки в класах'
              ],
              correctAnswer: 0,
              explanation: 'body викликається фреймворком щоразу при зміні стану; будь-яка затримка всередині body заблокує головний потік і призведе до зависання інтерфейсу.'
            },
            {
              question: 'Що робить контейнер Group у SwiftUI?',
              options: [
                'Логічно обʼєднує дочірні View без зміни їхнього геометричного взаємного розташування',
                'Фарбує всі елементи в однаковий колір',
                'Зберігає елементи в базу даних',
                'Створює системне вікно налаштувань'
              ],
              correctAnswer: 0,
              explanation: 'Group діє як прозорий контейнер для групування дочірніх View (наприклад, для спільного застосування модифікаторів або обходу обмежень ViewBuilder).'
            }
          ]
        }
      },
      {
        id: 'swiftui-intro-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Практикуємо верстку першої красивої адаптивної картки користувача з бейджем статусу та іконкою.',
        content: {
          realWorldContext: 'Створіть свій перший повноцінний SwiftUI компонент картки профілю користувача `UserProfileCardView` із динамічним статусом "онлайн / офлайн", перемиканням аватарки та форматуванням тексту.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: КАРТКА ПРОФІЛЮ КОРИСТУВАЧА
// ==========================================

import SwiftUI

struct UserProfileCardView: View {
    let name: String
    let role: String
    let isOnline: Bool
    let projectsCompleted: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Верхній рядок: Аватар + Ім'я + Статус
            HStack(spacing: 12) {
                // Кругла іконка аватара
                Image(systemName: "person.crop.circle.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 48, height: 48)
                    .foregroundStyle(.blue)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(name)
                        .font(.headline)
                        .foregroundStyle(.primary)
                    
                    Text(role)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                
                Spacer()
                
                // Індикатор онлайн-статусу
                HStack(spacing: 6) {
                    Circle()
                        .fill(isOnline ? Color.green : Color.gray)
                        .frame(width: 8, height: 8)
                    
                    Text(isOnline ? "Онлайн" : "Офлайн")
                        .font(.caption2)
                        .fontWeight(.medium)
                        .foregroundStyle(isOnline ? .green : .secondary)
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background((isOnline ? Color.green : Color.gray).opacity(0.12))
                .clipShape(Capsule())
            }
            
            Divider()
            
            // Нижній блок статистики
            HStack {
                Label("\\(projectsCompleted) проєктів завершено", systemImage: "checkmark.seal")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(16)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .padding(.horizontal)
    }
}

// Прев'ю для тестування в Canvas
#Preview {
    VStack(spacing: 16) {
        UserProfileCardView(name: "Марія Бондаренко", role: "iOS Team Lead", isOnline: true, projectsCompleted: 24)
        UserProfileCardView(name: "Андрій Козак", role: "Junior Swift Dev", isOnline: false, projectsCompleted: 3)
    }
}`,
          explanation: [
            '`UserProfileCardView` демонструє композицію: вкладені `VStack` та `HStack` створюють чистий адаптивний макет.',
            'Тернарний оператор `isOnline ? Color.green : Color.gray` динамічно змінює колір індикатора в залежності від вхідних даних.',
            '`Spacer()` автоматично відштовхує індикатор статусу до правого краю картки незалежно від розміру екрана iPhone.'
          ],
          challenge: {
            task: 'Створіть простий SwiftUI компонент `GreetingBadge`, який приймає рядок `name` та відображає його білим жирним шрифтом `.headline` всередині синього прямокутника з внутрішнім відступом і заокругленими кутами 10pt.',
            hint: 'Використовуйте Text(name).font(.headline).foregroundStyle(.white).padding().background(Color.blue).clipShape(RoundedRectangle(cornerRadius: 10))',
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
      }
    ]
  },
  {
    id: 'swiftui-layout-stacks',
    module: 4,
    moduleTitle: 'Модуль 4: Основи SwiftUI та компонування',
    title: 'Компонування зі стеками: VStack, HStack, ZStack і Spacer',
    description: 'Побудуйте будь-який сучасний інтерфейс за допомогою трьох стеків: вертикального VStack, горизонтального HStack та нашарування ZStack.',
    difficulty: 'Початковий',
    estimatedMinutes: 22,
    icon: 'Layers',
    content: {
      realWorldContext: 'Будь-який інтерфейс у iOS — від картки товару в Amazon до екрана повідомлення в Telegram — це комбінація вкладених стеків. Зрозумівши, як стеки розподіляють вільний простір і як працює пружина `Spacer()`, ви зможете зверстати будь-який дизайн з Figma за лічені хвилини.',
      detailedTheory: [
        {
          title: 'Трійка фундаментальних контейнерів',
          paragraphs: [
            '1. `VStack (Vertical Stack)`: розміщує елементи один під одним вертикально.',
            '2. `HStack (Horizontal Stack)`: розміщує елементи поруч горизонтально зліва направо.',
            '3. `ZStack (Zero-depth Stack)`: нашаровує елементи по осі глибини один поверх одного (наприклад, значок або текст поверх фонового зображення).'
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
          title: 'Чисте адаптивне компонування зі Spacer',
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
        '`ZStack(alignment: .topTrailing)` розміщує значок зміни відсотка у правому верхньому кутку поверх фонового прямокутника.',
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
    },
    pages: [
      {
        id: 'stacks-intuition-axes',
        title: 'Інтуїція: Три виміри верстки — по горизонталі, вертикалі та в глибину',
        stepLabel: '1. Інтуїція & Осі компонування',
        description: 'Як мислити стеками при розборі будь-якого дизайну та як працює пружина Spacer().',
        content: {
          realWorldContext: 'Коли дизайнер надсилає вам макет екрана у Figma, на перший погляд він здається складним хаосом кнопок та карток. Проте будь-який екран iOS розкладається на три базові напрямки: елементи йдуть зверху вниз, зліва направо або лежать один на одному.',
          detailedTheory: [
            {
              title: 'Метафора: Шафа з речами та пружини',
              paragraphs: [
                'Уявіть організацію предметів у кімнаті:\n• **VStack (Vertical)**: стопка тарілок або колонка тексту в газеті — елементи шикуються суворо зверху вниз.\n• **HStack (Horizontal)**: книги на книжковій полиці — елементи стоять у ряд зліва направо.\n• **ZStack (Depth / Глибина)**: наклейка на склі вікна або картина у рамці — елементи нашаровуються один поверх одного вздовж осі Z (перпендикулярно до екрана вашого смартфона).\n\nА що таке **Spacer()**? Це невидима пружина! Якщо покласти пружину між двома книгами на полиці, вона розтиснеться на всю ширину полиці та притисне одну книгу до крайнього лівого боку, а другу — до крайнього правого.'
              ]
            },
            {
              title: 'Композиція стеків у стек',
              paragraphs: [
                'Справжня магія починається, коли ви вкладаєте стеки один в один:\nНаприклад, `HStack` (горизонтальний рядок повідомлення), всередині якого зліва лежить аватарка, а праворуч — `VStack` з імʼям контакту та текстом останнього повідомлення.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Який стек слід використати, щоб розмістити текст "SALE" поверх картинки товару?',
              options: [
                'ZStack (нашарування по осі глибини Z)',
                'VStack',
                'HStack',
                'Spacer'
              ],
              correctAnswer: 0,
              explanation: 'ZStack нашаровує дочірні елементи один поверх одного в глибину (по осі Z).'
            },
            {
              question: 'Як поводиться Spacer() всередині VStack?',
              options: [
                'Розширюється по вертикалі, виштовхуючи елементи до верхнього та нижнього країв',
                'Розширюється по горизонталі на всю ширину',
                'Створює фіксований відступ у 5 пікселів',
                'Ховає всі елементи під собою'
              ],
              correctAnswer: 0,
              explanation: 'Spacer() завжди розширюється вздовж головної осі свого батьківського стека (по вертикалі для VStack і по горизонталі для HStack).'
            }
          ]
        }
      },
      {
        id: 'stacks-syntax-spacing-alignment',
        title: 'Анатомія синтаксису: Вирівнювання (Alignment) та Відступи (Spacing)',
        stepLabel: '2. Анатомія синтаксису',
        description: 'Як налаштовувати притискання до країв leading/trailing та задавати точну відстань між елементами.',
        content: {
          realWorldContext: 'За замовчуванням елементи у VStack вирівнюються по центру екрана. Але в більшості додатків заголовки та тексти мають починатися строго від лівого краю. Для цього використовується параметр alignment.',
          detailedTheory: [
            {
              title: 'Параметр alignment (Вирівнювання)',
              paragraphs: [
                '• Для `VStack`: вирівнювання відбувається по горизонталі (`.leading` — лівий край, `.center` — центр, `.trailing` — правий край).\n• Для `HStack`: вирівнювання по вертикалі (`.top` — по верху, `.center` — по центру, `.bottom` — по низу, або за базовою лінією шрифту `.firstTextBaseline`).\n• Для `ZStack`: вирівнювання у двох вимірах одночасно (`.topLeading`, `.center`, `.bottomTrailing`).'
              ]
            },
            {
              title: 'Параметр spacing (Відстань)',
              paragraphs: [
                'Якщо не передати значення, SwiftUI підставить системний відступ (~8pt). Якщо передати `spacing: 0`, елементи склеяться впритул один до одного.',
                'Використання `spacing: 16` у стеку набагато надійніше, ніж ручне прописування `.padding(.bottom, 16)` для кожного елемента окремо.'
              ]
            }
          ],
          codeSnippet: `import SwiftUI

struct MessageRowView: View {
    let author: String
    let message: String
    let time: String
    
    var body: some View {
        // Головний горизонтальний контейнер
        HStack(alignment: .top, spacing: 12) {
            // Аватарка
            Circle()
                .fill(Color.blue.gradient)
                .frame(width: 44, height: 44)
                .overlay {
                    Text(author.prefix(1))
                        .foregroundStyle(.white)
                        .fontWeight(.bold)
                }
            
            // Вертикальна колонка тексту з вирівнюванням по лівому краю
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(author)
                        .font(.headline)
                    Spacer()
                    Text(time)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
                
                Text(message)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(2) // Обмеження довжини повідомлення
            }
        }
        .padding(.vertical, 8)
    }
}`,
          explanation: [
            '`HStack(alignment: .top, spacing: 12)` вирівнює аватарку по верхній лінії з першим рядком тексту повідомлення.',
            '`VStack(alignment: .leading)` гарантує, що імʼя та текст починаються з однієї вертикальної лінії зліва.',
            '`Spacer()` між автором і часом відштовхує час у правий кут рядка.'
          ]
        }
      },
      {
        id: 'stacks-under-the-hood-layout',
        title: 'Під капотом: 3 кроки алгоритму компонування (SwiftUI Layout Engine)',
        stepLabel: '3. Під капотом Layout',
        description: 'Як працює домовленість про розміри між батьківським і дочірнім View та чому хардкод координат веде до багів.',
        content: {
          realWorldContext: 'Чому деякі елементи розтягуються на весь екран, а інші залишаються крихітними? Все вирішується трьома кроками переговорів між View.',
          detailedTheory: [
            {
              title: 'Три кроки переговорів про розмір',
              paragraphs: [
                '1. **Батько пропонує розмір (Propose Size)**: екран каже стеку: "У мене є 393 x 852 пікселів, скільки тобі треба?".\n2. **Дочірній елемент САМ обирає свій розмір (Choose Size)**: текстовий напис `Text("ОК")` каже: "Мені треба лише 30 x 20 пікселів, більше не візьму". А прямокутник `Color.blue` каже: "Заберу всі запропоновані 393 x 852!".\n3. **Батько розміщує дочірній елемент (Position)**: батьківський контейнер центрифугує або притискає дочірній елемент відповідно до параметра `alignment`.'
              ]
            },
            {
              title: 'Адаптивність проти хардкоду',
              paragraphs: [
                'В iOS існують десятки розмірів екранів: iPhone SE (4.7"), iPhone 16 Pro (6.3"), iPhone 16 Pro Max (6.9") та iPad.\n\nЗавжди використовуйте `Spacer()` та відносні відступи замість фіксованих ширин `.frame(width: 320)`!'
              ]
            }
          ],
          comparisonSnippet: {
            good: {
              title: 'Адаптивна розтяжка через frame(maxWidth: .infinity)',
              code: `Button(action: {}) {
    Text("Оформити замовлення")
        .frame(maxWidth: .infinity) // Заповнює доступну ширину
        .padding()
        .background(Color.blue)
        .foregroundStyle(.white)
        .clipShape(RoundedRectangle(cornerRadius: 12))
}`,
              explanation: 'Кнопка буде ідеально виглядати на будь-якому iPhone, займаючи всю ширину з гарними полями.'
            },
            bad: {
              title: 'Хардкод фіксованої ширини',
              code: `Button(action: {}) {
    Text("Оформити замовлення")
        .frame(width: 350) // Зламається на iPhone SE (ширина 320pt)!
        .padding()
        .background(Color.blue)
}`,
              explanation: 'На маленьких екранах кнопка вилізе за межі або обріжеться, а на iPad буде виглядати куцою плямою.'
            }
          },
          keyTakeaways: [
            'У SwiftUI розмір елемента визначається перемовинами між батьком і дитиною.',
            'Spacer() та `.frame(maxWidth: .infinity)` — ключ до адаптивності.',
            'Ніколи не хардкодьте фіксовану ширину кнопок під один телефон.'
          ]
        }
      },
      {
        id: 'stacks-errors-quiz',
        title: 'Типові помилки зі стеками в Xcode & Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо конфлікти розтягування, плутанину alignment та перевіряємо навички верстки стеків.',
        content: {
          realWorldContext: 'Стеки є основою всього макету: розберімо найчастіші підводні камені при їх поєднанні.',
          detailedTheory: [
            {
              title: 'Популярні проблеми під час верстки',
              paragraphs: [
                '1. **Елементи "злипаються" до центру екрана**:\nПочатківець додає елементи у `VStack`, і вони збираються купою посередині екрана. Щоб притиснути контент до самого верху екрана, додайте `Spacer()` у самий низ `VStack`!\n\n2. **ZStack ховає елементи під фоном**:\nПамʼятайте: елементи у `ZStack` малюються в порядку черги. Перший елемент — найглибший шар (фон), останній елемент — поверх усіх. Якщо ви напишете текст першим, а прямокутник другим, прямокутник накриє собою текст!'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'У якому порядку відображаються елементи всередині ZStack { ViewA(); ViewB() }?',
              options: [
                'ViewB відображається поверх ViewA (ViewA на задньому плані)',
                'ViewA відображається поверх ViewB',
                'Вони розташовуються поруч горизонтально',
                'Порядок обирається системою випадково'
              ],
              correctAnswer: 0,
              explanation: 'У ZStack перший елемент малюється першим на задньому плані, а кожний наступний шар лягає поверх попередніх.'
            },
            {
              question: 'Як вирівняти всі текстові елементи у VStack по лівому краю?',
              options: [
                'VStack(alignment: .leading) { ... }',
                'VStack(alignment: .top) { ... }',
                'VStack(direction: .left) { ... }',
                'Text().alignLeft()'
              ],
              correctAnswer: 0,
              explanation: 'Для горизонтального вирівнювання у VStack використовується alignment: .leading.'
            },
            {
              question: 'Як змусити кнопку зайняти всю доступну ширину екрана?',
              options: [
                'Використати модифікатор .frame(maxWidth: .infinity)',
                'Задати .frame(width: 1000)',
                'Написати багато пробілів у тексті кнопки',
                'Кнопки у SwiftUI не вміють розтягуватися'
              ],
              correctAnswer: 0,
              explanation: '.frame(maxWidth: .infinity) повідомляє контейнеру, що компонент готовий зайняти максимум доступного вільного простору.'
            }
          ]
        }
      },
      {
        id: 'stacks-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінну адаптивну картку фінансової аналітики з накладенням стеків.',
        content: {
          realWorldContext: 'Створіть у Playground макет картки криптовалютного або фінансового портфеля `CryptoCardView` з логотипом валюти, балансом у гривнях/доларах та бейджем прибутку.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: КАРТКА ФІНАНСОВОЇ МЕТРИКИ
// ==========================================

import SwiftUI

struct CryptoCardView: View {
    let coinName: String
    let ticker: String
    let priceUSD: Double
    let dailyChangePercentage: Double
    let iconSystemName: String
    
    var isPositive: Bool {
        dailyChangePercentage >= 0
    }
    
    var body: some View {
        ZStack(alignment: .topTrailing) {
            // Шар 1: Фоновий контейнер із м'яким градієнтом
            RoundedRectangle(cornerRadius: 22)
                .fill(Color(.secondarySystemBackground))
            
            // Шар 2: Головний контент картки
            VStack(alignment: .leading, spacing: 18) {
                // Верхня лінія: Іконка монети та Назва
                HStack(spacing: 12) {
                    Image(systemName: iconSystemName)
                        .font(.title2)
                        .foregroundStyle(.white)
                        .frame(width: 44, height: 44)
                        .background(Color.orange.gradient)
                        .clipShape(Circle())
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text(coinName)
                            .font(.headline)
                        Text(ticker)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    
                    Spacer()
                }
                
                // Нижня лінія: Ціна
                VStack(alignment: .leading, spacing: 4) {
                    Text("$\\(priceUSD, specifier: "%.2f")")
                        .font(.system(size: 26, weight: .bold, design: .rounded))
                    
                    Text("Поточний курс")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            .padding(18)
            
            // Шар 3: Бейдж прибутку у верхньому правому кутку
            HStack(spacing: 4) {
                Image(systemName: isPositive ? "arrow.up.right" : "arrow.down.right")
                Text("\\(isPositive ? "+" : "")\\(dailyChangePercentage, specifier: "%.2f")%")
            }
            .font(.caption2)
            .fontWeight(.bold)
            .foregroundStyle(isPositive ? .green : .red)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background((isPositive ? Color.green : Color.red).opacity(0.15))
            .clipShape(Capsule())
            .padding(16)
        }
        .frame(height: 150)
        .padding(.horizontal)
    }
}

#Preview {
    VStack(spacing: 16) {
        CryptoCardView(coinName: "Bitcoin", ticker: "BTC", priceUSD: 89450.0, dailyChangePercentage: 3.45, iconSystemName: "bitcoinsign.circle.fill")
        CryptoCardView(coinName: "Ethereum", ticker: "ETH", priceUSD: 3120.0, dailyChangePercentage: -1.20, iconSystemName: "e.circle.fill")
    }
}`,
          explanation: [
            '`ZStack(alignment: .topTrailing)` розміщує бейдж відсотка строго у верхньому правому кутку без ручного вираховування координат.',
            '`VStack(alignment: .leading, spacing: 18)` структурує іконку та фінансову суму з гармонійним вертикальним інтервалом.',
            'Модифікатор `.specifier: "%.2f"` форматує дробові числа до 2 знаків після коми.'
          ],
          challenge: {
            task: 'Створіть `HStack`, де зліва розташована іконка "star.fill" жовтого кольору, поруч назва фільму "Інтерстеллар", а справа через Spacer кнопка з текстом "Деталі". Додайте зовнішній padding.',
            hint: 'Використовуйте HStack { Image(systemName: "star.fill").foregroundStyle(.yellow); Text("Інтерстеллар"); Spacer(); Button("Деталі") {} }.padding()',
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
      }
    ]
  },
  {
    id: 'swiftui-lists-scrollview',
    module: 4,
    moduleTitle: 'Модуль 4: Основи SwiftUI та компонування',
    title: 'Динамічні Списки: List, ScrollView та ForEach',
    description: 'Навчіться відображати великі списки даних: протокол Identifiable, нативний List, кастомні стрічки ScrollView + LazyVStack та оптимізація памʼяті.',
    difficulty: 'Середній',
    estimatedMinutes: 24,
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
            '2. `ScrollView + LazyVStack`: дає більше свободи для кастомного компонування (сітки, нестандартні картки без системних рамок). Префікс `Lazy` означає, що клітинка створиться лише тоді, коли користувач прокрутить до неї.'
          ]
        }
      ],
      theory: [
        'Моделі для списків повинні відповідати `Identifiable`.',
        '`List` — системні списки з підтримкою свайпів та оновлення.',
        '`LazyVStack` завантажує клітинки ліниво під час прокручування, бережучи памʼять.',
        '`ForEach` генерує View-елементи з масиву моделей.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Ліниве завантаження елементів через LazyVStack для великих списків',
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
        'Для нестандартних карток та стрічок обирайте `ScrollView + LazyVStack`.',
        'Завжди забезпечуйте відповідність моделей даних протоколу `Identifiable`.'
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
      }
    },
    pages: [
      {
        id: 'lists-intuition-virtualization',
        title: 'Інтуїція: Що таке віртуалізація списків та чому не можна малювати 10 000 карток одразу',
        stepLabel: '1. Інтуїція & Списки',
        description: 'Зрозумійте принцип роботи системних списків у мобільних додатках та навіщо потрібен протокол Identifiable.',
        content: {
          realWorldContext: 'Стрічка в Instagram або контакти в Telegram містять тисячі елементів. Якби телефон намагався одночасно згенерувати картинки й текст для всіх 10 000 повідомлень при запуску, памʼять миттєво закінчилася б, а додаток намертво завис.',
          detailedTheory: [
            {
              title: 'Метафора: Стрічка конвеєра',
              paragraphs: [
                'Уявіть працівника на конвеєрі, перед очима якого є маленьке оглядове віконце (екран вашого iPhone). У це віконце одночасно поміщається лише 5-7 коробок.\n\nЧи потрібно працівникові тримати в руках усі 10 000 коробок зі складу? Ні! Він бере лише ті коробки, які зараз пропливають повз віконце.\n\nСаме це робить `List` у SwiftUI: він створює та тримає в памʼяті лише ті клітинки, які зараз бачить користувач. Коли клітинка прокручується вгору за край екрана, вона вивільняється або перевикористовується.'
              ]
            },
            {
              title: 'Чому кожному елементу потрібен id?',
              paragraphs: [
                'Коли ви видаляєте контакт зі списку або додаєте новий, SwiftUI повинен плавно зсунути всі інші рядки з анімацією. Щоб не переплутати, де який рядок, SwiftUI вимагає, щоб кожен елемент мав унікальний "паспорт" — ідентифікатор `id` (протокол `Identifiable`).'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Чому List краще підходить для відображення 1000 елементів, ніж звичайний VStack?',
              options: [
                'List створює та рендерить лише ті клітинки, які зараз видно на екрані, заощаджуючи оперативну памʼять',
                'VStack автоматично видаляє базу даних',
                'List не підтримує кольоровий текст',
                'VStack заборонено використовувати на iPad'
              ],
              correctAnswer: 0,
              explanation: 'List використовує ліниву віртуалізацію клітинок, обробляючи лише видимий діапазон елементів.'
            },
            {
              question: 'Яку властивість обовʼязково вимагає протокол Identifiable?',
              options: [
                'var id: Hashable (наприклад, UUID або унікальний String)',
                'var name: String',
                'func calculateHash()',
                'let index: Int'
              ],
              correctAnswer: 0,
              explanation: 'Протокол Identifiable вимагає наявності унікального ідентифікатора id.'
            }
          ]
        }
      },
      {
        id: 'lists-identifiable-foreach',
        title: 'Анатомія списків: ForEach, свайпи onDelete та NavigationStack',
        stepLabel: '2. Identifiable & ForEach',
        description: 'Як ітерувати масиви в декларативному стилі, обробляти видалення свайпом та додавати заголовки.',
        content: {
          realWorldContext: 'Свайп вліво для видалення повідомлення чи товару з кошика — стандартний жест у кожному додатку iOS. У SwiftUI він реалізується одним модифікатором `.onDelete`.',
          detailedTheory: [
            {
              title: 'Цикл ForEach усередині списків',
              paragraphs: [
                '`ForEach` у SwiftUI — це не просто ключове слово циклу, а повноцінний генератор View.\n\nКоли модель відповідає `Identifiable`, синтаксис стає максимально коротким:\n`ForEach(users) { user in UserRow(user: user) }`.\nSwiftUI сам розуміє, як звʼязати `user.id` з відповідним рядком інтерфейсу.'
              ]
            },
            {
              title: 'Свайпи через .onDelete',
              paragraphs: [
                'Модифікатор `.onDelete(perform:)` працює саме в парі з `ForEach` усередині `List`.\n\nВін передає у замикання спеціальну колекцію `IndexSet` із номерами індексів, які користувач свайпнув, і ви видаляєте їх з масиву однією командою: `items.remove(atOffsets: indexSet)`.'
              ]
            }
          ],
          codeSnippet: `import SwiftUI

struct TodoItem: Identifiable {
    let id = UUID()
    var title: String
    var isDone: Bool = false
}

struct TodoListView: View {
    @State private var tasks = [
        TodoItem(title: "Купити молоко"),
        TodoItem(title: "Переглянути лекцію зі SwiftUI"),
        TodoItem(title: "Зробити комміт на GitHub")
    ]
    
    var body: some View {
        NavigationStack {
            List {
                Section("Мої завдання") {
                    ForEach(tasks) { task in
                        HStack {
                            Image(systemName: task.isDone ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(task.isDone ? .green : .secondary)
                            
                            Text(task.title)
                                .strikethrough(task.isDone)
                        }
                    }
                    .onDelete { offsets in
                        tasks.remove(atOffsets: offsets)
                    }
                }
            }
            .navigationTitle("Справи на сьогодні")
        }
    }
}`,
          explanation: [
            '`Section("Мої завдання")` автоматично створює гарний системний заголовок секції в стилі налаштувань iOS.',
            '`.onDelete` вмикає нативну анімацію зсуву та червону кнопку "Видалити".',
            '`NavigationStack` забезпечує великий заголовок `.navigationTitle` з підтримкою колапсу при скролі.'
          ]
        }
      },
      {
        id: 'lists-lazy-optimization',
        title: 'Під капотом: List проти ScrollView + LazyVStack',
        stepLabel: '3. LazyVStack & Оптимізація',
        description: 'Коли обирати системний List, а коли гнучкий LazyVStack для створення кастомних стрічок новин.',
        content: {
          realWorldContext: 'Стрічка в Pinterest або сітка фотографій в Instagram не схожі на звичайну таблицю налаштувань iPhone: у них немає системних розділювачів, сірого фону та стандартних свайпів. Тут на допомогу приходить звʼязка ScrollView + LazyVStack.',
          detailedTheory: [
            {
              title: 'Битва титанів: List проти ScrollView + LazyVStack',
              paragraphs: [
                '• **List**: ідеальний для налаштувань, форм введення, поштових скриньок та списків задач. Має вбудовану підтримку pull-to-refresh (`.refreshable`), свайпів (`.swipeActions`) та системного фону.\n• **ScrollView + LazyVStack**: ідеальний для стрічок новин, соціальних мереж та кастомного дизайну з Figma. Ви маєте повний 100% контроль над відступами, фоном та анімаціями.'
              ]
            },
            {
              title: 'Чому обовʼязково LAZY?',
              paragraphs: [
                'Звичайний `VStack` усередині `ScrollView` створює всі елементи миттєво в памʼяті.\n\n`LazyVStack` відкладає створення View-рядка до тієї мілісекунди, коли він дійсно зʼявляється на екрані при прокрутці пальцем. Це зменшує споживання оперативної памʼяті в десятки разів!'
              ]
            }
          ],
          comparisonSnippet: {
            good: {
              title: 'LazyVStack відкладає створення до моменту скролу',
              code: `ScrollView {
    LazyVStack(spacing: 16) {
        ForEach(feedPosts) { post in
            PostCardView(post: post)
        }
    }
    .padding()
}`,
              explanation: 'Створює картки постів тільки тоді, коли користувач наближається до них під час скролу.'
            },
            bad: {
              title: 'Звичайний VStack навантажує процесор і памʼять',
              code: `ScrollView {
    VStack(spacing: 16) { // Звичайний VStack створить ВСІ 2000 карток одразу!
        ForEach(feedPosts) { post in
            PostCardView(post: post)
        }
    }
}`,
              explanation: 'При 500+ елементах додаток зависне на кілька секунд під час першого відкриття екрана.'
            }
          },
          keyTakeaways: [
            'Для системних екранів (налаштування, меню) обирайте `List`.',
            'Для кастомних карток і сіток обирайте `ScrollView + LazyVStack`.',
            'Завжди перевіряйте, щоб у ScrollView використовувався саме префікс `Lazy`.'
          ]
        }
      },
      {
        id: 'lists-errors-quiz',
        title: 'Типові помилки зі списками в Xcode & Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо помилку відсутності Identifiable, дубльовані ідентифікатори та закріплюємо тему.',
        content: {
          realWorldContext: 'Найнеприємніший баг у списках — коли при видаленні одного рядка чомусь видаляється інший або анімація стрибає. Це майже завжди повʼязано з неправильним id.',
          detailedTheory: [
            {
              title: 'Популярні помилки списків',
              paragraphs: [
                '1. **Initializer \'init(_:rowContent:)\' requires that \'Model\' conform to \'Identifiable\'**:\nВи передали масив у `List(items)` або `ForEach(items)`, але забули написати `: Identifiable` в оголошенні структури `Model`.\n*Виправлення*: додайте `: Identifiable` та поле `let id = UUID()` у модель даних.\n\n2. **Duplicate keys found for id (Немонотонні / повторювані ID)**:\nВи використали як ідентифікатор назву товару `id: \\.title`, і в масиві виявилося два однакових товари "Кава".\n*Наслідок*: SwiftUI зламає анімації скролу та видалення. Завжди використовуйте справжні унікальні ключі (наприклад, `UUID()` або ID з бази даних).'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Чому небезпечно використовувати імʼя користувача або назву товару як id у списку?',
              options: [
                'Якщо в списку опиняться два елементи з однаковим імʼям, виникне конфлікт ідентифікаторів і баги рендерингу',
                'Swift забороняє використовувати рядки String',
                'Імена не можна порівнювати у SwiftUI',
                'Це сповільнює швидкість інтернету'
              ],
              correctAnswer: 0,
              explanation: 'id повинен бути суворо унікальним для кожного рядка. Збіг двох id викликає помилку Duplicate Keys і ламає оновлення інтерфейсу.'
            },
            {
              question: 'Який модифікатор дозволяє реалізувати жест свайпу для видалення рядка у List?',
              options: [
                '.onDelete { indexSet in ... }',
                '.swipeToDelete()',
                '.enableGestures()',
                '.removeOnTap()'
              ],
              correctAnswer: 0,
              explanation: 'Модифікатор .onDelete на ForEach додає нативний жест свайпу для видалення рядка.'
            },
            {
              question: 'У чому полягає відмінність LazyVStack від звичайного VStack всередині ScrollView?',
              options: [
                'LazyVStack створює елементи тільки тоді, коли вони потрапляють у зону видимості екрана',
                'LazyVStack не підтримує картинки',
                'LazyVStack працює тільки горизонтально',
                'Звичайний VStack заборонено вкладати у ScrollView'
              ],
              correctAnswer: 0,
              explanation: 'Префікс Lazy (лінивий) означає відкладену ініціалізацію елементів до моменту їх появи перед очима користувача.'
            }
          ]
        }
      },
      {
        id: 'lists-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінний екран фінансової історії транзакцій з додаванням нових операцій та свайпами.',
        content: {
          realWorldContext: 'Створіть у Playground банківський журнал транзакцій `TransactionHistoryView` з кольоровою диференціацією надходжень (+) та витрат (-), можливістю видалення свайпом та додаванням нових пунктів.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: ЖУРНАЛ ТРАНЗАКЦІЙ
// ==========================================

import SwiftUI

struct BankTransaction: Identifiable {
    let id = UUID()
    let category: String
    let note: String
    let amount: Double
    let date: String
}

struct TransactionHistoryView: View {
    @State private var history: [BankTransaction] = [
        BankTransaction(category: "Зарплата", note: "Основний дохід", amount: 45000.0, date: "Сьогодні"),
        BankTransaction(category: "Сільпо", note: "Продукти додому", amount: -840.50, date: "Вчора"),
        BankTransaction(category: "Apple Services", note: "Підписка iCloud", amount: -129.0, date: "12 лист"),
        BankTransaction(category: "Кешбек", note: "Бонуси за покупки", amount: 240.0, date: "10 лист")
    ]
    
    var body: some View {
        NavigationStack {
            List {
                Section("Останні операції") {
                    ForEach(history) { item in
                        HStack(spacing: 12) {
                            // Кругла іконка зі стрілкою напрямку платежу
                            Image(systemName: item.amount >= 0 ? "arrow.down.left" : "arrow.up.right")
                                .font(.headline)
                                .foregroundStyle(item.amount >= 0 ? .green : .red)
                                .frame(width: 36, height: 36)
                                .background((item.amount >= 0 ? Color.green : Color.red).opacity(0.12))
                                .clipShape(Circle())
                            
                            VStack(alignment: .leading, spacing: 3) {
                                Text(item.category)
                                    .font(.headline)
                                Text("\\(item.note) • \\(item.date)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            
                            Spacer()
                            
                            // Сума операції
                            Text("\\(item.amount >= 0 ? "+" : "")\\(item.amount, specifier: "%.2f") ₴")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(item.amount >= 0 ? .green : .primary)
                        }
                        .padding(.vertical, 4)
                    }
                    .onDelete { indexSet in
                        history.remove(atOffsets: indexSet)
                    }
                }
            }
            .navigationTitle("Історія балансу")
        }
    }
}

#Preview {
    TransactionHistoryView()
}`,
          explanation: [
            '`BankTransaction: Identifiable` забезпечує безпомилкову роботу `ForEach(history)`.',
            'Тернарний оператор `item.amount >= 0 ? .green : .red` візуально виділяє позитивні та негативні фінансові потоки.',
            '`.onDelete` дозволяє користувачеві безпечно видаляти записи з журналу одним свайпом вліво.'
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
          }
        }
      }
    ]
  },
  {
    id: 'swiftui-modifiers-components',
    module: 4,
    moduleTitle: 'Модуль 4: Основи SwiftUI та компонування',
    title: 'Модифікатори: Порядок виклику та Власні Компоненти',
    description: 'Дізнайтеся, чому порядок модифікаторів має вирішальне значення у SwiftUI, як створювати кастомні ViewModifier та розбивати монолітні екрани на компоненти.',
    difficulty: 'Середній',
    estimatedMinutes: 22,
    icon: 'Sparkles',
    content: {
      realWorldContext: 'Одна з найчастіших помилок новачків у SwiftUI — нерозуміння того, чому фоновий колір заливає лише текст, а не всю кнопку, або чому рамка обрізає тінь. Усе це залежить від черговості модифікаторів. Декомпозиція коду на окремі перевикористовувані компоненти спрощує підтримку коду у великих застосунках.',
      detailedTheory: [
        {
          title: 'Порядок модифікаторів МАЄ ЗНАЧЕННЯ',
          paragraphs: [
            'У SwiftUI модифікатори НЕ змінюють наявне View на місці. Кожен модифікатор створює навколо попереднього нову обгортку View.',
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
    },
    pages: [
      {
        id: 'modifiers-intuition-wrapping',
        title: 'Інтуїція: Як влаштовані модифікатори — принцип "Матрьошки"',
        stepLabel: '1. Інтуїція & Шари обгортки',
        description: 'Чому модифікатори не змінюють властивості на місці, а загортають View у нові контейнери шар за шаром.',
        content: {
          realWorldContext: 'Коли ви відправляєте подарунок поштою, ви кладете річ у коробку, коробку загортаєте у святковий папір, а зверху клеїте поштову марку. Якщо наклеїти марку до паперу, папір закриє марку! У SwiftUI працює точно такий самий принцип шарів.',
          detailedTheory: [
            {
              title: 'Метафора: Багетна рамка для картини',
              paragraphs: [
                'Уявіть картину художника:\n1. Спочатку береться полотно з малюнком (`Text("Привіт")`).\n2. Навколо полотна додається широке біле паспарту (`.padding()`). Площа виробу збільшилася.\n3. Під паспарту підкладається деревʼяна підкладка (`.background(Color.blue)`). Тепер увесь великий прямокутник став синім.\n4. Зовнішні кути рами спилюються пилкою (`.clipShape(RoundedRectangle(cornerRadius: 16))`).\n\nЯкщо поміняти місцями кроки 2 і 3 — тобто спочатку пофарбувати малюнок фарбою, а потім додати біле паспарту — синім залишиться лише крихітний клаптик під літерами тексту! Модифікатори у SwiftUI — це шари обгортки (Матрьошка).'
              ]
            },
            {
              title: 'Чому це не мутація обʼєкта?',
              paragraphs: [
                'В імперативних мовах ви писали: `button.backgroundColor = .blue`. Це мутувало наявний обʼєкт на місці.\n\nУ SwiftUI виклик `.background(Color.blue)` повертає **НОВИЙ** екземпляр структури `ModifiedContent`, який загортає початковий компонент усередину себе. Ваше початкове View залишається недоторканим і незмінним.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Що насправді робить модифікатор .padding() у SwiftUI?',
              options: [
                'Огортає View у новий шар з додаванням внутрішніх відступів',
                'Змінює внутрішню константу margin у пікселях екрана',
                'Примусово зменшує розмір шрифту',
                'Перезавантажує додаток'
              ],
              correctAnswer: 0,
              explanation: 'Модифікатори у SwiftUI не мутують обʼєкт, а огортають його в новий шар ModifiedContent.'
            },
            {
              question: 'Чому код Text("Привіт").background(.blue).padding() дає інший результат, ніж Text("Привіт").padding().background(.blue)?',
              options: [
                'У першому випадку синій фон застосується лише до площі тексту, а в другому — зафарбує всю розширену площу разом із відступами',
                'Тому що другий варіант містить помилку компіляції',
                'Різниці немає, це одне й те саме',
                'У першому випадку текст стане прозорим'
              ],
              correctAnswer: 0,
              explanation: 'Порядок модифікаторів визначає, який шар накладається першим: фон на стиснутий текст чи фон на розширений відступами блок.'
            }
          ]
        }
      },
      {
        id: 'modifiers-order-significance',
        title: 'Анатомія порядку: Зони натискання, frame та обрізка clipShape',
        stepLabel: '2. Порядок модифікаторів',
        description: 'Як порядок виклику впливає на площу тапу кнопки, появу тіней та коректне заокруглення кутів.',
        content: {
          realWorldContext: 'Користувач намагається натиснути на кнопку, але попадає пальцем на кілька міліметрів поруч — і кнопка не спрацьовує! Якщо ви правильно розташували `.padding()` до `.onTapGesture` чи фону, зона кліку збільшиться до комфортного розміру 44x44pt.',
          detailedTheory: [
            {
              title: 'Правило трьох кроків оформлення плашок',
              paragraphs: [
                'Золотий стандарт стилізації карток і кнопок:\n1. Спочатку задайте розмір або відступи: `.padding(...)` або `.frame(...)`.\n2. Потім застосуйте колір або градієнт: `.background(...)`.\n3. І лише наприкінці обріжте форму або додайте тінь: `.clipShape(...)` та `.shadow(...)`.\n\nЯкщо викликати `.clipShape` до `.padding`, ви обріжете початковий текст, а зовнішні відступи залишаться безформними прямокутниками.'
              ]
            },
            {
              title: 'Тінь (Shadow) та обрізка (ClipShape)',
              paragraphs: [
                'Обережно: якщо викликати `.shadow()` **до** `.clipShape()`, заокруглені кути зріжуть вашу тінь!\n\nЗавжди накладайте `.shadow()` **після** або зовні обрізаної форми, щоб світлотінь мʼяко розсіювалася навколо обʼєкта.'
              ]
            }
          ],
          codeSnippet: `import SwiftUI

struct ActionButtonDemo: View {
    var body: some View {
        VStack(spacing: 24) {
            // 1. ПРАВИЛЬНА КНОПКА (Зручна зона тапу, плавний фон)
            Button(action: {}) {
                Text("Почати тренування")
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 14)
                    .background(Color.blue.gradient)
                    .clipShape(Capsule())
                    .shadow(color: .blue.opacity(0.3), radius: 8, y: 4)
            }
            
            // 2. ПОМИЛКОВА КНОПКА (Фон накладено раніше за відступи)
            Button(action: {}) {
                Text("Почати тренування")
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .background(Color.red) // Синє тільки під буквами!
                    .padding(.horizontal, 24)
                    .clipShape(Capsule()) // Обріже відступи
            }
        }
    }
}`,
          explanation: [
            'У правильній кнопці `.padding` формує зручну площу натискання, потім `.background` заливає її синім градієнтом, `.clipShape` перетворює на капсулу, і `.shadow` додає обʼєм.',
            'У другій кнопці порядок зламано: фон застосувався лише до прямокутника тексту, а форма спотворилася.'
          ]
        }
      },
      {
        id: 'modifiers-custom-viewmodifier',
        title: 'Чистий код: Створення власних ViewModifier та декомпозиція екранів',
        stepLabel: '3. Власні ViewModifier',
        description: 'Як упакувати 10 однакових модифікаторів в одну зручну функцію та розвантажити компілятор Swift.',
        content: {
          realWorldContext: 'У вашому додатку є 15 різних карток, і кожна повинна мати білий фон, заокруглення 16pt, сіру обводку та легку тінь. Копіювати 5 рядків модифікаторів у 15 місць — це порушення принципу DRY (Don\'t Repeat Yourself). Створіть один єдиний ViewModifier!',
          detailedTheory: [
            {
              title: 'Протокол ViewModifier',
              paragraphs: [
                'Щоб створити власний модифікатор, оголосіть структуру з протоколом `ViewModifier` та реалізуйте метод:\n`func body(content: Content) -> some View { ... }`\n\nПараметр `content` — це початкове View, до якого користувач застосує ваш стиль.'
              ]
            },
            {
              title: 'Створення зручного розширення для View',
              paragraphs: [
                'Щоб не писати громіздке `.modifier(CardStyleModifier())`, додайте розширення:\n`extension View { func cardStyle() -> some View { modifier(CardStyleModifier()) } }`.\nТепер ваш кастомний модифікатор виглядає як рідний системний метод SwiftUI!'
              ]
            },
            {
              title: 'Декомпозиція: Порятунок від довгих body',
              paragraphs: [
                'Якщо `var body` перевищує 50-70 рядків, Xcode починає підгальмовувати, а підказки автодоповнення перестають працювати. Розбивайте екран на маленькі дочірні підкомпоненти: `HeaderView`, `ContentView`, `BottomBarView`.'
              ]
            }
          ],
          codeSnippet: `import SwiftUI

// 1. Оголошення власного модифікатора
struct PrimaryButtonModifier: ViewModifier {
    let backgroundColor: Color
    
    func body(content: Content) -> some View {
        content
            .font(.headline)
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(backgroundColor.gradient)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .shadow(color: backgroundColor.opacity(0.35), radius: 8, y: 4)
    }
}

// 2. Розширення для лаконічного виклику
extension View {
    func primaryButtonStyle(color: Color = .blue) -> some View {
        modifier(PrimaryButtonModifier(backgroundColor: color))
    }
}

// 3. Чисте та лаконічне використання в інтерфейсі
struct CheckoutScreen: View {
    var body: some View {
        VStack(spacing: 16) {
            Button("Оплатити через Apple Pay") {}
                .primaryButtonStyle(color: .black)
            
            Button("Оплатити карткою") {}
                .primaryButtonStyle(color: .blue)
        }
        .padding()
    }
}`,
          explanation: [
            '`PrimaryButtonModifier` інкапсулює 8 рядків налаштування стилю в єдине місце.',
            'Якщо бренд-дизайнер оновить радіус заокруглення з 14 до 18, ви зміните лише один рядок коду, і всі кнопки в усьому застосунку оновляться автоматично.'
          ]
        }
      },
      {
        id: 'modifiers-errors-quiz',
        title: 'Типові помилки компілятора та Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо зависання компілятора через надто складні вирази та перевіряємо розуміння модифікаторів.',
        content: {
          realWorldContext: 'Компілятор Swift іноді видає помилку "The compiler is unable to type-check this expression in reasonable time; try breaking up the expression into distinct sub-expressions". Розглянемо, як це лікується.',
          detailedTheory: [
            {
              title: 'Чому компілятор "втомлюється"?',
              paragraphs: [
                'Кожен модифікатор створює вкладений generic-тип `ModifiedContent<ModifiedContent<...>>`. Якщо в одному `var body` зібрано понад 30-40 модифікаторів поспіль без розбиття, алгоритм виводу типів Swift змушений перебирати мільйони комбінацій типів.\n\n*Лікування*: винесіть логічну частину верстки в окрему структуру `struct SubView: View` або збережену властивість. Це миттєво повертає блискавичну швидкість збірки.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Яку функцію необхідно реалізувати у структурі, що відповідає протоколу ViewModifier?',
              options: [
                'func body(content: Content) -> some View',
                'func apply(to: UIView)',
                'func render() -> Void',
                'var modifierName: String { get }'
              ],
              correctAnswer: 0,
              explanation: 'Протокол ViewModifier вимагає реалізації єдиного методу func body(content: Content) -> some View.'
            },
            {
              question: 'Як найефективніше виправити помилку "The compiler is unable to type-check this expression in reasonable time"?',
              options: [
                'Розбити великий монолітний body на кілька окремих дочірніх структур або обчислювальних властивостей',
                'Перезавантажити компʼютер Mac',
                'Видалити всі модифікатори з екрана',
                'Замінити SwiftUI на веб-сайт'
              ],
              correctAnswer: 0,
              explanation: 'Декомпозиція великого виразу на окремі підструктури дає компілятору чіткі точки зупинки типізації та оптимізує час збірки.'
            },
            {
              question: 'Що станеться, якщо застосувати модифікатор .clipShape(Circle()) до додавання .padding()?',
              options: [
                'Коло обріже початковий контент, а відступи додадуться вже зовні, утворивши прямокутне невидиме поле',
                'Виникне Fatal Crash у рантаймі',
                'Коло автоматично перетвориться на квадрат',
                'Padding взагалі перестане працювати'
              ],
              correctAnswer: 0,
              explanation: 'Оскільки модифікатори огортають елемент по черзі, відступ буде додано навколо вже обрізаного кола.'
            }
          ]
        }
      },
      {
        id: 'modifiers-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінну картку товару в онлайн-магазині з кастомними модифікаторами та повною декомпозицією.',
        content: {
          realWorldContext: 'Створіть у Playground модульний екран огляду товару `ProductOverview`, використовуючи власний стиль картки `CardStyleModifier` та розбиваючи інтерфейс на незалежні підкомпоненти.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: МОДУЛЬНА КАРТКА ТОВАРУ
// ==========================================

import SwiftUI

// 1. Кастомний модифікатор для універсального стилю карток
struct UniversalCardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(18)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 20))
            .shadow(color: .black.opacity(0.06), radius: 10, y: 5)
    }
}

extension View {
    func universalCard() -> some View {
        modifier(UniversalCardStyle())
    }
}

// 2. Головний екран картки товару
struct ProductCardView: View {
    let title: String
    let brand: String
    let price: Double
    let rating: Double
    let isAvailable: Bool
    
    var body: some View {
        VStack(spacing: 16) {
            ProductHeaderSection(title: title, brand: brand, isAvailable: isAvailable)
            Divider()
            ProductFooterSection(price: price, rating: rating)
        }
        .universalCard() // Застосування власного модифікатора
        .padding(.horizontal)
    }
}

// 3. Декомпозовані дочірні компоненти
struct ProductHeaderSection: View {
    let title: String
    let brand: String
    let isAvailable: Bool
    
    var body: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                Text(brand)
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundStyle(.blue)
                
                Text(title)
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundStyle(.primary)
            }
            
            Spacer()
            
            Text(isAvailable ? "В наявності" : "Закінчився")
                .font(.caption2)
                .fontWeight(.semibold)
                .foregroundStyle(isAvailable ? .green : .secondary)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background((isAvailable ? Color.green : Color.gray).opacity(0.12))
                .clipShape(Capsule())
        }
    }
}

struct ProductFooterSection: View {
    let price: Double
    let rating: Double
    
    var body: some View {
        HStack {
            // Ціна
            VStack(alignment: .leading, spacing: 2) {
                Text("Ціна")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                Text("$\\(price, specifier: "%.2f")")
                    .font(.title2)
                    .fontWeight(.bold)
            }
            
            Spacer()
            
            // Рейтинг
            HStack(spacing: 4) {
                Image(systemName: "star.fill")
                    .foregroundStyle(.yellow)
                Text("\\(rating, specifier: "%.1f")")
                    .fontWeight(.bold)
            }
            .font(.subheadline)
        }
    }
}

#Preview {
    ProductCardView(title: "AirPods Pro (2nd Gen)", brand: "Apple", price: 249.0, rating: 4.9, isAvailable: true)
}`,
          explanation: [
            '`UniversalCardStyle` забезпечує повторюваність стилів для всіх карток застосунку без дублювання коду.',
            'Розбиття на `ProductHeaderSection` та `ProductFooterSection` спрощує підтримку коду, тестування та читабельність.',
            'Кожен дочірній View відповідає лише за свою логічну зону.'
          ],
          challenge: {
            task: 'Створіть власний `ViewModifier` під назвою `PillBackground`, який додає горизонтальний відступ 16, вертикальний 8, сірий фон `Color(.systemGray6)` та форму `Capsule()`.',
            hint: 'struct PillBackground: ViewModifier { func body(content: Content) -> some View { content.padding(.horizontal, 16).padding(.vertical, 8).background(Color(.systemGray6)).clipShape(Capsule()) } }',
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
    ]
  }
];
