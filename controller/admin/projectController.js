import asyncHandler from "express-async-handler"
import Project from "../../models/Project.js"

export const projectAdd = asyncHandler(async (req, res) => {
    try {
        const newProject = req.body
        console.log(newProject)
        const project = await Project.create(newProject)

        const io = req.app.get("io");
        io.to("project").emit("project:created", project);

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

export const getProjectDetails = asyncHandler(async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
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

export const updateProjects = asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    req.app.get("io").to("project").emit("project:updated", project);

    res.json(project);
});


export const deleteProjects = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id

        const exists = await Project.findById(id);
        if (!exists) return res.status(404).json({ message: "Project not found" })

        await Project.findByIdAndDelete(id)

        const io = req.app.get("io");
        io.to("project").emit("project:deleted", id);

        return res.json({ message: "Project removed successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})