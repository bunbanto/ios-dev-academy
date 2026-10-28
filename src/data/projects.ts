import { ProjectGuide } from '@/types';

export const PORTFOLIO_PROJECTS: ProjectGuide[] = [
  {
    id: 'habit-tracker',
    title: 'HabitPulse — Трекер звичок',
    subtitle: 'Повноцінний додаток з локальною базою SwiftData, анімаціями та прогрес-барами.',
    level: 'Junior',
    duration: '3-4 дні',
    technologies: ['SwiftUI', 'SwiftData', 'Observation', 'SF Symbols'],
    description: 'Створіть власний красивий трекер корисних звичок з можливістю відзначати виконання кожного дня, переглядати статистику та зберігати дані між сесіями.',
    steps: [
      {
        title: 'Крок 1: Модель звички у SwiftData',
        description: 'Створіть модель Habit з використанням макроса @Model, що зберігатиме назву, колір, дату створення та історію виконання.',
        code: `@Model
class Habit {
    var id: UUID
    var title: String
    var hexColor: String
    var streakCount: Int
    var lastCompletedDate: Date?
    
    init(title: String, hexColor: String = "#007AFF") {
        self.id = UUID()
        self.title = title
        self.hexColor = hexColor
        self.streakCount = 0
    }
}`
      },
      {
        title: 'Крок 2: Головний екран зі списком',
        description: 'Використайте @Query для отримання списку звичок та побудуйте кастомну карточку з кнопкою чек-іну.',
        code: `struct HabitListView: View {
    @Query(sort: \\Habit.streakCount, order: .reverse) private var habits: [Habit]
    @Environment(\\.modelContext) private var modelContext
    @State private var showingAddSheet = false

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(habits) { habit in
                        HabitCardView(habit: habit)
                    }
                }
                .padding()
            }
            .navigationTitle("Мої Звички")
            .toolbar {
                Button(action: { showingAddSheet = true }) {
                    Image(systemName: "plus.circle.fill").font(.title2)
                }
            }
        }
    }
}`
      }
    ]
  },
  {
    id: 'crypto-live',
    title: 'CryptoLive — Фінансовий монітор',
    subtitle: 'REST API, асинхронні запити URLSession, Swift Charts та розрахунок відсоткових змін.',
    level: 'Middle',
    duration: '5-6 днів',
    technologies: ['async/await', 'Codable', 'Swift Charts', 'URLSession'],
    description: 'Розробіть додаток, який підключається до публічного API CoinGecko, відображає курс Bitcoin, Ethereum та інших криптовалют у реальному часі зі спарклайн-графіками.',
    steps: [
      {
        title: 'Крок 1: Опис DTO моделі для крипто-монет',
        description: 'Створіть модель Coin із протоколом Codable та мапінгом полів.',
        code: `struct Coin: Codable, Identifiable {
    let id: String
    let symbol: String
    let name: String
    let currentPrice: Double
    let priceChangePercentage24h: Double
    let sparklineIn7d: SparklineData?

    enum CodingKeys: String, CodingKey {
        case id, symbol, name
        case currentPrice = "current_price"
        case priceChangePercentage24h = "price_change_percentage_24h"
        case sparklineIn7d = "sparkline_in_7d"
    }
}`
      },
      {
        title: 'Крок 2: Асинхронний сервіс завантаження',
        description: 'Реалізуйте мережевий шар з обробкою статус-кодів та пустих станів.',
        code: `@Observable
class CryptoViewModel {
    var coins: [Coin] = []
    var isRefreshing = false

    @MainActor
    func fetchTopCoins() async {
        isRefreshing = true
        defer { isRefreshing = false }
        
        let url = URL(string: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true")!
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            self.coins = try JSONDecoder().decode([Coin].self, from: data)
        } catch {
            print("Fetch error: \\(error)")
        }
    }
}`
      }
    ]
  }
];
