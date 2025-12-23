import express from "express";
import authRoutes from "./adminAuthRoutes.js"
import adminUsersRoutes from "./adminUsersRoutes.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/users", adminUsersRoutes)

export default router