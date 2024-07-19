import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const { PORT } = process.env;

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    include: [
      "@chakra-ui/icons",
      "remix-utils/client-only",
      "@remix-run/node",
      "ramda",
      "@prisma/client",
      "tiny-invariant",
    ],
  },
  server: {
    port: PORT ? parseInt(PORT) : undefined,
  },
});
