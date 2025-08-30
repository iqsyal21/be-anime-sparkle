import { TrendingAnime } from '../models/TrendingAnime.js';
import { fetchTrending } from '../utils/fetchTrending.js';

export const getTrendingAnimes = async (req, res) => {
  try {
    const region = req.query.region || 'indonesia';
    let dataAnime = await TrendingAnime.findOne({ region });

    if (!dataAnime) {
      console.log(
        `⚠️ dataAnime kosong untuk region ${region}, jalankan update manual...`
      );
      await fetchTrending(region);
      dataAnime = await TrendingAnime.findOne({ region });
    }

    if (!dataAnime) {
      return res
        .status(404)
        .json({ error: 'Trending belum tersedia, coba lagi nanti' });
    }

    res.json({
      region,
      updatedAt: dataAnime.updatedAt,
      items: dataAnime.data.items,
    });
  } catch (err) {
    console.error('❌ Error trending:', err);
    res.status(500).json({ error: 'Gagal mengambil trending dari dataAnime' });
  }
};
