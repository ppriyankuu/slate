'use client'

import { generateSessionId } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const createSession = () => {
    const uniqueId = generateSessionId();
    router.push(`/live/${uniqueId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">Slate🎴</h1>
        <p className="text-neutral-400 mb-8">
          Create a document and share the code with a teammate. Pair program together.
        </p>
        <button
          onClick={createSession}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md transition"
        >
          Create Session
        </button>
      </div>
    </div>
  )
}
