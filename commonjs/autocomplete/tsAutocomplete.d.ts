import type { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
export declare function tsAutocomplete({ path, env, }: {
    path: string;
    env: VirtualTypeScriptEnvironment;
}): (context: CompletionContext) => Promise<CompletionResult | null>;
//# sourceMappingURL=tsAutocomplete.d.ts.map