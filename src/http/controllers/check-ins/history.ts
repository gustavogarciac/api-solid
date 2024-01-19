import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";

export const history = async (req: FastifyRequest, reply: FastifyReply) => {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(req.query);

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    page,
    userId: req.user.userId,
  });

  return reply.status(201).send({ checkIns });
};
