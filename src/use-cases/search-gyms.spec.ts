import { expect, describe, it, beforeEach } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });
  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Gym 01",
      description: null,
      phone: null,
      latitude: -30.0626448,
      longitude: -51.1896496,
    });
    await gymsRepository.create({
      title: "Gym 02",
      description: null,
      phone: null,
      latitude: -30.0626448,
      longitude: -51.1896496,
    });

    const { gyms } = await sut.execute({
      query: "Gym 01",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "Gym 01",
      }),
    ]);
  });

  it("should be able to search for gyms with pagination", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -30.0626448,
        longitude: -51.1896496,
      });
    }

    const { gyms } = await sut.execute({
      query: "Javascript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "Javascript Gym 21",
      }),
      expect.objectContaining({
        title: "Javascript Gym 22",
      }),
    ]);
  });
});
