import express from "express";
import { loginUser, logoutUser, refreshToken, registerUser } from "../../controller/admin/authController.js";
import { verifyJWT } from "../../middlewares/authMiddlewares.js";


const router = express.Router()

router.post("/register", registerUser)

router.post("/login", loginUser)

router.post("/refresh", refreshToken)

router.post("/logout", verifyJWT ,logoutUser)

export default router