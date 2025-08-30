import { PlaylistAnime } from "../models/PlaylistAnime.js";
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

        const dataAnime = await PlaylistAnime.findOne({ channel: channelKey });
        const now = Date.now();
        const maxAge = 1000 * 60 * 60 * 6;

        if (dataAnime && now - dataAnime.updatedAt.getTime() < maxAge) {
            console.log("✅ Ambil dari dataAnime DB");
            return res.json(dataAnime.data);
        }

        const channelId = allowedChannels[channelKey];
        const playlistData = await fetchAllPlaylists(channelId, process.env.YOUTUBE_API_KEY);

        if (dataAnime) {
            dataAnime.data = playlistData;
            dataAnime.updatedAt = new Date();
            await dataAnime.save();
        } else {
            await PlaylistAnime.create({ channel: channelKey, data: playlistData });
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

        const dataAnimes = await PlaylistAnime.find({
            channel: { $in: regionChannels[region] },
        });

        if (!dataAnimes || dataAnimes.length === 0) {
            return res.status(404).json({ error: "Belum ada data playlist di database untuk region ini" });
        }

        let allPlaylists = [];
        dataAnimes.forEach((dataAnime) => {
            if (dataAnime.data && dataAnime.data.items) {
                allPlaylists = allPlaylists.concat(dataAnime.data.items);
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