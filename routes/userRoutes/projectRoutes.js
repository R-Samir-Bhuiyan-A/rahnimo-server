import express from "express";
import { getAllProjects } from "../../controller/user/projectController.js";

const router = express.Router()

router.get("/", getAllProjects)

export default router