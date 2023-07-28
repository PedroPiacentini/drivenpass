import { Router } from "express";
import { validateBody } from "@/middlewares";
import { createUserSchema } from "@/schemas/users-schema";
import { login, register } from "@/controllers/users-controller";

const usersRouter = Router();

usersRouter
    .post("/register", validateBody(createUserSchema), register)
    .post("/login", validateBody(createUserSchema), login)

export { usersRouter };