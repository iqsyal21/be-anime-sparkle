import { PlaylistCache } from "../models/PlaylistCache.js";
import { fetchAllPlaylists } from "../utils/youtubeApi.js";

const allowedChannels = {
    museAsia: "UCGbshtvS9t-8CW11W7TooQg",
    museIndonesia: "UCxxnxya_32jcKj4yN1_kD7A",
    aniOneAsia: "UC0wNSTMWIL3qaorLx0jie6A",
    aniOneIndonesia: "UCUn0hEbVJc273anl_0ozDMQ",
    tropicsAnimeAsia: "UCC-g5hWSvCbdB8HQQIA0_pg",
};

const regionChannels = {
    indonesia: ["museIndonesia", "aniOneIndonesia", "tropicsAnimeAsia"],
    global: ["museAsia", "aniOneAsia"],
};

export const getPlaylists = async (req, res) => {
    try {
        const channelKey = req.query.channel;
        if (!allowedChannels[channelKey]) {
            return res.status(400).json({ error: "Channel tidak valid" });
        }

        const cache = await PlaylistCache.findOne({ channel: channelKey });
        const now = Date.now();
        const maxAge = 1000 * 60 * 60 * 6;

        if (cache && now - cache.updatedAt.getTime() < maxAge) {
            console.log("✅ Ambil dari cache DB");
            return res.json(cache.data);
        }

        const channelId = allowedChannels[channelKey];
        const playlistData = await fetchAllPlaylists(channelId, process.env.YOUTUBE_API_KEY);

        if (cache) {
            cache.data = playlistData;
            cache.updatedAt = new Date();
            await cache.save();
        } else {
            await PlaylistCache.create({ channel: channelKey, data: playlistData });
        }

        console.log("🌐 Ambil semua playlist baru dari YouTube API");
        res.json(playlistData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

export const getRandomAnimes = async (req, res) => {
    try {
        const region = req.query.region || "indonesia";
        if (!regionChannels[region]) {
            return res.status(400).json({ error: "Region tidak valid. Gunakan 'indonesia' atau 'global'." });
        }

        const caches = await PlaylistCache.find({
            channel: { $in: regionChannels[region] },
        });

        if (!caches || caches.length === 0) {
            return res.status(404).json({ error: "Belum ada data playlist di database untuk region ini" });
        }

        let allPlaylists = [];
        caches.forEach((cache) => {
            if (cache.data && cache.data.items) {
                allPlaylists = allPlaylists.concat(cache.data.items);
            }
        });

        if (allPlaylists.length === 0) {
            return res.status(404).json({ error: "Tidak ada data playlist tersedia untuk region ini" });
        }

        const shuffled = allPlaylists.sort(() => 0.5 - Math.random());
        const randomTen = shuffled.slice(0, 10);

        res.json({ items: randomTen, region });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};