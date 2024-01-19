import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const refresh = async (req: FastifyRequest, reply: FastifyReply) => {
  await req.jwtVerify({ onlyCookie: true });

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: req.user.userId,
      },
    }
  );
  const refreshToken = await reply.jwtSign(
    {},
    { sign: { sub: req.user.userId, expiresIn: "7d" } }
  );

  return reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token });
};
