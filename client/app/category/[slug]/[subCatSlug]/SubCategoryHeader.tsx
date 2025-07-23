import { env } from '@/config/env';
import axios from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const fetchCategory = async (slug: string, subCatSlug: string) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/subcategory/${slug}/${subCatSlug}`;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    return redirect('/error');
  }
};

const SubCategoryHeader = async ({
  slug,
  subCatSlug,
}: {
  slug: string;
  subCatSlug: string;
}) => {
  const subCategory = await fetchCategory(slug, subCatSlug);

  return (
    <div className="flex gap-8 pt-16 pb-8 md:pb-16">
      <div className="flex flex-col space-y-4">
        <Link href={`/category/${subCategory.category.slug}`}>
          In {subCategory.category.name}
        </Link>
        <h2 className="text-2xl font-semibold md:text-4xl">
          {subCategory.name}
        </h2>
        <p className="text-muted-foreground">{subCategory.summary}</p>
      </div>
    </div>
  );
};

export default SubCategoryHeader;
