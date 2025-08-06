import request from "supertest";
import app from "../app";

describe("Test API", () => {
  it("GET /tasks should respond with 200", async () => {
    const res = await request(app).get("/tasks");
    expect(res.status).toBeDefined();
  });

  it("GET /tasks/error should respond with 401", async () => {
    const res = await request(app).get("/tasks/error");
    expect(res.status).toBe(401);
  });

  it("POST /auth/login should respond with 400" +
      "if request not containing body", async () => {
    const res = await request(app).post("/auth/login");
    expect(res.status).toBe(400);
  });

  it("POST /auth/logout should respond with 400 if request not containing " +
      "authentication header", async () => {
    const res = await request(app).post("/auth/logout");
    expect(res.status).toBe(400);
  });
});
