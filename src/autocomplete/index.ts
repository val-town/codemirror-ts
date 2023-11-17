import type {
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { getAutocompletion } from "./getAutocompletion.js";
import * as Comlink from "comlink";

export function tsAutocomplete({
  path,
  env,
}: {
  path: string;
  env: VirtualTypeScriptEnvironment;
}) {
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

export function tsAutocompleteWorker({
  path,
  worker,
}: {
  path: string;
  worker: Comlink.Remote<{
    getAutocompletion: ({
      path,
      context,
    }: {
      path: string;
      context: Pick<CompletionContext, "pos" | "explicit">;
    }) => CompletionResult;
  }>;
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
