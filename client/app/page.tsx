'use client'

import { generateSessionId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState("");

  const createSession = () => {
    const uniqueId = generateSessionId();
    router.push(`/live/${uniqueId}`);
  };

  const joinSession = () => {
    if (!sessionCode.trim()) return;
    router.push(`/live/${sessionCode.trim()}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6">Slate🎴</h1>

        <p className="text-neutral-400 mb-8">
          Create a document or join an existing session to {' '}
          <br className="hidden md:block" />
          pair program live.
        </p>

        {/* Create session */}
        <button
          onClick={createSession}
          className="w-full px-6 py-3 mb-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md transition"
        >
          Create Session
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Join session */}
        <input
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
          placeholder="Enter session code"
          className="w-full mb-3 px-4 py-3 rounded-md bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />

        <button
          onClick={joinSession}
          className="w-full px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-md transition"
        >
          Join Session
        </button>
      </div>
    </div>
  );
}

