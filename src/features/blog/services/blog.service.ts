import { apiFetch } from '@/lib/api';
import { toQuery } from '@/lib/utils';
import type {
  Category,
  CategoryInput,
  Post,
  PostInput,
  PostListParams,
  PostListResult,
} from '@/types/blog';

const BASE = '/blog/admin';

const send = (method: string, body?: unknown) => ({
  auth: true as const,
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

/* Posts */
export const listPosts = (params: PostListParams) =>
  apiFetch<PostListResult>(`${BASE}/posts${toQuery({ ...params })}`, { auth: true });

export const getPost = (id: string) => apiFetch<Post>(`${BASE}/posts/${id}`, { auth: true });

export const createPost = (input: PostInput) =>
  apiFetch<Post>(`${BASE}/posts`, send('POST', input));

export const updatePost = (id: string, input: Partial<PostInput>) =>
  apiFetch<Post>(`${BASE}/posts/${id}`, send('PATCH', input));

export const publishPost = (id: string) =>
  apiFetch<Post>(`${BASE}/posts/${id}/publish`, send('POST'));
export const unpublishPost = (id: string) =>
  apiFetch<Post>(`${BASE}/posts/${id}/unpublish`, send('POST'));
export const trashPost = (id: string) =>
  apiFetch<{ id: string }>(`${BASE}/posts/${id}`, send('DELETE'));
export const restorePost = (id: string) =>
  apiFetch<Post>(`${BASE}/posts/${id}/restore`, send('POST'));
export const purgePost = (id: string) =>
  apiFetch<{ id: string }>(`${BASE}/posts/${id}/permanent`, send('DELETE'));

/* Categories */
export const listCategories = () => apiFetch<Category[]>(`${BASE}/categories`, { auth: true });
export const createCategory = (input: CategoryInput) =>
  apiFetch<Category>(`${BASE}/categories`, send('POST', input));
export const updateCategory = (id: string, input: Partial<CategoryInput>) =>
  apiFetch<Category>(`${BASE}/categories/${id}`, send('PATCH', input));
export const deleteCategory = (id: string) =>
  apiFetch<{ id: string }>(`${BASE}/categories/${id}`, send('DELETE'));
