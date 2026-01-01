import express from "express";
import { createMember, deleteMember, getMembers, updateMember } from "../../controller/admin/teamController.js";
import { verifyJWT } from "../../middlewares/authMiddlewares.js";

const router = express.Router()

router.use(verifyJWT)

router.post("/", createMember)

router.get("/", getMembers)

router.patch("/:id", updateMember)

router.delete("/:id", deleteMember)

export default router;