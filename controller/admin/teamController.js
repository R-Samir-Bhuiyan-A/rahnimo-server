import Team from "../../models/Team.js";
import asyncHandler from "express-async-handler"

/**
 * @desc    Create new team member
 * @access  Admin
 */
export const createMember = async (req, res) => {
    try {
        const { name, designation, description, image } = req.body;

        if (!name || !designation || !image) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const member = await Team.create({
            name,
            designation,
            description,
            image,
            createdBy: req.user?.id
        });

        const io = req.app.get("io");
        io.emit("team:created", member);

        // res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all team members
 * @route   GET /api/team
 * @access  Public
 */
export const getMembers = async (req, res) => {
    try {
        const members = await Team.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update team member
 * @route   PATCH /api/team/:id
 * @access  Admin
 */
export const updateMember = asyncHandler(async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });

        const updated = await Team.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );

        const io = req.app.get("io");
        io.emit("team:updated", updated);

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export const getMemberDetails = asyncHandler(async (req, res) => {
    try {
        const member = await Team.findById(req.params.id)
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json({
            success: true,
            member,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching product",
            error: error.message,
        });
    }
})

/**
 * @desc    Delete team member (Soft Delete)
 * @route   DELETE /api/team/:id
 * @access  Admin
 */
export const deleteMember = async (req, res) => {
    try {
        const id = req.params.id
        
        const member = await Team.findById(id);
        if (!member) return res.status(404).json({ message: "Member not found" });

        await Team.findByIdAndDelete(id)

        const io = req.app.get("io");
        io.emit("team:deleted", req.params.id);

        res.json({ message: "Member removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
