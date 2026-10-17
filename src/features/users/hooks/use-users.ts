import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdminUser, UserListParams } from '@/types/users';
import { getUser, listPermissions, listRoles, listUsers } from '../services/users.service';

export const userKeys = {
  all: ['users'] as const,
  list: (params: UserListParams) => ['users', 'list', params] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
  roles: ['access', 'roles'] as const,
  permissions: ['access', 'permissions'] as const,
};

export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => listUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useUser(id: string) {
  return useQuery({ queryKey: userKeys.detail(id), queryFn: () => getUser(id) });
}

export function useRoles(enabled = true) {
  return useQuery({ queryKey: userKeys.roles, queryFn: listRoles, enabled });
}

export function usePermissionCatalog(enabled = true) {
  return useQuery({
    queryKey: userKeys.permissions,
    queryFn: listPermissions,
    enabled,
    staleTime: Infinity,
  });
}

/** Mutations that change a user: the result replaces the cached detail and lists are refetched. */
export function useUserMutation<TVars>(fn: (vars: TVars) => Promise<AdminUser>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.detail(user.id), user);
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
      void queryClient.invalidateQueries({ queryKey: userKeys.roles });
    },
  });
}
