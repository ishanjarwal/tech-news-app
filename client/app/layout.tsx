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

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Tech Newz | Stay Ahead in the Tech Space',
  description:
    'Tech Newz delivers the latest technology news, coding tutorials, developer insights, product reviews, and industry analysis to keep tech enthusiasts and programmers ahead of the curve.',
  keywords:
    'technology news, coding tutorials, programming, developer news, software development, tech reviews, startups, AI, web development, mobile development, cybersecurity, tech trends, programming tips',
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Newz | Stay Ahead in the Tech Space',
    description:
      'Latest tech news, developer tutorials, product reviews, and industry insights for tech enthusiasts and programmers.',
    site: '@TechNewzOfficial',
    creator: '@TechNewzOfficial',
    images: ['https://yourdomain.com/og-image.jpg'],
  },
  openGraph: {
    title: 'Tech Newz | Stay Ahead in the Tech Space',
    description:
      'Explore the latest technology trends, coding tutorials, and in-depth developer content at Tech Newz.',
    url: 'https://yourdomain.com/',
    siteName: 'Tech Newz',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tech Newz - Stay Ahead in the Tech Space',
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
