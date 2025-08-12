import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import jobRoutes from "./routes/jobs";
import authRoutes from "./routes/authRoutes";
import applicationRoutes from "./routes/applications";
import healthRoutes from "./routes/health";
import { logger } from "./middlewares/logger";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

setupSwagger(app);
app.use("/api", userRoutes);
app.use("/health", healthRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/applications", applicationRoutes);
app.use(notFound);
app.use(errorHandler);
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
export default app;
