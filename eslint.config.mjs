import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**/*",
      "out/**/*",
      "node_modules/**/*",
      "terminal-chat/**/*",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Re-enabling rules to fix violations as per task instructions
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      "react/no-unescaped-entities": "error",
      "react-hooks/exhaustive-deps": "error",
      "jsx-a11y/alt-text": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
  },
];

export default eslintConfig;
