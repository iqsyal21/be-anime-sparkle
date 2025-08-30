import { VideoAnime } from '../models/VideoAnime.js';
import { TrendingAnime } from '../models/TrendingAnime.js';

export const fetchTrending = async (region = 'indonesia') => {
  try {
    console.log(`🔄 Hitung trending dari video anime untuk region: ${region}`);

    // ambil video 7 hari terakhir dari VideoAnime
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recentVideos = await VideoAnime.find({
      publishedAt: { $gte: new Date(oneWeekAgo) },
    });

    // sort by viewCount & ambil top 10
    const sorted = recentVideos
      .map((v) => ({
        videoId: v.videoId,
        title: v.title,
        publishedAt: v.publishedAt,
        viewCount: v.viewCount,
        channelTitle: v.channelTitle,
        thumbnail: v.thumbnail,
      }))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10);

    const result = { region, items: sorted };

    await TrendingAnime.findOneAndUpdate(
      { region },
      { data: result, updatedAt: new Date() },
      { upsert: true }
    );

    console.log(`✅ Trending ${region} berhasil dihitung dari anime`);
  } catch (err) {
    console.error('❌ Gagal menghitung trending:', err);
  }
};
