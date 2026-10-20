import { apiFetch } from '@/lib/api';
import { toQuery } from '@/lib/utils';
import type {
  ContactInput,
  ContactResult,
  Inquiry,
  InquiryListParams,
  InquiryListResult,
  InquiryStats,
  InquiryStatus,
} from '@/types/inquiry';

const send = (method: string, body?: unknown) => ({
  auth: true as const,
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

/* Public */
export const submitContact = (input: ContactInput) =>
  apiFetch<ContactResult>('/contact', { method: 'POST', body: JSON.stringify(input) });

/* Dashboard */
export const listInquiries = (params: InquiryListParams) =>
  apiFetch<InquiryListResult>(`/inquiries${toQuery({ ...params })}`, { auth: true });
export const getInquiryStats = () => apiFetch<InquiryStats>('/inquiries/stats', { auth: true });
export const getInquiry = (id: string) => apiFetch<Inquiry>(`/inquiries/${id}`, { auth: true });
export const openInquiry = (id: string) => apiFetch<Inquiry>(`/inquiries/${id}/open`, send('POST'));
export const updateInquiry = (id: string, input: { status?: InquiryStatus; note?: string }) =>
  apiFetch<Inquiry>(`/inquiries/${id}`, send('PATCH', input));
export const replyToInquiry = (id: string, message: string) =>
  apiFetch<Inquiry>(`/inquiries/${id}/reply`, send('POST', { message }));
export const deleteInquiry = (id: string) =>
  apiFetch<{ id: string }>(`/inquiries/${id}`, send('DELETE'));
