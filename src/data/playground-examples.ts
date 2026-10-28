import { PlaygroundExample } from '@/types';

export const PLAYGROUND_EXAMPLES: PlaygroundExample[] = [
  {
    id: 'counter',
    title: 'Лічильник кави (@State & Button)',
    description: 'Класичний приклад реактивності SwiftUI: кнопка змінює @State, а UI миттєво реагує з пружною анімацією (Spring Animation).',
    category: 'State & Animation',
    interactiveType: 'counter',
    swiftCode: `import SwiftUI

struct CoffeeCounterView: View {
    @State private var cupsCount = 1
    @State private var isHot = true
    
    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: isHot ? "cup.and.saucer.fill" : "mug.fill")
                .font(.system(size: 64))
                .foregroundColor(.orange)
                .symbolEffect(.bounce, value: cupsCount)
            
            Text("\\(cupsCount) чашок випито")
                .font(.title2)
                .fontWeight(.bold)
            
            HStack(spacing: 16) {
                Button(action: { if cupsCount > 0 { cupsCount -= 1 } }) {
                    Image(systemName: "minus.circle.fill")
                        .font(.title)
                        .foregroundColor(.gray)
                }
                
                Button(action: {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                        cupsCount += 1
                    }
                }) {
                    Text("+ Ще чашечку")
                        .fontWeight(.semibold)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(Color.orange)
                        .foregroundColor(.white)
                        .cornerRadius(20)
                }
            }
        }
    }
}`
  },
  {
    id: 'profile',
    title: 'Картка розробника (ZStack & Glassmorphism)',
    description: 'Сучасний дизайн у стилі iOS: ультратонкий матеріал (Ultra Thin Material), градієнти, капсули та SF Symbols.',
    category: 'Layout & Styling',
    interactiveType: 'profile',
    swiftCode: `import SwiftUI

struct DeveloperProfileView: View {
    @State private var isPro = true
    
    var body: some View {
        ZStack {
            LinearGradient(
                colors: isPro ? [.indigo, .purple] : [.blue, .cyan],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 16) {
                Image(systemName: "laptopcomputer.and.iphone")
                    .font(.system(size: 50))
                    .foregroundColor(.white)
                    .padding()
                    .background(.ultraThinMaterial)
                    .clipShape(Circle())
                
                Text("Анна Шевченко")
                    .font(.title3)
                    .bold()
                    .foregroundColor(.white)
                
                Text(isPro ? "Senior iOS Architect" : "SwiftUI Creator")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                
                HStack(spacing: 12) {
                    Label("Swift 6", systemImage: "swift")
                    Label("SwiftData", systemImage: "cylinder")
                }
                .font(.caption)
                .foregroundColor(.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(.ultraThinMaterial)
                .clipShape(Capsule())
            }
            .padding(24)
            .background(Color.black.opacity(0.25))
            .cornerRadius(28)
        }
    }
}`
  },
  {
    id: 'todo',
    title: 'Список завдань (List, ForEach & Toggle)',
    description: 'Динамічний список задач з можливістю додавання нових пунктів та інтерактивними чекбоксами.',
    category: 'Lists & Forms',
    interactiveType: 'todo',
    swiftCode: `import SwiftUI

struct TaskItem: Identifiable {
    let id = UUID()
    var title: String
    var isDone: Bool
}

struct TaskListView: View {
    @State private var tasks: [TaskItem] = [
        TaskItem(title: "Вивчити Swift Optionals", isDone: true),
        TaskItem(title: "Зібрати інтерфейс у SwiftUI", isDone: false),
        TaskItem(title: "Задеплоїти в TestFlight", isDone: false)
    ]
    
    var body: some View {
        NavigationStack {
            List($tasks) { $task in
                HStack {
                    Image(systemName: task.isDone ? "checkmark.circle.fill" : "circle")
                        .foregroundColor(task.isDone ? .green : .gray)
                        .onTapGesture { task.isDone.toggle() }
                    
                    Text(task.title)
                        .strikethrough(task.isDone)
                        .foregroundColor(task.isDone ? .secondary : .primary)
                }
            }
            .navigationTitle("План розробника")
        }
    }
}`
  },
  {
    id: 'tipcalc',
    title: 'Калькулятор чайових (Slider & Binding)',
    description: 'Реальний приклад комерційного застосунку з обчислюваними властивостями (Computed Properties) та повзунком Slider.',
    category: 'Forms & Calculations',
    interactiveType: 'tipcalc',
    swiftCode: `import SwiftUI

struct TipCalculatorView: View {
    @State private var billAmount: Double = 50.0
    @State private var tipPercentage: Double = 15.0
    
    var totalAmount: Double {
        billAmount + (billAmount * tipPercentage / 100.0)
    }
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Рахунок: $\\(Int(billAmount))")
                .font(.headline)
            
            Slider(value: $billAmount, in: 10...200, step: 5)
            
            Text("Чайові: \\(Int(tipPercentage))%")
                .foregroundColor(.secondary)
            
            Slider(value: $tipPercentage, in: 0...30, step: 5)
                .tint(.green)
            
            Divider()
            
            Text("Загалом: $\\(totalAmount, specifier: "%.2f")")
                .font(.title)
                .bold()
                .foregroundColor(.green)
        }
        .padding()
    }
}`
  },
  {
    id: 'biometric',
    title: 'FaceID & Dynamic Island',
    description: 'Імітація біометричної автентифікації Apple LocalAuthentication та реакція острівця Dynamic Island на iPhone 16 Pro.',
    category: 'Native Hardware',
    interactiveType: 'biometric',
    swiftCode: `import SwiftUI
import LocalAuthentication

struct BiometricAuthView: View {
    @State private var isUnlocked = false
    @State private var isScanning = false
    
    var body: some View {
        VStack(spacing: 30) {
            Image(systemName: isUnlocked ? "lock.open.fill" : "faceid")
                .font(.system(size: 60))
                .foregroundColor(isUnlocked ? .green : .blue)
                .symbolEffect(.pulse, isActive: isScanning)
            
            Text(isUnlocked ? "Доступ надано" : "Вхід через Face ID")
                .font(.title2)
                .bold()
            
            Button("Сканувати обличчя") {
                simulateFaceID()
            }
            .buttonStyle(.borderedProminent)
            .tint(.blue)
        }
    }
}`
  }
];
