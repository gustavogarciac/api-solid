import { prisma } from "@/lib/prismadb";
import { FastifyReply, FastifyRequest } from "fastify";

export const deleteUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  await prisma.user.deleteMany();

  return reply.status(204).send();
};
