import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '~/components/theme/theme-provider';
import { ReduxProvider } from '~/components/providers/redux-provider';
import { CommandsProvider } from '~/components/commands/commands-context';

import { cn } from '~/lib/utils';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Polytask',
  description: 'AI-powered task management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
        <ReduxProvider>
          <CommandsProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </CommandsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
