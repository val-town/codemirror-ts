import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { type CompletionContext } from "@codemirror/autocomplete";
import { type Remote } from "comlink";
export type WorkerShape = Remote<ReturnType<typeof createWorker>>;
export declare function createWorker(initializer: () => VirtualTypeScriptEnvironment | Promise<VirtualTypeScriptEnvironment>): {
    initialize(): Promise<void>;
    updateFile({ path, code }: {
        path: string;
        code: string;
    }): void;
    getLints({ path }: {
        path: string;
    }): import("@codemirror/lint").Diagnostic[];
    getAutocompletion({ path, context, }: {
        path: string;
        context: Pick<CompletionContext, "pos" | "explicit">;
    }): Promise<import("@codemirror/autocomplete").CompletionResult | null> | null;
    getHover({ path, pos }: {
        path: string;
        pos: number;
    }): import("../hover/getHover.js").HoverInfo | null | undefined;
};
//# sourceMappingURL=createWorker.d.ts.map