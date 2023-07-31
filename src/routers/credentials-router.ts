import { Router } from "express";
import { validateBody } from "@/middlewares";
import { authenticateToken } from "@/middlewares";
import { createCredential } from "@/controllers/credentials-controller";
import { createCredentialSchema } from "@/schemas/credentials-schema";
const credentialRouter = Router();

credentialRouter
    .all("/*", authenticateToken)
    .post("/", validateBody(createCredentialSchema), createCredential)

export { credentialRouter };