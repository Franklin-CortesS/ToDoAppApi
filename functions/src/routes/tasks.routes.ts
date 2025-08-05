import {Router} from "express";
import {
  getTasks,
  createTask,
  deleteTask,
} from "../controllers/tasks.controller";
import validateSchema from "../middlewares/validateTaskSchema";
import taskSchema from "../schemas/task.schema";
import { verifyAuthToken } from "../middlewares/validateToken";

const router = Router();
router.use(verifyAuthToken);

router.get("/", getTasks);
router.post("/create", validateSchema(taskSchema), createTask);
router.delete("/delete/:id", deleteTask);

export default router;
