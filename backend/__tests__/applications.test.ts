import request from "supertest";
import app from "../src/index";
import { PrismaClient } from "../src/generated/prisma";
import jwt, { Secret } from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as Secret;

describe("Applications API", () => {
  let userToken: string;
  let companyToken: string;
  let jobId: string;
  let otherUserToken: string;

  beforeAll(async () => {
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        id: "user1",
        name: "User Test",
        email: "user@test.com",
        role: "user",
        password: "testpassword",
      },
    });
    const otherUser = await prisma.user.create({
      data: {
        id: "user2",
        name: "Other User",
        email: "other@test.com",
        role: "user",
        password: "testpassword",
      },
    });

    const company = await prisma.user.create({
      data: {
        id: "company1",
        name: "Company Test",
        email: "company@test.com",
        role: "company",
        password: "testpassword",
      },
    });

    const job = await prisma.job.create({
      data: {
        id: "job1",
        title: "Job Test",
        description: "Descrição da vaga para teste",
        location: "Remote",
        companyId: company.id,
      },
    });

    jobId = job.id;
    userToken = jwt.sign({ userId: user.id, role: "user" }, JWT_SECRET);
    otherUserToken = jwt.sign(
      { userId: otherUser.id, role: "user" },
      JWT_SECRET
    );
    companyToken = jwt.sign(
      { userId: company.id, role: "company" },
      JWT_SECRET
    );
  });

  describe("POST /applications/:jobId", () => {
    it("returns 401 if no token", async () => {
      const res = await request(app).post(`/applications/${jobId}`);
      expect(res.status).toBe(401);
    });

    it("returns 403 if company tries to apply", async () => {
      const res = await request(app)
        .post(`/applications/${jobId}`)
        .set("Authorization", `Bearer ${companyToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe(
        "Companies are not allowed to apply for jobs."
      );
    });

    it("creates application for user", async () => {
      const res = await request(app)
        .post(`/applications/${jobId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("jobId", jobId);
      expect(res.body).toHaveProperty("userId");
    });

    it("returns 400 if user applies twice", async () => {
      const res = await request(app)
        .post(`/applications/${jobId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("You already have applied to this job.");
    });

    it("returns 404 if job does not exist", async () => {
      const res = await request(app)
        .post("/applications/nonexistentJob")
        .set("Authorization", `Bearer ${otherUserToken}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Job not found");
    });
  });

  describe("GET /applications", () => {
    it("returns 401 if no token", async () => {
      const res = await request(app).get("/applications");
      expect(res.status).toBe(401);
    });

    it("returns applications for logged user", async () => {
      const res = await request(app)
        .get("/applications")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("job");
    });
  });

  describe("DELETE /applications/:jobId", () => {
    it("returns 404 if application does not exist", async () => {
      const res = await request(app)
        .delete("/applications/nonexistentJob")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Application not found");
    });

    it("returns 403 if user tries to delete another user's application", async () => {
      const res = await request(app)
        .delete(`/applications/${jobId}`)
        .set("Authorization", `Bearer ${otherUserToken}`);
      expect(res.status).toBe(403);
    });

    it("deletes the application successfully", async () => {
      const res = await request(app)
        .delete(`/applications/${jobId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Application cancelled successfully");
    });
  });

  describe("GET /applications/:jobId/applications", () => {
    beforeAll(async () => {
      await prisma.application.create({
        data: { jobId, userId: "user1" },
      });
    });

    it("returns 403 if role is not company", async () => {
      const res = await request(app)
        .get(`/applications/${jobId}/applications`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("Access denied");
    });

    it("returns 404 if job does not exist", async () => {
      const res = await request(app)
        .get("/applications/nonexistentJob/applications")
        .set("Authorization", `Bearer ${companyToken}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Job not found");
    });

    it("returns 403 if company is not owner of job", async () => {
      const fakeCompanyToken = jwt.sign(
        { userId: "fakeCompany", role: "company" },
        JWT_SECRET
      );
      const res = await request(app)
        .get(`/applications/${jobId}/applications`)
        .set("Authorization", `Bearer ${fakeCompanyToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe(
        "Not authorized to view applications for this job"
      );
    });

    it("returns list of applications for company owner", async () => {
      const res = await request(app)
        .get(`/applications/${jobId}/applications`)
        .set("Authorization", `Bearer ${companyToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("user");
    });
  });
});
