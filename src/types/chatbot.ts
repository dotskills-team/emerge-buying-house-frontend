// Mirrors the backend contract in emerge-buying-house-backend/src/modules/chatbot.
export interface QuestionRef {
  id: string;
  question: string;
}

export type AskResult =
  | { found: true; answer: QuestionRef & { answer: string }; related: QuestionRef[] }
  | { found: false; suggestions: QuestionRef[] };

export interface ChatAnswer {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  published: boolean;
  sortOrder: number;
  hits: number;
  helpful: number;
  notHelpful: number;
  updatedBy: { _id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatAnswerInput {
  question: string;
  answer: string;
  keywords: string[];
  published: boolean;
  sortOrder: number;
  /** The unanswered question this answer is written for. */
  fromUnanswered?: string;
}

export type UnansweredStatus = 'open' | 'resolved' | 'dismissed';

export interface UnansweredQuestion {
  id: string;
  text: string;
  count: number;
  lastAskedAt: string;
  status: UnansweredStatus;
}

export interface ChatbotStats {
  published: number;
  drafts: number;
  /** Times an answer was given. */
  answered: number;
  /** Times a question had no answer. */
  missed: number;
  openQuestions: number;
  helpful: number;
  notHelpful: number;
}

export interface MatchTest {
  best: (QuestionRef & { score: number }) | null;
  suggestions: QuestionRef[];
}
