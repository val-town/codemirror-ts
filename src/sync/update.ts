import { VirtualTypeScriptEnvironment } from "@typescript/vfs";

export function createOrUpdateFile(
  env: VirtualTypeScriptEnvironment,
  path: string,
  code: string,
) {
  // In TypeScript, updates are not like PUTs, you
  // need to create a file before updating it.
  if (!env.getSourceFile(path)) {
    env.createFile(path, code);
  } else {
    env.updateFile(path, code);
  }
}
