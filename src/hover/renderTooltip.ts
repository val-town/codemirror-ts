import type { EditorView, TooltipView } from "@codemirror/view";
import type ts from "typescript";
import type { HoverInfo } from "./getHover.js";

export type TooltipRenderer = (
  arg0: HoverInfo,
  editorView: EditorView,
) => TooltipView;

/**
 * Default, barebones tooltip renderer. Generates
 * structure of a div, containing a series of
 * span elements with the typescript `kind` as
 * classes.
 */
export const defaultRenderer: TooltipRenderer = (info: HoverInfo) => {
  const div = document.createElement("div");
  if (info.quickInfo?.displayParts) {
    div.appendChild(renderDisplayParts(info.quickInfo.displayParts));
  }
  return { dom: div };
};

export const renderDisplayParts = (displayParts: ts.SymbolDisplayPart[]) => {
  const div = document.createElement("div");
  for (const part of displayParts) {
    const span = div.appendChild(document.createElement("span"));
    span.className = `quick-info-${part.kind}`;
    span.innerText = part.text;
  }
  return div;
};
