import mongoose from 'mongoose';

const VideoAnimeSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: String,
  publishedAt: Date,
  channelTitle: String,
  thumbnail: String,
  viewCount: Number,
  updatedAt: { type: Date, default: Date.now },
});

export const VideoAnime = mongoose.model('VideoAnime', VideoAnimeSchema);
