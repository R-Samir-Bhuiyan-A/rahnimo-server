import express from "express";
import adminRoutes from "./adminRoutes/index.js"
import projectRoutes from "./userRoutes/projectRoutes.js"

const router = express.Router()

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 API is running successfully!",
    })
})

router.use("/admin", adminRoutes)
router.use("/projects", projectRoutes)


export default router