import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Papy - Menu QR',
  description: 'Menu digital du restaurant Papy à Phuket, Thaïlande',
  keywords: 'restaurant, phuket, patong, menu, thaï, cuisine, papy',
  openGraph: {
    title: 'Papy - Menu QR',
    description: 'Menu digital du restaurant Papy à Phuket, Thaïlande',
    type: 'website',
  },
  manifest: '/manifest.json',
  themeColor: '#10b981',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
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
        {children}
      </body>
    </html>
  );
}