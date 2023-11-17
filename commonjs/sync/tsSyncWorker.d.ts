import * as Comlink from "comlink";
type WorkerShape = Comlink.Remote<{
    updateFile({ path, code }: {
        path: string;
        code: string;
    }): void;
}>;
/**
 * Sync updates from CodeMirror to the worker.
 */
export declare function tsSyncWorker({ worker, path, }: {
    worker: WorkerShape;
    path: string;
}): import("@codemirror/state").Extension;
export {};
//# sourceMappingURL=tsSyncWorker.d.ts.map