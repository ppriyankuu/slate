import WebSocket, { WebSocketServer } from "ws";
import {
    addUserToSession,
    updateSessionCode,
    getSessionCode,
    getSessionUsers,
    removeUserFromSession,
    getOrCreateSession
} from "./sessions";
import { ClientMessage, ServerMessage } from "./types";

// track socket ==>> session & user
const socketMeta = new Map<
    WebSocket,
    { sessionId: string; userId: string }
>();

const wss = new WebSocketServer({ port: 8080 });

// seting up the connection
//provides a socket object which is my direct way of communication to the specific user
wss.on("connection", (socket: WebSocket) => {
    console.log("client connected");

    // this handles incomming message and this is where the actual collaboration happens.
    socket.on("message", (data) => {
        console.log("message from client")

        let message: ClientMessage;
        try {
            message = JSON.parse(data.toString());
        } catch {
            return;
        }

        // JOIN logic
        if (message.type === "JOIN") {
            const sessionId = message.sessionId;
            const userId = crypto.randomUUID();

            socketMeta.set(socket, { sessionId, userId });

            //main part
            const user = addUserToSession(sessionId, userId);
            const session = getOrCreateSession(sessionId);

            session.clients.set(user.id, socket)

            const initMessage: ServerMessage = {
                type: 'INIT',
                username: user.username,
                role: user.role,
                code: getSessionCode(sessionId),
            };
            socket.send(JSON.stringify(initMessage));

            // NOTIFICATION to others
            broadcast(sessionId, {
                type: "NOTIFICATION",
                message: `${user.username} joined the session`,
            }, user.id);

            // USER LIST to all
            broadcast(sessionId, { type: "USER_LIST", users: getSessionUsers(sessionId) });

            return;
        }

        // UPDATE logic
        if (message.type === "UPDATE") {
            const meta = socketMeta.get(socket);
            if (!meta) return;

            const { sessionId, userId } = meta;
            const session = getOrCreateSession(sessionId);

            const user = session.users.get(userId);
            if (!user || user.role !== 'editor') return; // viewers can't edit

            updateSessionCode(sessionId, message.code);

            // live code change shown to all
            broadcast(sessionId, { type: "UPDATE", code: message.code }, userId)

            return;
        }
    });

    socket.on("close", () => {
        const meta = socketMeta.get(socket);
        if (!meta) return;

        const { sessionId, userId } = meta;
        const result = removeUserFromSession(sessionId, userId);

        socketMeta.delete(socket);

        if (!result) return;

        broadcast(sessionId, {
            type: "NOTIFICATION",
            message: `${result.username} left the session`
        });

        broadcast(sessionId, {
            type: "USER_LIST",
            users: getSessionUsers(sessionId),
        });

        console.log("client disconnected");
    });
});

function broadcast(
    sessionId: string,
    message: ServerMessage,
    excludeUserId?: string
) {
    const session = getOrCreateSession(sessionId);

    session.clients.forEach((client, uid) => {
        if (uid === excludeUserId) return;
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
