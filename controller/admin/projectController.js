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
// export const getAllProject = asyncHandler(async (req, res) => {
//     try {
//         const {
//             search,
//             category,
//             status,
//             featured,
//             visibility = "public",
//             page = 1,
//             sort = "-createdAt",
//             limit,
//         } = req.query;

//         // ✅ Redis cache key তৈরি
//         const cacheKey = JSON.stringify(req.query);

//         const cached = await getProductsCache(cacheKey);

//         if (cached) {
//             return res.status(200).json(cached);
//         }

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: err.message });
//     }
// })