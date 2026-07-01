import request from "supertest";
import app from "./app";

describe("GET /health", () => {
  it("should return 200 OK and health status parameters", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("env");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("should return 404 for unknown endpoints", async () => {
    const res = await request(app).get("/unknown-route-path");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message");
  });
});
