import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Inquiry, InquiryListParams, InquiryStatus } from '@/types/inquiry';
import {
  deleteInquiry,
  getInquiry,
  getInquiryStats,
  listInquiries,
  openInquiry,
  replyToInquiry,
  updateInquiry,
} from '../services/inquiries.service';

export const inquiryKeys = {
  all: ['inquiries'] as const,
  list: (params: InquiryListParams) => ['inquiries', 'list', params] as const,
  stats: ['inquiries', 'stats'] as const,
  detail: (id: string) => ['inquiries', 'detail', id] as const,
};

export function useInquiries(params: InquiryListParams) {
  return useQuery({
    queryKey: inquiryKeys.list(params),
    queryFn: () => listInquiries(params),
    placeholderData: keepPreviousData,
  });
}

/** Counts per status. Refreshed every minute so the sidebar badge picks up new messages. */
export function useInquiryStats(enabled = true) {
  return useQuery({
    queryKey: inquiryKeys.stats,
    queryFn: getInquiryStats,
    enabled,
    refetchInterval: 60_000,
  });
}

export function useInquiry(id: string) {
  return useQuery({ queryKey: inquiryKeys.detail(id), queryFn: () => getInquiry(id) });
}

/** Every change returns the updated inquiry: store it, then refresh lists and counts. */
function useInquiryMutation<TVars>(fn: (vars: TVars) => Promise<Inquiry>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: async (inquiry) => {
      queryClient.setQueryData(inquiryKeys.detail(inquiry.id), inquiry);
      await queryClient.invalidateQueries({ queryKey: ['inquiries', 'list'] });
      await queryClient.invalidateQueries({ queryKey: inquiryKeys.stats });
    },
  });
}

export const useOpenInquiry = () => useInquiryMutation(openInquiry);
export const useUpdateInquiry = () =>
  useInquiryMutation(({ id, ...input }: { id: string; status?: InquiryStatus; note?: string }) =>
    updateInquiry(id, input),
  );
export const useReplyToInquiry = () =>
  useInquiryMutation(({ id, message }: { id: string; message: string }) =>
    replyToInquiry(id, message),
  );

export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInquiry,
    onSuccess: async ({ id }) => {
      queryClient.removeQueries({ queryKey: inquiryKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: ['inquiries', 'list'] });
      await queryClient.invalidateQueries({ queryKey: inquiryKeys.stats });
    },
  });
}
