import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import { createNetworkParams } from '@/protocols';
import Cryptr from 'cryptr';

const appSecret = "segredo";
const cryptr = new Cryptr(appSecret);

async function getNetworkByUserAndName(userId: number, networkTitle: string) {
    const network = await prisma.network.findFirst({
        where: {
            userId: userId,
            title: networkTitle,
        },
    });

    return network;
}

async function getNetworkById(networkId: number) {
    const network = await prisma.network.findFirst({
        where: {
            id: networkId,
        },
    });
    if (!network) throw notFoundError();

    const decryptedPassword = cryptr.decrypt(network.password);

    return { ...network, password: decryptedPassword };
}

async function deleteNetworkById(userId: number, networkId: number) {
    const network = await prisma.network.delete({
        where: {
            id: networkId,
            userId
        },
    });
    if (!network) throw notFoundError();

    const decryptedPassword = cryptr.decrypt(network.password);

    return { ...network, password: decryptedPassword };
}

async function createNetwork(params: createNetworkParams, userId: number) {
    const { title, network, password } = params;

    const encryptedPassword = cryptr.encrypt(password);

    const createdNetwork = await prisma.network.create({
        data: {
            user: { connect: { id: userId } },
            title,
            password: encryptedPassword,
            network
        },
    });

    const decryptedPassword = cryptr.decrypt(createdNetwork.password);

    return { ...createdNetwork, password: decryptedPassword };
}

async function getNetworks(userId: number) {
    const networks = await prisma.network.findMany({
        where: {
            userId
        }
    });
    if (!networks) throw notFoundError();
    const decryptedNetworks = []
    networks.map(network => {
        const decryptedPassword = cryptr.decrypt(network.password);
        console.log(decryptedPassword)
        decryptedNetworks.push({ ...network, password: decryptedPassword });
    })

    return decryptedNetworks;
}

const networkRepository = {
    getNetworkByUserAndName,
    createNetwork,
    getNetworkById,
    getNetworks,
    deleteNetworkById
};

export default networkRepository;