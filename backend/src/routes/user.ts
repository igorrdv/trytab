import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

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

export default router;
