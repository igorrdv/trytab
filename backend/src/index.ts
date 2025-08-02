import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import jobRoutes from "./routes/jobs";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/api", userRoutes);
app.use("/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
