import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import logger from "./utils/logger.js";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// Immediately running async function (IIFE)
(async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // init socket and attach to app
    // const io = initSocketServer(server, app);

    // Start server
    server.listen(PORT, () => {
      logger.info(`✅ Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      logger.error(`💥 Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      logger.error(`💣 Uncaught Exception: ${err.message}`);
      process.exit(1);
    });

  } catch (err) {
    logger.error(`❌ Failed to start server: ${err.message}`);
    process.exit(1);
  }
})();