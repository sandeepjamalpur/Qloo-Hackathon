
import type { Metadata } from 'next';
import { Alegreya, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';


const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});


export const metadata: Metadata = {
  title: 'Cultura',
  description: 'A sophisticated Cultural Discovery App to explore personalized recommendations powered by advanced AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${alegreya.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans animate-fade-in">
        <Providers>
          {
          children}
        </Providers>
      </body>
    </html>
  );
}
