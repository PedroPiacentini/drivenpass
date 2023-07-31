import { faker } from "@faker-js/faker";
import app, { init } from "app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../hellpers";
import httpStatus from "http-status";
import { createCredential, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';

beforeAll(async () => {
    await init();
    await cleanDb();
})

const server = supertest(app);

describe("GET /credentials", () => {

    it('retorna 401 caso não envie o token', async () => {
        const response = await server.get('/credentials');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('retorna 401 se o token não for válido', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('retorna 401 se não houver sessão para o token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("token é válido e possui sessão", () => {
        it('retorna status 200', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const credential = await createCredential(user.id);

            const response = await server.get("/credentials").set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.OK);
        })
    })
})

describe("POST /credentials", () => {
    it('retorna 401 caso não envie o token', async () => {
        const response = await server.post('/credentials');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('retorna 401 se o token não for válido', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('retorna 401 se não houver sessão para o token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
})