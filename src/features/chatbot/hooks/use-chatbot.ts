import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ChatAnswerInput, UnansweredStatus } from '@/types/chatbot';
import {
  createAnswer,
  deleteAnswer,
  getChatbotStats,
  listAnswers,
  listUnanswered,
  setUnansweredStatus,
  updateAnswer,
} from '../services/chatbot.service';

export const chatbotKeys = {
  all: ['chatbot'] as const,
  answers: (q: string) => ['chatbot', 'answers', q] as const,
  stats: ['chatbot', 'stats'] as const,
  unanswered: (status: UnansweredStatus) => ['chatbot', 'unanswered', status] as const,
};

export const useChatAnswers = (q: string) =>
  useQuery({ queryKey: chatbotKeys.answers(q), queryFn: () => listAnswers(q || undefined) });
export const useChatbotStats = () =>
  useQuery({ queryKey: chatbotKeys.stats, queryFn: getChatbotStats });
export const useUnanswered = (status: UnansweredStatus) =>
  useQuery({ queryKey: chatbotKeys.unanswered(status), queryFn: () => listUnanswered(status) });

/** Any change can move counts and lists, so everything chatbot-related is refreshed. */
function useChatbotMutation<TVars, TResult>(fn: (vars: TVars) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chatbotKeys.all }),
  });
}

export const useCreateAnswer = () => useChatbotMutation(createAnswer);
export const useUpdateAnswer = () =>
  useChatbotMutation(({ id, ...input }: { id: string } & Partial<ChatAnswerInput>) =>
    updateAnswer(id, input),
  );
export const useDeleteAnswer = () => useChatbotMutation(deleteAnswer);
export const useSetUnansweredStatus = () =>
  useChatbotMutation(({ id, status }: { id: string; status: 'open' | 'dismissed' }) =>
    setUnansweredStatus(id, status),
  );
