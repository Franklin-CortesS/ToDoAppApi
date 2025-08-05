import {Router} from "express";
import {login, logout} from "../controllers/auth.controller";
import validateSchema from "../middlewares/validateSchemas";
import loginSchema from "../schemas/login.schema";

const router = Router();

router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);

export default router;
