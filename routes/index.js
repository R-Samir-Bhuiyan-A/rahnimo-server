import express from "express";
import adminRoutes from "./adminRoutes/index.js"

const router = express.Router()

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 API is running successfully!",
    })
})

router.use("/admin", adminRoutes)


export default router