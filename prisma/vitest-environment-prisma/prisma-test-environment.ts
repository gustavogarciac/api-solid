import { Environment } from "vitest";

export default <Environment>{
  name: "prisma",
  async setup() {
    console.log("Executou");

    return {
      teardown() {
        console.log("Teardown");
      },
    };
  },
  transformMode: "web",
};
