import mongoose from 'mongoose';

const TrendingAnimeSchema = new mongoose.Schema({
  region: { type: String, required: true },
  data: { type: Object, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const TrendingAnime = mongoose.model(
  'TrendingAnime',
  TrendingAnimeSchema
);
