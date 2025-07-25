import { Metadata } from 'next';
import HomePageContent from './HomePageContent';

export const metadata: Metadata = {
  title: 'Tech Newz | Stay ahead in the tech space.',
  description: '',
  keywords: '',
  twitter: {},
  openGraph: {},
};

const page = async () => {
  return (
    <main>
      <HomePageContent />
    </main>
  );
};

export default page;
