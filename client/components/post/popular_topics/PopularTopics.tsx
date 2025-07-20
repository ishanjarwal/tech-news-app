import { env } from '@/config/env';
import axios from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const TAG_COLORS = ['#fa00ff', '#00b6ff', '#0cff00', '#ffcc00'];

export function getRandomTagColor(): string {
  const index = Math.floor(Math.random() * TAG_COLORS.length);
  return TAG_COLORS[index];
}

const getTags = async () => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/tag/popular`;
    const response = await axios.get(url);
    const tags = response.data?.data ?? [];
    return tags;
  } catch (error) {
    return redirect('/error');
  }
};

const PopularTopics = async () => {
  const tags = await getTags();

  return (
    <div>
      <h2 className="border-foreground border-b-2 pb-2 text-2xl font-semibold uppercase">
        🔥 Popular Topics
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag: any, index: number) => {
          const color = getRandomTagColor();
          console.log(color);
          return (
            <Link
              key={'popular-tag-' + index}
              href={`/tag/${tag.slug}`}
              className="rounded-md px-3 py-2 text-sm hover:brightness-50"
              style={{ backgroundColor: color + 25, color: color }}
            >
              {tag.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PopularTopics;
