import type { Paginated } from './api';

export type PostStatus = 'draft' | 'published';

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface Category extends CategoryRef {
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoverImage {
  url: string;
  publicId?: string;
  alt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: CoverImage | null;
  status: PostStatus;
  category: CategoryRef | null;
  tags: string[];
  /** Populated author; `_id` because the backend does not reshape the populated user. */
  author: { _id: string; name: string } | null;
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
  featured: boolean;
  readingTime: number;
  publishedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** List responses leave out the heavy `content` field. */
export type PostSummary = Omit<Post, 'content'>;

export type PostListResult = Paginated<PostSummary>;

export interface PostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: CoverImage | null;
  category?: string | null;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string | null;
  featured?: boolean;
}

export interface PostListParams {
  q?: string;
  status?: PostStatus;
  category?: string;
  trash?: boolean;
  sort?: 'newest' | 'oldest' | 'title';
  page: number;
  limit: number;
}

export interface CategoryInput {
  name: string;
  slug?: string;
  description?: string;
}
