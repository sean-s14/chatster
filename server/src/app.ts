import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

const app: Application = express();

app.use(helmet());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.get("/api", async (req: Request, res: Response) => {
  res.send({ message: "Hello World!" });
});

export default app;
