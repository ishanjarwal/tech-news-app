import CardListSkeleton from '@/components/skeletons/list/CardListSkeleton';
import { Suspense } from 'react';
import List from './List';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: string }>;
}

const page = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params;
  const page = Number((await searchParams).page) || 1;
  return (
    <div className="px-2 sm:px-0">
      <div>
        <h2 className="my-8 text-2xl font-semibold md:text-3xl">
          Post Archive
        </h2>
      </div>
      <Suspense fallback={<CardListSkeleton />}>
        <List page={page} />
      </Suspense>
    </div>
  );
};

export default page;
