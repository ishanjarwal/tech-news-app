'use client';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  followStatus,
  selectFollowState,
  toggleFollow,
} from '@/reducers/followReducer';
import { selectUserState } from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface AuthorProfileProps {
  author: {
    id: string;
    fullname: string;
    username: string;
    avatar?: string;
    cover_image?: string;
    bio?: string;
    joined: Date;
  };
}

const AuthorProfile = ({ author }: AuthorProfileProps) => {
  const { user } = useSelector(selectUserState);
  const { loading, follows } = useSelector(selectFollowState);
  const dispatch = useDispatch<AppDispatch>();

  const toggleFollowAuthor = () => {
    dispatch(toggleFollow({ username: author.username }));
  };

  useEffect(() => {
    dispatch(followStatus({ author_id: author.id }));
  }, []);

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
        <Link href={`/author/${author.username}`}>
          <Avatar className="absolute left-[5%] size-24 -translate-y-1/2">
            <AvatarImage
              src={author.avatar || '/images/profile-placeholder.png'}
              className="object-cover object-center"
              alt="Author Profile"
            />
          </Avatar>
        </Link>
      </div>
      <div className="flex items-center justify-between ps-32 pe-2 pt-2">
        <div>
          <Link href={`/author/${author.username}`}>
            <p className="text-sm font-semibold">{author.fullname}</p>
          </Link>
          <Link href={`/author/${author.username}`}>
            <p className="text-muted-foreground text-xs">@{author.username}</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-col space-y-6 p-4">
        {user && user.username != author.username && (
          <Button
            onClick={toggleFollowAuthor}
            disabled={loading}
            className="w-full cursor-pointer"
          >
            {follows ? 'Unfollow' : 'Follow'}
          </Button>
        )}
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
