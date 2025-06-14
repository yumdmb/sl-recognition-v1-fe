'use client';

import { Suspense } from 'react';
import ChatLayout from '@/components/chat/ChatLayout';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ChatLayout />
    </Suspense>
  );
}
