import { apiFetch } from '@/lib/api';
import { toQuery } from '@/lib/utils';
import type {
  AskResult,
  ChatAnswer,
  ChatAnswerInput,
  ChatbotStats,
  MatchTest,
  QuestionRef,
  UnansweredQuestion,
  UnansweredStatus,
} from '@/types/chatbot';

const json = (method: string, body?: unknown) => ({
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});
const authed = (method: string, body?: unknown) => ({ auth: true as const, ...json(method, body) });

/* Public chat */
export const getSuggestions = () =>
  apiFetch<{ suggestions: QuestionRef[] }>('/chatbot/suggestions');
export const askQuestion = (input: { message: string } | { answerId: string }) =>
  apiFetch<AskResult>('/chatbot/ask', json('POST', input));
export const sendFeedback = (id: string, helpful: boolean) =>
  apiFetch<{ id: string }>(`/chatbot/answers/${id}/feedback`, json('POST', { helpful }));

/* Dashboard */
const BASE = '/chatbot/admin';
export const listAnswers = (q?: string) =>
  apiFetch<ChatAnswer[]>(`${BASE}/answers${toQuery({ q })}`, { auth: true });
export const getChatbotStats = () => apiFetch<ChatbotStats>(`${BASE}/stats`, { auth: true });
export const createAnswer = (input: ChatAnswerInput) =>
  apiFetch<ChatAnswer>(`${BASE}/answers`, authed('POST', input));
export const updateAnswer = (id: string, input: Partial<ChatAnswerInput>) =>
  apiFetch<ChatAnswer>(`${BASE}/answers/${id}`, authed('PATCH', input));
export const deleteAnswer = (id: string) =>
  apiFetch<{ id: string }>(`${BASE}/answers/${id}`, authed('DELETE'));
export const listUnanswered = (status: UnansweredStatus) =>
  apiFetch<UnansweredQuestion[]>(`${BASE}/unanswered${toQuery({ status })}`, { auth: true });
export const setUnansweredStatus = (id: string, status: 'open' | 'dismissed') =>
  apiFetch<UnansweredQuestion>(`${BASE}/unanswered/${id}`, authed('PATCH', { status }));
export const testMatch = (message: string) =>
  apiFetch<MatchTest>(`${BASE}/test`, authed('POST', { message }));
