import fetch from "node-fetch";
import { PlaylistCache } from "../models/PlaylistCache.js";
import { TrendingCache } from "../models/TrendingCache.js";

const regionChannels = {
    indonesia: ["museIndonesia", "aniOneIndonesia", "tropicsAnimeAsia"],
    global: ["museAsia", "aniOneAsia"],
};

export const updateTrendingCache = async (region = "global") => {
    try {
        console.log(`🔄 Update trending untuk region: ${region}`);

        const caches = await PlaylistCache.find({
            channel: { $in: regionChannels[region] },
        });

        let allVideos = [];
        for (const cacheItem of caches) {
            for (const playlist of cacheItem.data.items) {
                const playlistId = playlist.id;

                let nextPageToken = "";
                do {
                    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${process.env.YOUTUBE_API_KEY}`;
                    const resp = await fetch(url);
                    const data = await resp.json();
                    if (data.items) allVideos = allVideos.concat(data.items);
                    nextPageToken = data.nextPageToken || "";
                } while (nextPageToken);
            }
        }

        // filter hanya video 7 hari terakhir
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recentVideos = allVideos.filter((item) => {
            const publishedAt = new Date(item.snippet.publishedAt).getTime();
            return publishedAt >= oneWeekAgo;
        });

        // ambil statistik viewCount (batch 50 id)
        const videoIds = recentVideos.map((v) => v.snippet.resourceId?.videoId).filter(Boolean);
        const videoStats = [];

        for (let i = 0; i < videoIds.length; i += 50) {
            const batch = videoIds.slice(i, i + 50).join(",");
            const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${batch}&key=${process.env.YOUTUBE_API_KEY}`;
            const resp = await fetch(url);
            const data = await resp.json();
            if (data.items) videoStats.push(...data.items);
        }

        // sort by viewCount & ambil top 10
        const sorted = videoStats
            .map((v) => ({
                videoId: v.id,
                title: v.snippet.title,
                publishedAt: v.snippet.publishedAt,
                viewCount: parseInt(v.statistics.viewCount || "0", 10),
                channelTitle: v.snippet.channelTitle,
                thumbnail: v.snippet.thumbnails?.medium?.url,
            }))
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 10);

        const result = { region, items: sorted };

        await TrendingCache.findOneAndUpdate(
            { region },
            { data: result, updatedAt: new Date() },
            { upsert: true }
        );

        console.log(`✅ Trending ${region} berhasil diperbarui`);
    } catch (err) {
        console.error("❌ Gagal update trending:", err);
    }
};
