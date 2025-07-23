import TagListSkeleton from '@/components/skeletons/tags/TagListSkeleton';
import { Suspense } from 'react';
import List from './List';

interface PageProps {
  searchParams: Promise<{ page: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  const page = Number((await searchParams).page) || 1;
  return (
    <div className="px-2 sm:px-0">
      <div>
        <h2 className="my-8 text-2xl font-bold md:text-3xl">#️&nbsp;Topics</h2>
      </div>
      <Suspense fallback={<TagListSkeleton />}>
        <List page={page} />
      </Suspense>
    </div>
  );
};

export default page;
