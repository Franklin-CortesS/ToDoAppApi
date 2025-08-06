import {Router} from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller";
import validateSchema from "../middlewares/validateSchemas";
import taskSchema from "../schemas/task.schema";
import {verifyAuthToken} from "../middlewares/validateToken";

const router = Router();
router.use(verifyAuthToken);

router.get("/", getTasks);
router.post("/create", validateSchema(taskSchema), createTask);
router.put("/update/:id", validateSchema(taskSchema), updateTask);
router.delete("/delete/:id", deleteTask);

export default router;
