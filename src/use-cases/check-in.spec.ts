import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Gym 01",
      description: "Gym 01 description",
      latitude: -30.0540788,
      longitude: -51.2655997,
      phone: "51999999999",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -30.0540788,
      userLongitude: -51.2655997,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it("should not be able to check in twice in a day", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0));
    await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -30.0540788,
      userLongitude: -51.2655997,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-id",
        userLatitude: -30.0540788,
        userLongitude: -51.2655997,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });
  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -30.0540788,
      userLongitude: -51.2655997,
    });

    vi.setSystemTime(new Date(2023, 0, 2, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -30.0540788,
      userLongitude: -51.2655997,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Gym 02",
      description: "Gym 02 description",
      latitude: new Decimal(-30.0626448),
      longitude: new Decimal(-51.1896496),
      phone: "51999999999",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-id",
        userLatitude: -30.0766828,
        userLongitude: -51.1253951,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
