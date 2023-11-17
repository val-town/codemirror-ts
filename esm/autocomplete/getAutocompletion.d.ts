import type { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
export declare function getAutocompletion({ env, path, context, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
    /**
     * Allow this to be a subset of the full CompletionContext
     * object, because the raw object isn't serializable.
     */
    context: Pick<CompletionContext, "pos" | "explicit">;
}): Promise<CompletionResult | null>;
//# sourceMappingURL=getAutocompletion.d.ts.map