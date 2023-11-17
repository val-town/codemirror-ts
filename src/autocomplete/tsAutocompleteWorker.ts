import type {
  CompletionResult,
  CompletionContext,
  CompletionSource,
} from "@codemirror/autocomplete";
import { type WorkerShape } from "../worker.js";

/**
 * Create a `CompletionSource` that queries
 * the TypeScript environment in a web worker.
 */
export function tsAutocompleteWorker({
  path,
  worker,
}: {
  path: string;
  worker: WorkerShape;
}): CompletionSource {
  return async (
    context: CompletionContext,
  ): Promise<CompletionResult | null> => {
    return worker.getAutocompletion({
      path,
      // Reduce this object so that it's serializable.
      context: {
        pos: context.pos,
        explicit: context.explicit,
      },
    });
  };
}
