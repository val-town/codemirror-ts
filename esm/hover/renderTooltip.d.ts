import { EditorView, TooltipView } from "@codemirror/view";
import { HoverInfo } from "./getHover.js";
export type TooltipRenderer = (arg0: HoverInfo, editorView: EditorView) => TooltipView;
export declare const defaultRenderer: TooltipRenderer;
//# sourceMappingURL=renderTooltip.d.ts.map