'use client';
import LogoutButton from '@/components/auth/logout/LogoutButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { selectUserState } from '@/reducers/userReducer';
import { User } from '@/types/types';
import {
  ArrowRight,
  Grid2X2,
  Heart,
  Pen,
  Save,
  SlidersHorizontal,
  UserCheck,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const { user } = useSelector(selectUserState);
  const { username, fullname, email, avatar, roles } = user as User;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={
                avatar ? avatar : `https://ui-avatars.com/api/?name=${fullname}`
              }
              alt="Avatar"
            />
            {/* <AvatarFallback>CN</AvatarFallback> */}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[300px]">
        <div className="bg-accent mb-1 flex space-x-2 rounded-md p-4">
          <div>
            <Avatar>
              <AvatarImage
                src={
                  avatar
                    ? avatar
                    : `https://ui-avatars.com/api/?name=${fullname}`
                }
                alt="Avatar"
              />
              {/* <AvatarFallback>CN</AvatarFallback> */}
            </Avatar>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{fullname}</p>
            <p className="text-muted-foreground text-xs">@{username}</p>
          </div>
        </div>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={'/me'} className="group relative">
            <span>
              <UserIcon />
            </span>
            <span>Profile</span>
            <span className="absolute top-1/2 right-1 -translate-x-1 -translate-y-1/2 opacity-0 duration-150 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight />
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={'/liked'} className="group relative">
            <span>
              <Heart />
            </span>
            <span>Liked Posts</span>
            <span className="absolute top-1/2 right-1 -translate-x-1 -translate-y-1/2 opacity-0 duration-150 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight />
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={'/me/following'} className="group relative">
            <span>
              <UserCheck />
            </span>
            <span>My following</span>
            <span className="absolute top-1/2 right-1 -translate-x-1 -translate-y-1/2 opacity-0 duration-150 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight />
            </span>
          </Link>
        </DropdownMenuItem>
        {roles.includes('author') && (
          <>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={'/me/posts'} className="group relative">
                <span>
                  <Grid2X2 />
                </span>
                <span>My Posts</span>
                <span className="absolute top-1/2 right-1 -translate-x-1 -translate-y-1/2 opacity-0 duration-150 group-hover:translate-x-0 group-hover:opacity-100">
                  <ArrowRight />
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={'/me/drafts'} className="group relative">
                <span>
                  <Save />
                </span>
                <span>Drafts</span>
                <span className="absolute top-1/2 right-1 -translate-x-1 -translate-y-1/2 opacity-0 duration-150 group-hover:translate-x-0 group-hover:opacity-100">
                  <ArrowRight />
                </span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={'/write'} className="group relative">
            <span>
              <Pen />
            </span>
            <span>Write</span>
            <span className="absolute top-1/2 right-1 -translate-x-1 -translate-y-1/2 opacity-0 duration-150 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight />
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={'/me?tab=account-preferences'} className="group relative">
            <span>
              <SlidersHorizontal />
            </span>
            <span>Preferences</span>
            <span className="absolute top-1/2 right-1 -translate-x-1 -translate-y-1/2 opacity-0 duration-150 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight />
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <LogoutButton className="px-2 py-1" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
