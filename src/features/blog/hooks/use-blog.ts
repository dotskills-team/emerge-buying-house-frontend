import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PostListParams } from '@/types/blog';
import {
  createCategory,
  deleteCategory,
  getPost,
  listCategories,
  listPosts,
  publishPost,
  purgePost,
  restorePost,
  trashPost,
  unpublishPost,
  updateCategory,
} from '../services/blog.service';

export const blogKeys = {
  posts: ['blog', 'posts'] as const,
  list: (params: PostListParams) => ['blog', 'posts', 'list', params] as const,
  categories: ['blog', 'categories'] as const,
};

export const postKey = (id: string) => ['blog', 'post', id] as const;

export function usePost(id: string) {
  return useQuery({ queryKey: postKey(id), queryFn: () => getPost(id) });
}

export function usePosts(params: PostListParams) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => listPosts(params),
    placeholderData: keepPreviousData,
  });
}

function usePostMutation<TVars>(fn: (vars: TVars) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.posts }),
  });
}

export const usePublishPost = () => usePostMutation(publishPost);
export const useUnpublishPost = () => usePostMutation(unpublishPost);
export const useTrashPost = () => usePostMutation(trashPost);
export const useRestorePost = () => usePostMutation(restorePost);
export const usePurgePost = () => usePostMutation(purgePost);

export function useCategories() {
  return useQuery({ queryKey: blogKeys.categories, queryFn: listCategories });
}

function useCategoryMutation<TVars>(fn: (vars: TVars) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.categories }),
  });
}

export const useCreateCategory = () => useCategoryMutation(createCategory);
export const useUpdateCategory = () =>
  useCategoryMutation(({ id, name }: { id: string; name: string }) => updateCategory(id, { name }));
export const useDeleteCategory = () => useCategoryMutation(deleteCategory);
