import TagListSkeleton from '@/components/skeletons/tags/TagListSkeleton';
import { env } from '@/config/env';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import CategoryList from './CategoryList';

const fetchCategories = async () => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/category`;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    return redirect('/error');
  }
};

const page = async () => {
  const categories = await fetchCategories();
  return (
    <div>
      <h2 className="my-8 text-2xl font-bold md:text-3xl">
        Popular Categories
      </h2>
      <Suspense fallback={<TagListSkeleton />}>
        <CategoryList />
      </Suspense>
    </div>
  );
};

export default page;
