import { CreateUserParams } from "@/protocols";
import userService from "@/services/user-service";
import { Request, Response } from "express";
import httpStatus from "http-status";


export async function register(req: Request, res: Response) {
    const { email, password } = req.body as CreateUserParams;
    try {
        const user = await userService.createUser({ email, password });
        return res.status(httpStatus.CREATED).json({
            id: user.id,
            email: user.email,
        });
    } catch (error) {
        if (error.name === 'DuplicatedEmailError') {
            return res.status(httpStatus.CONFLICT).send(error);
        }
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body as CreateUserParams;

    try {
        const { token, user } = await userService.login({ email, password });
        const { id } = user;
        return res.status(httpStatus.OK).send({ email, token, id });
    } catch (error) {
        if (error.name === "InvalidCredentialsError") return res.status(httpStatus.UNAUTHORIZED).send(error.message)
        return res.status(httpStatus.UNAUTHORIZED).send({});
    }
}