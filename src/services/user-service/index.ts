import { CreateUserParams } from "@/protocols";
import { User } from "@prisma/client";
import { duplicatedEmailError } from "./errors";
import bcrypt from "bcrypt";
import userRepository from "@/repositories/user-repository.ts";


export async function createUser({ email, password }: CreateUserParams): Promise<User> {
    await validateUniqueEmailOrFail(email);

    const hashedPassword = await bcrypt.hash(password, 12);
    return userRepository.create({
        email,
        password: hashedPassword,
    });
}

async function validateUniqueEmailOrFail(email: string) {
    const userWithSameEmail = await userRepository.findByEmail(email);
    if (userWithSameEmail) {
        throw duplicatedEmailError();
    }
}

const userService = {
    createUser,
};

export * from './errors';
export default userService;