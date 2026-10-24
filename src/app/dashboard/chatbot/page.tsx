import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { ChatbotPage } from '@/features/chatbot/components/chatbot-page';

export const metadata: Metadata = { title: 'Chatbot' };

export default function Page() {
  return (
    <RequirePermission any={['chatbot.manage']}>
      <ChatbotPage />
    </RequirePermission>
  );
}
