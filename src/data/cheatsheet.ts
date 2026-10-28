import { CheatsheetItem } from '@/types';

export const CHEATSHEET_ITEMS: CheatsheetItem[] = [
  {
    id: 'c1',
    category: 'Swift Basics',
    title: 'guard let vs if let',
    syntax: 'guard let val = opt else { return }',
    description: 'Використовуйте guard let для раннього виходу з функції, щоб уникнути вкладених дужок.',
    example: `func processUser(id: String?) {
    guard let id = id else {
        print("Помилка: ID відсутній")
        return
    }
    print("Обробка: \\(id)")
}`
  },
  {
    id: 'c2',
    category: 'Swift Basics',
    title: 'Nil-Coalescing Operator',
    syntax: 'let value = optional ?? defaultValue',
    description: 'Повертає значення опціоналу, або дефолтне значення, якщо опціонал містить nil.',
    example: `let savedTheme: String? = nil
let activeTheme = savedTheme ?? "dark" // "dark"`
  },
  {
    id: 'c3',
    category: 'SwiftUI Layout',
    title: 'Стеки та простори (Stacks & Spacers)',
    syntax: 'VStack / HStack / ZStack { ... }',
    description: 'VStack розташовує по вертикалі, HStack — по горизонталі, ZStack — нашаровує. Spacer() заповнює вільний простір.',
    example: `HStack {
    Text("Зліва")
    Spacer()
    Text("Справа")
}`
  },
  {
    id: 'c4',
    category: 'SwiftUI Layout',
    title: 'Тіні та заокруглені краї',
    syntax: '.clipShape(RoundedRectangle(cornerRadius: 16))',
    description: 'Сучасний спосіб обрізання та додавання мʼякої тіні у стилі Apple iOS.',
    example: `Text("Карточка")
    .padding()
    .background(Color.white)
    .clipShape(RoundedRectangle(cornerRadius: 16))
    .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)`
  },
  {
    id: 'c5',
    category: 'State & Data',
    title: '@State (Локальний стан)',
    syntax: '@State private var count = 0',
    description: 'Вказує SwiftUI стежити за змінами змінної та автоматично перемальовувати інтерфейс.',
    example: `@State private var isOn = false

Toggle("Увімкнути сповіщення", isOn: $isOn)`
  },
  {
    id: 'c6',
    category: 'State & Data',
    title: '@Binding (Звʼязок з батьком)',
    syntax: '@Binding var isPresented: Bool',
    description: 'Дозволяє дочірньому View читати та змінювати стан батьківського View.',
    example: `struct CloseButton: View {
    @Binding var isPresented: Bool
    var body: some View {
        Button("Закрити") { isPresented = false }
    }
}`
  },
  {
    id: 'c7',
    category: 'Async & Network',
    title: 'async / await з URLSession',
    syntax: 'let (data, response) = try await URLSession.shared.data(from: url)',
    description: 'Асинхронний мережевий запит без блокування Main Thread.',
    example: `func loadData() async throws -> [Post] {
    let url = URL(string: "https://api.example.com/posts")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode([Post].self, from: data)
}`
  },
  {
    id: 'c8',
    category: 'SwiftData',
    title: '@Model та @Query (iOS 17+)',
    syntax: '@Model class Item { ... } \n@Query var items: [Item]',
    description: 'Декларативне збереження в базу даних SQLite без зайвого коду.',
    example: `@Model
class Task {
    var title: String
    init(title: String) { self.title = title }
}

struct ListView: View {
    @Query var tasks: [Task]
    // ...
}`
  }
];
