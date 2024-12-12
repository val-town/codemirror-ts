/** @type {import('vite').UserConfig} */
export default {
  root: process.env.VITEST ? "." : "demo",
  outDir: "build",
  test: {
    coverage: {
      include: ["src/**"],
      exclude: ["demo/**", "scripts/**"],
    },
  },
  base: "/codemirror-ts/",
};
