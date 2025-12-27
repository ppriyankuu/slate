export type UserRole = 'editor' | 'viewer';

export interface SessionUser {
    id: string;
    username: string;
    role: UserRole;
}

export type ServerMessage =
    | { type: 'init'; code: string; username: string; role: UserRole }
    | { type: 'update'; code: string }
    | { type: 'notification'; message: string }
    | { type: 'userList'; users: SessionUser[] };