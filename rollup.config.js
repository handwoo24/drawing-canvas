import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",
  output: {
    file: "./dist/bundle.js",
    format: "iife",
    name: "DrawingProvider",
    globals: {
      react: "React",
      lodash: "lodash",
    },
  },
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
    }),
  ],
  external: ["react", "lodash"],
};
