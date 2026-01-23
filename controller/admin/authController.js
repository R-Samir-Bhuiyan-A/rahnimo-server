import dotenv from "dotenv";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../../models/User.js";
import Token from "../../models/Token.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { deleteAllRefreshTokensByUser, deleteRefreshTokenCache, getRefreshTokenCache, setRefreshTokenCache } from "../../cachingFunction/tokenCaching.js";

dotenv.config()

/*=========== Helpers using HMAC secrets================ */
const createAccessToken = (user) => {
    if (!process.env.JWT_ACCESS_SECRET) throw new Error("JWT_REFRESH_SECRET missing")
    return jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "1h" }
    )
}

const createRefreshToken = (user) => {
    if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET missing");
    return jwt.sign({ id: user._id.toString() }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}

/*==========================================================
                REGISTER
==========================================================*/

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, image } = req.body;

    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ message: "Name, email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res
        .status(409)
        .json({ message: "Email already exists" });

    const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        image: image,
        applyAdmin: "pending",
        provider: "credentials",
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Token.create({
        userId: user._id,
        token,
        type: "emailVerification",
        expiresAt,
    });

    const verificationUrl = `${process.env.ADMIN_URL}/verify-email?uid=${user._id}&token=${token}`
    await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<p>Hi ${user.name},</p>
           <p>Click the link below to verify your email:</p>
            <a href="${verificationUrl}" target="_blank">Verify Email</a>
           <p>This link expires in 24 hours.</p>`,
    });

    return res
        .status(201)
        .json({ message: "User registered! Verification email" });
})

/*==========================================================
                LOGIN
==========================================================*/
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");

    if (!user) return res.status(401).json({ message: "User not found" });
    if (!user.isVerified) {
        return res.status(403).json({ message: "Email verification did not complete yet" })
    }
    if (user.role !== "admin") {
        return res.status(401).json({ message: "Only admin can allow for login" })
    }

    if(user.applyAdmin !== "approved"){
        return res.status(402).json({ message : 'Need to admin aprroval'})
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(423).json({ message: "Account locked. Try later or reset password." });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        if (user.loginAttempts >= 5) {
            user.lockUntil = Date.now() + 30 * 60 * 1000;
            user.loginAttempts = 0;
        }
        await user.save();
        return res.status(401).json({ message: "Invalid credentials" });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();

    const accessToken = createAccessToken(user);
    const adminRefreshToken = createRefreshToken(user);

    await setRefreshTokenCache(adminRefreshToken, user._id.toString());
    const cookieOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAMESITE || "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
  res.cookie("adminRefreshToken", adminRefreshToken, cookieOptions);

  return res
  .json({
    message: "Logged in",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
  });
})

/*==========================================================
                REFRESH
==========================================================*/
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.adminRefreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    console.log(payload)
  } catch (err) {
    await deleteRefreshTokenCache(token)
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const storedUserId = await getRefreshTokenCache(token)
  if (!storedUserId || storedUserId !== payload.id) {
    await deleteRefreshTokenCache(token)
    await deleteAllRefreshTokensByUser(storedUserId)
    return res.status(403).json({ message: "Refresh token revoked" });
  }

  const user = await User.findById(payload.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const accessToken = createAccessToken(user);
  return res.json({ accessToken, 
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    } 
  });
});

/*==========================================================
                LOGOUT
==========================================================*/
export const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies?.adminRefreshToken;
  if (token) {
    await deleteRefreshTokenCache(token);
  }

  res.clearCookie("adminRefreshToken", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAMESITE || "lax",
    path: "/",
  });

  return res.json({ message: "Logged out" });
});