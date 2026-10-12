import type { Configuration } from "lint-staged"

export default {
  "*.{ts,tsx}": ["oxfmt", "oxlint --fix", () => "vite build"],
} satisfies Configuration
