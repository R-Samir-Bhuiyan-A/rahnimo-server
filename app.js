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

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://rahnimo-admin.vercel.app",
    "https://rahnimo.vercel.app",
    "https://admin.rahnimo.com",
    "https://server.rahnimo.com",
    "https://www.rahnimo.com",
    "https://rahnimo.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ FIX 1: Always answer preflight cleanly on Vercel (do not hit limiter/routes)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ FIX 2: Prevent NaN env crashes / bad config on Vercel
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// API routes
app.use("/", routes);

// Error handling
app.use(errorHandler);

export default app;
