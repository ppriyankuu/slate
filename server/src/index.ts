import WebSocket, { WebSocketServer } from "ws";
import { addUserToSession, updateSessionCode, getSessionCode, getSessionUsers, removeUserFromSession, getOrCreateSession } from "./sessions";

//for the close socket
const socketMeta = new Map<
    WebSocket,
    { sessionId: string; userId: string }
>();

//initializing the webSocketserver 
const wss = new WebSocketServer({ port: 8080 });

// seting up the connection
//provides a socket object which is my direct way of communication to the specific user
wss.on("connection", (socket, req) => {
    console.log("client connected");

    //this handle incomming message and this is where the actual collaboration happens.
    socket.on("message", (data) => {
        console.log("message from client")
        const message = JSON.parse(data.toString())

        //join logic
        if (message.type === "join") {
            // for the close socket
            socketMeta.set(socket, {
                sessionId: message.sessionCode,
                userId: message.userId,
            });

            //main part
            const user = addUserToSession(message.sessionCode, message.userId);

            const session = getOrCreateSession(message.sessionCode);
            session.clients.set(message.userId, socket)

            socket.send(JSON.stringify({
                type: "init", //should be in all caps and no space.
                username: user.username,
                role: user.role,
                code: getSessionCode(message.sessionCode),

            }))
        }

        //update logic
        if (message.type === "update") {
            const meta = socketMeta.get(socket);
            if (!meta) return; // safety guard

            const { sessionId, userId } = meta;

            //save the update code
            updateSessionCode(sessionId, message.code);
            //now brodcast to every user except the one who sends
            const session = getOrCreateSession(message.sessionCode);

            session.clients.forEach((client, uid) => {
                if (uid !== userId && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "update",
                        code: getSessionCode(sessionId)
                    }))
                }
            })

        }
    });

    socket.on("close", () => {
        console.log("client is disconnected")
        const meta = socketMeta.get(socket);
        if (!meta) return;
        removeUserFromSession(meta.sessionId, meta.userId);

        socketMeta.delete(socket)
    });
});

