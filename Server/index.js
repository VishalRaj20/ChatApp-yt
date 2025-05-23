import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import MessagesRoutes from "./routes/MessagesRoutes.js";
import ChannelRoutes from "./routes/ChannelRoutes.js";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  }));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', MessagesRoutes);
app.use("/api/channel", ChannelRoutes);

if(process.env.NODE_ENV === "production"){

  const dirPath = path.resolve();
    app.use(express.static("./Client/dist"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(dirPath, "./Client/dist", "index.html"));
    }
    );
}

const server = app.listen(port, () =>{
    console.log(`Server is running at Port: ${port}`);
})

setupSocket(server);

mongoose.connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ DB connection successful"))
.catch((err) => console.error("❌ DB connection error:", err));
