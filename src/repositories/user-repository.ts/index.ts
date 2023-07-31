import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function findByEmail(email: string, select?: Prisma.UserSelect) {
    const params: Prisma.UserFindUniqueArgs = {
        where: {
            email,
        },
    };

    if (select) {
        params.select = select;
    }
    return prisma.user.findUnique(params);
}

async function create(data: Prisma.UserUncheckedCreateInput) {
    const result = prisma.user.create({
        data,
    });
    return result;
}

const userRepository = {
    findByEmail,
    create,
};

export default userRepository;