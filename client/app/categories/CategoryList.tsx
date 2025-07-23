import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { env } from '@/config/env';

const fetchCategories = async () => {
  const url = `${env.NEXT_PUBLIC_BASE_URL}/category`;
  const response = await axios.get(url);
  return response.data.data;
};

const CategoryList = async () => {
  const categories = await fetchCategories();

  return (
    <div className="grid grid-cols-2 gap-2 pb-8 sm:gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category: any, index: number) => (
        <Link
          key={'category-' + index}
          className="bg-card hover:bg-accent flex items-start gap-x-4 rounded-lg p-4 shadow-2xl duration-75"
          href={`/category/${category.slug}`}
        >
          {category.thumbnail && (
            <div className="relative aspect-square size-24 overflow-hidden rounded-lg">
              <Image
                src={category.thumbnail}
                alt={category.name}
                fill
                className="object-cover object-center"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col">
            <p className="text-lg leading-tight font-semibold sm:text-xl">
              {category.name}
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {category.summary}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
