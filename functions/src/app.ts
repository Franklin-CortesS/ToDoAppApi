import express from "express";
import cors from "cors";
import tareasRouter from "./routes/tasks.routes";
import authRouter from "./routes/auth.routes";

const app = express();
const allowedOrigins = [
  "http://localhost:4200",
  "https://todoapp-fcs2499.web.app",
];

app.use(cors({
  origin: function (origin, callback){
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Origin not allowed"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use("/tasks", tareasRouter);
app.use("/auth", authRouter);

export default app;
