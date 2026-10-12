import { defineConfig } from "vite"
import ttsc from "@ttsc/unplugin/vite"
import { builtinModules } from "module"

export default defineConfig({
  build: {
    lib: {
      entry: ["src/index.ts", "src/pre_run.ts"],
      formats: ["es"],
    },
    rolldownOptions: {
      external: builtinModules.flatMap((mod) =>
        mod.startsWith("node:") ? [mod] : [mod, `node:${mod}`]
      ),
      platform: "node",
    },
    target: "node24",
  },
  plugins: [ttsc()],
})
