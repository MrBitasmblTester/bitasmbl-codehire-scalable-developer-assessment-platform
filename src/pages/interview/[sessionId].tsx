// pages/interview/[sessionId].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { VideoCall } from "@/components/VideoCall";
import { ChatSidebar } from "@/components/ChatSidebar";
import { LoadingOverlay } from "@/components/LoadingOverlay";

const MonacoEditor = dynamic(() => import("@/components/MonacoEditor"), {
  ssr: false,
});

export default function InterviewSessionPage() {
  const { sessionId } = useRouter().query;
  const [loaded, setLoaded] = useState(false);

  const {
    code,
    updateCode,
    interviewee,
    interviewer,
    isConnected,
    sendMessage,
    messages,
  } = useInterviewSession(sessionId as string);

  useEffect(() => {
    if (sessionId) setLoaded(true);
  }, [sessionId]);

  if (!loaded) return <LoadingOverlay />;

  return (
    <>
      <Head>
        <title>Live Interview – {sessionId}</title>
      </Head>

      <div className="flex h-screen overflow-hidden bg-[#111] text-white">
        {/* Video & Chat */}
        <div className="w-1/3 border-r border-gray-800 flex flex-col">
          <VideoCall sessionId={sessionId as string} />
          <ChatSidebar
            messages={messages}
            onSend={sendMessage}
            participants={{ interviewer, interviewee }}
          />
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative">
          <div className="absolute top-0 left-0 right-0 p-4 bg-[#1a1a1a] border-b border-gray-700 z-10">
            <h2 className="text-lg font-semibold">Live Code Collaboration</h2>
            <p className="text-sm text-gray-400">Session: {sessionId}</p>
          </div>

          <div className="pt-16 h-full">
            <MonacoEditor
              code={code}
              onChange={updateCode}
              readOnly={!isConnected}
            />
          </div>
        </div>
      </div>
    </>
  );
}
