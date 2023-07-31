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

export async function deleteCredentialById(userId: number, credentialId: number) {
    const credential = await credentialRepository.getCREdentialById(credentialId);
    if (credential.userId !== userId) throw notFoundError();
    const deletedCredential = await credentialRepository.deleteCredentialById(userId, credentialId);
    return deletedCredential;
}

export async function getCredentials(userId: number) {
    const credentials = await credentialRepository.getCredendials(userId);
    return credentials;
}

const credentialService = {
    createCredential,
    getCredentialById,
    getCredentials,
    deleteCredentialById
};

export default credentialService;