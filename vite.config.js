/** @type {import('vite').UserConfig} */
export default {
  root: process.env.VITEST ? "." : "demo",
  outDir: "build",
  base: "/codemirror-ts/",
};
