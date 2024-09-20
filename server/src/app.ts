import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import { errorHandler } from "./middleware/error";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(errorHandler);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api", async (req: Request, res: Response) => {
  res.send({ message: "Hello World!" });
});

export default app;
