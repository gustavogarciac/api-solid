import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to fetch nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, "ADMIN");

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near Gym",
        description: "Some description",
        phone: "123456789",
        latitude: -30.0540788,
        longitude: -51.2655997,
      });
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Distant Gym",
        description: "Some description",
        phone: "123456789",
        latitude: -30.1169458,
        longitude: -50.8250189,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: -30.0540788, longitude: -51.2655997 })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym",
      }),
    ]);
  });
});
