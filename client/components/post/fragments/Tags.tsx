import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const Tags = ({ tags }: { tags: { slug: string; name: string }[] }) => {
  return (
    <div className="flex flex-wrap justify-start gap-2">
      {tags.map((tag: { slug: string; name: string }, index: number) => (
        <Link href={`/tag/${tag.slug}`} className="text-sm hover:underline">
          #{tag.name}
        </Link>
      ))}
    </div>
  );
};

export default Tags;
