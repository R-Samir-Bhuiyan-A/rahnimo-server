import express from "express";
import { createMember, deleteMember, getMemberDetails, getMembers, updateMember } from "../../controller/admin/teamController.js";
import { verifyJWT } from "../../middlewares/authMiddlewares.js";

const router = express.Router()

router.post("/",verifyJWT, createMember)

router.get("/", getMembers)

router.get("/:id", getMemberDetails)

router.patch("/:id",verifyJWT, updateMember)

router.delete("/:id",verifyJWT, deleteMember)

export default router;