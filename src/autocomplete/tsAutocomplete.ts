import type {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from "@codemirror/autocomplete";
import { tsFacet } from "../index.js";
import { deserializeCompletions } from "./deserializeCompletions.js";
import type { AutocompleteOptions } from "./types.js";

/**
 * Create a `CompletionSource` that queries
 * the TypeScript environment in a web worker.
 */
export function tsAutocomplete(
  opts: AutocompleteOptions = {},
): CompletionSource {
  return async (
    context: CompletionContext,
  ): Promise<CompletionResult | null> => {
    const config = context.state.facet(tsFacet);
    if (!config?.worker) return null;
    const completion = deserializeCompletions(
      await config.worker.getAutocompletion({
        path: config.path,
        // Reduce this object so that it's serializable.
        context: {
          pos: context.pos,
          explicit: context.explicit,
        },
      }),
      opts,
    );

    return completion;
  };
}
