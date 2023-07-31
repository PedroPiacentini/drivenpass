import { createCredentialParams } from "@/protocols";
import { duplicatedTittleError } from "./errors";
import credentialRepository from "@/repositories/credential-repository.ts";
import { notFoundError } from "@/errors";

export async function createCredential(body: createCredentialParams, userId: number) {
    const credential = await credentialRepository.getCredentialByUserAndName(userId, body.title);
    if (credential) throw duplicatedTittleError();
    return await credentialRepository.createCredential(body, userId);
}

export async function getCredentialById(userId: number, credentialId: number) {
    const credential = await credentialRepository.getCREdentialById(credentialId);
    if (credential.userId !== userId) throw notFoundError();
    return credential;
}

const credentialService = {
    createCredential,
    getCredentialById
};

export default credentialService;