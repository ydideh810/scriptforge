import './globals.css';
import type { Metadata } from 'next';
import { Share_Tech_Mono, Orbitron } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
});

export const metadata: Metadata = {
  title: 'LABOR_TRON',
  description: 'Next-generation AI scripting platform',
  themeColor: '#0A0A0F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${shareTechMono.variable} ${orbitron.variable} font-mono bg-[#0A0A0F]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="min-h-screen relative overflow-hidden">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
