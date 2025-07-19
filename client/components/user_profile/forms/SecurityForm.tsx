'use client';
import { google } from '@/assets/icons/icons';
import { CustomPasswordInput } from '@/components/common/CustomFormElements';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { changePassword, selectUserState } from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { ChangePasswordSchema, ChangePasswordValues } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Loader, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const SecurityForm = () => {
  const { user } = useSelector(selectUserState);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col space-y-8 pt-8">
      <ChangePasswordForm open={open} setOpen={setOpen} />
      <div className="flex w-full items-end space-x-2">
        <div className="flex-1">
          <label className="text-muted-foreground text-xs">Password</label>
          <Input value="**********" disabled />
        </div>
        <div>
          <Button
            onClick={() => setOpen(true)}
            variant={'secondary'}
            className="cursor-pointer"
          >
            Change
          </Button>
        </div>
      </div>
      <div className="flex space-x-2">
        <p className="text-muted-foreground">Login Provider : </p>
        {user?.login_provider === 'google' ? (
          <p className="flex space-x-2">
            <span className="size-6">{google}</span>
            <span>Google</span>
          </p>
        ) : (
          <p>Email</p>
        )}
      </div>
    </div>
  );
};

const ChangePasswordForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const { loading, errors: validation_errors } = useSelector(selectUserState);
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ChangePasswordValues>({
    defaultValues: {
      old_password: '',
      password: '',
      password_confirmation: '',
    },
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordValues) => {
    const result = dispatch(changePassword(data));
    if (!changePassword.pending.match(result)) {
      reset();
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          setOpen(true);
        } else {
          reset();
          setOpen(false);
        }
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-4 border-b pb-4 text-xl font-semibold">
            <DialogTitle>Change your account password</DialogTitle>{' '}
          </DialogHeader>
          {validation_errors && (
            <div className="border-destructive bg-destructive/10 text-destructive w-full rounded-lg px-3 py-2">
              {validation_errors.map((el) => (
                <p className="flex items-start justify-start space-x-1">
                  <X size={16} className="mt-[3px]" />
                  <span>{el.msg}</span>
                </p>
              ))}
            </div>
          )}
          <div className="flex flex-col space-y-8">
            <CustomPasswordInput
              labelText="Old Password"
              name="old_password"
              register={register}
              error={errors.old_password}
              disabled={loading}
            />
            <CustomPasswordInput
              labelText="New Password"
              name="password"
              register={register}
              error={errors.password}
              disabled={loading}
            />
            <CustomPasswordInput
              labelText="Confirm Password"
              name="password_confirmation"
              register={register}
              error={errors.password_confirmation}
              disabled={loading}
            />
          </div>
          <DialogFooter className="justify-end border-t pt-4">
            <Button
              onClick={() => {
                reset();
                setOpen(false);
              }}
              type="button"
              disabled={loading}
              variant={'secondary'}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {!loading ? 'Confirm' : <Loader className="animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityForm;
