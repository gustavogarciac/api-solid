import { prisma } from "@/lib/prismadb";
import { hash } from "bcryptjs";

interface RegisterUseCaseParams {
  email: string;
  name: string;
  password: string;
}

export const registerUseCase = async ({
  email,
  name,
  password,
}: RegisterUseCaseParams) => {
  const hashedPassword = await hash(password, 6);

  const emailAlreadyInUse = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailAlreadyInUse) throw new Error("This email is already in use.");

  await prisma.user.create({
    data: { email, name, passwordHash: hashedPassword },
  });
};
