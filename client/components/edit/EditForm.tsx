'use client';

import { NewPostSchema, NewPostValues } from '@/validations/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  CustomSelectInput,
  CustomTextboxInput,
} from '../common/CustomFormElements';
import { Button } from '../ui/button';

import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { getChangedProps } from '@/lib/utils';
import {
  fetchCategories,
  selectCategoryState,
} from '@/reducers/categoryReducer';
import { selectPostState, updatePost } from '@/reducers/postReducer';
import {
  fetchSubCategories,
  resetSubCategoryState,
  selectSubCategoryState,
} from '@/reducers/subCategoryReducer';
import { AppDispatch } from '@/stores/appstore';
import { Post } from '@/types/types';
import { isEmpty } from 'lodash';
import { X } from 'lucide-react';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '../write/Editor';
import TagInput from '../write/TagsInput';
import ThumbnailInput from './ThumbnailInput';
import { selectUserState } from '@/reducers/userReducer';

const EditForm = ({ post }: { post: Post }) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector(selectUserState);

  const { categories, loading: categoryLoading } =
    useSelector(selectCategoryState);
  const { loading, errors: validation_errors } = useSelector(selectPostState);
  const { subcategories, loading: subCategoryLoading } = useSelector(
    selectSubCategoryState
  );

  const defaultValues: NewPostValues = {
    category: post.category.slug,
    content: post.content,
    summary: post.summary,
    tags: post.tags.map((el) => el.slug),
    title: post.title,
    status: post.status,
    subCategory: post?.subCategory?.slug || undefined,
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<NewPostValues>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  // Reset form if post prop changes (optional, but safe)
  useEffect(() => {
    reset(defaultValues);
  }, [post]);

  // Fetch categories once
  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  // Dynamically fetch subcategories on category change
  const category = watch('category');
  useEffect(() => {
    if (category) {
      dispatch(fetchSubCategories({ categorySlug: category }));
    }
    return () => {
      dispatch(resetSubCategoryState());
    };
  }, [category]);

  // Submit handler
  const onSubmit = async (data: NewPostValues) => {
    const sendable = getChangedProps(defaultValues, data);
    if (isEmpty(sendable)) return;

    const result = await dispatch(
      updatePost({ ...sendable, id: id as string })
    );
    if (updatePost.fulfilled.match(result)) {
      router.push(post.status === 'draft' ? '/me/drafts' : '/me/posts');
    }
  };

  // Watch form for changes
  const watchedValues = watch();
  const isUnchanged = isEmpty(getChangedProps(watchedValues, defaultValues));

  // Handle unsaved changes warning
  useUnsavedChangesWarning(!isUnchanged, () => {
    console.log('User attempted to navigate away');
  });

  if (!user) return redirect('/');
  if (post.author.username !== user.username) return redirect('/');

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
          labelText="Title"
          className="max-h-[150px] !text-2xl"
        />
        <ThumbnailInput postImage={post.thumbnail} id={id} />
        <CustomTextboxInput
          name="summary"
          register={register}
          error={errors.summary}
          labelText="Summary"
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
              notFoundLabel="No category found"
              options={
                categories?.map((el) => ({ label: el.name, value: el.slug })) ||
                []
              }
            />
          </div>
          <div className="flex-1">
            <CustomSelectInput
              disabled={loading || !category || subCategoryLoading}
              control={control}
              error={errors.subCategory}
              register={register}
              name="subCategory"
              labelText="Sub category"
              notFoundLabel="No subcategory found"
              options={
                subcategories?.map((el) => ({
                  label: el.name,
                  value: el.slug,
                })) || []
              }
            />
          </div>
        </div>

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

        <TagInput control={control} error={errors.tags} />
      </div>

      <div className="border-border flex items-center justify-end space-x-2 border-t pt-4">
        <Button
          disabled={isUnchanged}
          type="submit"
          className="cursor-pointer"
          size="sm"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditForm;
