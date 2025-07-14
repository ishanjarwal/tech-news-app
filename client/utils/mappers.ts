import { Category, Post, PublicUser, SubCategory, Tag } from '@/types/types';

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
