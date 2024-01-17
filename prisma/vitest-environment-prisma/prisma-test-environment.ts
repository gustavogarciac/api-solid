import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { execSync } from "node:child_process";

import { randomUUID } from "node:crypto";
import { Environment } from "vitest";

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "[ENV ERROR] Please provide a DATABASE_URL environment variable"
    );
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  async setup() {
    const schema = randomUUID();
    const databaseURL = generateDatabaseURL(schema);

    process.env.DATABASE_URL = databaseURL; // Changing the database url to the one with the schema in order to have different databases for each test

    execSync(`npx prisma migrate deploy`); // Execute prisma migrations */

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );
        await prisma.$disconnect();
      },
    };
  },
  transformMode: "web",
};
