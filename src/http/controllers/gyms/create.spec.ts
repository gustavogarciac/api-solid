import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, "ADMIN");

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "123456789",
        latitude: -30.0540788,
        longitude: -51.2655997,
      });

    expect(response.statusCode).toEqual(201);
  });
});
