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
  /** Tiny inline preview shown blurred while the photo loads. */
  blur?: string;
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
  canonicalUrl: string | null;
  noIndex: boolean;
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
  canonicalUrl?: string | null;
  noIndex?: boolean;
  featured?: boolean;
}

export interface PostListParams {
  q?: string;
  status?: PostStatus | 'scheduled';
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

/** What editors see: a published post with a future date is "scheduled". */
export type DisplayStatus = PostStatus | 'scheduled';

export interface PostStats {
  all: number;
  draft: number;
  published: number;
  scheduled: number;
  trash: number;
}

/** Public category list entry, with its number of live posts. */
export interface CategoryWithCount extends Category {
  postCount: number;
}

export interface TagCount {
  tag: string;
  count: number;
}
