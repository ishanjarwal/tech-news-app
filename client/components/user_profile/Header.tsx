'use client';
import { selectUserState } from '@/reducers/userReducer';
import { User } from '@/types/types';
import { BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';
import ProfilePictureForm from './ProfilePictureForm';
import CoverImageForm from './CoverImageForm';

const Header = () => {
  const { user } = useSelector(selectUserState);
  const isAuthor = user?.roles.includes('author');
  return (
    <>
      {isAuthor ? (
        <div className="relative mb-32 aspect-[3] w-full lg:mb-48">
          <CoverImageForm />
          <div className="absolute top-full left-[24px] z-[1] aspect-square w-[120px] -translate-y-1/2 sm:w-[148px] md:left-[32px] lg:left-[48px] lg:w-[192px]">
            <ProfilePictureForm />
          </div>
          <div className="px-8 pt-16 sm:ps-[196px] sm:pt-4 lg:ps-[280px]">
            <p className="flex items-center text-lg font-semibold lg:text-3xl">
              <span>{user?.fullname}</span>
              <span>
                <BadgeCheck className="text-background fill-yellow-300 shadow-xs text-shadow-amber-300 text-shadow-md" />
              </span>
            </p>
            <p className="flex items-center space-x-2 text-xs md:text-base">
              <span>@{user?.username}</span>
              <span>-</span>
              <span>{user?.email}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center md:flex-row md:space-x-8">
          <div className="relative aspect-square w-[120px] sm:w-[148px] lg:w-[192px]">
            <ProfilePictureForm />
          </div>{' '}
          <div className="flex flex-col items-center md:items-start">
            <p className="flex items-center text-lg font-semibold lg:text-3xl">
              <span>{user?.fullname}</span>
            </p>
            <p className="flex flex-col items-center space-x-2 text-xs sm:flex-row md:text-base">
              <span>@{user?.username}</span>
              <span className="hidden sm:block">-</span>
              <span>{user?.email}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
