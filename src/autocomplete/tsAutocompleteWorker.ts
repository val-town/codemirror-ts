import {
  type CompletionResult,
  type CompletionContext,
} from "@codemirror/autocomplete";
import { type WorkerShape } from "../worker.js";

export function tsAutocompleteWorker({
  path,
  worker,
}: {
  path: string;
  worker: WorkerShape;
}) {
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
