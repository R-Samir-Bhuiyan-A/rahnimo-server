import express from "express";
import { subscribe, unsubscribe } from "../controller/subscriptionController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const subscribeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { ok: false, message: "Too many requests" }
});

router.post("/subscribe", subscribeLimiter, subscribe);
router.get("/unsubscribe", unsubscribe);

export default router;
