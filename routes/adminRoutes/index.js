import express from "express";
import authRoutes from "./adminAuthRoutes.js"
import adminUsersRoutes from "./adminUsersRoutes.js"
import projectRoutes from "./projectsRoutes.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/users", adminUsersRoutes)
router.use("/projects", projectRoutes)

export default router