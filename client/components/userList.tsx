import { SessionUser } from '@/lib/types';

const COLORS = [
    'bg-emerald-500',
    'bg-sky-500',
    'bg-violet-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-cyan-500',
    'bg-lime-500',
    'bg-fuchsia-500',
];

export function UserList({ users }: { users: SessionUser[] }) {
    return (
        <div className="bg-neutral-800 p-3 rounded-md">
            <h3 className="text-sm font-medium text-neutral-300 mb-2">
                Users ({users.length})
            </h3>

            <ul className="space-y-1">
                {users.map((user, index) => {
                    const color = COLORS[index % COLORS.length];

                    return (
                        <li
                            key={user.username}
                            className="flex items-center gap-2"
                        >
                            <span
                                className={`w-2 h-2 rounded-full ${color}`}
                            />
                            <span className="text-sm text-neutral-100">
                                {user.username}
                            </span>
                            <span className="text-xs text-neutral-400">
                                ({user.role})
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

