import type { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import type ts from "typescript";

/**
 * This information is passed to the API consumer to allow
 * them to create tooltips however they wish.
 */
export interface HoverInfo {
  start: number;
  end: number;
  typeDef: readonly ts.DefinitionInfo[] | undefined;
  quickInfo: ts.QuickInfo | undefined;
}

export function getHover({
  env,
  path,
  pos,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
  pos: number;
}): HoverInfo | null {
  const sourcePos = pos;
  if (sourcePos === null) return null;

  try {
    const quickInfo = env.languageService.getQuickInfoAtPosition(
      path,
      sourcePos,
    );
    if (!quickInfo) return null;

    const start = quickInfo.textSpan.start;

    const typeDef =
      env.languageService.getTypeDefinitionAtPosition(path, sourcePos) ??
      env.languageService.getDefinitionAtPosition(path, sourcePos);

    return {
      start,
      end: start + quickInfo.textSpan.length,
      typeDef,
      quickInfo,
    };
  } catch (e) {
    // biome-ignore lint/suspicious/noConsole: we want to tell users about this
    console.error(e);
    return null;
  }
}
