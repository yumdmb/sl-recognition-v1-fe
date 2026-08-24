'use client';

import { Suspense } from 'react';
import ChatLayout from '@/components/chat/ChatLayout';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100dvh-8rem)] min-h-[540px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    }>
      <ChatLayout />
    </Suspense>
  );
}
