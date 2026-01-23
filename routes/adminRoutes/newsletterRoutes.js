import express from "express";
import { getSubscribers, createTemplate, getTemplates, createCampaign, updateTemplate, deleteTemplate } from "../../controller/adminNewsletterController.js";
import { verifyJWT, authorizeRoles } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

router.use(verifyJWT);
router.use(authorizeRoles("admin"));

router.get("/subscribers", getSubscribers);
router.post("/templates", createTemplate);
router.get("/templates", getTemplates);
router.put("/templates/:id", updateTemplate);
router.delete("/templates/:id", deleteTemplate);
router.post("/campaigns", createCampaign);

export default router;
