import { prisma } from "@/lib/prismadb";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { User } from "@prisma/client";

interface RegisterUseCaseParams {
  email: string;
  name: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseParams): Promise<RegisterUseCaseResponse> {
    const hashedPassword = await hash(password, 6);
    const emailAlreadyInUse = await this.usersRepository.findByEmail(email);

    if (emailAlreadyInUse) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      email,
      name,
      passwordHash: hashedPassword,
    });

    return { user };
  }
}
