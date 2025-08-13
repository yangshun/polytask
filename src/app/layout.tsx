import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';

import { ThemeProvider } from '~/components/theme/theme-provider';
import { ReduxProvider } from '~/components/providers/redux-provider';
import { CommandsProvider } from '~/components/commands/commands-context';

import { cn } from '~/lib/utils';
import './globals.css';
import { TooltipProvider } from '~/components/ui/tooltip';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const poppins = Poppins({
  weight: '600',
  variable: '--font-poppins',
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
        className={cn(
          geistSans.variable,
          geistMono.variable,
          poppins.variable,
          'antialiased',
        )}>
        <ReduxProvider>
          <CommandsProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <TooltipProvider>{children}</TooltipProvider>
            </ThemeProvider>
          </CommandsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
