import { Metadata } from 'next';
import HomePageContent from './HomePageContent';
import { Suspense } from 'react';
import CardListSkeleton from '@/components/skeletons/list/CardListSkeleton';

const page = async () => {
  return (
    <main>
      <Suspense fallback={<CardListSkeleton />}>
        <HomePageContent />
      </Suspense>
    </main>
  );
};

export default page;
