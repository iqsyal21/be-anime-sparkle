import { fetchTrending } from '../utils/fetchTrending.js';

export const trendingJob = async () => {
  console.log('⏰ Update TrendingAnime...');
  await fetchTrending('indonesia');
  await fetchTrending('global');
};
