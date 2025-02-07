import type { VirtualTypeScriptEnvironment } from "@typescript/vfs";

/**
 * In TypeScript, updates are not like PUTs, you
 * need to create a file before updating it.
 *
 * This method lets us treat the two as the same.
 */
export function createOrUpdateFile(
  env: VirtualTypeScriptEnvironment,
  path: string,
  code: string,
): boolean {
  const existing = env.getSourceFile(path);

  if (existing) {
    if (code === existing.getFullText()) return false;
    env.updateFile(path, code);
    // This should make initial linting etc faster by making
    // TypeScript eagerly create the source file object
    env.getSourceFile(path);
    return true;
  }

  env.createFile(path, code);
  env.getSourceFile(path);
  return true;
}
