// fastify-jwt.d.ts
import "@fastify/jwt";
import { Role } from "@prisma/client";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      userId: string;
      role: Role;
    };
  }
}
