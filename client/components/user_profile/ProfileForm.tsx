'use client';
import {
  facebook,
  github,
  instagram,
  linkedin,
  threads,
  x,
  youtube,
} from '@/assets/icons/icons';
import {
  resetValidationErrors,
  selectUserState,
  updateUser,
} from '@/reducers/userReducer';
import { User } from '@/types/types';
import {
  PREFERENCES_THEMES,
  UpdateUserSchema,
  UpdateUserValues,
} from '@/validations/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { isEqual } from 'lodash';
import { Globe, Loader, Plus, X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  CustomCheckboxInput,
  CustomFormInput,
  CustomRadioGroupInput,
  CustomTextboxInput,
} from '../common/CustomFormElements';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { AppDispatch } from '@/stores/appstore';
import { getChangedProps } from '@/lib/utils';

const social = [
  {
    name: 'instagram',
    icon: instagram,
    label: 'Instagram',
  },
  {
    name: 'x',
    icon: x,
    label: 'X',
  },
  {
    name: 'linkedin',
    icon: linkedin,
    label: 'LinkedIn',
  },
  {
    name: 'youtube',
    icon: youtube,
    label: 'Youtube',
  },
  {
    name: 'github',
    icon: github,
    label: 'Github',
  },
  {
    name: 'facebook',
    icon: facebook,
    label: 'Facebook',
  },
  {
    name: 'threads',
    icon: threads,
    label: 'Threads',
  },
] satisfies { name: keyof UpdateUserValues; label: string; icon: ReactNode }[];

const ProfileForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, errors: validation_errors } = useSelector(selectUserState);
  const user = useSelector(selectUserState).user as User;
  const defaultValues: UpdateUserValues = {
    fullname: user.fullname,
    username: user.username,
    bio: user.bio,
    newsletter: user.preferences?.newsletter,
    theme: user.preferences?.theme,
    language: user.preferences?.language,
    instagram: user.socialLinks?.instagram,
    github: user.socialLinks?.github,
    facebook: user.socialLinks?.facebook,
    youtube: user.socialLinks?.youtube,
    linkedin: user.socialLinks?.linkedin,
    threads: user.socialLinks?.threads,
    x: user.socialLinks?.x,
    websites: user.socialLinks?.websites?.map((el) => ({ value: el })) ?? [],
  };
  const { register, control, formState, watch, handleSubmit } =
    useForm<UpdateUserValues>({
      resolver: zodResolver(UpdateUserSchema),
      values: defaultValues,
    });

  const { errors } = formState;

  const { append, remove, fields } = useFieldArray<UpdateUserValues>({
    name: 'websites',
    control,
  });

  const onSubmit = (data: UpdateUserValues) => {
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
          {/* <CustomFormInput
            register={register}
            disabled={true}
            name={'email'}
            labelText="Email"
          /> */}
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

      {user.roles.includes('author') && (
        <div>
          <h2 className="text-2xl font-semibold">Social Links</h2>
          <Separator className="mt-4 mb-6" />
          <div className="flex w-full flex-col space-y-8">
            {social.map((el) => (
              <div className="justify- flex w-full items-center space-x-4">
                <span className="w-8">{el.icon}</span>
                <div className="flex-1">
                  <CustomFormInput
                    disabled={loading}
                    register={register}
                    name={el.name}
                    labelText={el.label}
                    error={errors[el.name]}
                  />
                </div>
              </div>
            ))}
            <div>
              <div className="flex w-full items-start space-x-4">
                <span className="w-8">
                  <Globe />
                </span>
                <div className="spacey-6 flex flex-1 flex-col space-y-8">
                  {fields.map((el, index) => (
                    <div key={el.id} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <CustomFormInput
                          disabled={loading}
                          register={register}
                          name={'websites.' + index + '.value'}
                          labelText={'Website ' + (index + 1)}
                          error={errors.websites?.[index]?.value}
                        />
                      </div>
                      <Button
                        onClick={() => remove(index)}
                        variant={'ghost'}
                        size={'icon'}
                        className="hover:!bg-background/20 cursor-pointer"
                      >
                        <X />
                      </Button>
                    </div>
                  ))}
                  {errors.websites && (
                    <p className="text-destructive text-xs">
                      {errors.websites.message}
                    </p>
                  )}
                  {(watch('websites') ?? []).length < 3 && (
                    <Button
                      disabled={loading}
                      className="w-max cursor-pointer hover:brightness-90"
                      type="button"
                      onClick={() => {
                        append({ value: '' });
                      }}
                    >
                      <span>Add</span>
                      <Plus />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold">Preferences</h2>
        <Separator className="mt-4 mb-6" />
        <div className="flex w-full flex-col space-y-8">
          <CustomCheckboxInput
            disabled={loading}
            label="Newsletter"
            name="newsletter"
            error={errors.newsletter}
            control={control}
          />
          <div>
            <p className="mb-2">Prefered theme</p>
            <CustomRadioGroupInput
              disabled={loading}
              name="theme"
              error={errors.theme}
              control={control}
              options={PREFERENCES_THEMES.map((el) => ({
                label: el,
                value: el,
              }))}
            />
          </div>
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
        <Button
          disabled={isEqual(watch(), defaultValues) || loading}
          variant={'outline'}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
