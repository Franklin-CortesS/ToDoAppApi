import express from "express";
import tareasRouter from "./routes/tasks.routes";
import authRouter from "./routes/auth.routes";

const app = express();
app.use(express.json());
app.use("/tasks", tareasRouter);
app.use("/auth", authRouter);

export default app;
