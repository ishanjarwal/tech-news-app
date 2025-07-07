import Footer from '@/components/common/footer/Footer';
import Navbar from '@/components/common/navbar/Navbar';
import AppStoreProvider from '@/providers/AppStoreProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import type { Metadata } from 'next';
import ToastContainer, { Toaster } from 'react-hot-toast';
import './globals.css';
import InitializeUser from '@/components/auth/InitializeUser';
import PhotoUploader from '@/components/photo_upload/PhotoUploader';

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
