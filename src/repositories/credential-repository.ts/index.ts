import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import { createCredentialParams } from '@/protocols';
import Cryptr from 'cryptr';

const appSecret = "segredo";
const cryptr = new Cryptr(appSecret);

async function getCredentialByUserAndName(userId: number, credentialTitle: string) {
    const credential = await prisma.credential.findFirst({
        where: {
            userId: userId,
            title: credentialTitle,
        },
    });

    return credential;
}

async function getCREdentialById(credentialId: number) {
    const credential = await prisma.credential.findFirst({
        where: {
            id: credentialId,
        },
    });
    if (!credential) throw notFoundError();

    const decryptedPassword = cryptr.decrypt(credential.password);

    return { ...credential, password: decryptedPassword };
}

async function deleteCredentialById(userId: number, credentialId: number) {
    const credential = await prisma.credential.delete({
        where: {
            id: credentialId,
            userId
        },
    });
    if (!credential) throw notFoundError();

    const decryptedPassword = cryptr.decrypt(credential.password);

    return { ...credential, password: decryptedPassword };
}

async function createCredential(params: createCredentialParams, userId: number) {
    const { title, url, username, password } = params;

    const encryptedPassword = cryptr.encrypt(password);

    const credential = await prisma.credential.create({
        data: {
            user: { connect: { id: userId } },
            title,
            url,
            username,
            password: encryptedPassword,
        },
    });

    const decryptedPassword = cryptr.decrypt(credential.password);

    return { ...credential, password: decryptedPassword };
}

async function getCredendials(userId: number) {
    const credentials = await prisma.credential.findMany({
        where: {
            userId
        }
    });
    if (!credentials) throw notFoundError();
    const decryptedCredentials = []
    credentials.map(credential => {
        const decryptedPassword = cryptr.decrypt(credential.password);
        console.log(decryptedPassword)
        decryptedCredentials.push({ ...credential, password: decryptedPassword });
    })

    return decryptedCredentials;
}

const credentialRepository = {
    getCredentialByUserAndName,
    createCredential,
    getCREdentialById,
    getCredendials,
    deleteCredentialById
};

export default credentialRepository;