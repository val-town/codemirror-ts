import {
  EditorView,
  Tooltip,
  TooltipView,
  hoverTooltip,
} from "@codemirror/view";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { HoverInfo, getHover } from "./getHover.js";
import * as Comlink from "comlink";

export type TooltipRenderer = (
  arg0: HoverInfo,
  editorView: EditorView,
) => TooltipView;

const defaultRenderer: TooltipRenderer = (info: HoverInfo) => {
  const div = document.createElement("div");
  if (info.quickInfo?.displayParts) {
    for (let part of info.quickInfo.displayParts) {
      const span = div.appendChild(document.createElement("span"));
      span.className = `quick-info-${part.kind}`;
      span.innerText = part.text;
    }
  }
  return { dom: div };
};

export function tsHover({
  env,
  path,
  renderTooltip = defaultRenderer,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
  renderTooltip?: TooltipRenderer;
}) {
  return hoverTooltip(async (view, pos): Promise<Tooltip | null> => {
    const hoverData = getHover({
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

export function tsHoverWorker({
  worker,
  path,
  renderTooltip = defaultRenderer,
}: {
  worker: Comlink.Remote<{
    getHover: ({ path, pos }: { path: string; pos: number }) => HoverInfo;
  }>;
  path: string;
  renderTooltip?: TooltipRenderer;
}) {
  return hoverTooltip(async (view, pos): Promise<Tooltip | null> => {
    const hoverData = await worker.getHover({
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
