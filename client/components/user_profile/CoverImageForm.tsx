'use client';
import {
  deleteCoverImage,
  open,
  uploadCoverImage,
} from '@/reducers/photoReducer';
import { AppDispatch } from '@/stores/appstore';
import { Camera, Pen, Trash } from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { selectUserState } from '@/reducers/userReducer';
import Tooltip from '../common/Tooltip';

const CoverImageForm = () => {
  const { user } = useSelector(selectUserState);
  const dispatch = useDispatch<AppDispatch>();

  const handleModal = () => {
    dispatch(
      open({
        title: 'Upload Cover Image',
        description:
          'Upload a high quality and clear picture of yourself so that people can know you.',
        aspectRatio: 3,
        action: (photo: Blob) => {
          dispatch(uploadCoverImage({ photo }));
        },
      })
    );
  };

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  return (
    <div className="bg-accent h-full w-full overflow-hidden sm:rounded-2xl">
      <div className="bg-background/75 absolute right-0 bottom-0 z-[2] flex items-center rounded-tl-lg sm:me-4 sm:mb-4 sm:space-x-2 sm:!bg-transparent">
        <Tooltip content="Upload a new cover image">
          <Button
            size={'sm'}
            onClick={handleModal}
            className="sm:hover:!bg-foreground text-foreground cursor-pointer bg-transparent !px-[8px] !py-[3px] text-xs opacity-75 hover:!bg-transparent hover:opacity-100 sm:bg-white sm:!px-4 sm:!py-2 sm:text-black sm:opacity-100"
          >
            <Pen />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </Tooltip>
        {user?.cover_image && (
          <DeleteCoverImageForm open={deleteModal} setOpen={setDeleteModal} />
        )}
      </div>
      <div
        onClick={handleModal}
        className="bg-background/75 absolute top-0 left-0 z-[1] flex h-full w-full cursor-pointer flex-col items-center justify-center opacity-0 backdrop-blur-xs duration-150 sm:rounded-xl md:hover:opacity-100"
      >
        <span>
          <Camera />
        </span>
        <span className="text-center text-xs text-balance">
          Click to change or remove photo
        </span>
      </div>
      <div className="relative h-full w-full">
        <Image
          fill
          className="absolute h-full w-full object-cover object-center"
          src={user?.cover_image || '/images/banner-placeholder.jpg'}
          alt="Banner"
        />
      </div>
    </div>
  );
};

const DeleteCoverImageForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const { user } = useSelector(selectUserState);
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = () => {
    dispatch(deleteCoverImage());
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) {
          setOpen(false);
        }
      }}
    >
      <DialogTrigger>
        <Tooltip content="Remove cover image">
          <Button
            size={'sm'}
            onClick={() => setOpen(true)}
            variant={'destructive'}
            className="text-foreground cursor-pointer !bg-transparent !px-[4px] !py-[3px] text-xs opacity-75 hover:opacity-100 sm:!px-4 sm:!py-2 sm:text-white sm:opacity-100"
          >
            <Trash size={6} />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Remove Cover Image</DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your
            cover image our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <Button
            variant={'secondary'}
            onClick={() => setOpen(false)}
            className="cursor-pointer hover:brightness-90"
          >
            <span>Cancel</span>
          </Button>
          <Button
            onClick={handleDelete}
            className="cursor-pointer hover:brightness-90"
            variant={'destructive'}
          >
            <Trash size={6} />
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageForm;
