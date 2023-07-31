import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { ApplicationError, createCredentialParams } from "@/protocols";
import httpStatus from "http-status";
import credentialService from "@/services/credential-service";

export async function createCredential(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const body = req.body as createCredentialParams;

    try {
        const credential = await credentialService.createCredential(body, userId);
        return res.status(httpStatus.CREATED).send(credential);
    } catch (error) {
        if (error.name === "DuplicatedTittleError") return res.status(httpStatus.CONFLICT).send(error.message)
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}
