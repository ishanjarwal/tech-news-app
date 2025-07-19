'use client';

import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import {
  fetchCategories,
  selectCategoryState,
} from '@/reducers/categoryReducer';
import {
  createPost,
  resetPostState,
  selectPostState,
} from '@/reducers/postReducer';
import {
  fetchSubCategories,
  resetSubCategoryState,
  selectSubCategoryState,
} from '@/reducers/subCategoryReducer';
import { AppDispatch } from '@/stores/appstore';
import { ImageValues } from '@/types/types';
import { NewPostSchema, NewPostValues } from '@/validations/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  CustomSelectInput,
  CustomTextboxInput,
} from '../common/CustomFormElements';
import { Button } from '../ui/button';
import Editor from './Editor';
import TagInput from './TagsInput';
import ThumbnailInput from './ThumbnailInput';
import { isEmpty } from 'lodash';
import { getChangedProps } from '@/lib/utils';
import { sanitizeHtml } from '@/utils/sanitizePostContent';

const WriteForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading: categoryLoading } =
    useSelector(selectCategoryState);
  const { loading, errors: validation_errors } = useSelector(selectPostState);
  const { subcategories, loading: subCategoryLoading } = useSelector(
    selectSubCategoryState
  );
  const [tempThumbnailValue, setTempThumbnailValue] =
    useState<ImageValues | null>(null);

  const defaultValues: NewPostValues = {
    category: '',
    content: '',
    summary: '',
    tags: [],
    title: '',
    status: 'draft',
  };

  const {
    formState: { errors, isDirty },
    register,
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm<NewPostValues>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const onSubmit = async (data: NewPostValues) => {
    const sendable = {
      ...data,
      thumbnail: tempThumbnailValue || undefined,
      content: sanitizeHtml(data.content),
    };
    console.log(sendable);
    // const result = await dispatch(createPost(sendable));
    // if (createPost.fulfilled.match(result)) {
    //   router.push(`/post/${result.payload.data.slug}`);
    // }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const category = watch('category');
  useEffect(() => {
    dispatch(resetSubCategoryState());
    if (category) {
      dispatch(fetchSubCategories({ categorySlug: category }));
    }
  }, [category]);

  const watchedValues = watch();
  const isUnchanged = isEmpty(getChangedProps(watchedValues, defaultValues));
  useUnsavedChangesWarning(!isUnchanged || Boolean(tempThumbnailValue), () => {
    console.log('User attempted to navigate away');
  });

  useEffect(() => {
    return () => {
      dispatch(resetPostState());
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-8 pb-16">
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
              <Editor
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
