import type { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import type ts from "typescript";

/**
 * This information is passed to the API consumer to allow
 * them to create tooltips however they wish.
 */
export interface HoverInfo {
  start: number;
  end: number;
  /** Type definitions returned by ts.LanguageService.getTypeDefinitionAtPosition() */
  typeDef: readonly ts.DefinitionInfo[] | undefined;
  /** Definitions returned by ts.LanguageService.getDefinitionAtPosition() */
  def: readonly ts.DefinitionInfo[] | undefined;
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

  try {
    const quickInfo = env.languageService.getQuickInfoAtPosition(
      path,
      sourcePos,
    );
    if (!quickInfo) {
      return null;
    }

    const start = quickInfo.textSpan.start;

    const typeDef =
      env.languageService.getTypeDefinitionAtPosition(path, sourcePos);
    const def =
      env.languageService.getDefinitionAtPosition(path, sourcePos);

    return {
      start,
      end: start + quickInfo.textSpan.length,
      typeDef,
      def,
      quickInfo,
    };
  } catch (e) {
    // biome-ignore lint/suspicious/noConsole: we want to tell users about this
    console.error(e);
    return null;
  }
}
