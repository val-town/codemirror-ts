import { EditorView, TooltipView } from "@codemirror/view";
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
export declare function getHover({ env, path, pos, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
    pos: number;
}): Promise<HoverInfo | null>;
export type TooltipRenderer = (arg0: HoverInfo, editorView: EditorView) => TooltipView;
export declare function tsHover({ env, path, renderTooltip, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
    renderTooltip?: TooltipRenderer;
}): import("@codemirror/state").Extension;
//# sourceMappingURL=index.d.ts.map