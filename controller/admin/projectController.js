import asyncHandler from "express-async-handler"
import Project from "../../models/Project.js"
import { deleteProductByIdCache, deleteProjectsCache, getProjectByIdCache, getProjectsCache, setProjectByIdCache, setProjectsCache } from "../../cachingFunction/projectCaching.js"

export const projectAdd = asyncHandler(async (req, res) => {
    try {
        const newProject = req.body

        const project = await Project.create(newProject)

        const io = req.app.get("io");
        io.to("project").emit("project:created", project);

        await deleteProjectsCache()

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
        const cacheKey = JSON.stringify("all-projects");
        const cached = await getProjectsCache(cacheKey)

        if (cached) {
            return res.status(200).json(cached)
        }

        const projects = await Project.find()

        await setProjectsCache(cacheKey, projects)

        return res.status(200).json(projects)
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

export const getProjectDetails = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id

        const cachedProject = await getProjectByIdCache(id)
        if (cachedProject) {
            return res.status(200).json({ success: true, project: cachedProject })
        }

        const project = await Project.findById(id)

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await setProjectByIdCache(id, project)

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
    const id = req.params.id
    const updateProject = req.body

    const project = await Project.findByIdAndUpdate(
        id,
        updateProject,
        { new: true, runValidators: true }
    );

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    req.app.get("io").to("project").emit("project:updated", project);

    await deleteProjects()
    await deleteProductByIdCache(id)

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

        await deleteProjects()
        await deleteProductByIdCache(id)

        return res.json({ message: "Project removed successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})