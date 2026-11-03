import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.ts", "packages/**/tests/**/*.test.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./packages/shared/src"),
      "@infra": path.resolve(__dirname, "./packages/infrastructure/src"),
      "@features": path.resolve(__dirname, "./features"),
    },
  },
});
