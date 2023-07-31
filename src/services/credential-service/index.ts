import { createCredentialParams } from "@/protocols";
import { duplicatedTittleError } from "./errors";
import credentialRepository from "@/repositories/credential-repository.ts";

export async function createCredential(body: createCredentialParams, userId: number) {
    const credential = await credentialRepository.getCredentialByUserAndName(userId, body.title);
    if (credential) throw duplicatedTittleError();
    return await credentialRepository.createCredential(body, userId);
}

const credentialService = {
    createCredential
};

export default credentialService;