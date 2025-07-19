import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';

interface AuthorProfileProps {
  author: {
    fullname: string;
    username: string;
    avatar?: string;
    cover_image?: string;
    bio?: string;
    joined: Date;
  };
}

const AuthorProfile = ({ author }: AuthorProfileProps) => {
  return (
    <div className="bg-accent overflow-hidden rounded-lg">
      <AspectRatio ratio={3} className="w-full">
        <Image
          src={author.cover_image || '/images/banner-placeholder.jpg'}
          fill
          alt="Author cover image"
          className="object-cover object-center"
        />
      </AspectRatio>
      <div className="relative">
        <Avatar className="absolute left-[5%] size-24 -translate-y-1/2">
          <AvatarImage
            src={author.avatar || '/images/profile-placeholder.png'}
            className="object-cover object-center"
            alt="Author Profile"
          />
        </Avatar>
      </div>
      <div className="flex items-center justify-between ps-32 pe-2 pt-2">
        <div>
          <p className="text-sm font-semibold">{author.fullname}</p>
          <p className="text-muted-foreground text-xs">@{author.username}</p>
        </div>
        <Button className="cursor-pointer">Follow</Button>
      </div>
      <div className="flex flex-col space-y-6 p-4">
        {author.bio && (
          <div>
            <p className="text-muted-foreground text-xs">About</p>
            <p className="text-sm">{author.bio}</p>
          </div>
        )}
        <div>
          <p className="text-muted-foreground text-xs">Joined</p>
          <p className="text-sm">{format(new Date(author.joined), 'PPP')} </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
