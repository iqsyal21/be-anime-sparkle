import { fetchVideos } from '../utils/fetchVideos.js';

export const videoJob = async () => {
  console.log('⏰ Update VideoAnime...');
  await fetchVideos('indonesia');
  await fetchVideos('global');
};
