import { Button } from '@/components/ui/button';
import { formatNumberShort } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const CommentButton = ({ comments_count }: { comments_count: number }) => {
  return (
    <Button
      variant={'ghost'}
      className="cursor-pointer flex-col gap-0 px-2"
      asChild
    >
      <Link href={'#comments'}>
        <span>
          <MessageCircle />
        </span>
        <span className="text-[8px] sm:!text-[10px]">
          {formatNumberShort(comments_count)}
        </span>
      </Link>
    </Button>
  );
};

export default CommentButton;
