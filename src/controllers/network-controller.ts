import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { createNetworkParams } from "@/protocols";
import networkService from "@/services/network-service";

export async function createNetwork(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const body = req.body as createNetworkParams;

    try {
        const network = await networkService.createNetwork(body, userId);
        return res.status(httpStatus.CREATED).send(network);
    } catch (error) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}

export async function getNetworkById(req: AuthenticatedRequest, res: Response) {
    const { networkId } = req.params;
    const { userId } = req;
    try {
        const network = await networkService.getNetworkById(userId, Number(networkId));
        return res.status(httpStatus.OK).send(network);
    } catch (error) {
        if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error.message);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function deleteNetworkById(req: AuthenticatedRequest, res: Response) {
    const { networkId } = req.params;
    const { userId } = req;
    try {
        const network = await networkService.deleteNetworkById(userId, Number(networkId));
        return res.status(httpStatus.OK).send(network);
    } catch (error) {
        if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error.message);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function getNetworks(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
        const networks = await networkService.getNetworks(userId);
        return res.status(httpStatus.OK).send(networks);
    } catch (error) {
        if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error.message);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}