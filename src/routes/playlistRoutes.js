import express from "express";
import { getPlaylists, getRandomAnimes } from "../controllers/playlistController.js";

const router = express.Router();

router.get("/playlists", getPlaylists);
router.get("/list-foryou", getRandomAnimes);

export default router;
