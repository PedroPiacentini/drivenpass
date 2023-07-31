import { Router } from "express";
import { validateBody } from "@/middlewares";
import { authenticateToken } from "@/middlewares";
import { createNetwork, deleteNetworkById, getNetworkById, getNetworks } from "@/controllers/network-controller";
import { createNetworkSchema } from "@/schemas/network-schema";
const networkRouter = Router();

networkRouter
    .all("/*", authenticateToken)
    .post("/", validateBody(createNetworkSchema), createNetwork)
    .get("/:networkId", getNetworkById)
    .get("/", getNetworks)
    .delete("/:networkId", deleteNetworkById)

export { networkRouter };