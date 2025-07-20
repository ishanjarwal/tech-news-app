import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import React from 'react';

const LikeButton = () => {
  return (
    <Button variant={'ghost'} className="cursor-pointer flex-col gap-0">
      <span>
        <Heart />
      </span>
      <span className="text-[8px] sm:!text-[10px]">1.1K</span>
    </Button>
  );
};

export default LikeButton;
