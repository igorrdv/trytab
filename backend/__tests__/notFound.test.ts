import request from "supertest";
import app from "../src/index";

describe("Not Found Middleware", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/random-route");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Not Found");
  });
});
