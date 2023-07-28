import { CreateUserParams } from "@/protocols";
import { User } from "@prisma/client";
import { duplicatedEmailError, invalidCredentialsError } from "./errors";
import bcrypt from "bcrypt";
import userRepository from "@/repositories/user-repository.ts";
import jwt from "jsonwebtoken";
import { exclude } from "@/utils/prisma-utils";
import sessionRepository from "@/repositories/session-repository.ts";


export async function createUser({ email, password }: CreateUserParams): Promise<User> {
    await validateUniqueEmailOrFail(email);

    const hashedPassword = await bcrypt.hash(password, 12);
    return userRepository.create({
        email,
        password: hashedPassword,
    });
}

export async function login({ email, password }: CreateUserParams): Promise<SignInResult> {

    const user = await getUserOrFail(email);

    await validatePasswordOrFail(password, user.password);

    const token = await createSession(user.id);

    return {
        user: exclude(user, "password"),
        token,
    };
}

async function validateUniqueEmailOrFail(email: string) {
    const userWithSameEmail = await userRepository.findByEmail(email);
    if (userWithSameEmail) {
        throw duplicatedEmailError();
    }
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
    const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
    if (!user) throw invalidCredentialsError();

    return user;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) throw invalidCredentialsError();
}

async function createSession(userId: number) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    await sessionRepository.create({
        token,
        userId,
    });

    return token;
}

type SignInResult = {
    user: Pick<User, 'id' | 'email'>;
    token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

const userService = {
    createUser,
    login
};

export * from './errors';
export default userService;