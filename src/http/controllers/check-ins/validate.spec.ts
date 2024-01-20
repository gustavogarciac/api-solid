import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prismadb";

describe("Check-In Validate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to validate a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, "ADMIN");

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        latitude: -30.0540788,
        longitude: -51.2655997,
      },
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        gymId: gym.id,
        userId: user.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(checkIn.validatedAt).toEqual(expect.any(Date));
  });
});
