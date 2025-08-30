import cron from 'node-cron';
import { videoJob } from './videoJob.js';
import { trendingJob } from './trendingJob.js';

export const startCronJobs = () => {
  cron.schedule('0 */6 * * *', async () => {
    try {
      await videoJob();
    } catch (err) {
      console.error('❌ Gagal menjalankan videoJob:', err);
    }
  });

  cron.schedule('30 */6 * * *', async () => {
    try {
      await trendingJob();
    } catch (err) {
      console.error('❌ Gagal menjalankan trendingJob:', err);
    }
  });

  console.log('✅ Semua cron jobs aktif (interval 6 jam)');
};
