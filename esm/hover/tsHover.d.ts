import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { TooltipRenderer } from "./renderTooltip.js";
export declare function tsHover({ env, path, renderTooltip, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
    renderTooltip?: TooltipRenderer;
}): import("@codemirror/state").Extension;
//# sourceMappingURL=tsHover.d.ts.map