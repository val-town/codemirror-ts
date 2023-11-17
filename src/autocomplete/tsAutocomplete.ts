import type {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from "@codemirror/autocomplete";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { getAutocompletion } from "./getAutocompletion.js";

/**
 * Create a `CompletionSource` that queries
 * the _on-thread_ TypeScript environments for autocompletions
 * at this character.
 */
export function tsAutocomplete({
  path,
  env,
}: {
  path: string;
  env: VirtualTypeScriptEnvironment;
}): CompletionSource {
  return async (
    context: CompletionContext,
  ): Promise<CompletionResult | null> => {
    return getAutocompletion({
      env,
      path,
      context,
    });
  };
}
