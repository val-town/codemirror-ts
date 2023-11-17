import { type CompletionResult, type CompletionContext } from "@codemirror/autocomplete";
import { type WorkerShape } from "../worker.js";
export declare function tsAutocompleteWorker({ path, worker, }: {
    path: string;
    worker: WorkerShape;
}): (context: CompletionContext) => Promise<CompletionResult | null>;
//# sourceMappingURL=tsAutocompleteWorker.d.ts.map