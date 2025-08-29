import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Gagal konek ke database. Server tidak berjalan.");
        process.exit(1);
    }
};

startServer();
