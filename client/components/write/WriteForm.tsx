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
import { useEffect, useState } from 'react';
import {
  fetchCategories,
  selectCategoryState,
} from '@/reducers/categoryReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/stores/appstore';
import { createPost, selectPostState } from '@/reducers/postReducer';
import TurndownService from 'turndown';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImageValues } from '@/types/types';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import {
  fetchSubCategories,
  resetSubCategoryState,
  selectSubCategoryState,
} from '@/reducers/subCategoryReducer';

const WriteForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading: categoryLoading } =
    useSelector(selectCategoryState);
  const { loading } = useSelector(selectPostState);
  const { subcategories, loading: subCategoryLoading } = useSelector(
    selectSubCategoryState
  );
  const [tempThumbnailValue, setTempThumbnailValue] =
    useState<ImageValues | null>(null);

  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm<NewPostValues>({
    resolver: zodResolver(NewPostSchema),
  });

  const onSubmit = async (data: NewPostValues) => {
    console.log(data);
    const sendable = {
      ...data,
      thumbnail: tempThumbnailValue || undefined,
    };
    const result = await dispatch(createPost(sendable));
    if (createPost.fulfilled.match(result)) {
      router.push(`/post/${result.payload.data.data.slug}`);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    dispatch(resetSubCategoryState());
    if (watch('category')) {
      dispatch(fetchSubCategories({ categorySlug: watch('category') }));
    }
  }, [watch('category')]);

  useUnsavedChangesWarning(true, () => {
    console.log(closed);
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-8 pb-16">
        <CustomTextboxInput
          name="title"
          register={register}
          error={errors.title}
          labelText={'Title'}
          className="max-h-[150px] !text-2xl"
        />
        <ThumbnailInput
          tempThumbnailValue={tempThumbnailValue}
          setTempThumbnailValue={setTempThumbnailValue}
          id={undefined}
        />
        <CustomTextboxInput
          name="summary"
          register={register}
          error={errors.summary}
          labelText={'Summary'}
        />
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <CustomSelectInput
              disabled={loading || categoryLoading}
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
              disabled={loading || !watch('category') || subCategoryLoading}
              control={control}
              error={errors.subCategory}
              register={register}
              name="subCategory"
              labelText="Sub category"
              notFoundLabel={'No subcategory found'}
              options={
                subcategories?.map((el) => ({
                  label: el.name,
                  value: el.slug,
                })) || []
              }
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
