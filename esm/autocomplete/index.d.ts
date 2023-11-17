import type { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
import * as Comlink from "comlink";
export declare function tsAutocomplete({ path, env, }: {
    path: string;
    env: VirtualTypeScriptEnvironment;
}): (context: CompletionContext) => Promise<CompletionResult | null>;
export declare function tsAutocompleteWorker({ path, worker, }: {
    path: string;
    worker: Comlink.Remote<{
        getAutocompletion: ({ path, context, }: {
            path: string;
            context: Pick<CompletionContext, "pos" | "explicit">;
        }) => CompletionResult;
    }>;
}): (context: CompletionContext) => Promise<CompletionResult | null>;
//# sourceMappingURL=index.d.ts.map