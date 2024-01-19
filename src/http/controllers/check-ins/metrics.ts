import { FastifyReply, FastifyRequest } from "fastify";

import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

export const metrics = async (req: FastifyRequest, reply: FastifyReply) => {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId: req.user.userId,
  });

  return reply.status(201).send({ checkInsCount });
};
