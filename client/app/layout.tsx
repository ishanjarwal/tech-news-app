import Footer from '@/components/common/footer/Footer';
import Navbar from '@/components/common/navbar/Navbar';
import AppStoreProvider from '@/providers/AppStoreProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import type { Metadata } from 'next';
import ToastContainer, { Toaster } from 'react-hot-toast';
import './globals.css';
import InitializeUser from '@/components/auth/InitializeUser';
import PhotoUploader from '@/components/photo_upload/PhotoUploader';
import { Manrope } from 'next/font/google';
import PageProgress from '@/components/page_progress/PageProgress';
import { Analytics } from '@vercel/analytics/next';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'The Binary Ping | Stay Ahead in the Tech Space',
  description:
    'The Binary Ping delivers the latest technology news, coding tutorials, developer insights, product reviews, and industry analysis to keep tech enthusiasts and programmers ahead of the curve.',
  keywords:
    'technology news, coding tutorials, programming, developer news, software development, tech reviews, startups, AI, web development, mobile development, cybersecurity, tech trends, programming tips',
  twitter: {
    card: 'summary_large_image',
    title: 'The Binary Ping | Stay Ahead in the Tech Space',
    description:
      'Latest tech news, developer tutorials, product reviews, and industry insights for tech enthusiasts and programmers.',
    site: '@thebinaryping',
    creator: '@thebinaryping',
    images: ['https://thebinaryping.vercel.app/images/og-image.jpg'],
  },
  openGraph: {
    title: 'The Binary Ping | Stay Ahead in the Tech Space',
    description:
      'Explore the latest technology trends, coding tutorials, and in-depth developer content at The Binary Ping.',
    url: 'https://thebinaryping.vercel.app/',
    siteName: 'The Binary Ping',
    images: [
      {
        url: 'https://thebinaryping.vercel.app/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Binary Ping - Stay Ahead in the Tech Space',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${manrope.variable}`}>
        <Analytics />
        <PageProgress />
        <AppStoreProvider>
          <InitializeUser>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster position="top-center" />
              <main className="container mx-auto flex items-center justify-center">
                <div className="max-w-8xl mx-auto w-full">
                  <PhotoUploader />
                  <Navbar />
                  <div className="">{children}</div>
                  <Footer />
                </div>
              </main>
            </ThemeProvider>
          </InitializeUser>
        </AppStoreProvider>
      </body>
    </html>
  );
}
