import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import playlistRoutes from "./routes/playlistRoutes.js";
import trendingRoutes from "./routes/trendingRoutes.js";

dotenv.config();

const app = express();
app.use(cors());

app.use("/api", playlistRoutes);
app.use("/api", trendingRoutes);

export default app;
