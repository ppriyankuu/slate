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
export type ClientMessage = { type: 'join'; sessionCode: string } | { type: 'update'; code: string };

// all the type of actions the server will be performing
export type ServerMessage =
    | { type: 'init'; code: string; username: string; role: UserRole }
    | { type: 'update'; code: string }
    | { type: 'notification'; message: string }
    | { type: 'userList'; users: SessionUser[] };