import type {
  CompletionResult,
  CompletionContext,
  CompletionSource,
} from "@codemirror/autocomplete";
import { tsFacetWorker } from "../index.js";

/**
 * Create a `CompletionSource` that queries
 * the TypeScript environment in a web worker.
 */
export function tsAutocompleteWorker(): CompletionSource {
  return async (
    context: CompletionContext,
  ): Promise<CompletionResult | null> => {
    const config = context.state.facet(tsFacetWorker);
    if (!config) return null;
    return config.worker.getAutocompletion({
      path: config.path,
      // Reduce this object so that it's serializable.
      context: {
        pos: context.pos,
        explicit: context.explicit,
      },
    });
  };
}
