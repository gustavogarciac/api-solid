import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { searchGym } from "./search";
import { nearbyGyms } from "./nearby";
import { createGym } from "./create";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/gyms/search", searchGym);
  app.get("/gyms/nearby", nearbyGyms);

  app.post("/gyms", createGym);
}
