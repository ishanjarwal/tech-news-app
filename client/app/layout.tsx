import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/common/navbar/Navbar';
import Footer from '@/components/common/footer/Footer';
import ThemeProvider from '@/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'Tech News | Stay ahead in the Tech Space',
  description:
    "A community-driven platform for developers, tech enthusiasts, and innovators to discover the latest in technology, share insights, publish ideas, and grow together. Whether you're learning to code, following industry trends, or contributing your expertise — this is your space to connect and thrive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex items-center justify-center">
            <div className="mx-auto w-full max-w-7xl">
              <Navbar />
              <div className="">{children}</div>
              <Footer />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
