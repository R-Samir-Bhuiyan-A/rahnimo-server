import { Server } from "socket.io";
import jwt from "jsonwebtoken"


export function initSocketServer(httpServer, app) {
    const io = new Server(httpServer, {
        path: "/socket.io",
        cors: {
            origin: [
                "http://localhost:3000",
                "http://localhost:3001",
                "https://rahnimo-admin.vercel.app",
                "https://rahnimo.vercel.app",
                "https://rahnimo.com",
                "https://www.rahnimo.com",
                "https://admin.rahnimo.com",
            ]
        },
    });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error("Not authenticated"));

            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            // attach user info to socket
            socket.user = { id: payload.id, email: payload.email };
            return next();
        } catch (err) {
            console.error("Socket auth error:", err.message);
            return next(new Error("Authentication error"));
        }
    });
    io.on("connection", (socket) => {
        socket.join("team");
        socket.join("project");
    });

    // make io accessible via app (or export it)
    app.set("io", io);
    return io;
}
