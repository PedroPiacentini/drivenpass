import { Router } from "express";
import { validateBody } from "@/middlewares";
import { authenticateToken } from "@/middlewares";
import { createCredential, getCredentialById } from "@/controllers/credentials-controller";
import { createCredentialSchema } from "@/schemas/credentials-schema";
const credentialRouter = Router();

credentialRouter
    .all("/*", authenticateToken)
    .post("/", validateBody(createCredentialSchema), createCredential)
    .get("/:credentialId", getCredentialById)

export { credentialRouter };