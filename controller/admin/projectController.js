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

export const updateProjects = asyncHandler(async(req, res)=>{
    try {
        const { id } = req.params
        const updateProject = req.body

        const update = await Project.findByIdAndUpdate(
            id,
            updateProject,
            {
                new: true,
                runValidators: true
            }
        )

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        };

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            product: update,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
})

export const deleteProjects = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id

        const exists = await Project.findById(id);
        if (!exists) return res.status(404).json({ message: "Project not found" })

        await Project.findByIdAndDelete(id)

        return res.json({ message: "Project removed successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})