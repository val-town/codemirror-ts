import { Diagnostic } from "@codemirror/lint";
import * as Comlink from "comlink";
export declare function tsLinterWorker({ worker, path, }: {
    worker: Comlink.Remote<{
        getLints: ({ path }: {
            path: string;
        }) => Diagnostic[];
    }>;
    path: string;
}): import("@codemirror/state").Extension;
//# sourceMappingURL=linterWorker.d.ts.map