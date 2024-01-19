import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prismadb";

describe("Check-In Create (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        latitude: -30.0540788,
        longitude: -51.2655997,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -30.0540788,
        longitude: -51.2655997,
      });

    expect(response.statusCode).toEqual(201);
  });
});
