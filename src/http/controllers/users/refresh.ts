import { FastifyReply, FastifyRequest } from "fastify";

export const refresh = async (req: FastifyRequest, reply: FastifyReply) => {
  await req.jwtVerify({ onlyCookie: true });

  const token = await reply.jwtSign({
    userId: req.user.userId,
    role: req.user.role,
  });
  const refreshToken = await reply.jwtSign(
    { userId: req.user.userId, role: req.user.role },
    { sign: { expiresIn: "7d" } }
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
