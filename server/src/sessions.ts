import { Session, SessionUser, USERNAME_POOL, UserRole } from "./types";

// in-memory variable to store all the active sessions going on
// sessionId ===>>> Session (key value pair)
const sessions = new Map<string, Session>();

export function getOrCreateSession(sessionId: string): Session {
    // if session doesn't exist; create one
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
            id: sessionId,
            codeContent: '// Start coding together!',
            users: new Map(),
            usedUsernames: new Set(),
            clients:new Map(), //Server should know where to send the update code
        });
    }

    return sessions.get(sessionId)!;
}

export function addUserToSession(sessionId: string, userId: string): SessionUser {
    const session = getOrCreateSession(sessionId);

    // converting the map into an array
    const usersInTheSession = Array.from(session.users.values())

    const numberOfEditors = usersInTheSession.filter(user => user.role === 'editor').length;

    // determining the role for the new user
    // only 2 editors will be there per session (it's a pair programming application after all :)
    const newUserRole: UserRole = numberOfEditors < 2 ? 'editor' : 'viewer';

    // assigning username to the new user
    const username = generateUniqueUsername(session.usedUsernames);
    session.usedUsernames.add(username); // need to update the usedUsername after changes

    const user: SessionUser = { id: userId, username, role: newUserRole };
    session.users.set(userId, user);

    return user;
}

export function removeUserFromSession(sessionId: string, userId: string): { username: string, usersLeft: number } | null {
    const session = sessions.get(sessionId);
    if (!session) return null;

    const user = session.users.get(userId);
    if (!user) return null;

    session.users.delete(userId);
    session.usedUsernames.delete(user.username);
    session.clients.delete(userId) // delete the client also

    if (session.users.size === 0) {
        sessions.delete(sessionId);
        return { username: user.username, usersLeft: 0 };
    }

    return { username: user.username, usersLeft: session.users.size };
}

export function updateSessionCode(sessionId: string, newCode: string): void {
    const session = sessions.get(sessionId);
    if (session) {
        session.codeContent = newCode;
    }
}

export function getSessionCode(sessionId: string): string {
    return sessions.get(sessionId)?.codeContent || '';
}

export function getSessionUsers(sessionId: string): SessionUser[] {
    const session = sessions.get(sessionId);
    return session ? Array.from(session.users.values()) : [];
}

// generates random unique username within session. 
// every user should have a unique username at least within a session
function generateUniqueUsername(usedUsernames: Set<string>): string {
    const available = USERNAME_POOL.filter(name => !usedUsernames.has(name));
    const random = available[Math.random() * available.length];
    return random;
}