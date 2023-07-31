import { ApplicationError } from '@/protocols';

export function duplicatedTittleError(): ApplicationError {
    return {
        name: 'DuplicatedTittleError',
        message: 'There is already an credential with given title',
    };
}