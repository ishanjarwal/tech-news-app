'use client';
import { Button } from '@/components/ui/button';
import { selectUserState } from '@/reducers/userReducer';
import { Pen } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const EditButton = ({
  post_id,
  author_username,
}: {
  post_id: string;
  author_username: string;
}) => {
  const { user } = useSelector(selectUserState);
  if (author_username !== user?.username) return null;

  return (
    <Button variant={'ghost'} asChild>
      <Link href={`/edit/${post_id}`} className="!px-2">
        <Pen />
        <span className="hidden sm:block">Edit</span>
      </Link>
    </Button>
  );
};

export default EditButton;
