import { Router } from "express";
import { addProfileImage, getUserInfo, login, signup, updateProfile, removeProfileImage, Logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";


const authRoutes = Router();
const upload = multer({ dest: 'uploads/images' });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post('/update-profile', verifyToken, updateProfile);
authRoutes.post('/add-profile-image', verifyToken,upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post('/logout', Logout);

export default authRoutes;
