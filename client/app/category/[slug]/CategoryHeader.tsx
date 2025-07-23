import { AspectRatio } from '@/components/ui/aspect-ratio';
import { env } from '@/config/env';
import axios from 'axios';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const fetchCategory = async (slug: string) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/category/${slug}`;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    return redirect('/error');
  }
};

const CategoryHeader = async ({ slug }: { slug: string }) => {
  const category = await fetchCategory(slug);

  return (
    <div className="flex gap-8 pt-16 pb-8 md:pb-16">
      {category.thumbnail && (
        <div>
          <AspectRatio
            ratio={1}
            className="bg-background relative w-24 rounded-lg"
          >
            <Image
              src={category.thumbnail}
              alt={''}
              fill
              className="object-cover object-center"
            />
          </AspectRatio>
        </div>
      )}
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold md:text-4xl">{category.name}</h2>
        <p className="text-muted-foreground">{category.summary}</p>
      </div>
    </div>
  );
};

export default CategoryHeader;
