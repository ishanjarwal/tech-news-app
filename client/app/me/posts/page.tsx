import { Button } from '@/components/ui/button';
import { Pen, Trash } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const page = () => {
  return (
    <div className="grid grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((el) => (
        <div className="sm:bg-foreground/10 p-2 sm:rounded-lg">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md">
            <Image
              fill
              className="absolute h-full w-full object-cover object-center"
              src={'/images/abstract_waves.jpg'}
              alt="postname"
            />
          </div>
          <div className="flex flex-col space-y-2 pt-2">
            <h3 className="line-clamp-2 overflow-hidden text-lg font-semibold text-balance text-ellipsis sm:text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque,
              tempore!
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Updated 12 hours
              </span>
              <div className="flex items-center space-x-1">
                <Button
                  size={'icon'}
                  className="size-6 cursor-pointer !rounded-[4px] hover:brightness-90 sm:size-8"
                >
                  <Pen />
                </Button>
                <Button
                  size={'icon'}
                  className="size-6 cursor-pointer !rounded-[4px] hover:brightness-90 sm:size-8"
                  variant={'destructive'}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
