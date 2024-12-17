import type {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from "@codemirror/autocomplete";
import { tsFacet } from "../facet/tsFacet.js";
import { deserializeCompletions } from "./deserializeCompletions.js";
import { getAutocompletion } from "./getAutocompletion.js";
import type { AutocompleteOptions } from "./types.js";

/**
 * Create a `CompletionSource` that queries
 * the _on-thread_ TypeScript environments for autocompletions
 * at this character.
 */
export function tsAutocomplete(
  opts: AutocompleteOptions = {},
): CompletionSource {
  return async (
    context: CompletionContext,
  ): Promise<CompletionResult | null> => {
    const config = context.state.facet(tsFacet);
    if (!config?.env) return null;
    return deserializeCompletions(
      await getAutocompletion({
        ...config,
        context,
      }),
      opts,
    );
  };
}
