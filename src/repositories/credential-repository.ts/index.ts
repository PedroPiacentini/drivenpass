import { prisma } from '@/config';
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

const credentialRepository = {
    getCredentialByUserAndName,
    createCredential
};

export default credentialRepository;