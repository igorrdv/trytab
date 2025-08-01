import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  const jobs = await prisma.job.findMany();
  res.json(jobs);
});

router.get("/:id", async (req: Request, res: Response) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

router.post("/", async (req: Request, res: Response) => {
  const { title, description, company, location } = req.body;
  const job = await prisma.job.create({
    data: { title, description, company, location },
  });
  res.status(201).json(job);
});

router.put("/:id", async (req: Request, res: Response) => {
  const { title, description, company, location } = req.body;
  const job = await prisma.job.update({
    where: { id: req.params.id },
    data: { title, description, company, location },
  });
  res.json(job);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await prisma.job.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});

export default router;
