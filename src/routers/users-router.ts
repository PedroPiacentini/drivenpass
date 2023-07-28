import { Router } from "express";
import { validateBody } from "@/middlewares";
import { createUserSchema } from "@/schemas/users-schema";
import { register } from "@/controllers/users-controller";

const usersRouter = Router();

usersRouter.post("/", validateBody(createUserSchema), register);

export { usersRouter };