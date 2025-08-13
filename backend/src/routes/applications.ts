import { Router, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import {
  AuthenticatedRequest,
  authMiddleware,
} from "../middlewares/authMiddleware";
import { validateCreateApplication } from "../schemas/applicationSchema";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/:jobId",
  authMiddleware,

  async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const { userId, role } = req as AuthenticatedRequest;

    try {
      const job = await prisma.job.findUnique({ where: { id: jobId } });

      if (!job) return res.status(404).json({ error: "Job not found" });
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (role === "company") {
        return res
          .status(403)
          .json({ error: "Companies are not allowed to apply for jobs." });
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
  }
);

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

router.delete(
  "/:jobId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const userId = (req as AuthenticatedRequest).userId!;

    try {
      const existingApplication = await prisma.application.findFirst({
        where: { jobId },
      });

      if (!existingApplication) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (existingApplication.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await prisma.application.delete({
        where: {
          userId_jobId: { userId, jobId },
        },
      });

      res.status(200).json({ message: "Application cancelled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel application" });
    }
  }
);
router.get(
  "/:jobId/applications",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const { role, userId } = req as AuthenticatedRequest;

    if (role !== "company") {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { companyId: true },
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      if (job.companyId !== userId) {
        return res
          .status(403)
          .json({ error: "Not authorized to view applications for this job" });
      }

      const applications = await prisma.application.findMany({
        where: { jobId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json(applications);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch applications for this job" });
    }
  }
);

export default router;
