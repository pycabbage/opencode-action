import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      entry: ["src/index.ts", "src/pre.ts"],
      formats: ["es"],
    },
    target: "node24",
  },
})
