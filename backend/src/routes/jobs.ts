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
  if (remote !== undefined) filters.remote = remote === "true";
  if (type) filters.type = String(type);
  if (companyId) filters.companyId = String(companyId);

  const jobs = await prisma.job.findMany({
    where: filters,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!jobs || jobs.length === 0)
    return res.status(404).json({ error: "No jobs found" });

  res.json(jobs);
});

router.get(
  "/my-jobs",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const companyId = req.userId!;

    const jobs = await prisma.job.findMany({
      where: { companyId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!jobs || jobs.length === 0)
      return res.status(404).json({ error: "No jobs found" });

    res.json(jobs);
  }
);

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
    const role = req.role;

    if (role !== "company") {
      return res.status(403).json({ error: "Only companies can create jobs." });
    }

    try {
      const job = await prisma.job.create({
        data: {
          title,
          description,
          location,
          type,
          salary,
          remote,
          company: { connect: { id: companyId } },
        },
      });

      res.status(201).json(job);
    } catch (error) {
      res.status(500).json({ error: "Error creating job." });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description, location, type, salary, remote } = req.body;
    const jobId = req.params.id;
    const userId = req.userId!;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.companyId !== userId)
      return res.status(403).json({ error: "Forbidden" });

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { title, description, location, type, salary, remote },
    });

    res.json(updatedJob);
  }
);

router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const jobId = req.params.id;
    const userId = req.userId!;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.companyId !== userId)
      return res.status(403).json({ error: "Forbidden" });

    await prisma.job.delete({ where: { id: jobId } });

    res.status(204).send();
  }
);

export default router;
