import { SessionUser } from "@/lib/types";

export function UserList({ users }: { users: SessionUser[] }) {
    return (
        <aside className="h-full">
            <div className="h-full bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900">
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white">
                            Active Users
                        </h3>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                            Live Session
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-emerald-900/40 px-2.5 py-1 rounded-full">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400">
                            {users.length}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-600 text-sm">
                            Waiting for collaborators…
                        </div>
                    ) : (
                        users.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-3 p-3 rounded-md bg-neutral-800/60 hover:bg-neutral-800 transition sm:hover:-translate-y-[1px]"
                            >
                                {/* User */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative shrink-0">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-neutral-700 flex items-center justify-center font-bold text-sm text-white">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-neutral-900 rounded-full" />
                                    </div>

                                    <p className="text-sm font-medium text-white truncate">
                                        {user.username}
                                    </p>
                                </div>

                                {/* Role */}
                                <span
                                    className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase
                                    ${user.role === "editor"
                                            ? "bg-amber-900/40 text-amber-400"
                                            : "bg-blue-900/40 text-blue-400"
                                        }`}
                                >
                                    {user.role}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-neutral-800 text-[10px] text-neutral-500 flex justify-between">
                    <span>Secure Session</span>
                    <span>{users.filter(u => u.role === "editor").length}/2 Editors</span>
                </div>
            </div>
        </aside>
    );
}


