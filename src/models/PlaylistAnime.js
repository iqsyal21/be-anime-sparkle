import mongoose from 'mongoose';

const playlistAnimeSchema = new mongoose.Schema({
  channel: { type: String, required: true },
  data: { type: Object, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const PlaylistAnime = mongoose.model(
  'PlaylistAnime',
  playlistAnimeSchema
);
