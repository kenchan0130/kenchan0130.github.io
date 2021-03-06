module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ],
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: ".",
    project: "./tsconfig.json"
  },
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_"
    }]
  }
};
