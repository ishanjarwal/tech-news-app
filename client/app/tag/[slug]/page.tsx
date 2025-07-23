import CardHeaderSkeleton from '@/components/skeletons/list/CardHeaderSkeleton';
import CardListSkeleton from '@/components/skeletons/list/CardListSkeleton';
import { Suspense } from 'react';
import TagHeader from './TagHeader';
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
      <Suspense fallback={<CardHeaderSkeleton />}>
        <TagHeader slug={slug} />
      </Suspense>
      <Suspense fallback={<CardListSkeleton />}>
        <List slug={slug} page={page} />
      </Suspense>
    </div>
  );
};

export default page;
