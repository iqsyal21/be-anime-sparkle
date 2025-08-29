import mongoose from "mongoose";

const playlistCacheSchema = new mongoose.Schema({
    channel: { type: String, required: true },
    data: { type: Object, required: true },
    updatedAt: { type: Date, default: Date.now },
});

export const PlaylistCache = mongoose.model("PlaylistCache", playlistCacheSchema);
