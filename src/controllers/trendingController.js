import { TrendingCache } from "../models/TrendingCache.js";

export const getTrendingAnimes = async (req, res) => {
    try {
        const region = req.query.region || "global";
        const cache = await TrendingCache.findOne({ region });

        if (!cache) {
            return res.status(404).json({ error: "Trending belum tersedia, coba lagi nanti" });
        }

        res.json(cache.data);
    } catch (err) {
        console.error("❌ Error trending:", err);
        res.status(500).json({ error: "Gagal mengambil trending dari cache" });
    }
};
