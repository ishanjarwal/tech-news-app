import { z } from 'zod';


const isValidHTML = (value: string): boolean => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, 'text/html');
    // Check for parsing errors
    const hasParseError = doc.querySelector('parsererror');
    return !hasParseError;
  } catch {
    return false;
  }
};

export const NewPostSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Invalid title',
    })
    .min(25, { message: 'Title too short' })
    .max(150, { message: 'Title too big' }),

  summary: z
    .string({
      required_error: 'Summary is required',
      invalid_type_error: 'Invalid summary',
    })
    .min(75, { message: 'Summary too short' })
    .max(300, { message: 'Summary too big' }),

  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Invalid content format',
    })
    .min(100, { message: 'Content too short' })
    .max(20000, { message: 'Content too big' })
   .refine(isValidHTML, { message: 'Invalid content format' }),

  tags: z
    .array(
      z.object({
        value: z.string({
          required_error: 'Tag value must be a string',
        }),
      })
    )
    .min(5, { message: 'Minimum 5 tags are required' })
    .max(20, { message: 'Maximum 20 tags are allowed' }),

  category: z
    .string({
      required_error: 'Category is required',
      invalid_type_error: 'Invalid category',
    }),

  subCategory: z
    .string({ invalid_type_error: 'Invalid subcategory' })
    .optional(),

  status: z
    .enum(['published', 'draft'], {
      invalid_type_error: 'Invalid status',
    })
    .optional(),
});

export type NewPostValues = z.infer<typeof NewPostSchema>;
