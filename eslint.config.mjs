import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["contracts/**", "typechain-types/**", "lib/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
