import express from "express";
import { getAllProjects, getProjectDetails } from "../../controller/user/projectController.js";

const router = express.Router()

router.get("/", getAllProjects)

router.get("/:id", getProjectDetails)

export default router