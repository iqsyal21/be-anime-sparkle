import { connectDB } from "./config/db.js";
import app from "./app.js";
import { initCronJobs } from "./cron/cron.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        initCronJobs();

        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Gagal start server:", err);
        process.exit(1);
    }
};

startServer();
