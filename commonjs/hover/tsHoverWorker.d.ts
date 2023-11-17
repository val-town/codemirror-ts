import { type WorkerShape } from "../worker.js";
import { type TooltipRenderer } from "./renderTooltip.js";
export declare function tsHoverWorker({ worker, path, renderTooltip, }: {
    worker: WorkerShape;
    path: string;
    renderTooltip?: TooltipRenderer;
}): import("@codemirror/state").Extension;
//# sourceMappingURL=tsHoverWorker.d.ts.map