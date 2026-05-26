import express from "express";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js" 
import { connectDB } from "./lib/db.js"; // Assuming you have a db.js file for database connection
import CookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js"; // Assuming you have a user route file
import chatRoutes from "./routes/chat.route.js"
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
dotenv.config(); // ✅ now this works

const PORT = process.env.PORT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../../frontend/mernpro/dist");
const indexHtml = path.join(distPath, "index.html");
const shouldServeFrontend =
  fs.existsSync(indexHtml) ||
  process.env.NODE_ENV === "production" ||
  process.env.RENDER === "true";

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use (express.json()); 
app.use(CookieParser()); 

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat", chatRoutes);

if (shouldServeFrontend && fs.existsSync(indexHtml)) {
  app.use(express.static(distPath));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(indexHtml);
  });
} else {
  console.warn(
    `[vibly] Frontend not found at ${distPath}. ` +
      "Run `npm run build` from the repo root before deploy."
  );

  app.get("/", (_req, res) => {
    res.status(503).send("Frontend build missing. Check Render build command: npm run build");
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`NODE_ENV=${process.env.NODE_ENV ?? "(not set)"}`);
  console.log(`Frontend dist: ${distPath} (exists: ${fs.existsSync(indexHtml)})`);
  connectDB();
});
