import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 8000;

async function startServer() {
    try {
        await prisma.$queryRaw`SELECT 1`;

        console.log("✅ DATABASE CONNECTED");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ DATABASE CONNECTION FAILED");
        console.error(error);
        process.exit(1);
    }
}

startServer();