'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// The chat window is downloaded the first time someone opens it (or hovers the button), so it
// adds nothing to page load for visitors who never use it.
const loadPanel = () => import('./chat-panel').then((m) => m.ChatPanel);
const ChatPanel = dynamic(loadPanel, { ssr: false });

/** The round chat button in the corner of every public page, and the chat window it opens. */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  // Kept mounted once opened, so closing and reopening keeps the conversation and scroll.
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    setMounted(true);
    setOpen((o) => !o);
  };
  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      {mounted && <ChatPanel open={open} onClose={close} />}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        onPointerEnter={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Questions? Chat with us'}
        title={open ? 'Close chat' : 'Questions? Chat with us'}
        className={cn(
          'shadow-glow text-fg-inverse fixed right-5 bottom-5 z-(--z-drawer) size-14 items-center justify-center rounded-full bg-(image:--gradient-brand) transition-transform duration-200 hover:scale-105 active:scale-95',
          'mb-[env(safe-area-inset-bottom)]',
          // On phones the open chat fills the screen and has its own close button.
          open ? 'hidden sm:inline-flex' : 'inline-flex',
        )}
      >
        {open ? <X size={24} aria-hidden /> : <MessageCircle size={26} aria-hidden />}
      </button>
    </>
  );
}
