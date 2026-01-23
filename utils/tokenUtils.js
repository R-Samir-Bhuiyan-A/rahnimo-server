import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateUnsubscribeToken = (subscriberId, email) => {
    return jwt.sign(
        { id: subscriberId, email, purpose: "unsubscribe" },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "365d" }
    );
};

export const verifyUnsubscribeToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        if (decoded.purpose !== "unsubscribe") return null;
        return decoded;
    } catch (error) {
        return null;
    }
};
