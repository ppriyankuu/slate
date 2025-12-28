import type WebSocket from "ws";

export type UserRole = 'editor' | 'viewer';

// fixed list of random usernames (because this app is a no-auth platform)
export const USERNAME_POOL = [
    'Aardvark', 'Beaver', 'Cheetah', 'Dolphin', 'Eagle',
    'Falcon', 'Giraffe', 'Hippo', 'Iguana', 'Jaguar',
    'Koala', 'Lemur', 'Meerkat', 'Otter', 'Panda'
];

// what a user looks like (once he joins a session)
export interface SessionUser {
    id: string;
    username: string;
    role: UserRole;
}

// what a session looks like
export interface Session {
    id: string;
    codeContent: string;
    users: Map<string, SessionUser>;
    usedUsernames: Set<string>;
    clients: Map<string, WebSocket>
}

// message types for websocket communication
export type ClientMessage = { type: 'JOIN'; sessionId: string } | { type: 'UPDATE'; code: string };

// all the type of actions the server will be performing
export type ServerMessage =
    | { type: 'INIT'; code: string; username: string; role: UserRole }
    | { type: 'UPDATE'; code: string }
    | { type: 'NOTIFICATION'; message: string }
    | { type: 'USER_LIST'; users: SessionUser[] };