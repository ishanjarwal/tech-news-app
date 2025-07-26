import z from 'zod';

export const commentSchema = z.object({
  content: z
    .string({
      required_error: 'cannot be empty',
      invalid_type_error: 'Invalid comment',
    })
    .min(1, 'Required')
    .max(150, { message: 'Too big' }),
});
export type CommentValues = z.infer<typeof commentSchema>;
