import dotenv from "dotenv";
import app from "./app.js";
import prisma from "./lib/prisma.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL");
    console.error(error);
    process.exit(1);
  }
}

startServer();