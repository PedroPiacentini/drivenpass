import app, { init } from "app";
import supertest from "supertest";
import { cleanDb } from "./hellpers";
import httpStatus from "http-status";

beforeAll(async () => {
    await init();
    await cleanDb();
})

const server = supertest(app);

describe("/register", () => {
    it("retorna status 201 e dados do usuário após receber um corpo valido", async () => {
        const body = {
            email: "teste@teste12.com",
            password: "testeteste"
        };

        const result = await server.post("/users/register").send(body);

        const status = result.status;
        const resultBody = result.body;

        expect(status).toEqual(httpStatus.CREATED);
        expect(resultBody).toEqual({
            email: "teste@teste12.com",
            id: expect.any(Number)
        })
    });
});

describe("/login", () => {
    it("retorna status 200 e dados do usuário após receber um corpo valido", async () => {
        const body = {
            email: "teste@teste12.com",
            password: "testeteste"
        };

        const result = await server.post("/users/login").send(body);

        const status = result.status;
        const resultBody = result.body;

        expect(status).toEqual(httpStatus.OK);
        expect(resultBody).toEqual({
            email: "teste@teste12.com",
            id: expect.any(Number),
            token: expect.any(String)
        })
    });
});
