import { expect, test, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";

describe("Register Use Case", () => {
  it("should hash user's password", async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null;
      },
      async create(data) {
        return {
          id: "user-1",
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          createdAt: new Date(),
        };
      },
    });

    const { user } = await registerUseCase.execute({
      name: "John doe",
      email: "johndoe2@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.passwordHash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
