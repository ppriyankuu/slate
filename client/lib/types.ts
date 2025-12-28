export type UserRole = 'editor' | 'viewer';

export interface SessionUser {
    id: string;
    username: string;
    role: UserRole;
}

export type ServerMessage =
    | { type: 'INIT'; code: string; username: string; role: UserRole }
    | { type: 'UPDATE'; code: string }
    | { type: 'NOTIFICATION'; message: string }
    | { type: 'USER_LIST'; users: SessionUser[] };