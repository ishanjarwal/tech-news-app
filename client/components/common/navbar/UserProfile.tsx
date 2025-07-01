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
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const { user } = useSelector(selectUserState);
  const { username, fullname, email, avatar } = user as User;

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
      <DropdownMenuContent align="end" className="min-w-[200px]">
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
            Profile
            <span className="absolute top-1/2 right-1 -translate-x-1 -translate-y-1/2 opacity-0 duration-150 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight />
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={'/me/preferences'} className="group relative">
            Preferences
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
