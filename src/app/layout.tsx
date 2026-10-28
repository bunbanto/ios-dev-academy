import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

export const metadata: Metadata = {
  title: 'SwiftLab — Навчання розробки додатків для iPhone (Swift & SwiftUI)',
  description: 'Інтерактивна платформа для вивчення розробки iOS додатків: симулятор iPhone 16 Pro, живий SwiftUI код, уроки від початківця до Senior, квізи для співбесід та готові портфоліо-проєкти.',
  keywords: [
    'iOS development',
    'Swift 6',
    'SwiftUI',
    'iPhone app development',
    'SwiftData',
    'розробка додатків для iphone',
    'курси swift',
    'навчання ios'
  ],
  authors: [{ name: 'SwiftLab Academy' }],
  openGraph: {
    title: 'SwiftLab — Навчання розробки додатків для iPhone',
    description: 'Опануйте мову Swift та SwiftUI за допомогою інтерактивного iPhone симулятора та практичних уроків.',
    type: 'website',
  },
};

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
  return (
    <html lang="uk" className="dark">
      <body className="min-h-screen flex flex-col bg-[#090a0f] text-neutral-100 antialiased selection:bg-ios-blue selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
