import express from "express";
import {
    createFaq,
    getAllFaqs,
    getPublicFaqs,
    updateFaq,
    deleteFaq
} from "../controller/faqController.js";
import { verifyJWT, authorizeRoles } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Public Routes
router.get("/public/faqs", getPublicFaqs);

// Admin Routes (Protected)
router.get("/faqs", verifyJWT, authorizeRoles("admin"), getAllFaqs);
router.post("/faqs", verifyJWT, authorizeRoles("admin"), createFaq);
router.put("/faqs/:id", verifyJWT, authorizeRoles("admin"), updateFaq);
router.delete("/faqs/:id", verifyJWT, authorizeRoles("admin"), deleteFaq);

export default router;
