import { Server } from "socket.io";
import jwt from "jsonwebtoken"
import Team from "../models/Team.js";


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
                "https://admin.rahnimo.com",
                "https://www.rahnimo.com"
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

        socket.on("get-teams", async () => {
            const teams = await Team.find({ isActive: true }).sort({ createdAt: -1 })

            socket.emit("teams", teams);
        });

        socket.join("team");
        socket.join("project");
    });

    // make io accessible via app (or export it)
    app.set("io", io);
    return io;
}