import express from "express";
import { authorizeRoles, verifyJWT } from "../../middlewares/authMiddlewares.js";
import { deleteUser, getAllUsers, getAllUsersCount } from "../../controller/admin/adminUserController.js";

const router = express.Router()

router.use(verifyJWT)
router.use(authorizeRoles("admin"))

// get Total User Count
router.get("/usersCount", getAllUsersCount)

// ✅ get All Users
router.get("/", getAllUsers)

// ✅ Delete  User
router.delete("/:id", deleteUser)

export default router;