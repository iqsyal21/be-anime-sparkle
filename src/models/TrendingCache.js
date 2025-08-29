import mongoose from "mongoose";

const TrendingCacheSchema = new mongoose.Schema({
    region: { type: String, required: true },
    data: { type: Object, required: true },
    updatedAt: { type: Date, default: Date.now }
});

export const TrendingCache = mongoose.model("TrendingCache", TrendingCacheSchema);
