import type { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
export declare function getAutocompletion({ env, path, context, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
    context: CompletionContext;
}): Promise<CompletionResult | null>;
export declare function tsAutocomplete({ path, env, }: {
    path: string;
    env: VirtualTypeScriptEnvironment;
}): (context: CompletionContext) => Promise<CompletionResult | null>;
//# sourceMappingURL=index.d.ts.map