import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database';

describe("Survey", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  })

  it("It should be able to create a new survey", async () => {
    const response = await request(app).post("/surveys").send({
      title: "Title example",
      description: "Description example"
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  })

  it("It should be able to show all surveys", async () => {
    await request(app).post("/surveys").send({
      title: "Title example 2",
      description: "Description example 2"
    });

    const response = await request(app).get("/surveys");

    expect(response.body.length).toBe(2);
  })
})