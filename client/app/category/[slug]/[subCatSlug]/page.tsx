import CardHeaderSkeleton from '@/components/skeletons/list/CardHeaderSkeleton';
import CardListSkeleton from '@/components/skeletons/list/CardListSkeleton';
import { Suspense } from 'react';
import List from './List';
import SubCategoryHeader from './SubCategoryHeader';

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subCatSlug: string }>;
  searchParams: Promise<{ page?: number }>;
}) => {
  const { slug, subCatSlug } = await params;
  const page = Number((await searchParams).page) || 1;
  return (
    <div className="px-2 sm:px-0">
      <Suspense fallback={<CardHeaderSkeleton />}>
        <SubCategoryHeader slug={slug} subCatSlug={subCatSlug} />
      </Suspense>
      <Suspense fallback={<CardListSkeleton />}>
        <List slug={slug} subCategorySlug={subCatSlug} page={page} />
      </Suspense>
    </div>
  );
};

export default page;
