import {
  EditorView,
  Tooltip,
  TooltipView,
  hoverTooltip,
} from "@codemirror/view";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { type QuickInfo, type DefinitionInfo } from "typescript";

/**
 * This information is passed to the API consumer to allow
 * them to create tooltips however they wish.
 */
export interface HoverInfo {
  start: number;
  end: number;
  typeDef: readonly DefinitionInfo[] | undefined;
  quickInfo: QuickInfo | undefined;
}

export async function getHover({
  env,
  path,
  pos,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
  pos: number;
}): Promise<HoverInfo | null> {
  const sourcePos = pos;
  if (sourcePos === null) return null;

  const quickInfo = env.languageService.getQuickInfoAtPosition(path, sourcePos);
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
}

export type TooltipRenderer = (
  arg0: HoverInfo,
  editorView: EditorView,
) => TooltipView;

export function tsHover({
  env,
  path,
  renderTooltip,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
  renderTooltip: TooltipRenderer;
}) {
  return hoverTooltip(async (view, pos): Promise<Tooltip | null> => {
    const hoverData = await getHover({
      env,
      path,
      pos,
    });

    if (!hoverData) return null;

    return {
      pos: hoverData.start,
      end: hoverData.end,
      create: () => renderTooltip(hoverData, view),
    };
  });
}
