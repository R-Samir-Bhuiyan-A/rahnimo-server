import express from "express"
import { deleteProjects, getAllProjects, getProjectDetails, projectAdd, updateProjects } from "../../controller/admin/projectController.js"
import { verifyJWT } from "../../middlewares/authMiddlewares.js"

const router = express.Router()

router.post("/",verifyJWT, projectAdd)

router.get("/", getAllProjects)

router.get("/:id", getProjectDetails)

router.patch("/:id",verifyJWT, updateProjects)

router.delete("/:id", verifyJWT, deleteProjects)

export default router