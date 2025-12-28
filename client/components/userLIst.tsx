'use client'
import { SessionUser } from "@/lib/types";

export default function UserList({ users }: { users: SessionUser[] }) {
    return (
        <div>
            <div className="w-full max-w-md mx-auto p-5 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden tracking-tight">
                {/* Header section with online pulse */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Active Now</h3>
                        <p className="text-xs text-indigo-300/60 font-medium uppercase tracking-wider">Live Session</p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">{users.length} Online</span>
                    </div>
                </div>

                {/* User list items */}
                <div className="space-y-4">
                    {users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-white/20">
                            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <p className="text-sm italic font-medium">Waiting for collaborators...</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-500 border border-transparent hover:border-white/10 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        {/* Animated Avatar */}
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-xl group-hover:rotate-3 transition-transform duration-500">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm"></div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors duration-300">
                                            {user.username}
                                        </p>
                                        <p className="text-[10px] text-white/30 font-mono tracking-tighter">
                                            #{user.id.slice(0, 8).toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                {/* Role Badges with Icons */}
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.role === 'editor'
                                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    }`}>
                                    {user.role === 'editor' ? (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                    <span>{user.role}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Face-pile Summary */}
                <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {users.slice(0, 4).map((u, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] text-white font-bold uppercase">
                                {u.username.charAt(0)}
                            </div>
                        ))}
                        {users.length > 4 && (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] text-white/50 font-bold">
                                +{users.length - 4}
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                        Secure Session
                    </p>
                </div>
            </div>
        </div>
    )
}