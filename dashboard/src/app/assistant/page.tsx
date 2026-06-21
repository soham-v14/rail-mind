"use client";

import AiChatAssistant from "@/components/AiChatAssistant";

export default function AssistantPage() {
  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 p-2 md:p-4">
        <div className="max-w-3xl mx-auto">
          <AiChatAssistant />
        </div>
      </main>
    </div>
  );
}
