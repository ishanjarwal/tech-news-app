'use client';
import {
  CustomFormInput,
  CustomTextboxInput,
} from '@/components/common/CustomFormElements';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getChangedProps } from '@/lib/utils';
import {
  resetValidationErrors,
  selectUserState,
  updateUser,
} from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { User } from '@/types/types';
import { BasicDetailsSchema, BasicDetailsValues } from '@/validations/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { isEqual } from 'lodash';
import { Loader, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const BasicDetailsForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, errors: validation_errors } = useSelector(selectUserState);
  const user = useSelector(selectUserState).user as User;
  const defaultValues: BasicDetailsValues = {
    fullname: user.fullname,
    username: user.username,
    bio: user.bio,
  };
  const { register, control, formState, watch, handleSubmit } =
    useForm<BasicDetailsValues>({
      resolver: zodResolver(BasicDetailsSchema),
      values: defaultValues,
    });

  const { errors } = formState;

  const onSubmit = (data: BasicDetailsValues) => {
    const sendable = getChangedProps(defaultValues, data);
    console.log(sendable);
    dispatch(updateUser(sendable));
  };

  useEffect(() => {
    return () => {
      dispatch(resetValidationErrors());
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-12 px-4 sm:px-0"
    >
      <div>
        <h2 className="text-2xl font-semibold">Basic</h2>
        <Separator className="mt-4 mb-12" />
        <div className="flex flex-col space-y-8">
          <CustomFormInput
            disabled={loading}
            register={register}
            name={'fullname'}
            labelText="Full name"
            error={errors.fullname}
          />
          <CustomFormInput
            disabled={loading}
            register={register}
            name={'username'}
            labelText="Username"
            error={errors.username}
          />
          <div className="relative">
            <Label className="text-muted-foreground absolute -top-[18px] left-0 text-xs">
              Email
            </Label>
            <Input disabled={true} value={user.email} />
          </div>
          {user.roles.includes('author') && (
            <CustomTextboxInput
              disabled={loading}
              register={register}
              name={'bio'}
              labelText="Bio"
              error={errors.bio}
            />
          )}
        </div>
      </div>

      <div>
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
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button disabled={isEqual(watch(), defaultValues) || loading}>
          {!loading ? 'Save' : <Loader className="animate-spin" />}
        </Button>
        {/* <Button
          disabled={isEqual(watch(), defaultValues) || loading}
          variant={'outline'}
        >
          Cancel
        </Button> */}
      </div>
    </form>
  );
};

export default BasicDetailsForm;
