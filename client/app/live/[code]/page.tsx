'use client'

import { CodeEditor } from "@/components/codeEditor";
import { Notification } from "@/components/notification";
import { UserList } from "@/components/userList";
import { ClientMessage, ServerMessage, SessionUser } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SessionPage() {
    const params = useParams();
    const router = useRouter();
    const sessionCode = params.code as string;

    const [code, setCode] = useState('// Start coding together!');
    const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
    const [users, setUsers] = useState<SessionUser[]>([]);
    const [notifications, setNotifications] = useState<string[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!sessionCode) return;

        const ws = new WebSocket("ws://localhost:8080");
        wsRef.current = ws;

        ws.onopen = () => {
            const joinMessage: ClientMessage = {
                type: 'JOIN',
                sessionId: sessionCode,
            };

            ws.send(JSON.stringify(joinMessage));
        };

        ws.onmessage = (event) => {
            let message: ServerMessage;
            try {
                message = JSON.parse(event.data) as ServerMessage;
            } catch {
                console.error("Invalid JSON from server");
                return;
            }

            switch (message.type) {
                case "INIT": {
                    setCurrentUser({
                        username: message.username,
                        role: message.role,
                    });
                    setCode(message.code);
                    break;
                }
                case "UPDATE": {
                    setCode(message.code);
                    break;
                }
                case "NOTIFICATION": {
                    setNotifications(prev => [...prev, message.message]);
                    break;
                }
                case "USER_LIST": {
                    setUsers(message.users);

                    setCurrentUser(prev => {
                        if (!prev) return null;

                        const updatedSelf = message.users.find(
                            u => u.username === prev.username
                        );

                        return updatedSelf
                            ? { ...prev, role: updatedSelf.role }
                            : prev;
                    });

                    break;
                }
                default: {
                }
            }
        };

        ws.onerror = () => {
            console.warn("WebSocket error event (browser gives no details)");
        };

        ws.onclose = (event) => {
            console.log("WS closed", event.code, event.reason);

            if (currentUser) {
                setNotifications(prev => [...prev, "Disconnected from session"]);
            }
        };

        return () => {
            ws.close();
            wsRef.current = null;
        };
    }, [sessionCode]);

    // for auto-clearing notification
    useEffect(() => {
        if (notifications.length === 0) return;

        const timer = setTimeout(() => {
            setNotifications(prev => prev.slice(1));
        }, 2500);

        return () => clearTimeout(timer);
    }, [notifications]);

    const handleCodeChange = (newCode: string) => {
        if (currentUser?.role !== "editor") return;

        setCode(newCode);

        const updateMessage: ClientMessage = {
            type: 'UPDATE',
            code: newCode,
        }

        wsRef.current?.send(JSON.stringify(updateMessage));
    }

    const copyToClipboard = (message: string) => {
        navigator.clipboard.writeText(message);
        setNotifications(prev => [...prev, 'Code copied to clipboard!']);
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <p className="text-neutral-400">Joining session...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4">
            <Notification
                message={notifications[0]}
                onClose={() => setNotifications(prev => prev.slice(1))} />
            <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <h1 className="text-lg sm:text-xl font-bold break-all">
                        Session: {sessionCode}
                    </h1>

                    <button
                        onClick={() => copyToClipboard(sessionCode)}
                        className="w-fit text-sm bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 rounded"
                    >
                        Copy Session Code
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end">
                    <span className="text-sm bg-emerald-900 px-3 py-1.5 rounded truncate max-w-full">
                        You: {currentUser.username} ({currentUser.role})
                    </span>

                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-neutral-400 hover:text-white px-2 py-1"
                    >
                        Leave
                    </button>
                </div>
            </header>


            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
                        <div className="flex justify-between items-center p-3 bg-neutral-800">
                            <span className="text-sm text-neutral-400">Code</span>
                            <button
                                onClick={() => copyToClipboard(code)}
                                className="cursor-pointer text-sm bg-neutral-700 hover:bg-neutral-600 px-2 py-1 rounded"
                            >
                                Copy Code
                            </button>
                        </div>

                        <CodeEditor
                            value={code}
                            onChange={handleCodeChange}
                            readOnly={currentUser.role === 'viewer'}
                        />
                    </div>
                </div>

                <div>
                    <UserList users={users} />
                </div>
            </div>
        </div>
    )
}