import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt, { compare } from "bcrypt";
import { login } from "../services/authService";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res
      .status(201)
      .json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const { token, user } = await login(email, password);
    return res.json({ token, user });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
});

router.get(
  "/me",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  }
);

export default router;
