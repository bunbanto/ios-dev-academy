import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, type Theme } from '@/context/ThemeContext';
import AuthModal from '@/components/AuthModal';
import { cookies } from 'next/headers';
import { LocaleProvider, type Locale } from '@/i18n/LocaleContext';

export async function generateMetadata(): Promise<Metadata> {
  const locale = cookies().get('swiftlab_locale')?.value;
  if (locale === 'en') {
    return {
      title: 'SwiftLab — Learn iOS App Development with Swift & SwiftUI',
      description: 'An interactive platform for learning iOS development, with a live iPhone simulator, practical lessons, interview quizzes, and portfolio projects.',
      keywords: ['iOS development', 'Swift 6', 'SwiftUI', 'iPhone app development', 'SwiftData', 'learn Swift'],
      authors: [{ name: 'SwiftLab Academy' }],
      openGraph: {
        title: 'SwiftLab — Learn iOS App Development',
        description: 'Learn Swift and SwiftUI with an interactive iPhone simulator and hands-on lessons.',
        type: 'website',
      },
    };
  }
  return {
    title: 'SwiftLab — Навчання розробки застосунків для iPhone (Swift & SwiftUI)',
    description: 'Інтерактивна платформа для вивчення розробки iOS застосунків: симулятор iPhone 16 Pro, живий SwiftUI код, уроки від початківця до Senior, квізи для співбесід та готові портфоліо-проєкти.',
    keywords: ['iOS development', 'Swift 6', 'SwiftUI', 'iPhone app development', 'SwiftData', 'розробка застосунків для iPhone', 'курси swift', 'навчання ios'],
    authors: [{ name: 'SwiftLab Academy' }],
    openGraph: {
      title: 'SwiftLab — Навчання розробки застосунків для iPhone',
      description: 'Опануйте мову Swift та SwiftUI за допомогою інтерактивного iPhone симулятора та практичних уроків.',
      type: 'website',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#007AFF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const savedLocale = cookies().get('swiftlab_locale')?.value;
  const locale: Locale = savedLocale === 'en' ? 'en' : 'uk';
  const savedTheme = (cookies().get('swiftlab_theme')?.value as Theme) || 'dark';

  return (
    <html lang={locale} className={savedTheme} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('swiftlab_theme');
                if (t === 'light' || t === 'dark') {
                  document.documentElement.className = t;
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090a0f] text-neutral-100 antialiased selection:bg-ios-blue selection:text-white transition-colors duration-200">
        <LocaleProvider initialLocale={locale}>
          <ThemeProvider initialTheme={savedTheme}>
            <AuthProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <AuthModal />
            </AuthProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
