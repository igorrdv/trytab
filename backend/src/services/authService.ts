import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as Secret;

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
  return { token, user: { id: user.id, email: user.email } };
}
