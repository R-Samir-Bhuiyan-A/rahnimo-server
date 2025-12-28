import { Server } from "socket.io";


export function initSocketServer(httpServer, app) {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:3000",
                "http://localhost:3001",
            ]
        },
    });
    
}