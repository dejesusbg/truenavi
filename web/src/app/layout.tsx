import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: '../../public/fonts/InterVariable.ttf',
  display: 'swap',
  variable: '--font-sans',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'truenavi',
  description: 'A navigation app for the visually impaired',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="min-h-[calc(100svh-90px)] h-full max-w-none mx-2.5 lg:mx-8 m-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
