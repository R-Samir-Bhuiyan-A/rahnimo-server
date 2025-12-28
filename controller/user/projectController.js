import Project from "../../models/Project.js";
import asyncHandler from "express-async-handler"

export const getAllProjects = asyncHandler(async (req, res) => {
    try {
        const projects = await Project.find()
        return res.status(200).json(projects)
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

export const getProjectDetails = asyncHandler(async (req, res) => {
    const id = req.params.id
    try {
        const project = await Project.findById(id)
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        res.status(500).json({
            message: "Server error while fetching product",
            error: error.message,
        });
    }
})