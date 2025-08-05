import {Router} from "express";
import {
  getTasks,
  createTask,
  deleteTask,
} from "../controllers/tasks.controllers";
import validateSchema from "../middlewares/validateTaskSchema";
import taskSchema from "../schemas/task.schema";

const router = Router();

router.get("/", getTasks);
router.post("/create", validateSchema(taskSchema), createTask);
router.delete("/delete/:id", deleteTask);

export default router;
