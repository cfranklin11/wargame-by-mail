import { defineConfig } from "cypress";
import { Army, Miniature, PrismaClient, Unit } from "@prisma/client";

const { CYPRESS_BASE_URL = "http://localhost:7357" } = process.env;

const prisma = new PrismaClient();

export default defineConfig({
  e2e: {
    baseUrl: CYPRESS_BASE_URL,
    setupNodeEvents(on) {
      on("task", {
        async resetArmy({
          army,
          units,
          miniatures,
        }: {
          army: Army;
          units: Unit[];
          miniatures: Miniature[];
        }) {
          return Promise.all([
            prisma.army.update({ where: { id: army.id }, data: army }),
            ...units.map((unit) =>
              prisma.unit.update({ where: { id: unit.id }, data: unit }),
            ),
            ...miniatures.map((miniature) =>
              prisma.miniature.update({
                where: { id: miniature.id },
                data: miniature,
              }),
            ),
          ]);
        },
      });
    },
  },
});
