import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { CheckInValidateUseCase } from "../validate-check-in";

export function makeValidateCheckInUseCase() {
  const checkinsRepository = new PrismaCheckInsRepository();
  const useCase = new CheckInValidateUseCase(checkinsRepository);
  return useCase;
}
