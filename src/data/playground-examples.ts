import { PlaygroundExample } from '@/types';

export const PLAYGROUND_EXAMPLES: PlaygroundExample[] = [
  {
    id: 'counter',
    title: 'Лічильник кави (@State & Animation)',
    description: 'Класичний приклад реактивності SwiftUI: кнопки змінюють @State, а UI миттєво реагує з пружною анімацією (Spring Animation) та зміною теми напою.',
    category: 'State & Animation',
    interactiveType: 'counter',
    swiftCode: `import SwiftUI

struct ContentView: View {
    @State private var cupsCount = 3
    @State private var isHot = true
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 24) {
                // Прев'ю бейдж
                VStack(spacing: 4) {
                    Text("SWIFTUI LIVE PREVIEW")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .foregroundColor(.gray)
                        .tracking(1)
                    
                    Text("@State & Animation Spring")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 8)
                .padding(.horizontal, 16)
                .background(Color.white.opacity(0.08))
                .clipShape(Capsule())
                
                // Кругла іконка кави з бейджем кількості
                ZStack(alignment: .topTrailing) {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: isHot ? [.orange, .yellow] : [.blue, .cyan],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 120, height: 120)
                        .shadow(color: (isHot ? Color.orange : Color.blue).opacity(0.4), radius: 16)
                    
                    Image(systemName: isHot ? "cup.and.saucer.fill" : "mug.fill")
                        .font(.system(size: 52))
                        .foregroundColor(.white)
                        .frame(width: 120, height: 120)
                        .symbolEffect(.bounce, value: cupsCount)
                    
                    Text("\\(cupsCount)")
                        .font(.caption)
                        .fontWeight(.black)
                        .foregroundColor(.black)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.white)
                        .clipShape(Capsule())
                        .offset(x: 4, y: -4)
                }
                .padding(.top, 12)
                
                // Текстові підписи
                VStack(spacing: 6) {
                    Text("\\(cupsCount) \\(cupsCount == 1 ? "Чашка кави" : (cupsCount >= 2 && cupsCount <= 4 ? "Чашки кави" : "Чашок кави"))")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text(isHot ? "🔥 Гаряче американо" : "❄️ Освіжний айс-лате")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }
                
                // Кнопки - / +
                HStack(spacing: 12) {
                    Button {
                        if cupsCount > 0 {
                            cupsCount -= 1
                        }
                    } label: {
                        Text("- Менше")
                            .fontWeight(.semibold)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.white.opacity(0.12))
                            .foregroundColor(.white)
                            .cornerRadius(14)
                    }
                    
                    Button {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.6)) {
                            cupsCount += 1
                        }
                    } label: {
                        Text("+ Ще одну!")
                            .fontWeight(.semibold)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.orange)
                            .foregroundColor(.white)
                            .cornerRadius(14)
                            .shadow(color: .orange.opacity(0.3), radius: 8, y: 4)
                    }
                }
                .padding(.horizontal, 8)
                
                // Перемикач типу напою
                Button {
                    withAnimation(.easeInOut(duration: 0.25)) {
                        isHot.toggle()
                    }
                } label: {
                    Text("Перемкнути: \\(isHot ? "Зробити з льодом" : "Зробити гарячою")")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color.white.opacity(0.06))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.white.opacity(0.1), lineWidth: 1)
                        )
                        .cornerRadius(12)
                }
                .padding(.horizontal, 8)
            }
            .padding(20)
        }
        .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
}
`
  },
  {
    id: 'profile',
    title: 'Картка розробника (ZStack & Glassmorphism)',
    description: 'Сучасний дизайн картки у стилі iOS: ультратонкий матеріал (Ultra Thin Material), перемикання тем, статистика, лічильник вподобань та ShareLink.',
    category: 'Layout & Styling',
    interactiveType: 'profile',
    swiftCode: `import SwiftUI

enum ProfileTheme: String, CaseIterable {
    case indigo = "Indigo"
    case sunset = "Sunset"
    case dark = "Dark"
    
    var gradientColors: [Color] {
        switch self {
        case .indigo:
            return [Color(red: 0.26, green: 0.23, blue: 0.75), Color(red: 0.58, green: 0.20, blue: 0.70)]
        case .sunset:
            return [Color(red: 0.90, green: 0.35, blue: 0.15), Color(red: 0.85, green: 0.15, blue: 0.45)]
        case .dark:
            return [Color(white: 0.12), Color.black]
        }
    }
}

struct ContentView: View {
    @State private var selectedTheme: ProfileTheme = .indigo
    @State private var likesCount = 142
    @State private var isLiked = false
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 20) {
                // Головна картка
                VStack(spacing: 16) {
                    HStack(spacing: 14) {
                        Text("iOS")
                            .font(.title2)
                            .fontWeight(.black)
                            .foregroundColor(.white)
                            .frame(width: 60, height: 60)
                            .background(Color.white.opacity(0.2))
                            .clipShape(RoundedRectangle(cornerRadius: 18))
                            .overlay(
                                RoundedRectangle(cornerRadius: 18)
                                    .stroke(Color.white.opacity(0.3), lineWidth: 1)
                            )
                        
                        VStack(alignment: .leading, spacing: 3) {
                            Text("Анна Шевченко")
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                            Text("Junior iOS Developer")
                                .font(.caption)
                                .foregroundColor(.white.opacity(0.8))
                            
                            Text("SwiftUI & SwiftData")
                                .font(.caption2)
                                .fontWeight(.medium)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(Color.black.opacity(0.3))
                                .foregroundColor(.white)
                                .clipShape(Capsule())
                        }
                        
                        Spacer()
                    }
                    
                    // Статистика
                    HStack {
                        Spacer()
                        VStack(spacing: 2) {
                            Text("14")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            Text("Уроків")
                                .font(.caption2)
                                .foregroundColor(.white.opacity(0.7))
                        }
                        Spacer()
                        VStack(spacing: 2) {
                            Text("4")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            Text("Проєкти")
                                .font(.caption2)
                                .foregroundColor(.white.opacity(0.7))
                        }
                        Spacer()
                        VStack(spacing: 2) {
                            Text("4.9 ★")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            Text("Рейтинг")
                                .font(.caption2)
                                .foregroundColor(.white.opacity(0.7))
                        }
                        Spacer()
                    }
                    .padding(.vertical, 10)
                    .background(Color.black.opacity(0.25))
                    .cornerRadius(16)
                    
                    // Кнопки взаємодії
                    HStack {
                        Button {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
                                isLiked.toggle()
                                likesCount += isLiked ? 1 : -1
                            }
                        } label: {
                            HStack(spacing: 6) {
                                Image(systemName: isLiked ? "heart.fill" : "heart")
                                    .foregroundColor(isLiked ? .red : .white)
                                Text("\\(likesCount)")
                                    .font(.caption)
                                    .fontWeight(.semibold)
                                    .foregroundColor(.white)
                            }
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(Color.white.opacity(0.2))
                            .clipShape(Capsule())
                        }
                        
                        Spacer()
                        
                        ShareLink(item: "Анна Шевченко — iOS Developer") {
                            HStack(spacing: 4) {
                                Image(systemName: "square.and.arrow.up")
                                Text("Поділитися")
                            }
                            .font(.caption)
                            .foregroundColor(.white)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(Color.white.opacity(0.2))
                            .clipShape(Capsule())
                        }
                    }
                }
                .padding(20)
                .background(
                    LinearGradient(
                        colors: selectedTheme.gradientColors,
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .cornerRadius(28)
                .overlay(
                    RoundedRectangle(cornerRadius: 28)
                        .stroke(Color.white.opacity(0.2), lineWidth: 1)
                )
                
                // Перемикач теми
                VStack(alignment: .leading, spacing: 8) {
                    Text("Тема картки:")
                        .font(.caption)
                        .foregroundColor(.gray)
                    
                    HStack(spacing: 8) {
                        ForEach(ProfileTheme.allCases, id: \\.self) { theme in
                            Button {
                                withAnimation(.easeInOut(duration: 0.2)) {
                                    selectedTheme = theme
                                }
                            } label: {
                                Text(theme.rawValue)
                                    .font(.caption)
                                    .fontWeight(.medium)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 8)
                                    .background(selectedTheme == theme ? Color.white.opacity(0.2) : Color.white.opacity(0.05))
                                    .foregroundColor(.white)
                                    .cornerRadius(12)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(selectedTheme == theme ? Color.white.opacity(0.5) : Color.white.opacity(0.1), lineWidth: 1)
                                    )
                            }
                        }
                    }
                }
            }
            .padding(20)
        }
        .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
}
`
  },
  {
    id: 'todo',
    title: 'Список справ (Interactive List & TextField)',
    description: 'Повноцінний список завдань: чекбокси з перекреслюванням тексту, додавання нових задач через TextField та видалення елементів.',
    category: 'Lists & Forms',
    interactiveType: 'todo',
    swiftCode: `import SwiftUI

struct TaskItem: Identifiable {
    let id = UUID()
    var title: String
    var isDone: Bool
}

struct ContentView: View {
    @State private var tasks: [TaskItem] = [
        TaskItem(title: "Пройти модуль Опціоналів Swift", isDone: true),
        TaskItem(title: "Скласти UI на базі VStack та HStack", isDone: true),
        TaskItem(title: "Додати SwiftData для нотаток", isDone: false),
        TaskItem(title: "Задеплоїти білд у TestFlight", isDone: false)
    ]
    @State private var newTaskTitle = ""
    
    var completedCount: Int {
        tasks.filter { $0.isDone }.count
    }
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 16) {
                // Заголовок з лічильником
                HStack {
                    Text("Список справ")
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Spacer()
                    
                    Text("\\(completedCount)/\\(tasks.count) готово")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(Color.blue)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(Color.blue.opacity(0.2))
                        .clipShape(Capsule())
                }
                .padding(.bottom, 4)
                
                // Список завдань
                ScrollView {
                    LazyVStack(spacing: 8) {
                        ForEach($tasks) { $task in
                            HStack(spacing: 12) {
                                Button {
                                    withAnimation(.spring(response: 0.25, dampingFraction: 0.7)) {
                                        task.isDone.toggle()
                                    }
                                } label: {
                                    Image(systemName: task.isDone ? "checkmark.circle.fill" : "circle")
                                        .font(.title3)
                                        .foregroundColor(task.isDone ? .green : .gray)
                                }
                                
                                Text(task.title)
                                    .font(.subheadline)
                                    .strikethrough(task.isDone, color: .gray)
                                    .foregroundColor(task.isDone ? .gray : .white)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                
                                Button {
                                    withAnimation(.easeInOut(duration: 0.2)) {
                                        tasks.removeAll { $0.id == task.id }
                                    }
                                } label: {
                                    Image(systemName: "trash")
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                            }
                            .padding(.horizontal, 14)
                            .padding(.vertical, 12)
                            .background(task.isDone ? Color.white.opacity(0.04) : Color.white.opacity(0.08))
                            .cornerRadius(14)
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(Color.white.opacity(0.08), lineWidth: 1)
                            )
                        }
                    }
                }
                
                // Поле створення нового завдання
                HStack(spacing: 8) {
                    TextField("Додати нове завдання...", text: $newTaskTitle)
                        .font(.subheadline)
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .background(Color.white.opacity(0.08))
                        .cornerRadius(14)
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .stroke(Color.white.opacity(0.12), lineWidth: 1)
                        )
                        .onSubmit(addTask)
                    
                    Button(action: addTask) {
                        Image(systemName: "plus")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(width: 42, height: 42)
                            .background(Color.blue)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                    .disabled(newTaskTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
            .padding(20)
        }
        .preferredColorScheme(.dark)
    }
    
    private func addTask() {
        let trimmed = newTaskTitle.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            tasks.append(TaskItem(title: trimmed, isDone: false))
            newTaskTitle = ""
        }
    }
}

#Preview {
    ContentView()
}
`
  },
  {
    id: 'tipcalc',
    title: 'Калькулятор чайових (Slider, Binding & Presets)',
    description: 'Реальний застосунок із розрахунком чайових: інтерактивні повзунки для чеку та відсотка, кнопки швидких пресетів (10%, 15%, 18%, 20%) та миттєвий підрахунок.',
    category: 'Forms & Calculations',
    interactiveType: 'tipcalc',
    swiftCode: `import SwiftUI

struct ContentView: View {
    @State private var billAmount: Double = 65.0
    @State private var tipPercentage: Double = 18.0
    
    let presets: [Double] = [10, 15, 18, 20]
    
    var tipAmount: Double {
        (billAmount * tipPercentage) / 100.0
    }
    
    var totalAmount: Double {
        billAmount + tipAmount
    }
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 24) {
                // Підсумкова сума вгорі
                VStack(spacing: 6) {
                    Text("КАЛЬКУЛЯТОР РАХУНКУ")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .foregroundColor(.green)
                        .tracking(1)
                    
                    Text("$\\(totalAmount, specifier: "%.2f")")
                        .font(.system(size: 40, weight: .black, design: .rounded))
                        .foregroundColor(.white)
                    
                    Text("Рахунок: $\\(Int(billAmount)) + Чайові: $\\(tipAmount, specifier: "%.2f") (\\(Int(tipPercentage))%)")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                .padding(.top, 10)
                
                // Картка з повзунками
                VStack(spacing: 20) {
                    // Рахунок
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("Сума чеку")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            Spacer()
                            Text("$\\(Int(billAmount))")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                        }
                        
                        Slider(value: $billAmount, in: 10...300, step: 5)
                            .tint(.blue)
                    }
                    
                    // Чайові
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("Відсоток чайових")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            Spacer()
                            Text("\\(Int(tipPercentage))%")
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundColor(.green)
                        }
                        
                        Slider(value: $tipPercentage, in: 0...30, step: 1)
                            .tint(.green)
                    }
                }
                .padding(18)
                .background(Color.white.opacity(0.06))
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
                
                // Швидкі кнопки пресетів
                HStack(spacing: 8) {
                    ForEach(presets, id: \\.self) { preset in
                        Button {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                tipPercentage = preset
                            }
                        } label: {
                            Text("\\(Int(preset))%")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(tipPercentage == preset ? Color.green : Color.white.opacity(0.1))
                                .foregroundColor(.white)
                                .cornerRadius(12)
                                .shadow(color: tipPercentage == preset ? Color.green.opacity(0.3) : .clear, radius: 8, y: 2)
                        }
                    }
                }
            }
            .padding(20)
        }
        .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
}
`
  },
  {
    id: 'biometric',
    title: 'FaceID & Біометрія (LocalAuthentication)',
    description: 'Справжня інтеграція біометричної автентифікації Apple LocalAuthentication з підтримкою симулятора та анімацією сканування.',
    category: 'Native Hardware',
    interactiveType: 'biometric',
    swiftCode: `import SwiftUI
import LocalAuthentication

struct ContentView: View {
    @State private var isUnlocked = false
    @State private var isScanning = false
    @State private var authMessage = "Натисніть кнопку нижче, щоб перевірити Face ID."
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 28) {
                // Біометрична рамка зі статусом
                ZStack {
                    RoundedRectangle(cornerRadius: 28)
                        .fill(isUnlocked ? Color.green.opacity(0.15) : (isScanning ? Color.blue.opacity(0.15) : Color.white.opacity(0.06)))
                        .frame(width: 120, height: 120)
                        .overlay(
                            RoundedRectangle(cornerRadius: 28)
                                .stroke(isUnlocked ? Color.green : (isScanning ? Color.blue : Color.white.opacity(0.12)), lineWidth: 2)
                        )
                    
                    Image(systemName: isUnlocked ? "lock.open.fill" : (isScanning ? "faceid" : "lock.fill"))
                        .font(.system(size: 48))
                        .foregroundColor(isUnlocked ? .green : (isScanning ? .blue : .gray))
                        .symbolEffect(.pulse, isActive: isScanning)
                }
                .padding(.top, 20)
                
                // Опис стану
                VStack(spacing: 8) {
                    Text(isUnlocked ? "Вхід Підтверджено!" : (isScanning ? "Сканування Face ID..." : "Додаток Заблоковано"))
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text(authMessage)
                        .font(.caption)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 24)
                }
                
                // Кнопка сканування / повторного блокування
                Button {
                    if isUnlocked {
                        isUnlocked = false
                        authMessage = "Натисніть кнопку нижче, щоб перевірити Face ID."
                    } else {
                        authenticateWithBiometrics()
                    }
                } label: {
                    Text(isScanning ? "Обробка..." : (isUnlocked ? "Заблокувати знову" : "Сканувати через Face ID"))
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(isUnlocked ? Color.white.opacity(0.15) : Color.blue)
                        .cornerRadius(18)
                        .shadow(color: isUnlocked ? .clear : Color.blue.opacity(0.3), radius: 8, y: 3)
                }
                .disabled(isScanning)
                .padding(.horizontal, 8)
            }
            .padding(20)
        }
        .preferredColorScheme(.dark)
    }
    
    private func authenticateWithBiometrics() {
        isScanning = true
        let context = LAContext()
        var error: NSError?
        
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: "Потрібна авторизація через Face ID") { success, _ in
                DispatchQueue.main.async {
                    self.isScanning = false
                    if success {
                        self.isUnlocked = true
                        self.authMessage = "Біометричний токен отримано через LocalAuthentication."
                    } else {
                        self.authMessage = "Не вдалося розпізнати обличчя. Спробуйте ще раз."
                    }
                }
            }
        } else {
            // Симуляція для Canvas та симулятора
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                self.isScanning = false
                self.isUnlocked = true
                self.authMessage = "Біометричний токен отримано через LocalAuthentication."
            }
        }
    }
}

#Preview {
    ContentView()
}
`
  },
  {
    id: 'weather',
    title: 'Погода (Glassmorphic Dashboard)',
    description: 'Сучасна віджет-картка погоди: градієнтний фон, SF Symbols, поточна температура та картка з показниками вологості, вітру й УФ-індексу.',
    category: 'Layout & Styling',
    interactiveType: 'weather',
    swiftCode: `import SwiftUI

struct ContentView: View {
    @State private var selectedCity = "Київ"
    @State private var temperature = 22
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 20) {
                // Головна погодна картка
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(selectedCity)
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                            Text("Переважно сонячно")
                                .font(.caption)
                                .foregroundColor(.white.opacity(0.85))
                        }
                        
                        Spacer()
                        
                        Image(systemName: "sun.max.fill")
                            .font(.system(size: 40))
                            .symbolRenderingMode(.multicolor)
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\\(temperature)°")
                            .font(.system(size: 56, weight: .thin, design: .rounded))
                            .foregroundColor(.white)
                        
                        HStack(spacing: 8) {
                            Text("Мін: 14°")
                            Text("Макс: 24°")
                        }
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.85))
                    }
                }
                .padding(22)
                .background(
                    LinearGradient(
                        colors: [Color.blue, Color.cyan.opacity(0.8)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .cornerRadius(28)
                .shadow(color: Color.blue.opacity(0.3), radius: 16, y: 8)
                
                // Деталі погоди
                VStack(spacing: 12) {
                    HStack {
                        Text("Вологість")
                            .foregroundColor(.gray)
                        Spacer()
                        Text("48%")
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                    }
                    
                    Divider().background(Color.white.opacity(0.1))
                    
                    HStack {
                        Text("Швидкість вітру")
                            .foregroundColor(.gray)
                        Spacer()
                        Text("4.2 м/с")
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                    }
                    
                    Divider().background(Color.white.opacity(0.1))
                    
                    HStack {
                        Text("УФ-індекс")
                            .foregroundColor(.gray)
                        Spacer()
                        Text("3 (Помірний)")
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                    }
                }
                .font(.caption)
                .padding(18)
                .background(Color.white.opacity(0.06))
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
            }
            .padding(20)
        }
        .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
}
`
  }
];
