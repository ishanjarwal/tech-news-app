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
} from '@/components/common/CustomFormElements';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppDispatch } from '@/stores/appstore';
import { getChangedProps } from '@/lib/utils';
import {
  PREFERENCES_THEMES,
  PreferencesSchema,
  PreferencesValues,
} from '@/validations/profile';

const PreferencesForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, errors: validation_errors } = useSelector(selectUserState);
  const user = useSelector(selectUserState).user as User;
  const defaultValues: PreferencesValues = {
    newsletter: user.preferences?.newsletter,
    theme: user.preferences?.theme,
    language: user.preferences?.language,
  };
  const { register, control, formState, watch, handleSubmit } =
    useForm<PreferencesValues>({
      resolver: zodResolver(PreferencesSchema),
      values: defaultValues,
    });

  const { errors } = formState;

  const onSubmit = (data: PreferencesValues) => {
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
        <h2 className="text-2xl font-semibold">Preferences</h2>
        <Separator className="mt-4 mb-6" />
        <div className="flex w-full flex-col space-y-8">
          <div className="ps-2">
            <CustomCheckboxInput
              disabled={loading}
              label="Newsletter"
              name="newsletter"
              error={errors.newsletter}
              control={control}
            />
          </div>
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

export default PreferencesForm;
