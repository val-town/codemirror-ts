import type {
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { getAutocompletion } from "./getAutocompletion.js";

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
