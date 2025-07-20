import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const CommentButton = () => {
  return (
    <Button variant={'ghost'} className="cursor-pointer flex-col gap-0" asChild>
      <Link href={'#comments'}>
        <span>
          <MessageCircle />
        </span>
        <span className="text-[8px] sm:!text-[10px]">200</span>
      </Link>
    </Button>
  );
};

export default CommentButton;
