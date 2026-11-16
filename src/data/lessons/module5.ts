import { Lesson } from '@/types';

export const module5Lessons: Lesson[] = [
  {
    id: 'swift-concurrency-fundamentals',
    module: 5,
    moduleTitle: 'Модуль 5: Асинхронність та Робота з Мережею',
    title: 'Swift Concurrency: async/await, Task та MainActor',
    description: 'Опануйте сучасну модель асинхронності в Swift: забудьте про callback hell, навчіться безпечно оновлювати UI на @MainActor та запускати паралельні задачі.',
    difficulty: 'Середній',
    estimatedMinutes: 24,
    icon: 'Clock',
    content: {
      realWorldContext: 'Коли додаток завантажує стрічку новин з інтернету, це займає 1-2 секунди. Якби процесор чекав на відповідь сервера синхронно, екран iPhone повністю завис би: користувач не міг би навіть прокрутити сторінку чи натиснути кнопку "Назад". Swift Concurrency дозволяє виконувати фонову роботу непомітно для користувача.',
      detailedTheory: [
        {
          title: 'Що таке async/await?',
          paragraphs: [
            'Функція з позначкою `async` повідомляє системі, що вона може призупинити своє виконання в точці `await`, звільнити системний потік для інших задач, і повернутися до виконання, коли дані надійдуть.',
            '`await` розгортає результат асинхронної операції лінійно, рядок за рядком, назавжди позбавляючи код від заплутаних вкладених замикань (Callback Hell).'
          ]
        },
        {
          title: 'Контейнер Task та паралелізм',
          paragraphs: [
            '`Task { ... }` — це міст між звичайним синхронним світом (наприклад, натисканням кнопки) та асинхронним кодом. Він створює окрему керовану асинхронну задачу.',
            'Для одночасного запуску кількох незалежних операцій використовують `async let` або `TaskGroup`.'
          ]
        },
        {
          title: 'Головний актор @MainActor',
          paragraphs: [
            'В операційній системі iOS існує залізне правило: **БУДЬ-ЯКЕ оновлення призначеного для користувача інтерфейсу (UI) зобовʼязане відбуватися на головному потоці (Main Thread)**.',
            'Атрибут `@MainActor` гарантує на рівні компілятора, що код властивості чи функції завжди виконуватиметься виключно на головному потоці, захищаючи від підступних багів гонки даних (Data Races).'
          ]
        }
      ],
      theory: [
        'async/await дозволяє писати асинхронний код як звичайний лінійний.',
        'await позначає точку можливого призупинення задачі (suspension point).',
        'Task запускає асинхронний контекст із синхронного коду.',
        '@MainActor гарантує безпечне оновлення інтерфейсу на головному потоці.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Сучасний async/await з лінійним кодом',
          code: `func loadUserProfile() async {
    do {
        let user = try await apiService.fetchUser()
        let avatar = try await apiService.fetchAvatar(for: user)
        
        // Оновлення UI на головному потоці
        self.profile = user
        self.avatarImage = avatar
    } catch {
        self.errorMessage = error.localizedDescription
    }
}`,
          explanation: 'Код читається згори донизу, як звичайна послідовність дій. Обробка помилок зосереджена в єдиному блоці catch.'
        },
        bad: {
          title: 'Застарілий Callback Hell (Піраміда замикань)',
          code: `apiService.fetchUser { result in
    switch result {
    case .success(let user):
        apiService.fetchAvatar(for: user) { avatarResult in
            switch avatarResult {
            case .success(let avatar):
                DispatchQueue.main.async {
                    self.profile = user
                    self.avatarImage = avatar
                }
            case .failure(let error):
                DispatchQueue.main.async { self.errorMessage = error.localizedDescription }
            }
        }
    case .failure(let error):
        DispatchQueue.main.async { self.errorMessage = error.localizedDescription }
    }
}`,
          explanation: 'Глибока вкладеність, дублювання коду перемикання потоків DispatchQueue.main.async та легкість випадково пропустити виклик колбеку.'
        }
      },
      codeSnippet: `import SwiftUI

// 1. Асинхронний сервіс
class NetworkFeedService {
    func fetchArticles() async throws -> [String] {
        guard let url = URL(string: "https://api.example.com/news") else {
            throw URLError(.badURL)
        }
        
        // await призупиняє функцію до завершення мережевого запиту
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        return try JSONDecoder().decode([String].self, from: data)
    }
}

// 2. Безпечне використання у SwiftUI з @MainActor
@MainActor
class FeedViewModel: ObservableObject {
    @Published var articles: [String] = []
    @Published var isLoading = false
    
    private let service = NetworkFeedService()
    
    func loadContent() async {
        isLoading = true
        defer { isLoading = false } // Виконається в кінці за будь-якого результату
        
        do {
            self.articles = try await service.fetchArticles()
        } catch {
            print("Помилка завантаження: \\(error.localizedDescription)")
        }
    }
}`,
      explanation: [
        '`try await URLSession.shared.data(from: url)` виконує системний мережевий запит у фоні без блокування інтерфейсу.',
        '`@MainActor class FeedViewModel` гарантує, що всі оновлення `@Published` властивостей відбуваються на головному потоці.',
        '`defer { isLoading = false }` забезпечує вимкнення спінера завантаження як при успіху, так і в разі помилки.'
      ],
      underTheHood: {
        title: 'Як працює планувальник Swift Cooperative Thread Pool',
        points: [
          'Раніше Grand Central Dispatch (GCD) міг створювати сотні потоків (Thread Explosion), що призводило до перевантаження ядра процесора перемиканням контексту.',
          'Новий Swift Concurrency Runtime використовує пул потоків, кількість яких точно дорівнює кількості фізичних ядер процесора вашого iPhone.',
          'Коли задача доходить до `await`, потік не чекає на місці, а миттєво бере в роботу іншу корисну задачу. Це забезпечує максимальну енергоефективність батареї смартфона.'
        ]
      },
      checkpoints: [
        {
          question: 'Що відбувається з системним потоком у момент виконання ключового слова await?',
          options: [
            'Потік звільняється для виконання інших корисних задач, а поточна функція призупиняється (suspends)',
            'Потік повністю блокується і зависає до отримання відповіді',
            'Телефон примусово перезавантажується',
            'Swift автоматично створює новий потік'
          ],
          correctAnswer: 0,
          explanation: 'await є точкою призупинення (suspension point): задача відкладається, а потік звільняється для інших процесів.'
        }
      ],
      keyTakeaways: [
        'async/await замінює складні замикання лінійним зрозумілим кодом.',
        'Ніколи не блокуйте головний потік важкими синхронними операціями.',
        'Використовуйте `@MainActor` для захисту інтерфейсу від Data Races.',
        'Кілька незалежних запитів запускайте паралельно через `async let`.'
      ],
      commonMistakes: [
        'Забування написати `await` перед викликом асинхронної функції.',
        'Оновлення стану UI з довільних фонових потоків без `@MainActor`.'
      ],
      challenge: {
        task: 'Створіть асинхронну функцію `fetchUserProfile() async throws -> String`, яка симулює затримку на 1 секунду за допомогою `try await Task.sleep(nanoseconds: 1_000_000_000)` та повертає рядок "Профіль завантажено".',
        hint: 'Оголосіть func fetchUserProfile() async throws -> String, додайте Task.sleep і поверніть значення',
        solution: `func fetchUserProfile() async throws -> String {
    try await Task.sleep(nanoseconds: 1_000_000_000)
    return "Профіль завантажено"
}`
      }
    },
    pages: [
      {
        id: 'concurrency-intuition-threads',
        title: 'Інтуїція: Що таке Асинхронність та чому зависає екран смартфона',
        stepLabel: '1. Інтуїція & Асинхронність',
        description: 'Зрозумійте відмінність між синхронним блокуванням інтерфейсу та асинхронною фоновою роботою.',
        content: {
          realWorldContext: 'Ви коли-небудь користувалися додатком, де при натисканні кнопки екран завмирає на 3 секунди і не реагує на жодні дотики? Це класичний баг: розробник запустив важке завантаження файлу прямо на головному потоці (Main Thread).',
          detailedTheory: [
            {
              title: 'Метафора: Офіціант у ресторані',
              paragraphs: [
                'Уявіть собі ресторан з одним офіціантом (це наш **Головний Потік / Main Thread**), який приймає замовлення від гостей (це реакція на тапи користувача та малювання пікселів з частотою 120 Гц).\n\n• **Синхронний підхід (Блокування)**: офіціант бере замовлення на стейк, іде на кухню і стоїть біля плити 25 хвилин, не рухаючись, поки мʼясо смажиться. Весь ресторан у цей час сидить без води, ніхто не може розрахуватися, двері зачинені. Це і є "зависання додатку"!\n• **Асинхронний підхід (Swift Concurrency)**: офіціант передає замовлення шеф-кухарю на кухню (`async`), розвертається і продовжує миттєво обслуговувати інших гостей. Коли стейк готовий, шеф дзвонить у дзвіночок (`await`), офіціант забирає готову страву і приносить гостю на стіл.'
              ]
            },
            {
              title: 'Головний потік (Main Thread) — святиня iOS',
              paragraphs: [
                'Головний потік процесора відповідає за плавне малювання інтерфейсу. Якщо будь-яка операція на головному потоці триває довше ніж 16 мілісекунд, користувач відчуває ривки (dropped frames). А якщо понад 10 секунд — операційна система iOS примусово вбиває процес додатка через так званий Watchdog Timeout!'
              ],
              callout: {
                type: 'tip',
                title: 'Золоте правило iOS',
                text: 'Мережа, парсинг великих файлів і запити до баз даних — ЗАВЖДИ у фоні. Оновлення тексту, картинок та анімацій — ЗАВЖДИ на головному потоці.'
              }
            }
          ],
          checkpoints: [
            {
              question: 'Чому не можна виконувати мережеві запити синхронно на головному потоці (Main Thread)?',
              options: [
                'Екран додатку повністю зависне і перестане реагувати на дотики пальців до завершення запиту',
                'Сервери Apple блокують синхронні IP-адреси',
                'Синхронний код автоматично видаляє файли',
                'Синхронні запити споживають у 100 разів більше трафіку'
              ],
              correctAnswer: 0,
              explanation: 'Головний потік відповідає за обробку дотиків і рендеринг UI. Його блокування призводить до повного зависання інтерфейсу (ANR/Freeze).'
            },
            {
              question: 'Що робить операційна система iOS, якщо додаток заблокував головний потік на тривалий час (наприклад, понад 10 секунд)?',
              options: [
                'Механізм Watchdog аварійно завершує роботу додатку (Crash)',
                'iOS вмикає чорно-білий режим',
                'Телефон надсилає SMS розробнику',
                'Нічого, додаток чекатиме нескінченно'
              ],
              correctAnswer: 0,
              explanation: 'Системний сторож iOS Watchdog безжально припиняє процес завислого додатка для захисту взаємодії користувача з телефоном.'
            }
          ]
        }
      },
      {
        id: 'concurrency-syntax-async-await',
        title: 'Анатомія синтаксису: Ключові слова async, await та блок Task',
        stepLabel: '2. Анатомія async/await',
        description: 'Як декларувати асинхронні функції, що означає призупинення await та як запустити задачу через Task.',
        content: {
          realWorldContext: 'Коли користувач натискає кнопку "Оновити баланс", ви викликаєте функцію, яка звертається до банківського сервера. Розгляньмо, як описати цю логіку чистим синтаксисом.',
          detailedTheory: [
            {
              title: 'Синтаксис async throws',
              paragraphs: [
                'Коли функція працює асинхронно і при цьому може повернути помилку (наприклад, збій зʼєднання), її заголовок виглядає так:\n`func fetchData() async throws -> Data`.\n\n• `async` вказує компілятору, що функція виконуватиметься асинхронно.\n• `throws` вказує, що функція може кинути виняток/помилку.\n\nПід час виклику такої функції обидва модифікатори пишуться перед нею у порядку `try await`:\n`let data = try await fetchData()`.'
              ]
            },
            {
              title: 'Що таке блок Task { ... }?',
              paragraphs: [
                'Звичайні кнопки у SwiftUI (`Button("Завантажити") { ... }`) є синхронними блоками. Ви не можете написати `await` безпосередньо всередині звичайної дії кнопки.\n\nЩоб увійти в асинхронний режим із синхронного місця, створюють контейнер `Task { ... }`.'
              ]
            }
          ],
          codeSnippet: `import SwiftUI

// 1. Асинхронна функція з імітацією затримки
func fetchBitcoinPrice() async throws -> Double {
    // Симуляція мережевої затримки на 1.5 секунди
    try await Task.sleep(nanoseconds: 1_500_000_000)
    return 94250.75
}

struct CryptoWidget: View {
    @State private var price: Double = 0.0
    @State private var isFetching = false
    
    var body: some View {
        VStack(spacing: 12) {
            Text("BTC: $\\(price, specifier: "%.2f")")
                .font(.title)
                .bold()
            
            Button(isFetching ? "Оновлення..." : "Оновити курс") {
                // Task дозволяє викликати async код із синхронної кнопки!
                Task {
                    isFetching = true
                    defer { isFetching = false }
                    
                    do {
                        price = try await fetchBitcoinPrice()
                    } catch {
                        print("Помилка зв'язку: \\(error)")
                    }
                }
            }
            .disabled(isFetching)
        }
        .padding()
    }
}`,
          explanation: [
            '`Task.sleep(nanoseconds:)` — сучасний аналог таймера очікування, який не заморожує процесорний потік.',
            '`Task { ... }` дає змогу викликати `try await fetchBitcoinPrice()` безпосередньо з обробника натискання кнопки.',
            '`defer { isFetching = false }` спрацює автоматично після виходу з блоку `Task`, гарантуючи розблокування кнопки.'
          ]
        }
      },
      {
        id: 'concurrency-mainactor-isolation',
        title: 'Безпека UI: Головний актор @MainActor та паралелізм async let',
        stepLabel: '3. @MainActor & Паралелізм',
        description: 'Як надійно захистити інтерфейс від викликів з фонових потоків та завантажувати кілька сутностей одночасно.',
        content: {
          realWorldContext: 'Якщо оновити текст у SwiftUI з фонового потоку, Xcode покаже фіолетове попередження: "Publishing changes from background threads is not allowed". Це потенційна причина дивних мерехтінь або крашів.',
          detailedTheory: [
            {
              title: 'Аннотація @MainActor',
              paragraphs: [
                'Актор у Swift — це захищений тип, що гарантує послідовний доступ до своїх даних без стану гонки (Data Race).\n\n`@MainActor` — це глобальний системний актор, який представляє головний потік пристрою. Якщо ви позначаєте клас ViewModel або окремий метод аннотацією `@MainActor`, компілятор гарантує, що всі зміни стану відбудуться виключно на головному потоці без необхідності вручну писати старий код `DispatchQueue.main.async`.'
              ]
            },
            {
              title: 'Паралельне завантаження через async let',
              paragraphs: [
                'Якщо вам потрібно завантажити аватарку ТА список друзів одночасно, не робіть це послідовно:\n`let avatar = await getAvatar()` (чекаємо 2 сек)\n`let friends = await getFriends()` (чекаємо ще 2 сек, разом 4 сек).\n\nВикористовуйте `async let`! Обидва запити полетять паралельно, і разом займуть лише 2 секунди!'
              ]
            }
          ],
          codeSnippet: `// Приклад паралельного завантаження двох сутностей
func loadDashboardData() async throws -> (UserProfile, [NotificationItem]) {
    // Обидва запити запускаються ОДНОЧАСНО у фоні!
    async let userRequest = api.fetchUser()
    async let notificationsRequest = api.fetchNotifications()
    
    // Очікуємо завершення обох запитів в одній точці
    let user = try await userRequest
    let notifications = try await notificationsRequest
    
    return (user, notifications)
}`,
          explanation: [
            '`async let` створює дочірню задачу, яка починає виконуватися негайно без очікування попереднього рядка.',
            'Точка синхронізації `try await userRequest` зупиняє виконання лише тоді, коли дані дійсно потрібні для подальшої роботи.'
          ]
        }
      },
      {
        id: 'concurrency-compiler-errors-quiz',
        title: 'Типові помилки Concurrency в Xcode & Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо часті помилки компілятора при роботі з асинхронністю та закріплюємо тему.',
        content: {
          realWorldContext: 'Компілятор Swift 5.10 / Swift 6 суворо перевіряє передачу даних між потоками. Розберімо типові червоні повідомлення.',
          detailedTheory: [
            {
              title: 'Популярні помилки з async/await',
              paragraphs: [
                '1. **\'async\' call in a function that does not recognize concurrency**:\nВи спробували написати `await myFunc()` всередині звичайної синхронної функції.\n*Виправлення*: обгорніть виклик у `Task { await myFunc() }` або додайте слово `async` до самої функції.\n\n2. **Call can throw, but it is not marked with \'try\'**:\nАсинхронна функція кидає помилку (`async throws`), а ви написали `await func()` без слова `try`.\n*Виправлення*: напишіть `try await func()`.\n\n3. **Publishing changes from background threads is not allowed**:\nВи оновили властивість `@Published` у ViewModel з фонового контексту.\n*Виправлення*: позначте клас ViewModel атрибутом `@MainActor`.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Для чого використовується аннотація @MainActor у Swift?',
              options: [
                'Щоб гарантувати виконання методів та оновлення стану виключно на головному потоці (Main Thread)',
                'Щоб прискорити швидкість інтернету',
                'Щоб додати підтримку 3D графіки в гру',
                'Для збереження даних у хмару iCloud'
              ],
              correctAnswer: 0,
              explanation: '@MainActor ізолює стан на головному потоці, захищаючи інтерфейс користувача від паралельних мутацій.'
            },
            {
              question: 'У чому перевага конструкції async let над послідовними викликами await?',
              options: [
                'Вона дозволяє запустити кілька незалежних асинхронних запитів паралельно, скорочуючи загальний час очікування',
                'Вона працює без підключення до Wi-Fi',
                'Вона не потребує обробки помилок',
                'Це єдиний спосіб відкрити файл на диску'
              ],
              correctAnswer: 0,
              explanation: 'async let стартує виконання задачі негайно у фоні, дозволяючи виконувати кілька запитів одночасно.'
            },
            {
              question: 'Як запустити асинхронну функцію зсередини звичайного обробника натискання кнопки SwiftUI?',
              options: [
                'Обгорнути виклик у блок Task { await myFunction() }',
                'Поставити три знаки оклику перед функцією',
                'Використати цикл while',
                'У SwiftUI заборонено викликати асинхронний код із кнопок'
              ],
              correctAnswer: 0,
              explanation: 'Блок Task створює новий асинхронний контекст із синхронного середовища кнопки.'
            }
          ]
        }
      },
      {
        id: 'concurrency-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінний екран завантаження новин із таймером, індикатором завантаження та захистом @MainActor.',
        content: {
          realWorldContext: 'Створіть у Playground асинхронний менеджер новин `NewsLoader`, який імітує підключення до сервера, паралельно завантажує заголовок дня та курси валют, а також оновлює інтерфейс через @MainActor.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: АСИНХРОННИЙ ЗАВАНТАЖУВАЧ
// ==========================================

import SwiftUI

struct NewsArticle: Identifiable {
    let id = UUID()
    let title: String
    let readTimeMinutes: Int
}

@MainActor
class NewsViewModel: ObservableObject {
    @Published var articles: [NewsArticle] = []
    @Published var breakingNews: String = "Очікування новин..."
    @Published var isLoading: Bool = false
    
    // Імітація асинхронного запиту до сервера
    func fetchTopHeadlines() async throws -> [NewsArticle] {
        try await Task.sleep(nanoseconds: 1_200_000_000) // 1.2 сек
        return [
            NewsArticle(title: "Apple презентувала новий чип M4 Ultra", readTimeMinutes: 3),
            NewsArticle(title: "Swift 6 отримав повну безпеку від Data Races", readTimeMinutes: 5),
            NewsArticle(title: "SwiftUI став головним інструментом iOS-розробки", readTimeMinutes: 4)
        ]
    }
    
    func fetchBreakingNewsBanner() async throws -> String {
        try await Task.sleep(nanoseconds: 800_000_000) // 0.8 сек
        return "⚡ ТЕРМІНОВО: Реліз нової версії Xcode!"
    }
    
    // Головний метод із паралельним завантаженням через async let
    func refreshFeed() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            // Запускаємо обидва мережеві запити одночасно!
            async let bannerTask = fetchBreakingNewsBanner()
            async let articlesTask = fetchTopHeadlines()
            
            // Збираємо результати
            let banner = try await bannerTask
            let news = try await articlesTask
            
            // Оновлюємо UI (безпечно на @MainActor)
            self.breakingNews = banner
            self.articles = news
        } catch {
            self.breakingNews = "Помилка завантаження новин"
        }
    }
}

struct NewsFeedScreen: View {
    @StateObject private var viewModel = NewsViewModel()
    
    var body: some View {
        NavigationStack {
            VStack {
                // Банер гарячих новин
                Text(viewModel.breakingNews)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red.gradient)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .padding(.horizontal)
                
                if viewModel.isLoading {
                    Spacer()
                    ProgressView("Завантаження новин...")
                    Spacer()
                } else {
                    List(viewModel.articles) { item in
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(item.title).font(.headline)
                                Text("Час читання: \\(item.readTimeMinutes) хв").font(.caption).foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Стрічка новин")
            .toolbar {
                Button("Оновити") {
                    Task {
                        await viewModel.refreshFeed()
                    }
                }
            }
            .task {
                // task автоматично стартує при першій появі екрана
                await viewModel.refreshFeed()
            }
        }
    }
}`,
          explanation: [
            '`async let bannerTask` та `async let articlesTask` завантажуються паралельно, заощаджуючи час очікування для клієнта.',
            '`@MainActor class NewsViewModel` усуває будь-яку можливість появи фіолетових попереджень Xcode про оновлення UI з фонових потоків.',
            'Модифікатор `.task { await viewModel.refreshFeed() }` у SwiftUI автоматично керує життєвим циклом: якщо користувач закриє екран до завершення запиту, задача автоматично скасується (Task Cancellation).'
          ],
          challenge: {
            task: 'Створіть асинхронну функцію `fetchUserProfile() async throws -> String`, яка симулює затримку на 1 секунду за допомогою `try await Task.sleep(nanoseconds: 1_000_000_000)` та повертає рядок "Профіль завантажено".',
            hint: 'Оголосіть func fetchUserProfile() async throws -> String, додайте Task.sleep і поверніть значення',
            solution: `func fetchUserProfile() async throws -> String {
    try await Task.sleep(nanoseconds: 1_000_000_000)
    return "Профіль завантажено"
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-codable-json',
    module: 5,
    moduleTitle: 'Модуль 5: Асинхронність та Робота з Мережею',
    title: 'Парсинг JSON через Codable та робота з API',
    description: 'Навчіться перетворювати сирі JSON-відповіді бекенду в надійні структури Swift: CodingKeys, конвертація snake_case та безпечний парсинг дат.',
    difficulty: 'Середній',
    estimatedMinutes: 24,
    icon: 'Code',
    content: {
      realWorldContext: 'Майже 99% сучасних мобільних додатків спілкуються із серверами за допомогою текстового формату JSON. Завдяки протоколу `Codable` вам більше не потрібно вручну писати сотні рядків небезпечного коду розбору словників — Swift робить це автоматично і з повною перевіркою типів.',
      detailedTheory: [
        {
          title: 'Що таке Codable?',
          paragraphs: [
            '`Codable` — це зручний псевдонім (typealias) для двох протоколів: `Decodable` (можливість перетворити байти JSON у структуру Swift) та `Encodable` (можливість перетворити структуру Swift назад у JSON-байти для надсилання на сервер).',
            'Якщо всі типи полів вашої структури є стандартними (`String`, `Int`, `Double`, `Bool`, `Date`, масиви), компілятор Swift автоматично згенерує весь код парсингу без жодного додаткового рядка!'
          ]
        },
        {
          title: 'Невідповідність імен полів: CodingKeys',
          paragraphs: [
            'У бекенд-розробці принято називати поля в стилі **snake_case** (наприклад, `user_id`, `created_at`, `is_premium`), тоді як у Swift стандартом є **camelCase** (`userId`, `createdAt`, `isPremium`).',
            'Щоб звʼязати їх між собою, всередині структури створюють спеціальний перелік `enum CodingKeys: String, CodingKey`.'
          ]
        }
      ],
      theory: [
        'Codable = Decodable + Encodable.',
        'Автоматичний парсинг для стандартних типів.',
        'CodingKeys узгоджує snake_case сервера з camelCase Swift.',
        'Стратегії декодера (keyDecodingStrategy, dateDecodingStrategy) автоматизують налаштування.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Декларативний Codable',
          code: `struct User: Codable {
    let id: Int
    let fullName: String
    let email: String
}

// Один рядок коду парсить весь об'єкт!
let user = try JSONDecoder().decode(User.self, from: jsonData)`,
          explanation: 'Повна типобезпека: якщо сервер надішле рядок замість числа, компілятор відловить це і захистить додаток від крашу.'
        },
        bad: {
          title: 'Застарілий небезпечний ручний парсинг JSONSerialization',
          code: `if let dict = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
    let id = dict["id"] as? Int ?? 0
    let name = dict["full_name"] as? String ?? ""
    let email = dict["email"] as? String ?? ""
    // Десятки рядків ручних перевірок та небезпечних кастів
}`,
          explanation: 'Відсутність контролю типів, купа boilerplate-коду та тихі баги при зміні структури відповіді сервера.'
        }
      },
      codeSnippet: `import Foundation

// 1. Модель даних зі специфічними назвами ключів
struct GitHubRepository: Codable, Identifiable {
    let id: Int
    let name: String
    let description: String? // Опціонал: опис може бути відсутній (null)
    let stargazersCount: Int
    let htmlUrl: String
    
    // Зв'язуємо camelCase Swift з snake_case JSON
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case description
        case stargazersCount = "stargazers_count"
        case htmlUrl = "html_url"
    }
}

// 2. Налаштування декодера
let decoder = JSONDecoder()
// Альтернатива: автоматична конвертація без написання CodingKeys!
// decoder.keyDecodingStrategy = .convertFromSnakeCase
// decoder.dateDecodingStrategy = .iso8601`,
      explanation: [
        '`description: String?` — обовʼязково робіть поля опціональними, якщо сервер може повернути `null` або пропустити ключ.',
        '`enum CodingKeys: String, CodingKey` вказує точні назви полів у JSON-документі.',
        '`decoder.keyDecodingStrategy = .convertFromSnakeCase` може автоматично перетворювати `stargazers_count` у `stargazersCount` без ручного прописування CodingKeys.'
      ],
      underTheHood: {
        title: 'Як компілятор реалізує Decodable під капотом',
        points: [
          'Коли ви пишете `: Decodable`, компілятор Swift сам дописує спеціальний ініціалізатор `init(from decoder: Decoder) throws`.',
          'Він дістає контейнер ключів `container = try decoder.container(keyedBy: CodingKeys.self)` і послідовно декодує кожне поле `self.name = try container.decode(String.self, forKey: .name)`.',
          'Ви можете перевизначити цей init вручну, якщо вам потрібна надскладна нестандартна трансформація даних.'
        ]
      },
      checkpoints: [
        {
          question: 'Що станеться при спробі розпарсити поле let age: Int, якщо в JSON надійшло null, а поле не було позначене як опціональне Int??',
          options: [
            'JSONDecoder викине помилку DecodingError.valueNotFound і парсинг всього обʼєкта завершиться збоєм',
            'Поле age автоматично стане рівним 0',
            'Додаток миттєво крашнеться без можливості обробки',
            'Поле перетвориться на порожній рядок'
          ],
          correctAnswer: 0,
          explanation: 'Якщо ключ у JSON має значення null, а властивість не є опціональною (T?), декодер викидає DecodingError.valueNotFound.'
        }
      ],
      keyTakeaways: [
        'Codable забезпечує автоматичний та типобезпечний парсинг JSON.',
        'Завжди позначайте поля як опціональні `?`, якщо вони не гарантовані сервером.',
        'Використовуйте `convertFromSnakeCase`, щоб не писати CodingKeys вручну.',
        'Для дат налаштовуйте `decoder.dateDecodingStrategy = .iso8601`.'
      ],
      commonMistakes: [
        'Спроба розпарсити неопціональне поле, коли сервер повертає `null`.',
        'Неправильна назва кейсу в `CodingKeys` (одруківка ламає парсинг всього обʼєкта).'
      ],
      challenge: {
        task: 'Опишіть структуру `Product: Codable` з полями `id: Int`, `name: String`, `price: Double` та `inStock: Bool`, де для поля `inStock` ключ у JSON називається "in_stock".',
        hint: 'Використайте enum CodingKeys: String, CodingKey { case id, name, price; case inStock = "in_stock" }',
        solution: `struct Product: Codable {
    let id: Int
    let name: String
    let price: Double
    let inStock: Bool
    
    enum CodingKeys: String, CodingKey {
        case id, name, price
        case inStock = "in_stock"
    }
}`
      }
    },
    pages: [
      {
        id: 'codable-intuition-translation',
        title: 'Інтуїція: Що таке JSON та чому потрібен перекладач Codable',
        stepLabel: '1. Інтуїція & JSON',
        description: 'Як компʼютери обмінюються даними в інтернеті та чому сирий текст перетворюється у безпечні структури Swift.',
        content: {
          realWorldContext: 'Бекенд вашого застосунку може бути написаний на іншій мові (Node.js, Python, Go) і працювати на Linux-серверах у США. Щоб передати дані на ваш iPhone, сервер пакує їх в універсальний текстовий формат — JSON (JavaScript Object Notation).',
          detailedTheory: [
            {
              title: 'Метафора: Меблі IKEA у плоскій коробці',
              paragraphs: [
                'Уявіть, що ви замовили шафу:\n• **JSON** — це розібрана шафа, складена в компактну плоску картонну коробку: дошки, шурупи та інструкція у вигляді текстового рядка: `{"width": 80, "color": "white"}`. Вона ідеальна для транспортування через океан (інтернет).\n• **Структура Swift (`struct Cabinet`)** — це зібрана та готова шафа, яка стоїть у вашій кімнаті. Вона має чіткі фізичні розміри та типи даних.\n\n**Codable** — це автоматичний майстер, який дістає деталі з картонної коробки JSON і безпомилково збирає готову структуру Swift (`Decodable`), або розбирає шафу назад у коробку для повернення поштою на склад (`Encodable`).'
              ]
            },
            {
              title: 'Чому строга типізація Swift рятує від збоїв?',
              paragraphs: [
                'У JSON числа, булеві значення та рядки можуть бути переплутані або зіпсовані. Завдяки `Codable` Swift гарантує: якщо поле `balance` має бути числом `Double`, а сервер випадково надіслав слово `"невідомо"`, парсинг зупиниться з точною помилкою ще до того, як некоректні дані потраплять на екран.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Що робить протокол Decodable у Swift?',
              options: [
                'Дозволяє автоматично ініціалізувати структуру Swift із зовнішніх сирих даних (наприклад, JSON)',
                'Шифрує паролі користувача на пристрої',
                'Перетворює зображення у чорно-білий формат',
                'Створює кнопки у SwiftUI'
              ],
              correctAnswer: 0,
              explanation: 'Decodable надає механізм декодування (десеріалізації) сирих форматів (JSON, Plist) у типізовані структури Swift.'
            },
            {
              question: 'З яких двох протоколів складається псевдонім Codable?',
              options: [
                'Decodable та Encodable',
                'Identifiable та Equatable',
                'Hashable та Comparable',
                'Readable та Writable'
              ],
              correctAnswer: 0,
              explanation: 'typealias Codable = Decodable & Encodable.'
            }
          ]
        }
      },
      {
        id: 'codable-syntax-codingkeys',
        title: 'Анатомія Codable: CodingKeys та стратегія convertFromSnakeCase',
        stepLabel: '2. CodingKeys & snake_case',
        description: 'Як налаштувати відповідність між назвами полів сервера та вашими змінними у Swift.',
        content: {
          realWorldContext: 'Бекенд майже завжди повертає поля через підкреслення: `first_name`, `avatar_url`, `phone_number`. Але в iOS код-стайлі назви з підкресленнями вважаються поганим тоном. Розгляньмо, як красиво звʼязати два світи.',
          detailedTheory: [
            {
              title: 'Перелік CodingKeys',
              paragraphs: [
                'Якщо назва поля у Swift відрізняється від назви ключа в JSON, усередині структури створюють спеціальний enum:\n```swift\nenum CodingKeys: String, CodingKey {\n    case id\n    case firstName = "first_name"\n    case avatarURL = "avatar_url"\n}\n```\nВсі поля, які мають бути розпарсені, зобовʼязані бути перераховані в цьому enum.'
              ]
            },
            {
              title: 'Магічний прапорець convertFromSnakeCase',
              paragraphs: [
                'Якщо у вас велика модель на 30 полів, писати `CodingKeys` для кожного поля втомливо. Ви можете увімкнути автоматичну конвертацію:\n`let decoder = JSONDecoder()`\n`decoder.keyDecodingStrategy = .convertFromSnakeCase`.\n\nТепер декодер сам автоматично перетворить `created_at` у `createdAt`, `user_name` у `userName`!'
              ]
            }
          ],
          codeSnippet: `import Foundation

// Модель профілю користувача
struct ServerUserProfile: Codable {
    let id: Int
    let firstName: String
    let lastName: String
    let email: String
    let isSubscribed: Bool
    
    // Вказуємо відповідність ключів
    enum CodingKeys: String, CodingKey {
        case id
        case firstName = "first_name"
        case lastName = "last_name"
        case email
        case isSubscribed = "is_subscribed"
    }
}

// Приклад сирого JSON
let jsonString = """
{
    "id": 101,
    "first_name": "Богдан",
    "last_name": "Хмельницький",
    "email": "hetman@cossacks.ua",
    "is_subscribed": true
}
"""

let jsonData = Data(jsonString.utf8)
let user = try JSONDecoder().decode(ServerUserProfile.self, from: jsonData)

print("Розпарсено: \\(user.firstName) \\(user.lastName)") // Богдан Хмельницький`,
          explanation: [
            '`CodingKeys` використовує тип `String, CodingKey`, що дає змогу явно звʼязати рядок `"first_name"` зі змінною `firstName`.',
            'Ключі `id` та `email` співпадають за назвою, тому для них текстове значення вказувати не потрібно.'
          ]
        }
      },
      {
        id: 'codable-nested-dates-strategies',
        title: 'Складні сценарії: Вкладені обʼєкти, масиви та парсинг дат (ISO8601)',
        stepLabel: '3. Вкладеність & Дати',
        description: 'Як парсити складні ієрархічні JSON-структури, масиви та правильно розбирати рядки з датами.',
        content: {
          realWorldContext: 'Бекенд рідко повертає плоскі структури. Зазвичай відповідь містить обʼєкт автора, список коментарів та часовий штамп публікації на кшталт `"2026-11-16T14:30:00Z"`.',
          detailedTheory: [
            {
              title: 'Вкладені моделі (Nested Objects)',
              paragraphs: [
                'Якщо JSON містить внутрішній обʼєкт (`"address": { "city": "Київ", "street": "Хрещатик" }`), вам не потрібно розбирати його вручну! Просто створіть окрему підструктуру `struct Address: Codable` і вкажіть її як тип поля в батьківській структурі: `let address: Address`.'
              ]
            },
            {
              title: 'Стратегії парсингу дат dateDecodingStrategy',
              paragraphs: [
                'За замовчуванням `JSONDecoder` очікує, що дата передається як число секунд (TimeInterval). Проте більшість сучасних бекендів надсилають дати у стандартному рядковому форматі ISO-8601.\n\nЩоб дати розпізнавалися автоматично як обʼєкти Swift `Date`, налаштуйте декодер:\n`decoder.dateDecodingStrategy = .iso8601`.'
              ]
            }
          ],
          codeSnippet: `import Foundation

struct UserAddress: Codable {
    let city: String
    let street: String
}

struct OrderSummary: Codable {
    let orderNumber: String
    let itemsCount: Int
    let totalAmount: Double
    let createdAt: Date // Автоматичний парсинг у Date!
    let deliveryAddress: UserAddress // Вкладений об'єкт
    let tags: [String] // Масив рядків
}

// Налаштування декодера
let orderDecoder = JSONDecoder()
orderDecoder.keyDecodingStrategy = .convertFromSnakeCase
orderDecoder.dateDecodingStrategy = .iso8601`,
          explanation: [
            'Swift автоматично рекурсивно декодує всі вкладені структури (`UserAddress`) та масиви (`[String]`).',
            '`dateDecodingStrategy = .iso8601` перетворює рядок часового штампу в повноцінний обʼєкт `Date` без потреби писати ручні форматери.'
          ]
        }
      },
      {
        id: 'codable-errors-debugging-quiz',
        title: 'Типові помилки парсингу в Xcode & Дебаг через DecodingError',
        stepLabel: '4. Помилки & Тест',
        description: 'Як читати повідомлення DecodingError, чому стається typeMismatch та перевірка знань.',
        content: {
          realWorldContext: 'Коли парсинг падає, новачки часто пишуть `try?` і отримують просто `nil`, не розуміючи, де саме сталася помилка. Грамотний інженер перехоплює `DecodingError`, де вказано точний шлях до проблемного поля.',
          detailedTheory: [
            {
              title: 'Анатомія DecodingError',
              paragraphs: [
                '1. **typeMismatch**: тип даних у JSON не відповідає типу поля (наприклад, сервер надіслав рядок `"42"`, а ви очікували число `Int`).\n2. **valueNotFound**: сервер надіслав `null`, а у вашій структурі поле оголошене без знака питання (`let title: String` замість `String?`).\n3. **keyNotFound**: вказаний ключ взагалі відсутній у відповіді сервера (одруківка в назві або сервер змінив формат API).\n4. **dataCorrupted**: JSON має пошкоджений синтаксис (наприклад, незакрита фігурна дужка або зайва кома).'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Яку помилку викине JSONDecoder, якщо поле оголошене як let price: Double, а сервер повернув рядок "FREE"?',
              options: [
                'DecodingError.typeMismatch',
                'DecodingError.keyNotFound',
                'Fatal Error: Division by zero',
                'Помилки не буде, price стане рівним 0.0'
              ],
              correctAnswer: 0,
              explanation: 'Оскільки тип даних у JSON (String) не відповідає типу очікуваного поля (Double), виникає DecodingError.typeMismatch.'
            },
            {
              question: 'Що робить параметр decoder.keyDecodingStrategy = .convertFromSnakeCase?',
              options: [
                'Автоматично зіставляє ключі виду first_name у JSON із властивостями firstName у структурі Swift',
                'Видаляє всі пробіли з тексту',
                'Сортує ключі за алфавітом',
                'Перекладає назви полів з англійської на українську'
              ],
              correctAnswer: 0,
              explanation: 'Ця стратегія декодера автоматично трансформує snake_case бекенду в ідіоматичний camelCase Swift.'
            },
            {
              question: 'Як правильно вчинити, якщо певне поле може час від часу бути відсутнім у відповіді сервера?',
              options: [
                'Оголосити це поле як Опціонал (наприклад, let description: String?)',
                'Видалити це поле зі структури',
                'Зробити поле глобальною змінною',
                'Заборонити серверу надсилати відповіді'
              ],
              correctAnswer: 0,
              explanation: 'Опціональний тип T? дозволяє декодеру безпечно записати туди nil, якщо ключ або значення відсутні.'
            }
          ]
        }
      },
      {
        id: 'codable-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінний парсер каталогу інтернет-магазину з відловом помилок та валідацією цін.',
        content: {
          realWorldContext: 'Створіть у Playground модель каталогу курсів Академії, розпарсіть реальну JSON-відповідь сервера, обробіть опціональні поля сертифікатів та виведіть список для користувача.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: ПАРСИНГ КАТАЛОГУ КУРСІВ
// ==========================================

import Foundation

// Модульна структура курсу
struct CourseItem: Codable, Identifiable {
    let id: Int
    let title: String
    let instructor: String
    let rating: Double
    let priceUSD: Double
    let certificateAvailable: Bool
    let promoCode: String? // Опціонал: промокод є не завжди!
    
    enum CodingKeys: String, CodingKey {
        case id
        case title
        case instructor
        case rating
        case priceUSD = "price_usd"
        case certificateAvailable = "has_certificate"
        case promoCode = "promo_code"
    }
}

// Тестовий JSON бекенду
let rawCatalogJSON = """
[
    {
        "id": 1,
        "title": "Swift & iOS Bootcamp: Від нуля до Junior",
        "instructor": "Тарас Шевченко",
        "rating": 4.95,
        "price_usd": 299.99,
        "has_certificate": true,
        "promo_code": "PROMO_2026"
    },
    {
        "id": 2,
        "title": "SwiftUI Архітектура та Анімації",
        "instructor": "Олена Коваль",
        "rating": 4.88,
        "price_usd": 180.00,
        "has_certificate": true,
        "promo_code": null
    }
]
"""

do {
    let data = Data(rawCatalogJSON.utf8)
    let courses = try JSONDecoder().decode([CourseItem].self, from: data)
    
    print("✅ Успішно розпарсено курсів: \\(courses.count)")
    for course in courses {
        let promoText = course.promoCode != nil ? "(Промокод: \\(course.promoCode!))" : "(Без знижки)"
        print("• [\\(course.id)] \\(course.title) — $\\(course.priceUSD) \\(promoText)")
    }
} catch DecodingError.keyNotFound(let key, let context) {
    print("❌ Не знайдено ключ: \\(key.stringValue), шлях: \\(context.codingPath)")
} catch DecodingError.typeMismatch(let type, let context) {
    print("❌ Невідповідність типу: \\(type), шлях: \\(context.codingPath)")
} catch {
    print("❌ Загальна помилка парсингу: \\(error.localizedDescription)")
}`,
          explanation: [
            '`[CourseItem].self` дозволяє розпарсити кореневий масив обʼєктів за один виклик.',
            'Обробка `DecodingError.keyNotFound` та `DecodingError.typeMismatch` дає точний стек та шлях помилки `context.codingPath`.',
            '`promoCode: String?` без проблем приймає значення `"promo_code": null` у другому курсі.'
          ],
          challenge: {
            task: 'Опишіть структуру `Product: Codable` з полями `id: Int`, `name: String`, `price: Double` та `inStock: Bool`, де для поля `inStock` ключ у JSON називається "in_stock".',
            hint: 'Використайте enum CodingKeys: String, CodingKey { case id, name, price; case inStock = "in_stock" }',
            solution: `struct Product: Codable {
    let id: Int
    let name: String
    let price: Double
    let inStock: Bool
    
    enum CodingKeys: String, CodingKey {
        case id, name, price
        case inStock = "in_stock"
    }
}`
          }
        }
      }
    ]
  },
  {
    id: 'swift-error-handling',
    module: 5,
    moduleTitle: 'Модуль 5: Асинхронність та Робота з Мережею',
    title: 'Обробка помилок у Swift: do-catch, throw та Result',
    description: 'Дізнайтеся, як писати надійні додатки, створювати кастомні типи помилок через enum з LocalizedError та відловлювати збої.',
    difficulty: 'Початковий',
    estimatedMinutes: 20,
    icon: 'AlertTriangle',
    content: {
      realWorldContext: 'При роботі з мережею, базою даних чи файловою системою помилки неминучі: користувач увімкнув авіарежим, сервер перевантажений або закінчилося місце на диску. Замість того, щоб падати чи мовчати, професійний додаток показує зрозуміле пояснення та кнопку "Спробувати знову".',
      detailedTheory: [
        {
          title: 'Філософія обробки помилок у Swift',
          paragraphs: [
            'У Swift помилки представляються значеннями типів, які відповідають протоколу `Error`. Найчастіше для цього використовують перелічення (`enum`), оскільки вони дозволяють описати всі можливі сценарії збоїв з різними асоційованими параметрами.',
            'Підписання enum під протокол `LocalizedError` дозволяє перевизначити властивість `errorDescription` і надати текст помилки рідною мовою користувача.'
          ]
        },
        {
          title: 'Механізм do-catch та оператори try, try?, try!',
          paragraphs: [
            '1. `try`: обовʼязковий префікс для будь-якої функції, що може кинути виняток. Вимагає обгортки в блок `do { ... } catch { ... }`.\n2. `try?`: перетворює результат виклику в **Optional**. Якщо сталася помилка, замість винятку функція просто поверне `nil` (зручно, коли деталі помилки не важливі).\n3. `try!`: примусове виконання. Якщо станеться помилка, додаток негайно впаде з Fatal Error (використовуйте тільки тоді, коли на 100% впевнені в успіху, наприклад при завантаженні константного файлу з bundle проєкту).'
          ]
        }
      ],
      theory: [
        'Помилки моделюються через enum з протоколом Error.',
        'LocalizedError надає зрозумілий текст errorDescription.',
        'do-catch безпечно ізолює винятки.',
        'try? перетворює результат на nil при помилці, а try! крашить.'
      ],
      comparisonSnippet: {
        good: {
          title: 'Точна типізована помилка з описом',
          code: `enum AuthError: LocalizedError {
    case invalidCredentials
    case passwordTooShort(minChars: Int)
    
    var errorDescription: String? {
        switch self {
        case .invalidCredentials:
            return "Невірний логін або пароль."
        case .passwordTooShort(let min):
            return "Пароль має містити щонайменше \\(min) символів."
        }
    }
}`,
          explanation: 'Користувач отримує чітке пояснення проблеми рідною мовою, а розробник може точково обробити кожен кейс.'
        },
        bad: {
          title: 'Повернення порожнього nil без пояснень',
          code: `func login(user: String, pass: String) -> Bool {
    if pass.count < 8 { return false } // Чому помилка? Невідомо!
    return true
}`,
          explanation: 'Користувач бачить лише "Помилка", не розуміючи, чи то пароль занадто короткий, чи інтернету немає.'
        }
      },
      codeSnippet: `import Foundation

// 1. Оголошення власного типу помилок
enum ValidationError: LocalizedError {
    case emptyField(fieldName: String)
    case invalidEmail
    case underAge(requiredAge: Int)
    
    var errorDescription: String? {
        switch self {
        case .emptyField(let field):
            return "Поле '\\(field)' не може бути порожнім."
        case .invalidEmail:
            return "Будь ласка, введіть коректну адресу електронної пошти."
        case .underAge(let required):
            return "Реєстрація дозволена лише для осіб від \\(required) років."
        }
    }
}

// 2. Функція, що викидає помилку (throw)
func validateRegistration(name: String, email: String, age: Int) throws {
    guard !name.trimmingCharacters(in: .whitespaces).isEmpty else {
        throw ValidationError.emptyField(fieldName: "Ім'я")
    }
    
    guard email.contains("@") && email.contains(".") else {
        throw ValidationError.invalidEmail
    }
    
    guard age >= 18 else {
        throw ValidationError.underAge(requiredAge: 18)
    }
}

// 3. Обробка через do-catch
do {
    try validateRegistration(name: "Андрій", email: "invalid-email", age: 16)
    print("Реєстрація успішна!")
} catch let error as ValidationError {
    print("Помилка валідації: \\(error.localizedDescription)")
} catch {
    print("Невідомий збій: \\(error.localizedDescription)")
}`,
      explanation: [
        'Оператор `throw` негайно зупиняє виконання функції та передає екземпляр помилки вище по стеку викликів.',
        'Конструкція `catch let error as ValidationError` демонструє pattern matching для перехоплення специфічних помилок вашого додатку.'
      ],
      underTheHood: {
        title: 'Чому Swift throws — це не винятки C++ чи Java',
        points: [
          'У мовах на зразок Java чи C++ винятки (Exceptions) призводять до так званого Stack Unwinding, що є вкрай повільною та важкою операцією для процесора.',
          'У Swift механізм `throws` реалізований як звичайне повернення прихованого значення (Hidden Return Pointer).',
          'Тому обробка помилок у Swift працює так само блискавично швидко, як і звичайний виклик функції!'
        ]
      },
      checkpoints: [
        {
          question: 'Що поверне вираз let data = try? loadFile(), якщо файл не вдалося прочитати?',
          options: [
            'nil',
            'Порожній обʼєкт Data',
            'Додаток миттєво впаде з Fatal Error',
            'Число -1'
          ],
          correctAnswer: 0,
          explanation: 'Оператор try? подавляє виняток і повертає nil при будь-якій помилці виконання.'
        }
      ],
      keyTakeaways: [
        'Моделюйте помилки через `enum` з протоколом `LocalizedError`.',
        'Використовуйте `throw` для сигналізування про збій.',
        'Оператор `try?` зручний для необовʼязкових операцій, де деталі помилки не важливі.',
        'Уникайте `try!`, якщо немає 100% гарантії успіху.'
      ],
      commonMistakes: [
        'Використання `try!` на мережевих чи дискових викликах, що призводить до крашу в користувачів.',
        'Порожні блоки `catch { }`, які приховують помилки від розробника.'
      ],
      challenge: {
        task: 'Створіть `enum BankError: Error` з кейсом `insufficientFunds(needed: Double)`. Напишіть функцію `makeTransfer(amount: Double, balance: Double) throws`, яка викидає цю помилку, якщо сума переказу більша за баланс.',
        hint: 'Використайте guard amount <= balance else { throw BankError.insufficientFunds(needed: amount - balance) }',
        solution: `enum BankError: Error {
    case insufficientFunds(needed: Double)
}

func makeTransfer(amount: Double, balance: Double) throws {
    guard amount <= balance else {
        throw BankError.insufficientFunds(needed: amount - balance)
    }
}`
      }
    },
    pages: [
      {
        id: 'errors-intuition-safety',
        title: 'Інтуїція: Що таке помилка в програмі та як будувати стійкі додатки',
        stepLabel: '1. Інтуїція & Безпека',
        description: 'Чому не можна ігнорувати збої та як мова Swift примушує розробника думати про безпеку.',
        content: {
          realWorldContext: 'Уявіть пасажирський літак. Інженери не сподіваються, що погода завжди буде сонячною, а двигуни ніколи не засмітяться. Замість цього вони встановлюють резервні системи, датчики тиску та інструкції на випадок будь-якої позаштатної ситуації.',
          detailedTheory: [
            {
              title: 'Метафора: Ремінь безпеки в автомобілі',
              paragraphs: [
                'Коли ви сідаєте в авто, ви пристібаєте ремінь безпеки. Це не означає, що ви плануєте потрапити в аварію просто зараз. Це гарантія: якщо попереду виникне перешкода, ви не постраждаєте.\n\nОбробка помилок у Swift — це ремінь безпеки для вашого коду. Якщо інтернет-зʼєднання обірветься посеред відправки грошей, додаток не повинен вилетіти з білим екраном. Він повинен акуратно показати: "Звʼязок втрачено. Повторити спробу?".'
              ]
            },
            {
              title: 'Чому повертати nil або false — погано?',
              paragraphs: [
                'Якщо функція входу `func login() -> Bool` повертає просто `false`, ви не знаєте причини: чи це пароль невірний, чи акаунт заблоковано, чи сервер на профілактиці.\n\nSwift вимагає явної типізації помилок: функція повідомляє точну причину збою.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Яка головна мета системи обробки помилок у Swift?',
              options: [
                'Передбачити можливі збої та забезпечити стабільну роботу додатку без аварійних вильотів',
                'Прискорити швидкість процесора',
                'Зменшити розмір шрифтів на екрані',
                'Автоматично видаляти старі файли'
              ],
              correctAnswer: 0,
              explanation: 'Обробка помилок дозволяє додатку контрольовано реагувати на непередбачувані ситуації (збій мережі, пошкоджені файли) без падінь.'
            },
            {
              question: 'Якому базовому протоколу має відповідати будь-який тип помилки у Swift?',
              options: [
                'Error',
                'Exception',
                'Crashable',
                'Throwable'
              ],
              correctAnswer: 0,
              explanation: 'Протокол Error — базовий маркерний протокол для всіх типів помилок у Swift.'
            }
          ]
        }
      },
      {
        id: 'errors-syntax-do-catch-try',
        title: 'Анатомія синтаксису: throws, throw, do-catch та трійка try / try? / try!',
        stepLabel: '2. Синтаксис do-catch',
        description: 'Як писати функції, що кидають помилки, відловлювати їх у блоках catch та в чому різниця між знаками ? та !.',
        content: {
          realWorldContext: 'Коли ви зчитуєте файл із памʼяті пристрою, операція позначена як throws: якщо файлу немає, система кине виняток.',
          detailedTheory: [
            {
              title: 'Трійка операторів try',
              paragraphs: [
                '• `try myFunc()`: стандартний виклик. Обовʼязково має знаходитися всередині блоку `do { ... } catch { ... }`.\n• `try? myFunc()`: безпечний виклик-опціонал. Якщо функція кинула помилку, вона приглушується, і результатом стає `nil`. Якщо виконалась успішно — результат загортається в `Optional(value)`.\n• `try! myFunc()`: небезпечний виклик. Ви кажете компілятору: "Я даю 100% гарантію, що тут помилки не буде". Якщо помилка станеться — додаток миттєво впаде (Fatal Crash). Ніколи не використовуйте `try!` для мережі!'
              ]
            },
            {
              title: 'Блок do-catch',
              paragraphs: [
                'Усередині блоку `catch` автоматично доступна неявна константа `error`, яка містить екземпляр помилки. Ви можете вивести її текст: `print(error.localizedDescription)`.'
              ]
            }
          ],
          codeSnippet: `import Foundation

// Демонстрація відмінності між try, try? та try!
func readSettingsFile(named: String) throws -> String {
    if named.isEmpty {
        throw URLError(.fileDoesNotExist)
    }
    return "Параметри: dark_mode = true"
}

// 1. Повноцінний do-catch (Рекомендований для важливих дій)
do {
    let settings = try readSettingsFile(named: "config.json")
    print("Успішно прочитано: \\(settings)")
} catch {
    print("Не вдалося завантажити налаштування: \\(error.localizedDescription)")
}

// 2. try? (Зручно для необов'язкових операцій)
let quickResult: String? = try? readSettingsFile(named: "")
print(quickResult) // nil (помилка поглинута без падіння)

// 3. try! (Тільки для файлів, які точно зашиті в додаток)
let bundleConfig = try! readSettingsFile(named: "system_default.json")
print("Дефолт: \\(bundleConfig)")`,
          explanation: [
            'У варіанті з `try?` тип змінної стає `String?`, захищаючи від крашу, якщо файлу не існує.',
            'У `do-catch` блоці помилка перехоплюється, і користувачеві можна показати повідомлення.',
            '`try!` слід використовувати лише там, де помилка є ознакою критичного багу програміста на етапі розробки.'
          ]
        }
      },
      {
        id: 'errors-custom-localized',
        title: 'Кастомні типи помилок: enum, LocalizedError та патерн Result',
        stepLabel: '3. LocalizedError & Result',
        description: 'Як формулювати красиві повідомлення про помилки рідною мовою та використовувати Result<Success, Failure>.',
        content: {
          realWorldContext: 'Системні помилки англійською мовою на зразок "The operation couldn’t be completed. (NSURLErrorDomain error -1009.)" дратують звичайних людей. Додавайте зрозумілий переклад українською через протокол LocalizedError.',
          detailedTheory: [
            {
              title: 'Протокол LocalizedError',
              paragraphs: [
                'Коли ви реалізуєте протокол `LocalizedError`, ви можете надати властивість `var errorDescription: String?`.\n\nТепер системна властивість `error.localizedDescription` автоматично повертатиме ваш гарний підготовлений текст замість сухих технічних кодів.'
              ]
            },
            {
              title: 'Тип Result<Success, Failure>',
              paragraphs: [
                'Тип `Result` у Swift — це стандартний enum з двома кейсами:\n• `.success(Value)`\n• `.failure(Error)`\n\nВін часто використовується для збереження результату асинхронної дії або передачі результату в синхронний код.'
              ]
            }
          ],
          codeSnippet: `import Foundation

// Власна модель помилок банкомату
enum ATMError: LocalizedError {
    case pinIncorrect(attemptsLeft: Int)
    case cardExpired(expiredDate: String)
    case dailyLimitExceeded(maxLimit: Double)
    
    var errorDescription: String? {
        switch self {
        case .pinIncorrect(let attempts):
            return "Невірний PIN-код. Залишилося спроб: \\(attempts)."
        case .cardExpired(let date):
            return "Термін дії картки закінчився \\(date). Зверніться до банку."
        case .dailyLimitExceeded(let max):
            return "Перевищено денний ліміт зняття коштів ($\\(max))."
        }
    }
}

// Використання типу Result
func processCashWithdrawal(amount: Double) -> Result<Double, ATMError> {
    guard amount <= 1000.0 else {
        return .failure(.dailyLimitExceeded(maxLimit: 1000.0))
    }
    return .success(amount)
}

let result = processCashWithdrawal(amount: 1500.0)

switch result {
case .success(let cash):
    print("Отримайте готівку: $\\(cash)")
case .failure(let atmError):
    print("Відмова: \\(atmError.localizedDescription)")
}`,
          explanation: [
            '`ATMError: LocalizedError` інкапсулює людські зрозумілі тексти для кожного можливого збою.',
            '`Result<Double, ATMError>` вимагає обовʼязкової обробки обох сценаріїв через switch, усуваючи неоднозначності.'
          ]
        }
      },
      {
        id: 'errors-compiler-warnings-quiz',
        title: 'Типові помилки обробки винятків в Xcode & Перевірка знань',
        stepLabel: '4. Помилки & Тест',
        description: 'Розбираємо незакриті виклики throws, небезпеки ігнорування catch та перевіряємо засвоєння теми.',
        content: {
          realWorldContext: 'Компілятор Swift гарантує абсолютну вичерпність обробки помилок: ви не можете просто забути написати catch.',
          detailedTheory: [
            {
              title: 'Популярні помилки Xcode',
              paragraphs: [
                '1. **Errors thrown from here are not handled**:\nВи викликали функцію `try doSomething()`, але не помістили її в блок `do { ... } catch { ... }` і поточна функція не має слова `throws`.\n*Виправлення*: або додайте `do-catch`, або оголосіть функцію як `throws`.\n\n2. **Call can throw, but it is not marked with \'try\'**:\nВи викликали throwing функцію, але пропустили слово `try`.\n*Виправлення*: напишіть `try`, `try?` або `try!` перед викликом.'
              ]
            }
          ],
          checkpoints: [
            {
              question: 'Яку небезпеку несе оператор try! у реальному додатку?',
              options: [
                'Якщо функція кине помилку, додаток негайно впаде з аварійним завершенням (Fatal Crash)',
                'Додаток зависне на 5 хвилин',
                'Оператор try! заборонений компілятором Apple',
                'Він стирає памʼять телефону'
              ],
              correctAnswer: 0,
              explanation: 'try! відключає захист і при будь-якому збої спричиняє негайний Fatal Error, що неприпустимо в продакшн-коді.'
            },
            {
              question: 'Яка змінна доступна за замовчуванням у блоці catch { ... } без явної декларації?',
              options: [
                'error (константа, що містить спійману помилку)',
                'e',
                'exception',
                'status'
              ],
              correctAnswer: 0,
              explanation: 'У Swift всередині блоку catch автоматично існує константа error.'
            },
            {
              question: 'У чому перевага enum над звичайними класами для опису типів помилок?',
              options: [
                'Enum дозволяє зафіксувати вичерпний список можливих сценаріїв збоїв та додавати асоційовані дані до кожного кейсу',
                'Enum займає більше памʼяті',
                'Enum підтримує поліморфізм C++',
                'Класи заборонено підписувати під протокол Error'
              ],
              correctAnswer: 0,
              explanation: 'Enum забезпечує вичерпність перевірок у switch та дозволяє передавати специфічні дані помилки через Associated Values.'
            }
          ]
        }
      },
      {
        id: 'errors-playground-lab',
        title: 'Xcode Playground Лабораторна & Фінальний челендж',
        stepLabel: '5. Xcode Lab & Челендж',
        description: 'Створюємо повноцінну систему валідації банківських операцій з інформативними повідомленнями про помилки.',
        content: {
          realWorldContext: 'Створіть у Playground модель банківського переказу `TransferProcessor` з перевіркою коректності IBAN, перевіркою ліміту суми та балансу клієнта.',
          codeSnippet: `// ==========================================
// ЛАБОРАТОРНА РОБОТА: БАНКІВСЬКА ВАЛІДАЦІЯ
// ==========================================

import Foundation

enum PaymentTransferError: LocalizedError {
    case invalidIBAN(provided: String)
    case zeroOrNegativeAmount
    case limitExceeded(requested: Double, maxAllowed: Double)
    case insufficientFunds(currentBalance: Double)
    
    var errorDescription: String? {
        switch self {
        case .invalidIBAN(let iban):
            return "Недійсний номер рахунку IBAN: '\\(iban)'. Має починатися з 'UA' і містити 29 символів."
        case .zeroOrNegativeAmount:
            return "Сума переказу повинна бути більшою за нуль."
        case .limitExceeded(let req, let max):
            return "Сума $\\(req) перевищує разовий ліміт операції ($\\(max))."
        case .insufficientFunds(let balance):
            return "Недостатньо коштів на рахунку. Поточний баланс: $\\(balance)."
        }
    }
}

struct BankTransferManager {
    var userBalance: Double = 5000.0
    let singleTransferLimit: Double = 2000.0
    
    mutating func executeTransfer(toIBAN: String, amount: Double) throws {
        // 1. Перевірка валідності IBAN
        guard toIBAN.hasPrefix("UA") && toIBAN.count == 29 else {
            throw PaymentTransferError.invalidIBAN(provided: toIBAN)
        }
        
        // 2. Перевірка додатної суми
        guard amount > 0 else {
            throw PaymentTransferError.zeroOrNegativeAmount
        }
        
        // 3. Перевірка разового ліміту
        guard amount <= singleTransferLimit else {
            throw PaymentTransferError.limitExceeded(requested: amount, maxAllowed: singleTransferLimit)
        }
        
        // 4. Перевірка достатності балансу
        guard amount <= userBalance else {
            throw PaymentTransferError.insufficientFunds(currentBalance: userBalance)
        }
        
        // Успішне списання
        userBalance -= amount
        print("✅ Переказ $\\(amount) на рахунок \\(toIBAN.prefix(8))... успішно виконано!")
        print("   Залишок на балансі: $\\(userBalance)")
    }
}

// Тестування сценаріїв обробки помилок
var bank = BankTransferManager()

// Сценарій 1: Помилковий IBAN
do {
    try bank.executeTransfer(toIBAN: "PL123456", amount: 100.0)
} catch {
    print("❌ Помилка: \\(error.localizedDescription)")
}

// Сценарій 2: Перевищення ліміту
do {
    try bank.executeTransfer(toIBAN: "UA123456789012345678901234567", amount: 2500.0)
} catch {
    print("❌ Помилка: \\(error.localizedDescription)")
}

// Сценарій 3: Успішний переказ
do {
    try bank.executeTransfer(toIBAN: "UA123456789012345678901234567", amount: 450.0)
} catch {
    print("❌ Помилка: \\(error.localizedDescription)")
}`,
          explanation: [
            '`PaymentTransferError` інкапсулює 4 різних сценарії невдачі з чіткими поясненнями українською мовою.',
            '`guard ... else { throw ... }` забезпечує ранній вихід з перевіркою кожного критерію безпеки по черзі.',
            '`do-catch` дає змогу вивести гарне повідомлення для клієнта замість аварійного падіння програми.'
          ],
          challenge: {
            task: 'Створіть `enum BankError: Error` з кейсом `insufficientFunds(needed: Double)`. Напишіть функцію `makeTransfer(amount: Double, balance: Double) throws`, яка викидає цю помилку, якщо сума переказу більша за баланс.',
            hint: 'Використайте guard amount <= balance else { throw BankError.insufficientFunds(needed: amount - balance) }',
            solution: `enum BankError: Error {
    case insufficientFunds(needed: Double)
}

func makeTransfer(amount: Double, balance: Double) throws {
    guard amount <= balance else {
        throw BankError.insufficientFunds(needed: amount - balance)
    }
}`
          }
        }
      }
    ]
  }
];
