import express from "express"
import { deleteProjects, getAllProjects, projectAdd, updateProjects } from "../../controller/admin/projectController.js"
import { verifyJWT } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

router.use(verifyJWT)

router.post("/", projectAdd)

router.get("/", getAllProjects)

router.patch("/:id", updateProjects)

router.delete("/:id", deleteProjects)

export default router