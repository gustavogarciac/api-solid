import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export const create = async (req: FastifyRequest, reply: FastifyReply) => {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(req.body);
  const { gymId } = createCheckInParamsSchema.parse(req.params);

  const checkInUseCase = makeCheckInUseCase();

  await checkInUseCase.execute({
    gymId,
    userId: req.user.userId,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
};
