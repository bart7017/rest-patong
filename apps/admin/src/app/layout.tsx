import './globals.css';
import type { Metadata } from 'next';
import { TranslationProvider } from '@/contexts/TranslationContext';

export const metadata: Metadata = {
  title: 'Papy - Administration',
  description: 'Interface d\'administration pour le menu QR du restaurant Papy',
  robots: 'noindex, nofollow', // Empêcher l'indexation de l'admin
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}