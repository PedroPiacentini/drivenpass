import { createNetworkParams } from "@/protocols";
import networkRepository from "@/repositories/network-repository.ts";
import { notFoundError } from "@/errors";

export async function createNetwork(body: createNetworkParams, userId: number) {
    const network = await networkRepository.getNetworkByUserAndName(userId, body.title);
    return await networkRepository.createNetwork(body, userId);
}

export async function getNetworkById(userId: number, networkId: number) {
    const network = await networkRepository.getNetworkById(networkId);
    if (network.userId !== userId) throw notFoundError();
    return network;
}

export async function deleteNetworkById(userId: number, networkId: number) {
    const network = await networkRepository.getNetworkById(networkId);
    if (network.userId !== userId) throw notFoundError();
    const deletedNetwork = await networkRepository.deleteNetworkById(userId, networkId);
    return deletedNetwork;
}

export async function getNetworks(userId: number) {
    const networks = await networkRepository.getNetworks(userId);
    return networks;
}

const networkService = {
    createNetwork,
    getNetworkById,
    getNetworks,
    deleteNetworkById
};

export default networkService;