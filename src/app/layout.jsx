import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/lib/auth';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });


export const metadata = {
  title: 'Food Hub',
  description: 'The ultimate admin panel for your food delivery platform.',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, spaceGrotesk.variable, "font-body antialiased")}>
        <AuthProvider>
            {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
