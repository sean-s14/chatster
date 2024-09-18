import app from "./app";
import dotenv from "dotenv";
import prisma from "./prismaClient";
import https from "https";
import fs from "fs";

dotenv.config();
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || "development";
let server: any;

const SSL_CRT_FILE = process.env.SSL_CRT_FILE;
if (!SSL_CRT_FILE) {
  console.log("SSL_CRT_FILE is not defined");
  process.exit(1);
}

const SSL_KEY_FILE = process.env.SSL_KEY_FILE;
if (!SSL_KEY_FILE) {
  console.log("SSL_KEY_FILE is not defined");
  process.exit(1);
}

if (ENV === "development") {
  const privateKey = fs.readFileSync(SSL_KEY_FILE, "utf8");
  const certificate = fs.readFileSync(SSL_CRT_FILE, "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(PORT, () => {
    console.log(`Server running at ${process.env.SERVER_BASE_URL}/`);
  });
} else if (ENV === "production") {
  // TODO: Implement production server configuration
} else {
  server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await prisma.$disconnect();
    console.log("Prisma Client disconnected");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed");
    await prisma.$disconnect();
    console.log("Prisma Client disconnected");
    process.exit(0);
  });
});
