import { EditorView, TooltipView } from "@codemirror/view";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { HoverInfo } from "./getHover.js";
import * as Comlink from "comlink";
export type TooltipRenderer = (arg0: HoverInfo, editorView: EditorView) => TooltipView;
export declare function tsHover({ env, path, renderTooltip, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
    renderTooltip?: TooltipRenderer;
}): import("@codemirror/state").Extension;
export declare function tsHoverWorker({ worker, path, renderTooltip, }: {
    worker: Comlink.Remote<{
        getHover: ({ path, pos }: {
            path: string;
            pos: number;
        }) => HoverInfo;
    }>;
    path: string;
    renderTooltip?: TooltipRenderer;
}): import("@codemirror/state").Extension;
//# sourceMappingURL=index.d.ts.map