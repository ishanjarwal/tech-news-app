import { z } from 'zod';
import localeCodes from 'locale-codes';

export const PREFERENCES_THEMES = ['light', 'dark', 'system'] as const;

const socialLink = (name: string) =>
  z
    .union([
      z
        .string()
        .trim()
        .max(100, `${name} must be at most 100 characters`)
        .url({ message: `${name} must be a valid URL` }),
      z.literal(''),
      z.undefined(),
    ])
    .transform((val) => (val === '' ? undefined : val));

/* -------------------- Basic Details -------------------- */
export const BasicDetailsSchema = z.object({
  username: z
    .string()
    .max(50, 'Max length is 50 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username must be alphanumeric and can contain underscores only'
    )
    .optional(),

  fullname: z
    .string()
    .max(100, 'Full name must be at most 100 characters')
    .regex(
      /^[\p{L}]+(?:\s[\p{L}]+){0,2}$/u,
      'Full name must contain only letters and at most two words (separated by spaces)'
    )
    .optional(),

  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
});

export type BasicDetailsValues = z.infer<typeof BasicDetailsSchema>;

/* -------------------- Social Links -------------------- */
export const SocialLinksSchema = z.object({
  github: socialLink('GitHub').optional(),
  linkedin: socialLink('LinkedIn').optional(),
  instagram: socialLink('Instagram').optional(),
  x: socialLink('X').optional(),
  threads: socialLink('Threads').optional(),
  youtube: socialLink('YouTube').optional(),
  facebook: socialLink('Facebook').optional(),

  websites: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, 'Website URL cannot be empty')
          .max(100, 'Website URL must be at most 100 characters'),
      })
    )
    .max(3, 'You can add at most 3 websites')
    .optional(),
});

export type SocialLinksValues = z.infer<typeof SocialLinksSchema>;

/* -------------------- Preferences -------------------- */
export const PreferencesSchema = z.object({
  theme: z
    .enum(PREFERENCES_THEMES, {
      errorMap: () => ({ message: 'Invalid theme value' }),
    })
    .optional(),

  language: z
    .string()
    .refine((language) => !!localeCodes.getByTag(language), {
      message: 'Invalid language code',
    })
    .optional(),

  newsletter: z.union([z.literal(true), z.literal(false)]).optional(),
});

export type PreferencesValues = z.infer<typeof PreferencesSchema>;

export interface UpdateUserValues
  extends BasicDetailsValues,
    SocialLinksValues,
    PreferencesValues {}
