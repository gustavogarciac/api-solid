import { makeGetUserProfile } from "@/use-cases/factories/make-get-user-profile-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export const profile = async (req: FastifyRequest, reply: FastifyReply) => {
  const getUserProfile = makeGetUserProfile();

  const { user } = await getUserProfile.execute({
    userId: req.user.userId,
  });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
};
