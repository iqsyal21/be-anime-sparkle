import fetch from 'node-fetch';
import { PlaylistAnime } from '../models/PlaylistAnime.js';
import { VideoAnime } from '../models/VideoAnime.js';

const regionChannels = {
  indonesia: ['museIndonesia', 'aniOneIndonesia', 'tropicsAnimeAsia'],
  global: ['museAsia', 'aniOneAsia'],
};

export const fetchVideos = async (region = 'indonesia') => {
  try {
    console.log(`🔄 Update video dataAnime untuk region: ${region}`);

    const dataAnimes = await PlaylistAnime.find({
      channel: { $in: regionChannels[region] },
    });

    let allVideos = [];
    for (const dataAnimeItem of dataAnimes) {
      for (const playlist of dataAnimeItem.data.items) {
        const playlistId = playlist.id;

        let nextPageToken = '';
        do {
          const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${process.env.YOUTUBE_API_KEY}`;
          const resp = await fetch(url);
          const data = await resp.json();
          if (data.items) allVideos = allVideos.concat(data.items);
          nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);
      }
    }

    const videoIds = allVideos
      .map((v) => v.snippet.resourceId?.videoId)
      .filter(Boolean);

    // fetch statistik
    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50).join(',');
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${batch}&key=${process.env.YOUTUBE_API_KEY}`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.items) {
        for (const v of data.items) {
          await VideoAnime.findOneAndUpdate(
            { videoId: v.id },
            {
              title: v.snippet.title,
              publishedAt: v.snippet.publishedAt,
              channelTitle: v.snippet.channelTitle,
              thumbnail: v.snippet.thumbnails?.medium?.url,
              viewCount: parseInt(v.statistics.viewCount || '0', 10),
              updatedAt: new Date(),
            },
            { upsert: true }
          );
        }
      }
    }

    console.log(`✅ Video dataAnime ${region} berhasil diperbarui`);
  } catch (err) {
    console.error('❌ Gagal update video dataAnime:', err);
  }
};
