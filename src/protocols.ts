import { Credential } from "@prisma/client";

export type ApplicationError = {
    name: string;
    message: string;
};

export type CreateUserParams = {
    email: string;
    password: string;
}

export type createCredentialParams = Omit<Credential, "id" | "userId">