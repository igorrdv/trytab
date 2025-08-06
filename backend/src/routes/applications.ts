import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import {
  AuthenticatedRequest,
  authMiddleware,
} from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

router.post("/:jobId", authMiddleware, async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const userId = (req as AuthenticatedRequest).userId;

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) return res.status(404).json({ error: "Job not found" });
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: { userId, jobId },
      },
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ error: "You already have applied to this job." });
    }

    const application = await prisma.application.create({
      data: { jobId, userId },
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to apply to this job" });
  }
});

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).userId;

  try {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

export default router;
