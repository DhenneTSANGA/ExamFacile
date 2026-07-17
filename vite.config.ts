import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    optimizeDeps: {
      exclude: [
        "better-sqlite3",
        "@prisma/adapter-better-sqlite3",
        "@prisma/client",
        "prisma",
        "dotenv",
      ],
    },
    ssr: {
      external: [
        "better-sqlite3",
        "@prisma/adapter-better-sqlite3",
        "@prisma/client",
      ],
      noExternal: [],
    },
  },
});
