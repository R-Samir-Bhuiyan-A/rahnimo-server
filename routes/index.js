import express from "express";
import adminRoutes from "./adminRoutes/index.js"
import subscriptionRoutes from "./subscriptionRoutes.js"
import faqRoutes from "./faqRoutes.js"

const router = express.Router()

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 API is running successfully!",
    })
})

router.use("/admin", adminRoutes)
router.use("/api/admin", adminRoutes)
router.use("/api", subscriptionRoutes)
router.use("/api", faqRoutes)

export default router