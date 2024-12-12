/** @type {import('vite').UserConfig} */
export default {
  root: process.env.VITEST ? "." : "demo",
  outDir: "build",
  test: {
    coverage: {
      enabled: true,
      include: ["src/**"],
      exclude: ["demo/**", "scripts/**"],
      reporter: ["text", "html", "json-summary", "json"],
    },
  },
  base: "/codemirror-ts/",
};
