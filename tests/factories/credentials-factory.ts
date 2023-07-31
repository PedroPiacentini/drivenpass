import { faker } from '@faker-js/faker';
import { prisma } from '@/config';
import Cryptr from 'cryptr';

const appSecret = process.env.CRYPTR_SECRET;
const cryptr = new Cryptr(appSecret);

export async function createCredential(userId: number) {
    const password = faker.internet.password(10);
    const encryptedPassword = cryptr.encrypt(password);
    return prisma.credential.create({
        data: {
            user: { connect: { id: userId } },
            title: faker.lorem.word(),
            url: faker.internet.url(),
            username: faker.internet.userName(),
            password: encryptedPassword,
        },
    });
}