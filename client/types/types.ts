import { PREFERENCES_THEMES } from '@/validations/profile';

export interface User {
  // id: string;
  fullname: string;
  username: string;
  email: string;

  bio?: string;
  avatar?: string;
  cover_image?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    x?: string;
    threads?: string;
    websites?: string[];
    youtube?: string;
    facebook?: string;
  };

  preferences?: {
    theme: (typeof PREFERENCES_THEMES)[number];
    newsletter: boolean;
    language: string;
  };

  roles: ('user' | 'admin' | 'author')[];

  created_at: Date;
  updated_at: Date;

  login_provider: 'email' | 'google';
}

export type PublicUser = Omit<
  User,
  | 'roles'
  | 'login_provider'
  | 'preferences'
  | 'email'
  | 'updated_at'
  | 'created_at'
> & {
  created_at?: Date;
  updated_at?: Date;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  created_at?: Date;
  updated_at?: Date;
  thumbnail?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  summary: string;
  created_at?: Date;
  updated_at?: Date;
  thumbnail?: string;
  category?: Category;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  summary: string;
  content: string;
  author: PublicUser;
  category: Category;
  tags: Tag[];
  status: PostStatusValues;
  subCategory: SubCategory;
  created_at: Date;
  updated_at: Date;
}

export interface Comment {
  id: string;
  user: {
    fullname: string;
    username: string;
    avatar?: string;
  };
  content: string;
  created_at: Date;
  updated_at?: Date;
  replies: Omit<Comment, 'replies'>[] | [];
}

export type InfoTypeValues =
  | 'warning'
  | 'error'
  | 'success'
  | 'validation_error';

export interface ReduxErrorPayload {
  status: InfoTypeValues;
  message: string;
  error?: any;
}

export interface ReduxSuccessPayload {
  status: InfoTypeValues;
  message: string;
  data?: any;
}

export interface ImageValues {
  public_id: string;
  url: string;
  format: string;
}

export type UserRoleValues = 'admin' | 'author' | 'user';
export type PostStatusValues = 'draft' | 'published';

export interface PostCardValues {
  thumbnail?: string;
  title: string;
  slug: string;
  summary: string;
  created_at: Date;
  author: { username: string; fullname: string; avatar?: string };
  category: { name: string; slug: string };
  subCategory?: { name: string; slug: string };
  reading_time_sec: number;
  tags: { name: string; slug: string }[];
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface MinimalCardProps {
  post: {
    title: string;
    slug: string;
    created_at: Date;
    author: {
      fullname: string;
      username: string;
      avatar?: string;
    };
    thumbnail?: string;
    category: {
      name: string;
      slug: string;
    };
    reading_time_sec: number;
  };
}
