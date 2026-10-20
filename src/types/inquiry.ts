import type { Paginated } from './api';

// Mirrors the backend contract in emerge-buying-house-backend/src/modules/inquiries.
export const INQUIRY_TOPICS = ['quote', 'partnership', 'audit', 'careers', 'other'] as const;
export type InquiryTopic = (typeof INQUIRY_TOPICS)[number];

export const TOPIC_LABELS: Record<InquiryTopic, string> = {
  quote: 'Request a quote',
  partnership: 'Partnership',
  audit: 'Factory audit',
  careers: 'Careers',
  other: 'Other',
};

export const INQUIRY_STATUSES = ['new', 'open', 'replied', 'closed'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export type DeliveryState = 'sent' | 'failed' | 'skipped';

export interface InquiryReply {
  message: string;
  sentAt: string;
  sentBy: { id: string; name: string } | null;
}

export interface InquirySummary {
  id: string;
  reference: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  topic: InquiryTopic;
  product: string;
  message: string;
  status: InquiryStatus;
  notifications: { team: DeliveryState; visitor: DeliveryState };
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry extends InquirySummary {
  note: string;
  replies: InquiryReply[];
}

export type InquiryListResult = Paginated<InquirySummary>;

export interface InquiryListParams {
  q?: string;
  status?: InquiryStatus;
  topic?: InquiryTopic;
  page: number;
  limit: number;
}

export type InquiryStats = Record<InquiryStatus | 'all', number>;

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  topic: InquiryTopic;
  product: string;
  message: string;
  /** Honeypot: always empty for people. */
  website: string;
}

export interface ContactResult {
  reference: string;
  /** Whether the confirmation email reached the visitor's address. */
  confirmationSent: boolean;
}
