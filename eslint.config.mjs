import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // All images are external Unsplash URLs with ?w=&q= params — already optimised.
      // next/image requires known dimensions; wrapping every decorative img is unnecessary here.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
