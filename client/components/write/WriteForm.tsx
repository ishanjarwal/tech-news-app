'use client';

import { NewPostSchema, NewPostValues } from '@/validations/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  CustomSelectInput,
  CustomTextboxInput,
} from '../common/CustomFormElements';
import { Button } from '../ui/button';
import MarkdownEditor from './MarkdownEditor';
import TagInput from './TagsInput';
import ThumbnailInput from './ThumbnailInput';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import {
  fetchCategories,
  selectCategoryState,
} from '@/reducers/categoryReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/stores/appstore';

const WriteForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector(selectCategoryState);
  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
  } = useForm<NewPostValues>({
    resolver: zodResolver(NewPostSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-8 pb-16">
        <div>
          {errors.title && (
            <p className="text-destructive text-xs">{errors.title.message}</p>
          )}
          <textarea
            {...register('title')}
            className={cn(
              'max-h-[250px] min-h-[75px] w-full border-b bg-transparent p-2 text-2xl outline-none',
              errors.title ? 'border-destructive' : 'border-border'
            )}
            placeholder="Title goes here"
          />
        </div>
        <ThumbnailInput />
        <CustomTextboxInput
          name="summary"
          register={register}
          error={errors.summary}
          labelText={'Summary'}
        />
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <CustomSelectInput
              control={control}
              error={errors.category}
              register={register}
              name="category"
              labelText="Category"
              notFoundLabel={'No category found'}
              options={
                categories?.map((el) => ({ label: el.name, value: el.slug })) ||
                []
              }
            />
          </div>
          <div className="flex-1">
            <CustomSelectInput
              control={control}
              error={errors.subCategory}
              register={register}
              name="subCategory"
              labelText="Sub category"
              notFoundLabel={'No subcategory found'}
              options={[
                { label: 'Nextjs', value: 'nextjs' },
                { label: 'Reactjs', value: 'reactjs' },
              ]}
            />
          </div>
        </div>
        <div>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <MarkdownEditor
                error={errors.content?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div>
          <TagInput control={control} error={errors.tags} />
        </div>
      </div>
      <div className="border-border flex items-center justify-end space-x-2 border-t pt-4">
        <Button className="cursor-pointer" variant={'secondary'} size={'sm'}>
          Save Draft
        </Button>
        <Button type="submit" className="cursor-pointer" size={'sm'}>
          Publish
        </Button>
      </div>
    </form>
  );
};

export default WriteForm;
