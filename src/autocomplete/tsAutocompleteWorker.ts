import type {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from "@codemirror/autocomplete";
import { tsFacetWorker } from "../index.js";
import { deserializeCompletions } from "./deserializeCompletions.js";
import { AutocompleteOptions } from "./types.js";

/**
 * Create a `CompletionSource` that queries
 * the TypeScript environment in a web worker.
 */
export function tsAutocompleteWorker(
  opts: AutocompleteOptions,
): CompletionSource {
  return async (
    context: CompletionContext,
  ): Promise<CompletionResult | null> => {
    const config = context.state.facet(tsFacetWorker);
    if (!config) return null;
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
