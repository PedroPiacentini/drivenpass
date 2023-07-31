import { createNetworkParams } from '@/protocols';
import Joi from 'joi';


export const createNetworkSchema = Joi.object<createNetworkParams>({
    password: Joi.string().required(),
    title: Joi.string().required(),
    network: Joi.string().required()
});