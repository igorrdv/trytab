import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  const { remote, type, companyId } = req.query;

  const filters: any = {};
  if (remote !== undefined) {
    filters.remote = remote === "true";
  }

  if (type) {
    filters.type = String(type);
  }

  if (companyId) {
    filters.companyId = String(companyId);
  }

  const jobs = await prisma.job.findMany({
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });
  if (!jobs) return res.status(404).json({ error: "No jobs found" });
  res.json(jobs);
});

router.get("/:id", async (req: Request, res: Response) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

router.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description, location, type, salary, remote } = req.body;
    const companyId = req.userId!;

    const job = await prisma.job.create({
      data: { title, description, location, type, salary, remote, companyId },
    });
    res.status(201).json(job);
  }
);

router.put(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;
    const userId = req.userId!;
    const { title, description, location, type, salary, remote } = req.body;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.companyId !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { title, description, location, type, salary, remote },
    });

    res.json(updatedJob);
  }
);

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  await prisma.job.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});

export default router;
