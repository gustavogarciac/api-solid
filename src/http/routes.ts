import { FastifyInstance } from "fastify";
import { registerUser } from "./controllers/register";
import { deleteUsers } from "./controllers/delete";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", registerUser);
  app.delete("/users", deleteUsers);
}
