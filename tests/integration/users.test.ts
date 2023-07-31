import { faker } from "@faker-js/faker";
import app, { init } from "app";
import supertest from "supertest";
import { cleanDb } from "../hellpers";
import httpStatus from "http-status";
import { createUser } from "../factories";
import { duplicatedEmailError } from "@/services/user-service";

beforeAll(async () => {
    await init();
    await cleanDb();
})

const server = supertest(app);

describe("POST /register", () => {

    it("retorna 400 caso não envie o body", async () => {
        const response = await server.post("/users/register");

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("retorna 400 se body não é valido", async () => {
        const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

        const response = await server.post("/users/register").send(invalidBody);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("body é valido", () => {
        const generateValidBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password(10),
        });

        it("retorna status 409 se email já existe", async () => {
            const body = generateValidBody();
            await createUser(body);

            const response = await server.post("/users/register").send(body);

            expect(response.status).toBe(httpStatus.CONFLICT);
            expect(response.body).toEqual(duplicatedEmailError());
        });

        it("retorna 201 se for a primeira vez do email", async () => {
            const body = generateValidBody();

            const response = await server.post("/users/register").send(body);

            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body).toEqual({
                id: expect.any(Number),
                email: body.email,
            });
        });
    })
});

describe("POST /users/login", () => {
    it("retorna 400 caso não envie o body", async () => {
        const response = await server.post("/users/login");

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("retorna 400 se body não é valido", async () => {
        const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

        const response = await server.post("/users/login").send(invalidBody);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("body é valido", () => {
        const generateValidBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password(10),
        });

        it("retorna status 401 se senha está incorreta", async () => {
            const body = generateValidBody();
            await createUser(body);

            const response = await server.post("/users/login").send({
                ...body,
                password: faker.internet.password(10)
            });

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("retorna status 401 se email está incorreto", async () => {
            const body = generateValidBody();

            const response = await server.post("/users/login").send(body);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("retorna 201 se email e senha estiverem corretos", async () => {
            const body = generateValidBody();
            await createUser(body);

            const response = await server.post("/users/login").send(body);

            expect(response.status).toBe(httpStatus.OK);
        });
    })
})
