import { Router } from "express";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const MessagesRoutes = Router();
const uploads = multer({dest: "uploads/files"});

MessagesRoutes.post("/get-messages", verifyToken, getMessages);
MessagesRoutes.post("/upload-file", verifyToken, uploads.single("file"), uploadFile);


export default MessagesRoutes;