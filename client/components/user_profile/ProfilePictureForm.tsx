'use client';
import {
  deleteProfilePicture,
  open,
  uploadProfilePicture,
} from '@/reducers/photoReducer';
import { selectUserState } from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { Camera, Pen, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import Tooltip from '../common/Tooltip';

const ProfilePictureForm = () => {
  const { user } = useSelector(selectUserState);
  const dispatch = useDispatch<AppDispatch>();
  const handleModal = () => {
    dispatch(
      open({
        title: 'Upload Profile Picture',
        description:
          'Upload a high quality and clear picture of yourself so that people can know you.',
        aspectRatio: 1,
        action: (photo: Blob) => {
          dispatch(uploadProfilePicture({ photo }));
        },
      })
    );
  };

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  return (
    <div className="bg-accent ring-background h-full w-full flex-1 rounded-full ring-4 md:ring-8">
      <div className="bg-accent/75 absolute bottom-[10%] left-[80%] z-[2] flex cursor-pointer items-center space-x-[2px] overflow-hidden rounded-full backdrop-blur-xs sm:right-[4%] sm:bottom-0 sm:left-auto md:right-[0%] lg:right-[8%]">
        <Tooltip content="Upload a new profile picture">
          <Button
            onClick={handleModal}
            variant={'ghost'}
            className="!h-auto !w-auto cursor-pointer rounded-none !p-2"
          >
            <Pen size={6} />
          </Button>
        </Tooltip>
        {user?.avatar && (
          <DeleteProfileForm open={deleteModal} setOpen={setDeleteModal} />
        )}
      </div>
      <div
        onClick={handleModal}
        className="bg-background/75 absolute top-0 left-0 z-[1] flex h-full w-full scale-105 cursor-pointer flex-col items-center justify-center rounded-full px-2 opacity-0 backdrop-blur-xs duration-150 md:hover:opacity-100"
      >
        <span>
          <Camera />
        </span>
        <span className="text-center text-xs text-balance">
          Click to change or remove photo
        </span>
      </div>
      <div className="relative h-full w-full overflow-hidden rounded-full">
        <Image
          fill
          className="absolute h-full w-full object-cover object-center"
          src={user?.avatar || '/images/profile-placeholder.png'}
          alt="Banner"
        />
      </div>
    </div>
  );
};

const DeleteProfileForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const { user } = useSelector(selectUserState);
  const dispatch = useDispatch<AppDispatch>();
  const handleDelete = () => {
    dispatch(deleteProfilePicture());
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
        <Tooltip content="Remove profile picture">
          <Button
            onClick={() => setOpen(true)}
            variant={'ghost'}
            className="text-destructive hover:text-destructive !h-auto !w-auto cursor-pointer rounded-none !p-2"
          >
            <Trash size={6} />
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="relative mx-auto mb-2 aspect-square w-24 overflow-hidden rounded-full">
            <Image
              fill
              className="h-full w-full object-cover object-center"
              src={user?.avatar as string}
              alt="Profile picture"
            />
          </div>
          <DialogTitle className="text-center">
            Remove profile picture
          </DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your
            picture our servers.
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

export default ProfilePictureForm;
