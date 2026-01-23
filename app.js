import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.set("trust proxy", 1);

// Middleware setup
app.use(helmet());
      "https://rahnimo-admin.vercel.app",
      "https://rahnimo.vercel.app",
      "https://admin.rahnimo.com",
      "https://server.rahnimo.com",
      "https://www.rahnimo.com",
      "https://rahnimo.com",
app.use(cors({
  origin: [
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3000",
    "https://rahnimo-admin.vercel.app",
    "https://rahnimo.vercel.app",
    "https://rahnimo.com",
    "https://www.rahnimo.com",
    "https://admin.rahnimo.com",
  ],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS), // মিলিসেকেন্ড
  max: parseInt(process.env.RATE_LIMIT_MAX), // max requests per window
  message: "Too many requests, please try again later.",
});

app.use(limiter);

// API routes
app.use("/", routes);

// Error handling
app.use(errorHandler);

export default app;
