import request from "supertest";
import express from "express";
import { errorHandler } from "../src/middlewares/errorHandler";

describe("Error Handler Middleware", () => {
  it("should return 500 and error message when an error is thrown", async () => {
    const app = express();

    app.get("/erro", () => {
      throw new Error("Proposital Error");
    });

    app.use(errorHandler);

    const res = await request(app).get("/erro");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Proposital Error");
  });

  it("should respect custom status code", async () => {
    const app = express();

    app.get("/erro-custom", (req, res, next) => {
      const err: any = new Error("Custom Error");
      err.status = 418;
      next(err);
    });

    app.use(errorHandler);

    const res = await request(app).get("/erro-custom");
    expect(res.status).toBe(418);
    expect(res.body).toHaveProperty("error", "Custom Error");
  });
});
