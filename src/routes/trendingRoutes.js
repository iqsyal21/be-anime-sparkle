import express from "express";
import { getTrendingAnimes } from "../controllers/trendingController.js";

const router = express.Router();
router.get("/trending", getTrendingAnimes);

export default router;
