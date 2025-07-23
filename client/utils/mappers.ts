import {
  Category,
  Post,
  PostCardValues,
  PublicUser,
  SubCategory,
  Tag,
} from '@/types/types';

export function mapPost(apiPost: any): Post {
  return {
    id: apiPost._id,
    title: apiPost.title,
    slug: apiPost.slug,
    summary: apiPost.summary,
    content: apiPost.content,
    thumbnail: apiPost.thumbnail?.url ?? undefined,
    created_at: new Date(apiPost.created_at),
    updated_at: new Date(apiPost.updated_at),
    author: mapPublicUser(apiPost.author),
    category: mapCategory(apiPost.category),
    tags: apiPost.tags.map(mapTag),
    status: apiPost.status,
    subCategory: apiPost.subCategory && mapSubCategory(apiPost.subCategory),
  };
}

export function mapPublicUser(user: any): PublicUser {
  return {
    fullname: user.fullname,
    username: user.username,
    avatar: user.avatar?.url ?? undefined,
    created_at: user.created_at ? new Date(user.created_at) : undefined,
    updated_at: user.updated_at ? new Date(user.updated_at) : undefined,
  };
}
function mapCategory(cat: any): Category {
  return {
    id: cat._id,
    name: cat.name,
    slug: cat.slug,
    summary: cat.summary ?? '',
    created_at: new Date(cat.created_at),
    updated_at: new Date(cat.updated_at),
    thumbnail: cat.thumbnail?.url,
  };
}

function mapTag(tag: any): Tag {
  return {
    id: tag._id,
    name: tag.name,
    slug: tag.slug,
    summary: tag.summary ?? '',
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
  };
}

function mapSubCategory(sub: any): SubCategory {
  return {
    id: sub._id,
    name: sub.name,
    slug: sub.slug,
    summary: sub.summary ?? '',
    created_at: new Date(sub.created_at),
    updated_at: new Date(sub.updated_at),
    thumbnail: sub.thumbnail?.url,
    category: mapCategory(sub.category),
  };
}

type RawPost = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail?: string;
  created_at: string;
  author: {
    username: string;
    fullname: string;
    avatar?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  subCategory?: {
    name: string;
    slug: string;
  };
  reading_time_sec: number;
  tags: {
    name: string;
    slug: string;
  }[];
};

export const mapCardPost = (post: RawPost): PostCardValues => {
  return {
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    thumbnail: post.thumbnail,
    created_at: new Date(post.created_at),
    author: {
      username: post.author.username,
      fullname: post.author.fullname,
      avatar: post.author.avatar,
    },
    category: {
      name: post.category.name,
      slug: post.category.slug,
    },
    subCategory: post.subCategory
      ? {
          name: post.subCategory.name,
          slug: post.subCategory.slug,
        }
      : undefined,
    reading_time_sec: post.reading_time_sec,
    tags: post.tags.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
  };
};
