import { createCredentialParams } from '@/protocols';
import Joi from 'joi';


export const createCredentialSchema = Joi.object<createCredentialParams>({
    password: Joi.string().required(),
    title: Joi.string().required(),
    url: Joi.string().required(),
    username: Joi.string().required()
});

