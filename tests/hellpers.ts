import { User } from "@prisma/client";
import { prisma } from "@/config";

export async function cleanDb() {
    await prisma.credential.deleteMany({});
    await prisma.network.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
}