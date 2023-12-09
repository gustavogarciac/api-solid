import { prisma } from "@/lib/prismadb";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { hash } from "bcryptjs";
import { registerUseCase } from "@/use-cases/register";

export const registerUser = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(req.body);

  try {
    await registerUseCase({ email, name, password });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
};
