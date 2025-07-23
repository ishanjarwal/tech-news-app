import { env } from '@/config/env';
import axios from 'axios';
import { redirect } from 'next/navigation';

const fetchTag = async (slug: string) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/tag/${slug}`;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    return redirect('/error');
  }
};

const TagHeader = async ({ slug }: { slug: string }) => {
  const tag = await fetchTag(slug);

  return (
    <div className="flex gap-8 pt-16 pb-8 md:pb-16">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold md:text-4xl">#{tag.name}</h2>
        <p className="text-muted-foreground">{tag.summary}</p>
      </div>
    </div>
  );
};

export default TagHeader;
