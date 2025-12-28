import asyncHandler from "express-async-handler"
import Project from "../../models/Project.js"

export const projectAdd = asyncHandler(async (req, res) => {
    try {
        const newProject = req.body
        console.log(newProject)
        const project = await Project.create(newProject)

        return res.status(201).json({
            success: true,
            message: '✅ Project created successfully & cache cleared',
            project,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
})

export const getAllProjects = asyncHandler(async (req, res) => {
    try {
        const projects = await Project.find()
        return res.status(200).json(projects)
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})