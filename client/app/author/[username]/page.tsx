import React, { Suspense } from 'react';
import AuthorDetails from './AuthorDetails';
import AuthorPosts from './List';
import List from './List';
import CardListSkeleton from '@/components/skeletons/list/CardListSkeleton';
import AuthorProfileSkeleton from '@/components/skeletons/author/AuthorProfileSkeleton';

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: number }>;
}

const page = async ({ params, searchParams }: PageProps) => {
  const { username } = await params;
  const page = Number((await searchParams).page) || 1;
  return (
    <div>
      <Suspense fallback={<AuthorProfileSkeleton />}>
        <AuthorDetails username={username} />
      </Suspense>
      <Suspense fallback={<CardListSkeleton />}>
        <div className="pt-4 sm:pt-8">
          <List username={username} page={page} />
        </div>
      </Suspense>
    </div>
  );
};

export default page;
